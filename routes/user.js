/*
 * GET /backpack/:id (:id being 64bit steam id)
 */
exports.backpack = function(req, res, next) {
  var getBackpack = require('../controllers/backpack');
  getBackpack(req.params.id, function (err, backpackitems, backpackSlots) {
    if (err) return next(err);
    res.render('backpack', { results: backpackitems, user: req.params.id, bpslots: backpackSlots });
  });
};

exports.schema = function(req, res, next) {
  var getSchema = require('../controllers/importSchema');
  getSchema(function (err, schema) {
    if (err) return next(err);
    res.render('schema', { results: schema });
  });
};

exports.openid = function(req, res, next) {
  var login = require('../controllers/authentication');
  getSchema(function (err, schema) {
    if (err) return next(err);
    res.render('schema', { results: schema });
  });
};