/**
 * Module dependencies.
 */

 var mongoose = require('mongoose')
   , server = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/metatf';
/**
 * Connect to MongoDB
 */

function connectToMongoose() {
  mongoose.connect(server);
  return server;
};

exports.connectToMongoose = connectToMongoose;