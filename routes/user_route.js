/**
 * Module Dependencies
 */
 var mongoose = require('mongoose')
   , Users = mongoose.model("Users")
   , user = new Users();

/**
 * GET /backpack/:id (:id being 64bit steam id)
 */
exports.backpack = function(req, res, next) {
  var getBackpack = require('../controllers/backpack');
  getBackpack(req.params.id, req, function (err, backpackitems, backpackSlots) {
    if (req.user) var steamID = req.user;
    if (err) return next(err);
    res.render('backpack', { title: 'Backpack', results: backpackitems, id: req.params.id, bpslots: backpackSlots, user: steamID });
  });
};

exports.schema = function(req, res, next) {
  if(req.user) var steamID = req.user;
  require('../controllers/importSchema').getSchema(null, function (err, schema) { // not writing, first arg is null
    if (err) return next(err);
    res.render('schema', { title: 'Schema', results: schema, user: steamID });
  });
};