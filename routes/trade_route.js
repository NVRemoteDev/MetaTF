
/*
 * Route Trades
 */

exports.index = function(req, res) {
  if(req.body.items) {
    Create(req, res); // Process the post data from create template
  } else if(req.params.action) {
    var action = req.params.action;
    if(action == 'view') {
      View(req, res);
    }
    if(action == 'create') {
      ViewCreate(req, res); // Forward them to the create template
    }
  }
};

/**
 * View trade/tradeID
 */
function View (req, res) {
   if(req.params.tradeid) {
      var tradeID = req.params.tradeid;
      require('../controllers/trade_controller').get(tradeID, function(err, tradeinfo) {
        if (err) throw err;
        if (tradeinfo) {
          if(req.user) { // User is logged in
            require('../controllers/user_controller').get(req.user.steamid, function(err, doc) {
              if (err) throw err;
              res.render('viewtrade', { title: 'View Trade', tradeinfo: tradeinfo, user: doc });
            });
          } else { // User viewing trade isn't logged in
            res.render('viewtrade', { title: 'View Trade', tradeinfo: tradeinfo, user: null });
          }
        } else {
          res.redirect('/');
        }
      });
    } else {
      // View last 10 trades/last 10 bumped trades
    }
}

/*
 * ViewCreate shows us the create template
 */
function ViewCreate (req, res) {
  if(req.user) { // User is logged in
    require('../controllers/user_controller').get(req.user.steamid, function(err, doc) {
      if (err) throw err;
      /* 
        [Get backpack items HERE]
      */
      /*
        [SHOW SCHEMA HERE]
      */
      res.render('createtrade', { title: 'Create Trade', user: doc });
    });
  } else { // Failsafe.  Ensure creator is logged in
    res.redirect('/');
  }
}

/*
 * Create sends data to trade controller to create
 * Sends tradeID to user controller for trade viewing later
 */
function Create (req, res) {
  var items = req.body.items;
  var steamID = req.user.steamid;
  var tradeID = 4325;
  require('../controllers/trade_controller.js').create(steamID, items, function(err, doc) {
    var trade = doc.tradeid;
    res.redirect('/trade/view/' + trade);
  });
}