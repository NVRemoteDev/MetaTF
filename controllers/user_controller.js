/**
 * Module dependencies.
 */

 var mongoose = require('mongoose')
   , Users = mongoose.model("Users");

exports.profile = function (req, res, next) {
  var PullFromSteamApi = require('../models/steamapi_model');
  if (req.user !== undefined) {
    require('../models/user_model').get(req.user.steamid, function (err, doc) {
      if (err) throw err;
      require('../models/user_model').checkIfUserAddToDbIfNot(req.params.id); // Add owner of checked backpack to database if necessary
      require('../models/user_model').pullUserDataFromSteamAPI(req.params.id); // Get the user's information, add it to database
      require('../models/user_model').get(req.params.id, function (err, profileowner) {
        if (err) throw err;
        res.render('profile', {
          title: 'Profile',
          id: req.params.id,
          user: doc,
          profileowner: profileowner
        });
      });
    });
  } else { // Not a logged in user; no navbar params
    require('../models/user_model').checkIfUserAddToDbIfNot(req.params.id);
    require('../models/user_model').pullUserDataFromSteamAPI(req.params.id);
    require('../models/user_model').get(req.params.id, function (err, doc) {
      if (err) throw err;
      res.render('profile', {
        title: 'Profile',
        id: req.params.id,
        user: null,
        profileowner: doc
      });
    });
  }
};