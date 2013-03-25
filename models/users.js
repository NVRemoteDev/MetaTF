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
    , avatar  : { type: String, default: 'http://www.meta.tf/static/images/default_avatar.png' }
    , isadmin : { type: String, default: 'no' }
    , openid  : { type: String }
    , tradeids  : { type: [] }
    , personaname : { type: String, default: 'New user' }
    , avatarmedium : { type: String, default: 'none' }
    , avatarfull : { type: String, default: 'none' }
  });
  mongoose.model("Users", Users);
};