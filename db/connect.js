/**
 * Module dependencies.
 */

 var mongoose = require('mongoose')
   , server = process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/metatf';
/**
 * Connect to MongoDB
 */

function connectToMongoose() {
  mongoose.connect(server);
  return server;
};

exports.connectToMongoose = connectToMongoose;