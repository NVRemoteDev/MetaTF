/**
 * Module Dependencies
 */
var path = require('path');

/**
 * GET /backpack/:id (:id being 64bit steam id)
 */
exports.backpack = function(req, res, next) {
  var getBackpack = require('../controllers/backpack');
  if(req.user) // If user is logged in, set req.user to their steam id (req.user if logged in is the steam openID)
  {
    var steamIdentifier = req.user.identifier;
    steamIdentifier = steamIdentifier.split('/');
    req.user = steamIdentifier[steamIdentifier.length-1];
  }
  getBackpack(req.params.id, req, function (err, backpackitems, backpackSlots) {
    if (err) return next(err);
    res.render('backpack', { title: 'Backpack', results: backpackitems, id: req.params.id, bpslots: backpackSlots, user: req.user });
  });
};

exports.schema = function(req, res, next) {
  var getSchema = require('../controllers/importSchema');
  if(req.user) // If user is logged in, set req.user to their steam id (req.user if logged in is the steam openID)
  {
    var steamIdentifier = req.user.identifier;
    steamIdentifier = steamIdentifier.split('/');
    req.user = steamIdentifier[steamIdentifier.length-1];
  }
  getSchema(function (err, schema) {
    if (err) return next(err);
    res.render('schema', { title: 'Schema', results: schema, user: req.user });
  });
};