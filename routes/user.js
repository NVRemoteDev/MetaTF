/**
 * Module Dependencies
 */

/**
 * GET /backpack/:id (:id being 64bit steam id)
 */
exports.backpack = function(req, res, next) {
  var getBackpack = require('../controllers/backpack');
  getBackpack(req.params.id, function (err, backpackitems, backpackSlots) {
    if (err) return next(err);
    res.render('backpack', { title: 'backpack', results: backpackitems, user: req.params.id, bpslots: backpackSlots });
  });
};

exports.schema = function(req, res, next) {
  var getSchema = require('../controllers/importSchema');
  getSchema(function (err, schema) {
    if (err) return next(err);
    res.render('schema', { title: 'schema', user: req.user, results: schema });
  });
};