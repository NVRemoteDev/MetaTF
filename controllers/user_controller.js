/**
 * Module dependencies.
 */

 var mongoose = require('mongoose'),
     Users = mongoose.model("Users");

/**
 * Renders the profile page which contains their trades
 */
exports.profile = function (req, res, next) {
  var PullFromSteamApi = require('../models/steamapi_model');
  // Not a logged in user; no navbar params
  var steamID = '';
  if (req.user) steamID = req.user.steamid;
  require('../models/user_model').get(steamID, function (err, loggedin) {
    if (err) throw err;
    require('../models/user_model').checkIfUserAddToDbIfNot(req.params.id);
    require('../models/user_model').pullUserDataFromSteamAPI(req.params.id);
    require('../models/user_model').get(req.params.id, function (err, doc) {
      if (err) throw err;
      if(loggedin && doc) { // user is logged in, profile we're checking exists
        res.render('profile', {
          title: 'Profile',
          id: req.params.id,
          user: loggedin,
          profileowner: doc
        });
      } else if(doc) { // user isn't logged in, profile we're checking exists
        res.render('profile', {
          title: 'Profile',
          id: req.params.id,
          user: null,
          profileowner: doc
        });
      } else { // error
        res.redirect('/');
      }
    });
  });
};