// Post schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var PostSchema = new Schema({
    caption: {type : String, default : ''}
  , images: {}
  , tags: []
  , user_id: String
  , user: {type : Schema.ObjectId, ref : 'User'}
});

mongoose.model('Post', PostSchema);
