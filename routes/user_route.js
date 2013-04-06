/**
 * Module Dependencies
 */
 var mongoose = require('mongoose')
   , Users = mongoose.model("Users")
   , user = new Users()
   , fs = require('fs');

/**
 * GET /backpack/:id? (:id being 64bit steam id)
 * Downloads user backpack items from Steam API
 */
exports.backpack = function(req, res, next) {
  console.log(req.headers.referer);
  var PullFromSteamApi = require('../models/steamapi_model');
  var steamID = req.params.id || req.user.steamid; // If no :id param use the logged in user's SteamID (required to see without :id)

  PullFromSteamApi(steamID, 'backpack', function (err, backpack) { //.result.items,
    if (err) return next(err);
    var fileName = './models/tf2item_schema.txt';
    var contents = '';
    var backpackHasNewIems = 'false';
    var backpackitems = backpack.result.items;
    var backpackslots = backpack.result.num_backpack_slots;

    var stream = fs.createReadStream(fileName, {flags: 'r', encoding: 'utf-8'});
    stream.on('data', function(data) {
      contents += data;
    });

    stream.on('end', function() {
      var obj = JSON.parse(contents); // Parse the user's API data from steam
      contents = null;
      data = null;
      if(obj !== undefined && backpackitems !== undefined) {
        var objLength = obj.items.length; // precache the length
        var bpItemsLength = backpackitems.length; // precache the length
        // Loop through TF2 Schema, backpack items, match data.
        for(var i = 0; i < objLength; i++) { // Schema
          for(var x = 0; x < bpItemsLength; x++) { // Backpack
            if (obj.items[i].defindex === backpackitems[x].defindex) {
              backpackitems[x].name = obj.items[i].name;
              backpackitems[x].image_url = obj.items[i].image_url;
              if(obj.items[i].item_description !== undefined) {
                backpackitems[x].item_description = obj.items[i].item_description;
              }
              if(backpackitems[x].inventory !== 0) { // In some very rare cases 0 can be an inventory number.
                var binary = (convertToBinary(backpackitems[x].inventory)); // http://wiki.teamfortress.com/wiki/WebAPI/GetPlayerItems#Inventory_token 
                var bpPosition = convertToNumber(binary[0]); // Get the backpack position of the item
                var isItNew = findIfNumberIsNew(binary[1]); // Check if the item is brand new to the user
                backpackitems[x].bpposition = bpPosition;
                backpackitems[x].isnew = isItNew;
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
       * Converts a TF2 Schema number into a binary number, which is used to get the backpack position
       * This is used to get the position of the item in the backpack 
      */
      function convertToBinary(binaryNumber)
      {
        var binary = '';
        while(binaryNumber > 0) {
          binary += (binaryNumber % 2).toString();
          binaryNumber = Math.floor(binaryNumber / 2);
        }
        binary = binary.match(/.{1,16}/g); // Splits the binary number into two 16 digit: array[0] = 16, array[1] = 16
        return binary;
      }

      /**
       * Converts a binary number to a real number
       * This is used to get the position of the item in the backpack 
       */
      function convertToNumber(number)
      {
        number = number.split("").reverse().join(""); // Reverse the array
        var total = 0;
        var a = number.match(/.{1,1}/g); // Splits the binary number into one array, each index is one number
        for(var y = 0; y < a.length; y++)
        {
          total += (Math.pow(2, (a.length - (y+1) )) * a[y]);
        }
        return total;
      }

      /**
       * Checks if the item is 'new', i.e. not placed in backpack.
       */
      function findIfNumberIsNew(number)
      {
        number = number.split("").reverse().join(""); // Reverse the array
        var a = number.match(/.{1,1}/g); // Splits the binary number into one array, each index is one number
        if(a[1] == 1) { // The item is new if a[1] = 1, not new if a[1] = 0
          backpackHasNewIems = 'true';
          return 'new';
        }
        return 'false';
      }

      function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1, property.length - 1);
        }
        return function (a,b) {
          var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
          return result * sortOrder;
        };
      }

      backpackitems.sort(dynamicSort("bpposition"));
      // User is logged in
      // Send the params for the navbar
      // Add the backpack checkee to db if necessary
      if(req.user !== undefined) {
        require('../controllers/user_controller').get(req.user.steamid, function(err, doc) {
        if (err) throw err;
          require('../models/user_models').checkIfUserAddToDbIfNot(req.params.id); // Add owner of checked backpack to database if necessary
          require('../models/user_models').pullUserDataFromSteamAPI(req.params.id); // Get the user's information, add it to database
          require('../controllers/user_controller').get(req.params.id, function(err, backpackOwner) {
            if (err) throw err;
            res.render('backpack', { title: 'Backpack', results: backpackitems,
              id: req.params.id, bpslots: backpackslots, user: doc, bpowner: backpackOwner, newItems: backpackHasNewIems });
          });
        });
      } else { // Not a logged in user; no navbar params
        require('../models/user_models').checkIfUserAddToDbIfNot(req.params.id);
        require('../models/user_models').pullUserDataFromSteamAPI(req.params.id);
        require('../controllers/user_controller').get(req.params.id, function(err, backpackOwner) {
          if (err) throw err;
          res.render('backpack', { title: 'Backpack', results: backpackitems,
            id: req.params.id, bpslots: backpackslots, user: null, bpowner: backpackOwner, newItems: backpackHasNewIems });
        });
      }
    });
  });
};

exports.schema = function(req, res, next) {
  var PullFromSteamApi = require('../models/steamapi_model');
  PullFromSteamApi(null, 'schema', function (err, schema) { // not writing, first arg is null
    if (req.user) var steamID = req.user.steamid;
    if (err) return next(err);
    require('../controllers/user_controller').get(steamID, function(err, doc) {
      if (err) throw err;
      if (!doc)
      {
        res.render('schema', { title: 'Schema', results: schema.result.items, user: null });
      }
      res.render('schema', { title: 'Schema', results: schema.result.items, user: doc });
    });
  });
};