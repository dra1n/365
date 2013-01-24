module.exports = function (app, passport, instagram) {
  var users = require('../controllers/users');
  var api = require('../controllers/api')(instagram);

  // users routes
  app.get('/auth/instagram', passport.authenticate('instagram'), users.signin);
  app.get('/auth/instagram/callback', passport.authenticate('instagram'), users.authCallback);
  app.get('/logout', users.logout);

  // api routes
  app.get('/api/subscription', api.handshake);
  app.post('/api/subscription', api.recieveNotification);
}
