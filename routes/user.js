
/*
 * GET users listing.
 */


/*
 * GET /backpack/:id (:id being 64bit steam id)
 */
exports.backpack = function(req, res, next) {
  var getBackpack = require('../backpack');
  getBackpack(req.params.id, function (err, backpackitems) {
    if (err) return next(err);
	res.render('backpack', { results: backpackitems, user: req.params.id });
  });
};