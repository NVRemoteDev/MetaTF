/**
 * Module dependencies
 */
var fs = require('fs');
var qs = require('querystring');

/**
 * Download TF2 Schema (as JSON txt file)
 */
exports.download = function (req, res, next) {
  var PullFromSteamApi = require('../models/steamapi_model');
  PullFromSteamApi(null, 'schema', function(err, schema) {
    var stream = fs.createWriteStream("./models/tf2item_schema.txt");
    try {
      stream.once('open', function(fd) {
        var result = schema.result;
        var length = result.items.length;
        for(var i = 0; i < length; i++) {
          if(result.items[i].name !== undefined) {
            result.items[i].name = translateItemNames(result.items[i].name);
          }
        }
        stream.write(JSON.stringify(result), null, 4); // Schema.result is all we want.
        stream.end();
        console.log('Schema written to file');
      });
    } catch (e) {
      return fn(new Error('Bad Steam response. Try again later.'));
    }
    // Translate some item names into their familiar counterpart in game before writing
    function translateItemNames(item) {
        switch(item) {
          case "Craft Bar Level 1":
            return "Scrap Metal";
          case "Craft Bar Level 2":
            return "Reclaimed Metal";
          case "Craft Bar Level 3":
            return "Refined Metal";
          case "Engineer Earmuffs":
            return "Safe'n'Sound";
          case "Decoder Ring":
            return "Mann Co. Supply Crate Key";
          case "Upgradeable TF_WEAPON_BONESAW":
            return "Bonesaw";
          case "Upgradeable TF_WEAPON_SNIPERRIFLE":
            return "Sniper Rifle";
          case "Upgradeable TF_WEAPON_ROCKETLAUNCHER":
            return "Rocket Launcher";
          case "Upgradeable TF_WEAPON_SHOTGUN_PRIMARY":
            return "Shotgun";
          case "Upgradeable TF_WEAPON_FIREAXE":
            return "Fireaxe";
          case "Upgradeable TF_WEAPON_MINIGUN":
            return "Minigun";
          case "Upgradeable TF_WEAPON_BOTTLE":
            return "Bottle";
          case "Upgradeable TF_WEAPON_FLAMETHROWER":
            return "Flamethrower";
          case "Upgradeable TF_WEAPON_SCATTERGUN":
            return "Scattergun";
          case "Upgradeable TF_WEAPON_KNIFE":
            return "Knife";
          case "Upgradeable TF_WEAPON_WRENCH":
            return "Wrench";
          case "Upgradeable TF_WEAPON_PIPEBOMBLAUNCHER":
            return "Stickybomb Launcher";
          case "Worms Gear":
            return "Lumbricus Lid";
          case "Autogrant Pyrovision Goggles":
            return "Pyrovision Goggles";
          case "Demoman Tricorne":
            return "Tippler's Tricorne";
          case "Scout Beanie":
            return "Troublemaker's Tossle";
          case "The Huo Long Heatmaker":
            return "The Huo-Long Heater";
          case "OSX Item":
            return "Earbuds";
          case "L4D Hat":
            return "Bill's Hat";
          case "TTG Max Hat":
            return "Max's Head";
          case "Duel MiniGame":
            return "Dueling Minigame";
          default:
            return item;
        }
      }
  });
};