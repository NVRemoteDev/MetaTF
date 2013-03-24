/**
 * Module dependencies.
 */

 var mongoose = require('mongoose')
   , Users = mongoose.model("Users");

// Create
exports.create = function (steamID) {
  var user = new Users();

  if (steamID == 76561197991291041) { // Add me as an admin for when database resets.
    user.isadmin = 'yes';
  } else {
    user.isadmin = 'no';
  }
  user.steamid = steamID;
  user.save(function (err, callback) {
    if (err) throw err;
    console.log('User ' + user.steamid + ' added');
    console.log('Admin: ' + user.isadmin);
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
exports.update = function (steamId) {
  //TODO
};

// Destroy
exports.destroy = function (steamId) {
  //TODO
};