
/**
 * Module requirements.
 */

require('./models/schemas.js').initialize(); // initialize Mongoose schema models

var express = require('express')
  , routes = require('./routes/index')
  , trade = require('./routes/trade_route')
  , user = require('./routes/user_route')
  , adminroutes = require('./routes/admin_route')
  , http = require('http')
  , passport = require('passport')
  , SteamStrategy = require('./node_modules/passport-steam/lib/passport-steam').Strategy
  , mongoose = require('mongoose') // Mongoose includes below
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
  //, Users = mongoose.model('Users');


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
passport.use(new SteamStrategy( {
    //returnURL: 'http://www.meta.tf/auth/steam/return',
    //realm: 'http://www.meta.tf'
    returnURL: 'http://localhost:3000/auth/steam/return',
    realm: 'http://localhost:3000/'
  }, 
  function(identifier, profile, done) {
    // asynchronous verification, sets req.session.user to steamID
    process.nextTick(function () {
      var steamIdentifier = identifier.split('/');
      var steamID = steamIdentifier[steamIdentifier.length-1];
      profile.identifier = steamID;
      return done(null, profile.identifier);
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
  app.use(
  if (!process.env.NODE_ENV) {
    express.session({ secret: 'dont be walmarting' }));
  } else {
    express.cookieSession({ secret: 'dont be walmarting', cookie: { maxAge: 10 * 60 * 60 * 1000 }}));
  }
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

var checkIfUserAddToDbIfNot = function(req, res, next) {
  var steamID = req.user;
  require('./controllers/user_controller').get(steamID, function(err, doc) {
    if (!doc) { // User not found
      require('./controllers/user_controller').create(steamID);
    }
  });
  return next();
};

/**
 * Routes
 */

app.get('/', routes.index);
app.get('/schema', user.schema); // Shows current Schema

/**
 * Trade routes
 */
app.get('/trades/:action/:id?', trade.index);
app.get('/trades', function(req, res, next) { // View most recent trades if no action specified
  res.redirect('/trades/view');
});

/**
 * User routes
 */

app.get('/user/', function(req, res, next) { // View SITE profile of logged in user
  res.redirect('/account');
});
app.get('/user/:id', user.backpack); // View SITE profile of SteamID :id
app.get('/account', ensureAuthenticated, function(req, res) {
  steamID = req.user;
  res.render('account', { title: 'Account', user: steamID });
});

/**
 * Backpack routes
 */

app.get('/backpack/', ensureAuthenticated, user.backpack); // View own backpack (must be logged in)
app.get('/backpack/:id', user.backpack); // View backpack of SteamID :id

/**
 * Admin Routes
 */

app.get('/admin/:action?/:user?', ensureAuthenticated, ensureAdmin, adminroutes.index);

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
//   ** CHECKS AGAINST DATABASE VIA checkIfUserAddToDbIfNot **
app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }), checkIfUserAddToDbIfNot, function (req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/login', function(req, res){
  res.redirect('/auth/steam');
});

/**
 * Listen
 */

require('./db/connect').connectToMongoose();
console.log('Schemas initialized');
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
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

// Simple route middleware to ensure user is admin.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.
function ensureAdmin(req, res, next) {
  var steamID = req.user;
  require('./controllers/user_controller').get(steamID, function(err, doc) {
    if (err) return next(err);
    if (doc.isadmin === "yes") { return next(); }
    res.redirect('/');
  });
}