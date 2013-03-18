/*
 * GET /backpack/:id (:id being 64bit steam id)
 */
exports.backpack = function(req, res, next) {
  var getBackpack = require('../backpack');
  getBackpack(req.params.id, function (err, backpackitems, backpackSlots) {
    if (err) return next(err);
    res.render('backpack', { results: backpackitems, user: req.params.id, bpslots: backpackSlots });
  });
};

exports.schema = function(req, res, next) {
  var getSchema = require('../importSchema');
  getSchema(function (err, schema) {
    if (err) return next(err);
    res.render('schema', { results: schema });
  });
};