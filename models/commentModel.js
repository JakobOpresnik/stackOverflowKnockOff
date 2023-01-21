var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var CommentSchema = new Schema({
	'contents' : String,
	'date_time' : String,
	'publish_date' : Date,
	'user' : {
		type : Schema.Types.ObjectId,
		ref : 'user'
	},
	'questionFK' : {
	 	type : Schema.Types.ObjectId,
	 	ref : 'question'
	},
	'answerFK' : {
		type : Schema.Types.ObjectId,
		ref : 'answer'
	}
});

module.exports = mongoose.model('Comment', CommentSchema);
