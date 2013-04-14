
/**
 * Route Trades
 * GET /trade/:action/:tradeid?
 * POST /trade/create
 */

exports.index = function(req, res, next) {
  if (req.body.items) {
    require('../models/trade_model').create(req, res); // Process the post data from create template
  } else if (req.params.action) {
    var action = req.params.action;
    if(action == 'view') {
      ViewTrade(req, res, next);
    }
    if (action == 'create') {
      ShowCreateATrade(req, res, next); // Forward them to the create template
    }
  }
};

/**
 * ShowCreateATrade shows us the create template
 */
function ShowCreateATrade (req, res, next) {
  require('../models/item_model').getschema(req, res, next, function (err, schema) {
    require('../models/item_model').getbackpack(req, res, next, function (err, backpackitems, backpackHasNewIems) {
      require('../models/user_model').get(req.user.steamid, function (err, doc) {
        if (backpackitems && doc && backpackHasNewIems) {
          if (err) throw err;
          var backpackslots = backpackitems.num_backpack_slots;
          var bpitems = backpackitems.items;
          res.render('createtrade', {
            title: 'Create Trade',
            items: bpitems,
            id: req.params.id,
            bpslots: backpackslots,
            user: doc,
            newItems: backpackHasNewIems,
            results: schema.items
          });
        } else {
          res.render('/');
        }
      });
    });
  });
}

/**
 * GET view/trade/tradeID
 */
function ViewTrade (req, res) {
  if (req.params.tradeid) {
    var tradeID = req.params.tradeid;
    require('../models/trade_model').get(tradeID, function(err, tradeinfo) {
      if (err) throw err;
      if (tradeinfo) {
        if (req.user) { // User is logged in
          require('../models/trade_model').get(req.user.steamid, function(err, doc) {
            if (err) throw err;
            res.render('viewtrade', { title: 'View Trade', tradeinfo: tradeinfo, user: doc });
          });
        } else { // User viewing trade isn't logged in
          res.render('viewtrade', { title: 'View Trade', tradeinfo: tradeinfo, user: null });
        }
      } else {
        // ERROR
        res.redirect('/');
      }
    });
  } else {
    // View last 10 trades/last 10 bumped trades
  }
}