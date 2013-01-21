var express = require('express')
  , passport = require('passport')
  , http = require('http')
  , path = require('path')
  , util = require('util')
  , instagram = require('instagram-node-lib')
  , InstagramStrategy = require('passport-instagram').Strategy;

instagram.set('client_id', process.env.CLIENT_ID);
instagram.set('client_secret', process.env.CLIENT_SECRET);
instagram.set('redirect_uri', process.env.REDIRECT_URI);
instagram.set('access_token', process.env.ACCESS_TOKEN)

var app = express();

app.configure(function() {
  app.set('dir', '/public');
  app.set('port', process.env.PORT || 3000);
  app.set('user_id', process.env.USER_ID);   // Now works only for one user
  app.set('callback_uri', 'http://365.eu01.aws.af.cm/auth/instagram/callback');

  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));  // Move this to env

  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

  // We don't need this. Yet
  //app.engine('.html', function() {
  //  return {
  //    compile: function(str, options) {
  //      return function(locals) {
  //        return str;
  //      };
  //    }
  //  }
  //});
});

app.configure('development', function() {
  console.log('Configuring middleware for the development environment.');
  app.set('dir', '/app');
  app.set('callback_uri', 'http://localhost:3000/auth/instagram/callback');
  app.use(express.static(__dirname + '/app'));
});

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Instagram profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the InstagramStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Instagram
//   profile), and invoke a callback with a user object.
passport.use(new InstagramStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: app.get('callback_uri')
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Instagram profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Instagram account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

//app.get('/', function(req, res) {
//  res.sendfile(__dirname + app.get('dir') + '/index.html');
//});

app.get('/recent_media', function(req, res) {
  // TODO: maybe move credentials to separate object
  instagram.users.recent({
    'user_id': app.get('user_id'),
    'complete': function(data, pagination) {
      res.json(data);
    },
    'error': function(errorMessage, errorObject, caller) {
      res.json(500, {'message': errorMessage, 'error': errorObject});
    }
  });
});

// GET /auth/instagram
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Instagram authentication will involve
//   redirecting the user to instagram.com.  After authorization, Instagram
//   will redirect the user back to this application at /auth/instagram/callback
app.get('/auth/instagram',
  passport.authenticate('instagram'),
  function(req, res){
    // The request will be redirected to Instagram for authentication, so this
    // function will not be called.
  });

// GET /auth/instagram/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/instagram/callback', 
  passport.authenticate('instagram', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

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
  res.redirect('/login');
}
