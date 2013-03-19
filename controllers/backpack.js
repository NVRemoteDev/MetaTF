
/**
 * Module dependencies.
 */

var qs = require('querystring')
  , http = require('http');

/**
 * Pull backpack contents from Steam API function.
 *
 * @param {String} id = SteamID
 * @param {Function} fn = callback (error, items, backpackslots)
 * @api private
 */

module.exports = function getBackpack(id, req, fn) {
  // set URL options to pull backpack
  if(!req.user) {
    var options = {
      hostname: 'api.steampowered.com',
      path: '/IEconItems_440/GetPlayerItems/v0001/?key=807715D1032417EF88DC269B03178CCA&SteamID=' + id,
      method: 'GET'
    };
  } else {
    var options = {
      hostname: 'api.steampowered.com',
      path: '/IEconItems_440/GetPlayerItems/v0001/?key=807715D1032417EF88DC269B03178CCA&SteamID=' + req.user,
      method: 'GET'
    };
  }
  // Pull the backpack
  http.request(options, function (res) {
    res.setEncoding('utf8');
    var body = '';

    res.on('data', function (chunk) { // event handler when data is received from query
      body += chunk;
    });

    // request is finished, parse data, pull schema, return item names and information via obj.x
    res.on('end', function () { 
      try {
        var obj = JSON.parse(body); // player object
      } catch (e) {
        return fn(new Error('Bad Steam response'));
      }
      
      console.log('Pulled JSON response');
      fn(null, obj.result.items, obj.result.num_backpack_slots); // return no error, item data, backpack slot count
    });
  }).end();
};