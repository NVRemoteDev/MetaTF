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
  var PullFromSteamApi = require('../models/steamapi_model');
  var steamID = req.params.id || req.user.steamid; // If no :id param use the logged in user's SteamID (required to see without :id)

  PullFromSteamApi(steamID, req, 'backpack', function (err, backpack) { //.result.items,
    if (err) return next(err);
    var fileName = './models/tf2item_schema.txt';
    var contents = '';
    var backpackHasNewIems = 'false';
    var backpackitems = backpack.result.items;
    var backpackslots = backpack.result.num_backpack_slots;

    var stream = fs.createReadStream(fileName, {flags: 'r', encoding: 'utf-8'});
    stream.on('data', function(data) {
      contents += data.toString();
    });

    stream.on('end', function() {
      var obj = JSON.parse(contents);
      if(obj !== undefined && backpackitems !== undefined)
      {
        for(var i=0; i < obj.items.length; i++) { // Match backpack item defindex to schema name
          for(var x=0; x < backpackitems.length; x++)
          {
            if (obj.items[i].defindex === backpackitems[x].defindex)
            {
              backpackitems[x].name = obj.items[i].name;
              backpackitems[x].image_url = obj.items[i].image_url;
              var binary = (convertToBinary(backpackitems[x].inventory)); // http://wiki.teamfortress.com/wiki/WebAPI/GetPlayerItems#Inventory_token 
              var bpPosition = convertToNumber(binary[0]); // Get the backpack position of the item
              var isItNew = findIfNumberIsNew(binary[1]);
              backpackitems[x].bpposition = bpPosition;
              backpackitems[x].isnew = isItNew;
            }
          }
        }
      }
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
      if(req.user !== undefined) {
        require('../controllers/user_controller').get(req.user.steamid, function(err, doc) {
        if (err) throw err;
          res.render('backpack', { title: 'Backpack', results: backpackitems,
          id: req.params.id, bpslots: backpackslots, user: doc, newItems: backpackHasNewIems });
        });
      } else {
        res.render('backpack', { title: 'Backpack', results: backpackitems,
        id: req.params.id, bpslots: backpackslots, user: null, newItems: backpackHasNewIems });
      }
    });
  });
};

exports.schema = function(req, res, next) {
  var PullFromSteamApi = require('../models/steamapi_model');
  PullFromSteamApi(null, req, 'schema', function (err, schema) { // not writing, first arg is null
    if(req.user) var steamID = req.user.steamid;
    if (err) return next(err);
    require('../controllers/user_controller').get(steamID, function(err, doc) {
      if (err) throw err;
      res.render('schema', { title: 'Schema', results: schema.result.items, user: doc });
    });
  });
};