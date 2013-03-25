/**
 * Module dependencies
 */
var fs = require('fs');
var qs = require('querystring');

/**
 * Download TF2 Schema (as JSON txt file)
 */
exports.download = function (req, res, next) {
  var PullFromSteamApi = require('../models/steamapi_model');
  PullFromSteamApi(null, req, 'schema', function(err, schema) {
    var stream = fs.createWriteStream("./models/tf2item_schema.txt");
    try {
      stream.once('open', function(fd) {
        stream.write(JSON.stringify(schema.result), null, 4); // Schema.result is all we want.
        stream.end();
        console.log('Schema written to file');
      });
    } catch (e) {
      return fn(new Error('Bad Steam response. Try again later.'));
    }
  });
};