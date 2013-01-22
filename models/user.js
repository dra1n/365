// User schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String
  , email: String
  , username: String
  , provider: String
  , instagram: {}
});

mongoose.model('User', UserSchema);
