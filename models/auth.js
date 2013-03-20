  /**
  * Module dependencies.
  */

  exports.loginToDb = function(req, res, next) { // This function will return information from the database
    if(!req.user) { return; }  // User isn't logged in
    var steamIdentifier = req.user.identifier; // req.user.identifier is set after logging in as steam; openID url
    steamIdentifier = steamIdentifier.split('/');
    var jsonSteamId = { steamid: steamIdentifier[steamIdentifier.length-1] }; // Use if we enter data to database, json format
    var userSteamId = steamIdentifier[steamIdentifier.length-1]; // Used as our search
    app.users.findOne({ steamid: userSteamId }, function (err, doc) { // Search Mongo
      if (err) return next(err);
      if (!doc) { // no steamID found
        app.users.insert(jsonSteamId, function (err, doc) { // create a database entry for this user.
          if (err) return next(err);
          app.users.findOne({ steamid: userSteamId }, function (err, doc) { // Search Mongo
            // User is found, set steamid
            req.session.steamid = doc.steamid;
            return next();
          });
        });
      } else {
        // User is found, set steamid
        req.session.steamid = doc.steamid;
        return next();
      };
    });
  };