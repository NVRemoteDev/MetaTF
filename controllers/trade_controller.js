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
exports.create = function (steamID, items, callback) {
  var trade = new Trades();
  if(steamID && items) {
    trade.steamid = steamID;
    trade.items = items;
  }
  trade.save(function (err, callback) {
    if (err) throw err;
    console.log('trade saved');
  });
  callback(null, 'created');
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