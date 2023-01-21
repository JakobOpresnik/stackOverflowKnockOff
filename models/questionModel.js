var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var questionSchema = new Schema({
	'title' : String,
	'contents' : String,
	'tags' : Array,
	'date_time' : String,
	'publish_date' : Date,
	'user' : String,
	'answers' : [{
		type : Schema.Types.ObjectId,
		ref : 'answer'
	}],
	'correct_answer' : {
		type : Schema.Types.ObjectId,
		ref : 'answer',
		default: null
	},
	'views' : Number,
	'popularity' : Number,
	'comments' : [{
		type : Schema.Types.ObjectId,
		ref : 'comment'
	}]
});

module.exports = mongoose.model('question', questionSchema);
