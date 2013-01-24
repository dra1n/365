module.exports = function(instagram) {
  // Confirm subscription
  this.handshake = function(req, res) {
    instagram.subscriptions.handshake(req, res);
  }

  // Handle instagram notifications
  this.recieveNotification = function(req, res) {
    req.body.forEach(function(notice) {
      console.log(notice.object_id);
      instagram.users.recent({'user_id': notice.object_id});
    });

    res.json(req.body);
  }

  return this;
}
