/**
 * Module dependencies
 */
var fs = require('fs');
var qs = require('querystring');

/**
 * Download TF2 Schema (as JSON txt file)
 */
exports.download = function (req, res, next) {
  var write = true;
  require('../controllers/importSchema').getSchema(write, function(err, schema) {
    var stream = fs.createWriteStream("./models/tf2item_schema.txt");
    stream.once('open', function(fd) {
      stream.write(JSON.stringify(schema), null, 4);
      stream.end();
      console.log('Schema written to file');
    });
  });
};