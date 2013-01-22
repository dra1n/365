var mongoose = require('mongoose')
  , InstagramStrategy = require('passport-instagram').Strategy
  , User = mongoose.model('User');

module.exports = function (passport, config) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({ _id: id }, function (err, user) {
      done(err, user);
    });
  });

  passport.use(new InstagramStrategy({
      clientID: config.instagram.clientID,
      clientSecret: config.instagram.clientSecret,
      callbackURL: config.instagram.callbackURL
    },
    function(token, tokenSecret, profile, done) {
      User.findOne({ 'instagram.id': profile.id }, function (err, user) {
        if (err) return done(err);
        if (!user) {
          user = new User({
              name: profile.displayName
            , username: profile.username
            , provider: 'instagram'
            , instagram: profile._json.data
          });

          user.save(function (err) {
            if (err) console.log(err);
            return done(err, user);
          });
        }
        else {
          return done(err, user);
        }
      });
    }
  ));
}
