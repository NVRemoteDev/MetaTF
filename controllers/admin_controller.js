/**
 * Admin controller
 * GET /admin/:action?/:user?
 */

exports.index = function(req, res, next) {
  var action = req.params.action;
  var steamID = req.user.steamid;
  var message = null;
  
  if(action === 'updateSchema') {
    require('./controllers/download_schema_controller').download(req, res, next); // Downloads and writes schema
    message = 'Downloading and writing schema...';
    require('../models/user_model').get(steamID, function(err, doc) {
      if (err) throw err;
        res.render('admin', { title: 'Admin Area', user: doc, message: message });
    });
  } else if(action === 'resizeImages') {
    require('./controllers/download_schema_controller').resizeitems(req, res, next); // Downloads and writes schema
    message = 'Resizing images...';
    require('../controllers/user_controller').get(steamID, function(err, doc) {
      if (err) throw err;
        res.render('admin', { title: 'Admin Area', user: doc, message: message });
    });
  } else if(action === 'addAdmin') {
    console.log('Admin: Admin added.');
    require('../models/user_model').get(steamID, function(err, doc) {
      if (err) throw err;
        res.render('admin', { title: 'Admin Area', user: doc });
    });
  } else { // Invalid action, or action is undefined
    require('../models/user_model').get(steamID, function(err, doc) {
      if (err) throw err;
        res.render('admin', { title: 'Admin Area', user: doc });
    });
  }
};