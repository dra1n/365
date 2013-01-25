// Comment schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var CommentSchema = new Schema({
    title     : String
  , body      : String
  , date      : Date
  , user      : {type : Schema.ObjectId, ref : 'User'}
});

mongoose.model('Comment', CommentSchema);
