/**
 * GET /admin/:action?/:user?
 */

exports.index = function(req, res, next) {
  var action = req.params.action;
  var steamID = req.user.steamid;

  if(action === 'updateSchema') {
    require('../controllers/downloadSchema_controller').download(); // Downloads and writes schema
    var message = 'Downloading and writing schema...';
    require('./controllers/user_controller').get(steamID, function(err, doc) {
      if (err) throw err;
        res.render('admin', { title: 'Admin Area', user: doc, message: message });
    });

  } else if(action === 'addAdmin') {
    console.log('Admin: Admin added.');
    require('../controllers/user_controller').get(steamID, function(err, doc) {
      if (err) throw err;
        res.render('admin', { title: 'Admin Area', user: doc });
    });
  } else { // Invalid action, or action is undefined
    require('../controllers/user_controller').get(steamID, function(err, doc) {
      if (err) throw err;
        res.render('admin', { title: 'Admin Area', user: doc });
    });
  }
};