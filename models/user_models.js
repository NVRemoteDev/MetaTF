// Adds user to DB if user is not already present
exports.checkIfUserAddToDbIfNot = function(id) {
  var steamID = id;
  require('../controllers/user_controller').get(steamID, function(err, doc) {
    if (!doc) { // User not found
      require('../controllers/user_controller').create(steamID);
    }
  });
};

exports.pullUserDataFromSteamAPI = function(id) {
  var steamID = id;
  var PullFromSteamApi = require('../models/steamapi_model');
  PullFromSteamApi(steamID, 'user', function(err, userData) {
    if(userData) {
      var playerData = userData.response.players[0];
      var addData =
      { "avatar" : playerData.avatar,
        "avatarmedium" : playerData.avatarmedium,
        "avatarfull" : playerData.avatarfull,
        "personaname" : playerData.personaname
      };
      require('../controllers/user_controller').update(steamID, addData); // Send data as JSON
    }
  });
};