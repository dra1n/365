var express = require('express')
  , fs = require('fs')
  , passport = require('passport')
  , http = require('http')
  , path = require('path')
  , util = require('util')
  , instagram = require('instagram-node-lib');

// Load configurations
var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , mongoose = require('mongoose');

instagram.set('client_id', config.instagram.clientID);
instagram.set('client_secret', config.instagram.clientSecret);
instagram.set('access_token', config.instagram.accessToken);

// Bootstrap db connection
mongoose.connect('mongodb://localhost/test');

// Bootstrap models
var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path+'/'+file);
});

// bootstrap passport config
require('./config/passport')(passport, config);

var app = express();

app.configure(function() {
  app.set('dir', config.public_dir);
  app.set('port', process.env.PORT || 3000);
  app.set('user_id', config.instagram.userId);   // Now works only for one user

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
  app.use(express.static(path.join(__dirname + config.public_dir)));

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

//app.get('/', function(req, res) {
//  res.sendfile(__dirname + app.get('dir') + '/index.html');
//});

app.get('/recent_media', function(req, res) {
  // TODO: maybe move credentials to separate object
  instagram.users.recent({
    'user_id': config.instagram.userId,
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
