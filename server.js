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
  , ObjectId = Schema.ObjectId
  , MongoStore = require('connect-mongo')(express);

/**
 * Connect to MongoDB/Mongoose
 */
require('./db/connect').connectToMongoose();
console.log('Schemas initialized');

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
    returnURL: 'http://www.meta.tf/auth/steam/return',
    realm: 'http://www.meta.tf'
    //returnURL: 'http://localhost:3000/auth/steam/return',
    //realm: 'http://localhost:3000/'
  },
  function(identifier, profile, done) {
    // asynchronous verification
    // Here we can also add data to the req.user object for reference
    process.nextTick(function () {
      var steamIdentifier = identifier.split('/');
      var steamID = steamIdentifier[steamIdentifier.length-1];
      profile.steamid = steamID;
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
// For connect-mongo db sessions
var sess_conf = {
  db: {
    mongoose_connection: mongoose.connections[0]
  }
};

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(function(req, res, next) { // 301 redirect /foo/bar/ to /foo/bar
   if(req.url.substr(-1) == '/' && req.url.length > 1)
       res.redirect(301, req.url.slice(0, -1));
   else
       next();
  });
  app.use('/static', express.static(__dirname + '/public'));
  app.use(express.session({
    secret: 'dont be walmarting',
    store: new MongoStore(sess_conf.db),
    cookie: {
      maxAge: new Date(Date.now() + 1209600000), // DO NOT CHANGE
      expires: new Date(Date.now() + 1209600000) // DO NOT CHANGE
    },
    maxAge : new Date(Date.now() + 1209600000), // DO NOT CHANGE
    expires: new Date(Date.now() + 1209600000) // DO NOT CHANGE
  }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

// Pulls user information from Steam API and adds that information to database
// THERE IS ANOTHER INSTANCE OF THIS IN /models/user_route.js
// THAT IS USED FOR ALL OTHER INSTANCES OUTSIDE server.js
var pullUserDataFromSteamAPI = function(req, res, next) {
  var steamID = req.user.steamid;
  var PullFromSteamApi = require('./models/steamapi_model');
  PullFromSteamApi(steamID, 'user', function(err, userData) {
    var playerData = userData.response.players[0];
    var addData =
    { "avatar" : playerData.avatar,
      "avatarmedium" : playerData.avatarmedium,
      "avatarfull" : playerData.avatarfull,
      "personaname" : playerData.personaname
    };
    require('./controllers/user_controller').update(steamID, addData); // Send data as JSON
  });
  return next();
};

// Adds user to DB if user is not already present
// THERE IS ANOTHER INSTANCE OF THIS IN /models/user_route.js
// THAT IS USED FOR ALL OTHER INSTANCES OUTSIDE server.js
var checkIfUserAddToDbIfNot = function(req, res, next) {
  var steamID = req.user.steamid;
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
app.get('/schema', user.showschema); // Shows current Schema

/**
 * Trade routes
 */
app.post('/trade/create/', ensureAuthenticated, function(req, res) {
  trade.index(req, res);
});
app.get('/trade/create/', ensureAuthenticated, user.createtrade);
app.get('/trade/:action/:tradeid?', trade.index);
app.get('/trade', function(req, res, next) { // View most recent trades if no action specified
  res.redirect('/trade/view');
});

/**
 * User routes
 */

app.get('/user/', function(req, res, next) { // View SITE profile of logged in user
  res.redirect('/account');
});
app.get('/user/:id', user.profile); // View SITE profile of SteamID :id
app.get('/account', ensureAuthenticated, pullUserDataFromSteamAPI, function(req, res) {
  steamID = req.user.steamid;
  require('./controllers/user_controller').get(steamID, function(err, doc) {
    if (err) throw err;
    res.render('account', { title: 'Account', user: doc });
  });
});

/**
 * Backpack routes
 */

app.get('/backpack', ensureAuthenticated, function(req, res, next) { // View SITE profile of logged in user
  steamID = req.user.steamid;
  res.redirect('/backpack/' + steamID);
});
app.get('/backpack/:id', user.showbackpack); // View backpack of SteamID :id

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
  passport.authenticate('steam', { failureRedirect: '/' }), checkIfUserAddToDbIfNot,
  pullUserDataFromSteamAPI,
  function (req, res) {
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
 * 404 Route
 */
app.get('*', function(req, res){
  res.redirect('/static/404.html');
});

/**
 * Listen
 */

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
//   See ensureAuthenticated() for more information
function ensureAdmin(req, res, next) {
  var steamID = req.user.steamid;
  require('./controllers/user_controller').get(steamID, function(err, doc) {
    if (err) return next(err);
    if (doc.isadmin === "yes") { return next(); }
    res.redirect('/');
  });
}