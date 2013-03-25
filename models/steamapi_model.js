/**
 * Module dependencies.
 */

var qs = require('querystring')
  , http = require('http');

/**
 * Pull contents from steam API
 */

module.exports = function PullFromSteamApi(steamID, req, api, fn) {
  if(api !== 'schema') {
    if(!steamID) // no user entered, use logged in user's details
    {
      steamID = req.user.steamid;
    }
  }
  var useApiString = '';
  switch(api) {
    case 'backpack' : useApiString = '/IEconItems_440/GetPlayerItems/v0001/?key=807715D1032417EF88DC269B03178CCA&SteamID=' + steamID;
                      break;
    case 'user'     : useApiString = '/ISteamUser/GetPlayerSummaries/v0002/?key=807715D1032417EF88DC269B03178CCA&steamids=' + steamID;
                      break;
    case 'schema'   : useApiString = '/IEconItems_440/GetSchema/v0001/?key=807715D1032417EF88DC269B03178CCA';
                      break;
  }

  var options = {
    hostname: 'api.steampowered.com',
    path: useApiString,
    method: 'GET'
  };

  // Pull the backpack
  http.request(options, function (res) {
    res.setEncoding('utf8');
    var body = '';

    res.on('data', function (chunk) { // event handler when data is received from query
      body += chunk;
    });

    // request is finished, parse data to JSON, return JSON object
    res.on('end', function () {
      try {
        var obj = JSON.parse(body); // player object
      } catch (e) {
        return fn(new Error('Bad Steam response'));
      }

      fn(null, obj);
    });
  }).end();
};