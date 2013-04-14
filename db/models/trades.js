/**
 * Module dependencies
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Trade Schema
 */
module.exports = function() {
  var Trades = new Schema({
      owner_steamid : { type: String },
      date_posted : { type: Date, default: Date.now },
      tradeid : { type: String, unique: true, default: 4325 },
      items : { type: [] },
      finished: { type: Boolean, default: false },
      views: { type: Number, default: 0 },
      last_bump : { type: Date, default: Date.now }
  });
  mongoose.model("Trades", Trades);
};