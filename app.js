var express = require('express')
  , http = require('http')
  , path = require('path')
  , instagram = require('instagram-node-lib');

instagram.set('client_id', process.env.CLIENT_ID);
instagram.set('client_secret', process.env.CLIENT_SECRET);
instagram.set('redirect_uri', process.env.REDIRECT_URI);
instagram.set('access_token', process.env.ACCESS_TOKEN)

var app = express();

app.configure(function() {
  app.set('dir', '/public');
  app.set('port', process.env.PORT || 3000);
  app.set('user_id', process.env.USER_ID);   // Now works only for one user
  app.use(express.logger('dev'));
  app.use(express.static(path.join(__dirname, 'public')));

  app.engine('.html', function() {
    return {
      compile: function(str, options) {
        return function(locals) {
          return str;
        };
      }
    }
  });
});

app.configure('development', function() {
  console.log('Configuring middleware for the development environment.');
  app.set('dir', '/app');
  app.use(express.static(__dirname + '/app'));
});

//app.get('/', function(req, res) {
//  res.sendfile(__dirname + app.get('dir') + '/index.html');
//});

app.get('/recent_media', function(req, res) {
  // TODO: maybe move credentials to separate object
  instagram.users.recent({
    'access_token': app.get('access_token'),
    'user_id': app.get('user_id'),
    'complete': function(data, pagination){
      res.json(data);
    },
    'error': function(errorMessage, errorObject, caller) {
      res.json(500, {'message': errorMessage, 'error': errorObject});
    }
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
