/**
 * Module dependencies.
 */

 var mongoose = require('mongoose')
   , Trades = mongoose.model("Trades");

/**
 * Create a new trade
 * Increments tradeID every time a trade is created to ensure we have
 * unique URLs
 *
 * @param steamID SteamID of the trade creator
 * @param items   Item array, uses steam API for user's items
 */
exports.create = function (steamID, items, fn) {
  var trade = new Trades();
  if(steamID && items) {
    trade.steamid = steamID;
    trade.items = items;
    trade.tradeid = Number(4325);
  }
  saveTrade(trade);

  // Recursivly call this function until we get a good tradeid
  // Mongoose/mongodb doesn't have an auto incrementing type by default
  function saveTrade(trade) {
    trade.save(function (err, callback) {
      if (err && err.code === 11000) { // duplicate tradeid, increment until we don't get an error
        var aNumber = parseInt(trade.tradeid, 10);
        trade.tradeid = ++aNumber;
        saveTrade(trade);
      } else if (!err) {
        fn(null, trade);
      }
    });
  }
};

/**
 * View a trade
 *
 * @param tradeID The trade id to view
 * @param fn      Function callback: (error, data)
 */
exports.get = function (tradeID, fn) {
  Trades.findOne({ tradeid: tradeID }, function (err, doc) {
    if (err) return err;
    if (doc) {
      fn(null, doc);
    } else {
      fn(null, null); // Trade not found
    }
  });
};

/**
 * Update a trade
 *
 * @param tradeID The trade id to update
 * @param whatToUpdate  JSON data telling us what to update
 */
exports.update = function (tradeID, whatToUpdate) { //whatToUpdate is JSON data that will be added to the user's database
  Users.findOne({ steamid: steamID }, function (err, doc) {
    if (err) return err;
    whatToUpdate = JSON.parse(JSON.stringify(whatToUpdate));

    if (doc && whatToUpdate !== undefined) {
      for (var propertyName in whatToUpdate)
      {
        doc[propertyName] = whatToUpdate[propertyName];
      }
      doc.save(function (err, callback) {
        if (err) throw err;
      });
    }
  });
};

// Destroy
exports.destroy = function (steamID) {
  //TODO
};