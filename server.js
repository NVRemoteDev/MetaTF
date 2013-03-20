
/**
 * Module requirements.
 */

var express = require('express')
  , routes = require('./routes')
  , trades = require('./routes/trades')
  , user = require('./routes/user')
  , auth = require('./models/auth')
  , http = require('http')
  , passport = require('passport')
  , SteamStrategy = require('./node_modules/passport-steam/lib/passport-steam').Strategy
  //, mongoose = require('mongoose')
  , mongodb = require('mongodb')

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Steam profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the SteamStrategy within Passport.
//   Strategies in passport require a `validate` function, which accept
//   credentials (in this case, an OpenID identifier and profile), and invoke a
//   callback with a user object.
passport.use(new SteamStrategy({
    //returnURL: 'http://www.meta.tf/auth/steam/return',
    //realm: 'http://www.meta.tf'
    returnURL: 'http://localhost:3000/auth/steam/return',
    realm: 'http://localhost:3000'
  },
  function(identifier, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Steam profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Steam account with a user record in your database,
      // and return that user instead.
      profile.identifier = identifier;
      return done(null, profile);
    });
  }
));

/**
 * Create app.
 */

var app = express();

/**
 * Configuration
 */

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use('/static', express.static(__dirname + '/public'));
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'dont be walmarting' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

  var loginToDatabase = function(req, res, next) { // This function will return information from the database
    if(!req.user) { return; }  // User isn't logged in
    // v req.user.identifier is set after logging into steam; openID url
    var steamIdentifier = req.user.identifier.split('/');
    var steamID = steamIdentifier[steamIdentifier.length-1]; // Used as our search criteria for mongo below
    var jsonSteamId = { steamid: steamID }; // Used to enter steamID to mongodb below, json format

    app.users.findOne({ steamid: steamID }, function (err, doc) { // Search Mongo
      if (err) return next(err);

      if (!doc) { // no steamID found
        app.users.insert(jsonSteamId, function (err, doc) { // create a database entry for this user.
          if (err) return next(err);
          app.users.findOne({ steamid: steamID }, function (err, doc) { // Search Mongo
            if(err) return next(err);
            // User is found, set steamid
            req.session.steamid = doc.steamid;
            return next();
          });
        });
      } else {
        // User is found, set steamid
        req.session.steamid = doc.steamid;
        return next();
      }
    });
  };

/**
 * Routes
 */

app.get('/', routes.index);
// TODO will be used to download TF2 Item schema.
app.get('/schema', user.schema);
// Trade routes
app.get('/trades/:action/:id?', trades.index); // CRUD for trades
app.get('/trades', function(req, res, next) { // View most recent trades if no action specified
  res.redirect('/trades/view');
});
// User routes
app.get('/user/', function(req, res, next) { // View SITE profile of logged in user
  res.redirect('/account');
});
app.get('/user/:id', user.backpack); // View SITE profile of SteamID :id

/**
 * Backpack routes
 */

app.get('/backpack/', ensureAuthenticated, user.backpack); // View own backpack (must be logged in)
app.get('/backpack/:id', user.backpack); // View backpack of SteamID :id

/**
* Steam Passport Routes
*/

// GET /auth/steam
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Steam authentication will involve redirecting
//   the user to steam.com.  After authenticating, Steam will redirect the
//   user back to this application at /auth/steam/return
app.get('/auth/steam',
  passport.authenticate('steam', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

// GET /auth/steam/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
//   ** CHECKS AGAINST DATABASE IF USER HAS ALREADY LOGGED IN AT THIS SITE, CREATES DB ENTRY IF NOT **
app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }), loginToDatabase, function (req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/account', ensureAuthenticated, function(req, res) {
  steamid = req.session.steamid;
  res.render('account', { title: 'Account', user: steamid });
});

app.get('/login', function(req, res){
  res.redirect('/auth/steam');
});

/**
 * Listen
 */

// heroku
//var server = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mydb';
//mongodb.Db.connect(server, function (err, client) {
// /heroku
// localhost
var server = new mongodb.Server('127.0.0.1', 27017);
new mongodb.Db('metatf', server).open(function (err, client) {
// /localhost
  if (err) throw err;
  console.log('\033[96m + \033[39m connected to mongodb');

  // set up collection shortcuts
  app.users = new mongodb.Collection(client, 'users');

  client.ensureIndex('users', 'steamid', function(err) {
    if (err) throw err;
    console.log('\033[96m + \033[93m ensured indexes');
    /**
    * Listen
    */
    http.createServer(app).listen(app.get('port'), function(){
      console.log("Express server listening on port " + app.get('port'));
    });
  });
});


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}