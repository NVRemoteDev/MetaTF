/**
 * Module dependencies
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * User Schema
 */
module.exports = function() {
  var Users = new Schema({
      steamid : { type: String, unique: true, required: true }
    , regdate : { type: Date, default: Date.now }
    , avatar  : { type: String, default: 'none' }
    , isadmin : { type: String, default: 'no' }
  });
  mongoose.model('Users', Users);
};