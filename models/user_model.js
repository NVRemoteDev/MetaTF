/**
 * User model controls common user functions, such as CRUD functions
 */

/**
 * Module dependencies.
 */

 var mongoose = require('mongoose')
   , Users = mongoose.model("Users");

// Create
exports.create = function (steamID, callback) {
  var user = new Users();
  if (steamID == 76561197991291041) { // Add me as an admin for when database resets.
    user.isadmin = 'yes';
  } else {
    user.isadmin = 'no';
  }
  user.steamid = steamID;
  user.save(function (err, callback) {
    if (err) throw err;
  });
};

// Read
exports.get = function (steamID, fn) {
  Users.findOne({ steamid: steamID }, function (err, doc) {
    if (err) return err;
    if (doc) {
      fn(null, doc);
    } else {
      fn(null, null); // User not found
    }
  });
};

// Update
exports.update = function (steamID, whatToUpdate) { //whatToUpdate is JSON data that will be added to the user's database
  Users.findOne({ steamid: steamID }, function (err, doc) {
    if (err) return err;
    whatToUpdate = JSON.parse(JSON.stringify(whatToUpdate));
    if (doc && whatToUpdate) {
      for (var propertyName in whatToUpdate)
      {
        if(propertyName == 'tradeids') {
            doc[propertyName].push(whatToUpdate[propertyName]);
        } else {
          doc[propertyName] = whatToUpdate[propertyName];
        }
      }
      doc.save(function (err, callback) {
        if (err) throw err;
      });
    }
  });
};

// Destroy
exports.destroy = function (steamID) {
  //TODO
};

// Adds user to DB if user is not already present
exports.checkIfUserAddToDbIfNot = function(id) {
  var steamID = id;
  require('./user_model').get(steamID, function(err, doc) {
    if (!doc) { // User not found
      require('./user_model').create(steamID);
    }
  });
};

exports.pullUserDataFromSteamAPI = function(id) {
  var steamID = id;
  var PullFromSteamApi = require('./steamapi_model');
  PullFromSteamApi(steamID, 'user', function(err, userData) {
    if(userData) {
      var playerData = userData.response.players[0];
      var addData =
      { "avatar" : playerData.avatar,
        "avatarmedium" : playerData.avatarmedium,
        "avatarfull" : playerData.avatarfull,
        "personaname" : playerData.personaname
      };
      require('./user_model').update(steamID, addData); // Send data as JSON
    }
  });
};