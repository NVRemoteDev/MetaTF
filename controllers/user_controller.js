/**
 * Module dependencies.
 */

 var mongoose = require('mongoose')
   , Users = mongoose.model("Users")
   , user = new Users();

// Create
exports.create = function (steamId) {
  user.steamid = steamId;
  user.save(function (err, callback) {
    if (err) throw err;
    console.log('User added');
  });
};

// Read
exports.get = function (steamId, fn) {
  Users.findOne({ steamid: steamId }, function (err, doc) {
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