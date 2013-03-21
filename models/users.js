var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {
  var Users = new Schema({
      steamid : { type: String, unique: true }
    , regdate : { type: Date, default: Date.now }
    , avatar  : { type: String, default: 'none' }
  });
  mongoose.model('Users', Users);
};