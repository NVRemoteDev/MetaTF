/**
 * Module dependencies.
 */

var qs = require('querystring')
  , http = require('http');

/**
 * Pull contents from steam API
 */

module.exports = function PullFromSteamApi(steamID, api, fn) {
  var useApiString = '';
  switch(api) {
    case 'backpack' : useApiString = '/IEconItems_440/GetPlayerItems/v0001/?key=FB2DAA80803E34E760188B487B0BA8D9&SteamID=' + steamID;
                      break;
    case 'user'     : useApiString = '/ISteamUser/GetPlayerSummaries/v0002/?key=FB2DAA80803E34E760188B487B0BA8D9&steamids=' + steamID;
                      break;
    case 'schema'   : useApiString = '/IEconItems_440/GetSchema/v0001/?key=FB2DAA80803E34E760188B487B0BA8D9&language=English';
                      break;
  }

  var options = {
    hostname: 'api.steampowered.com',
    path: useApiString,
    method: 'GET',
    headers: {
      "Connection": "keep-alive"
    }
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
        return fn(new Error('Bad Steam response: ' + body));
      }

      fn(null, obj);
    });
  }).end();
};