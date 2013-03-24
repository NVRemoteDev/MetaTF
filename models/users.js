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
      steamid : { type: String }
    , regdate : { type: Date, default: Date.now }
    , avatar  : { type: String, default: "none" }
    , isadmin : { type: String, default: "no" }
    , openid  : { type: String }
    , tradeids  : { type: [] }
  });
  mongoose.model("Users", Users);
};