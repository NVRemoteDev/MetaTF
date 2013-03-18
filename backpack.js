
/**
 * Module dependencies.
 */
 
var qs = require('querystring')
  , http = require('http')
  , sanitize = require('validator').sanitize
  , check = require('validator').check

/**
 * Search function.
 *
 * @param {String} SteamID
 * @param {Function} callback
 * @api private
 */

module.exports = function getBackpack (id, fn) {
  /*
  * Sanitizes ID string
  */
  try {
    id = sanitize(id).escape();
  } catch(e) {
    return fn(new Error('Invalid SteamID'));
  }

  // set URL options
  var options = {
    hostname: 'api.steampowered.com',
    path: '/IEconItems_440/GetPlayerItems/v0001/?key=0504CE7A41FE91E5345627BDE03831C6&SteamID=' + id,
    method: 'GET'
  };

  http.request(options, function (res) {
    res.setEncoding('utf8');
    var body = '';

    res.on('data', function (chunk) { // event handler when data is received from query
      body += chunk;
    });

    // request is finished, parse and return obj.x
    res.on('end', function () { 
      try {
        var obj = JSON.parse(body);
      } catch (e) {
        return fn(new Error('Bad Steam response'));
      }

      console.log('Pulled JSON response');
      fn(null, obj.result.items);
    });
  }).end()
};