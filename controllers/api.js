var mongoose = require('mongoose')
  , Post = mongoose.model('Post')
  , User = mongoose.model('User');

module.exports = function(instagram) {
  // Confirm subscription
  this.handshake = function(req, res) {
    instagram.subscriptions.handshake(req, res);
  }

  // Handle instagram notifications
  this.recieveNotification = function(req, res) {
    req.body.forEach(function(notice) {
      instagram.users.recent({
          user_id: notice.object_id
        , count: 1
        , complete: function(notificationBody) {
            notificationBody.forEach(function(data) {
              User.findOne({ 'instagram.id': data.user.id }, function (err, user) {
                if (err) { console.log(err); }
                if (user) {
                  var pst = new Post({
                      caption: data.caption.text
                    , images: data.images
                    , tags: data.tags
                    , user_id: data.user.id
                    , user: user
                  });

                  pst.save(function (err) {
                    if (err) console.log(err);
                  });
                }
                else {
                  return console.log(err);
                }
              });
            });
          }
      });
    });

    res.json(req.body);
  }

  return this;
}
