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

module.exports = function getSchema(fn) {
  //Schema
  var options = {
    hostname: 'api.steampowered.com',
    path: '/IEconItems_440/GetSchema/v0001/?key=0504CE7A41FE91E5345627BDE03831C6',
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
      fn(null, obj.result.items); // return no error, item data, backpack slot count
    });
  }).end();
};