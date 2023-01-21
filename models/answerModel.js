var mongoose = require('mongoose');
const User = require('./userModel');
var Schema   = mongoose.Schema;

var answerSchema = new Schema({
	'contents' : String,
	'date_time' : String,
	'publish_date' : Date,
	/*'user' : String,*/
	'user' : {
		type : Schema.Types.ObjectId,
		ref : 'user'
	},
	'questionFK' : {
		type : Schema.Types.ObjectId,
		ref : 'question'
	},
	'accepted' : Boolean,
	'upvotes' : Number,
	'downvotes' : Number,
	'comments' : [{
		type : Schema.Types.ObjectId,
		ref : 'comment'
	}]
});

module.exports = mongoose.model('answer', answerSchema);
