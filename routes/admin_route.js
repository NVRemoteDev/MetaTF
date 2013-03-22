/**
 * GET /admin/:action?/:user?
 */

exports.index = function(req, res, next) {
  var action = req.params.action;
  if(action === 'updateSchema') {
    require('../controllers/downloadSchema_controller').download(); // Downloads and writes schema
    var message = 'Downloading and writing schema.';
    steamID = req.user;
    res.render('admin', { title: 'Admin Area', user: steamID, message: message });
  } else if(action === 'addAdmin') {
    //TODO add admin
    console.log('Admin: Admin added.');
    steamID = req.user;
    res.render('admin', { title: 'Admin Area', user: steamID });
  } else { // Invalid action, or action is undefined
    steamID = req.user;
    res.render('admin', { title: 'Admin Area', user: steamID });
  }
};