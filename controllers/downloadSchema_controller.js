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
  PullFromSteamApi(null, 'schema', function(err, schema) {
    var stream = fs.createWriteStream("./models/tf2item_schema.txt");
    try {
      stream.once('open', function(fd) {
        var result = schema.result;
        stream.write(JSON.stringify(result), null, 4); // Schema.result is all we want.
        stream.end();
        console.log('Schema written to file');
      });
    } catch (e) {
      return fn(new Error('Bad Steam response. Try again later.'));
    }
  });
};