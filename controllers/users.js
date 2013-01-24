// The request will be redirected to Instagram for authentication, so this
// function will not be called.
exports.signin = function (req, res) {}

// auth callback
exports.authCallback = function (req, res, next) {
  res.redirect('/');
}

// logout
exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
}
