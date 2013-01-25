// Post schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var PostSchema = new Schema({
    caption       : {type : String, default : ''}
  , images        : {}
  , tags          : []
  , comments      : {type : [Schema.ObjectId], ref : 'Comment'}
  , createdAt     : {type: Date, default: Date.now}
  , user          : {type : Schema.ObjectId, ref : 'User'}
  , impression    : {type : String, default : ''}
});

mongoose.model('Post', PostSchema);
