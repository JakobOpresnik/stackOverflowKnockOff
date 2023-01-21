var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var bcrypt = require("bcrypt");

var userSchema = new Schema({
	'username' : String,
	'email' : String,
	'password' : String,
	'picture' : String,
	'questions' : [{
		type : Schema.Types.ObjectId,
		ref : 'question'
	}],
	'answers' : [{
		type : Schema.Types.ObjectId,
		ref : 'answer'
	}],
	'accepted_answers' : [{
		type : Schema.Types.ObjectId,
		ref : 'answer'
	}],
	'comments' : [{
		type : Schema.Types.ObjectId,
		ref : 'comment'
	}]
});

/**
 * checks if there is a user with such a username in the database
 * afterwards it checks if the password is correct
 */
userSchema.statics.authenticate = function(username, password, callback) {
	User.findOne({username: username})
	.exec(function(err, user) {
		if (err) {
			return callback(err);
		}
		else if (!user) {
			var err = new Error("User not found");
			err.status = 401;
			return callback(err);
		}
		// if user is found in the database, we compare his password & the parameter password
		else {
			bcrypt.compare(password, user.password, function(err, result) {
				if (result == true) {
					return callback(null, user);	// error is null
				}
				else {
					return callback();
				}
			});
		}
	})
};

/**
 * hashing user password before saving user to database
 */
userSchema.pre("save", function(next) {
	var user = this;	// getting user that is being saved into the database
	bcrypt.hash(user.password, 10, function(err, hash) {	// salt - 10
		if (err) {
			return next(err);
		}
		user.password = hash;
		next();
	});
});

var User = mongoose.model("user", userSchema);
module.exports = User;
