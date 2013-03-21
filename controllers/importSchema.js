/**
 * Module dependencies.
 */

var http = require('http');

/**
 * Pull backpack contents from Steam API function.
 *
 * @param {String} id = SteamID
 * @param {Function} fn = callback (error, items, slots)
 * @api private
 */

module.exports.getSchema = function (write, fn) {
  //Schema
  var options = {
    hostname: 'api.steampowered.com',
    path: '/IEconItems_440/GetSchema/v0001/?key=807715D1032417EF88DC269B03178CCA',
    method: 'GET'
  };
  // Pull the backpack
  http.request(options, function (res) {
    res.setEncoding('utf8');
    var body = '';

    res.on('data', function (chunk) { // event handler when data is received from query
      body += chunk;
    });

    // request is finished, parse data, pull schema, return item names and information via obj.x
    res.on('end', function () {
      var obj;
      try {
        obj = JSON.parse(body); // player object
      } catch (e) {
        return fn(new Error('Bad Steam response'));
      }

      console.log('Pulled JSON response');
      if(write) {
        fn(null, obj.result); // We'll be writing, so return the whole schema
      } else {
        fn(null, obj.result.items); // Just viewing items.
      }
    });
  }).end();
};