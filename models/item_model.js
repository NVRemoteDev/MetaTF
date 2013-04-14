
/**
 * Handles tf2 item schema, and the backpack
 */

/**
 * Module dependencies
 */
var fs = require('fs');

/**
 * Downloads user backpack items from Steam API
 * Matches items to schema to get names, backpack positions
 * And all other schema properties we want
 */
exports.getbackpack = function (req, res, next, trade) {
  var PullFromSteamApi = require('./steamapi_model'),
    steamID = req.params.id || req.user.steamid; // If no :id param use the logged in user's SteamID (required to see without :id)

  PullFromSteamApi(steamID, 'backpack', function (err, backpack) { // returns the user's backpack
    if (err) return next(err);
    var backpackHasNewIems = 'false',
        backpackitems = backpack.result.items,
        backpackslots = backpack.result.num_backpack_slots;

    require('./item_model').getschema(req, res, next, function(err, obj) {
      if (obj && backpackitems) {
        var objLength = obj.items.length; // precache the length
        var bpItemsLength = backpackitems.length; // precache the length
        // Loop through TF2 Schema, backpack items, match data.
        for (var i = 0; i < objLength; i++) { // Schema
          for (var x = 0; x < bpItemsLength; x++) { // Backpack
            if (obj.items[i].defindex === backpackitems[x].defindex) {
              backpackitems[x].name = obj.items[i].item_name;
              backpackitems[x].image_url = obj.items[i].image_url;
              backpackitems[x].item_type_name = obj.items[i].item_type_name;
              if (obj.items[i].item_description) {
                backpackitems[x].item_description = obj.items[i].item_description;
              }
              if (backpackitems[x].inventory !== 0) { // In some very rare cases 0 can be an inventory number.
                var binary = (convertToBinary(backpackitems[x].inventory)); // http://wiki.teamfortress.com/wiki/WebAPI/GetPlayerItems#Inventory_token 
                var bpPosition = convertToNumber(binary[0]); // Get the backpack position of the item
                var isItNew = findIfNumberIsNew(binary[1]); // Check if the item is brand new to the user
                backpackitems[x].bpposition = bpPosition;
                backpackitems[x].isnew = isItNew;
                backpackitems[x].quality = convertQualityToString(backpackitems[x].quality);
              } else {
                backpackitems[x].bpposition = 300;
                backpackitems[x].isnew = 'new';
              }
            }
          }
        }
      }
      obj = null;

      /**
       * Converts a TF2 PlayerItem inventory token into a binary number, which is used to get the backpack position
       * This is used to get the position of the item in the backpack 
       * It splits the binary number into two 16 digit arrays: array[0] = 16 numbers, array[1] = 16 numbers
       * We use 16, because the inventory position is a 16 digit binary number
       * array[0] contains the position, array[1] contains other data, like what character it is equipped by, and if the item is new 
       */
      function convertToBinary(binaryNumber) {
        var binary = '';
        while (binaryNumber > 0) {
          binary += (binaryNumber % 2).toString();
          binaryNumber = Math.floor(binaryNumber / 2);
        }
        binary = binary.match(/.{1,16}/g); // 
        return binary;
      }

      /**
       * Converts a binary number to a real number
       * This is used to get the position of the item in the backpack
       * The total is calculated with formula total = total + 2^(16 - (i+1)) * array_digit
       * The first calculation would be total = 0 + (2^15) * array_digit
       */
      function convertToNumber(number) {
        number = number.split("").reverse().join(""); // Reverse the array for accurate calculation in this scenario
        var total = 0;
        var a = number.split(""); // Splits the binary number into an array, each index contains one digit
        for (var i = 0; i < a.length; i++) {
          total += (Math.pow(2, (a.length - (i + 1))) * a[i]);
        }
        return total;
      }

      /**
       * Checks if the item is 'new', i.e. not placed in backpack.
       * The item is new if a[1] = 1, not new if a[1] = 0
       * More information: http://wiki.teamfortress.com/wiki/WebAPI/GetPlayerItems#Inventory_token
       */
      function findIfNumberIsNew(number) {
        number = number.split("").reverse().join(""); // Reverse the array
        var a = number.split(""); // Splits the binary number into one array, each index is one number
        if (a[1] == 1) {
          backpackHasNewIems = 'true';
          return 'new';
        }
        return 'false';
      }

      /*
       * Converts item.quality int to a human readable string
       * We do this to avoid long switch statements in backpackitems.ejs
       */
      function convertQualityToString(quality) {
        switch (quality) {
        case 0:
          return 'normal';
        case 1:
          return 'genuine';
        case 3:
          return 'vintage';
        case 5:
          return 'unusual';
        case 6:
          return 'unique';
        case 7:
          return 'community';
        case 8:
          return 'valve';
        case 9:
          return 'selfmade';
        case 11:
          return 'strange';
        case 13:
          return 'haunted';
        default:
          return 'normal';
        }
      }

      /**
       * Dynamic sort of array of objects by property
       * Used to sort our backpack items based on bpposition
       */
      function dynamicSort(property) {
        var sortOrder = 1;
        if (property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1, property.length - 1);
        }
        return function (a, b) {
          var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
          return result * sortOrder;
        };
      }

      // Sort items in order of their backpack position
      if (backpackitems) {
        backpackitems.sort(dynamicSort("bpposition"));
      }

      trade(null, backpack.result, backpackHasNewIems);
    });
  });
};

/**
 * Reads TF2 item schema, then returns the schema via trade
 */
exports.getschema = function (req, res, next, trade) {
  var fileName = './models/tf2item_schema.txt';
  var contents = '';

  var stream = fs.createReadStream(fileName, {
    flags: 'r',
    encoding: 'utf-8'
  });
  stream.on('data', function (data) {
    contents += data;
  });

  stream.on('end', function () {
    var obj = JSON.parse(contents);
    trade(null, obj); // callback
    contents = null;
    data = null;
    return;
  });
};