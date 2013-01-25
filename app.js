var express = require('express')
  , fs = require('fs')
  , passport = require('passport')
  , http = require('http')
  , instagram = require('instagram-node-lib');

// Load configurations
var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , mongoose = require('mongoose');

instagram.set('client_id', config.instagram.clientID);
instagram.set('client_secret', config.instagram.clientSecret);
instagram.set('access_token', config.instagram.accessToken);
instagram.set('callback_url', config.instagram.subCallbackUrl);

// Bootstrap db connection
mongoose.connect('mongodb://localhost/myday');

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
  app.use(express.static(__dirname + config.public_dir));

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

require('./config/routes')(app, passport, instagram);

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
  instagram.users.subscribe({});
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
//   Move this to /config/middlewares/authorization
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
