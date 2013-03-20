  /**
  * Module dependencies.
  */
  var express = require('express');
  var app = express();

  exports.checkdb = function (req, res) {
    if(!req.user) return;
    var steamIdentifier = req.user.identifier; // req.user.identifier is set after logging in as steam; openID url
    steamIdentifier = steamIdentifier.split('/');
    var jsonSteamId = { steamid: steamIdentifier[steamIdentifier.length-1] }; // Use if we enter data to database, json format
    var userSteamId = steamIdentifier[steamIdentifier.length-1]; // Used as our search
    app.users.findOne({ steamid: userSteamId }, function (err, doc) { // Search Mongo
      if (err) return next(err);
      if (!doc) { // no steamID found
        app.users.insert(jsonSteamId, function (err, doc) { // create a database entry for this user.
          if (err) return next(err);
        });
        app.users.findOne({ steamid: userSteamId }, function (err, doc) { // Repeat the search once user is registered to set var
          req.session.loggedIn = doc._id.toString();
          console.log("login in " + req.session.loggedIn);
        });
      } else { // User is found, set session.logged in to database _id and continue.
        req.session.loggedIn = doc._id.toString();
        console.log("login in " + req.session.loggedIn);
      };
    });
  };