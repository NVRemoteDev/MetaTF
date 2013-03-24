/**
 * Module Dependencies
 */
 var mongoose = require('mongoose')
   , Users = mongoose.model("Users")
   , user = new Users()
   , fs = require('fs');

/**
 * GET /backpack/:id (:id being 64bit steam id)
 */
exports.backpack = function(req, res, next) {
  var getBackpack = require('../controllers/backpack');
  getBackpack(req.params.id, req, function (err, backpackitems, backpackSlots) {
    if (req.user) var steamID = req.user.steamid;
    if (err) return next(err);
    var fileName = './models/tf2item_schema.txt';
    var contents = '';

    var stream = fs.createReadStream(fileName, {flags: 'r', encoding: 'utf-8'});
    stream.on('data', function(data) {
      contents += data.toString();
    });
    stream.on('end', function() {
      var obj = JSON.parse(contents);
      for(var i=0; i < obj.items.length; i++) {
        for(var x=0; x < backpackitems.length; x++)
        {
          if (obj.items[i].defindex === backpackitems[x].defindex)
          {
            backpackitems[x].name = obj.items[i].name;
            backpackitems[x].image_url = obj.items[i].image_url;
          }
        }
      }
      res.render('backpack', { title: 'Backpack', results: backpackitems,
        id: req.params.id, bpslots: backpackSlots, user: steamID });
    });
  });
};

exports.schema = function(req, res, next) {
  require('../controllers/importSchema').getSchema(null, function (err, schema) { // not writing, first arg is null
    if(req.user) var steamID = req.user.steamid;
    if (err) return next(err);
    res.render('schema', { title: 'Schema', results: schema, user: steamID });
  });
};