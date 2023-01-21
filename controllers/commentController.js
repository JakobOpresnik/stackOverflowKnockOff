var CommentModel = require('../models/commentModel.js');
var QuestionModel = require('../models/questionModel.js');
var UserModel = require('../models/userModel.js');
var AnswerModel = require('../models/answerModel.js');

/**
 * CommentController.js
 *
 * @description :: Server-side logic for managing Comments.
 */
module.exports = {

    /**
     * CommentController.list()
     */
    list: function (req, res) {
        CommentModel.find(function (err, Comments) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Comment.',
                    error: err
                });
            }

            return res.json(Comments);
        });
    },

    /**
     * CommentController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        CommentModel.findOne({_id: id}, function (err, Comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Comment.',
                    error: err
                });
            }

            if (!Comment) {
                return res.status(404).json({
                    message: 'No such Comment'
                });
            }

            return res.json(Comment);
        });
    },

    showAddComment: function(req, res) {
        var id = req.params.id;

        QuestionModel.findOne({_id: id}, function (err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question.',
                    error: err
                });
            }

            if (!question) {
                return res.status(404).json({
                    message: 'No such question'
                });
            }

            //return res.json(question);
            return res.render("comment/add", question);
        });
    },

    showAddCommentForAnswer: function(req, res) {
        var id = req.params.id;

        AnswerModel.findOne({_id: id}, function (err, answer) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting answer.',
                    error: err
                });
            }

            if (!answer) {
                return res.status(404).json({
                    message: 'No such answer'
                });
            }

            return res.render("comment/add_for_answer", answer);
        });
    },

    /**
     * CommentController.create()
     */
    create: function (req, res) {
        var questionID = req.body.questionFK;

        var date = new Date();
        var weekday, day, month, hour, minute, second;
        switch (date.getDay()) {
            case 0:
                weekday = "Sun";
                break;
            case 1:
                weekday = "Mon";
                break;
            case 2:
                weekday = "Tue";
                break;
            case 3:
                weekday = "Wed";
                break;
            case 4:
                weekday = "Thu";
                break;
            case 5:
                weekday = "Fri";
                break;
            case 6:
                weekday = "Sat";
                break;
            default:
                weekday = "undefined";
                break;
        }

        switch (date.getMonth()) {
            case 0:
                month = "Jan";
                break;
            case 1:
                month = "Feb";
                break;
            case 2:
                month = "Mar";
                break;
            case 3:
                month = "Apr";
                break;
            case 4:
                month = "May";
                break;
            case 5:
                month = "Jun";
                break;
            case 6:
                month = "Jul";
                break;
            case 7:
                month = "Aug";
                break;
            case 8:
                month = "Sep";
                break;
            case 9:
                month = "Oct";
                break;
            case 10:
                month = "Nov";
                break;
            case 11:
                month = "Dec";
                break;
        }

        if (date.getDate() < 10) {
            day = "0" + date.getDate();
        }
        else {
            day = date.getDate();
        }

        if (date.getHours() < 10) {
            hour = "0" + date.getHours();
        }
        else {
            hour = date.getHours();
        }

        if (date.getMinutes() < 10) {
            minute = "0" + date.getMinutes();
        }
        else {
            minute = date.getMinutes();
        }

        if (date.getSeconds() < 10) {
            second = "0" + date.getSeconds();
        }
        else {
            second = date.getSeconds();
        }
        
        var date_time = weekday + " " + month + " " + day + " " + date.getFullYear() + "  " + hour + ":" + minute + ":" + second;
        
        var comment = new CommentModel({
			contents : req.body.contents,
            date_time : date_time,
			publish_date : req.body.publish_date,
            user : req.session.userId,
			questionFK : req.body.questionFK,
            answerFK : req.body.answerFK
        });

        UserModel.findById(comment.user, function(err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }
            if (!user) {
                return res.status(404).json({
                    message: 'No such user',
                    error: err
                });
            }
            
            user.comments.push(comment);

            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user',
                        error: err
                    });
                }
            });
        });

        QuestionModel.findOne({_id: questionID}, function(err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question.',
                    error: err
                });
            }
            if (!question) {
                return res.status(404).json({
                    message: 'No such question.'
                });
            }

            comment.save(function(err, comment) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating comment',
                        error: err
                    });
                }

                var commentID = comment._id;
                question.comments.push(commentID);

                question.save(function(err, question) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating question',
                            error: err
                        });
                    }
                    return res.redirect("/questions/" + questionID);
                });
            });
        });
    },

    createForAnswer: function (req, res) {
        var answerID = req.body.answerFK;

        var date = new Date();
        var weekday, day, month, hour, minute, second;
        switch (date.getDay()) {
            case 0:
                weekday = "Sun";
                break;
            case 1:
                weekday = "Mon";
                break;
            case 2:
                weekday = "Tue";
                break;
            case 3:
                weekday = "Wed";
                break;
            case 4:
                weekday = "Thu";
                break;
            case 5:
                weekday = "Fri";
                break;
            case 6:
                weekday = "Sat";
                break;
            default:
                weekday = "undefined";
                break;
        }

        switch (date.getMonth()) {
            case 0:
                month = "Jan";
                break;
            case 1:
                month = "Feb";
                break;
            case 2:
                month = "Mar";
                break;
            case 3:
                month = "Apr";
                break;
            case 4:
                month = "May";
                break;
            case 5:
                month = "Jun";
                break;
            case 6:
                month = "Jul";
                break;
            case 7:
                month = "Aug";
                break;
            case 8:
                month = "Sep";
                break;
            case 9:
                month = "Oct";
                break;
            case 10:
                month = "Nov";
                break;
            case 11:
                month = "Dec";
                break;
        }

        if (date.getDate() < 10) {
            day = "0" + date.getDate();
        }
        else {
            day = date.getDate();
        }

        if (date.getHours() < 10) {
            hour = "0" + date.getHours();
        }
        else {
            hour = date.getHours();
        }

        if (date.getMinutes() < 10) {
            minute = "0" + date.getMinutes();
        }
        else {
            minute = date.getMinutes();
        }

        if (date.getSeconds() < 10) {
            second = "0" + date.getSeconds();
        }
        else {
            second = date.getSeconds();
        }
        
        var date_time = weekday + " " + month + " " + day + " " + date.getFullYear() + "  " + hour + ":" + minute + ":" + second;
        
        var comment = new CommentModel({
			contents : req.body.contents,
            date_time : date_time,
			publish_date : req.body.publish_date,
            user : req.session.userId,
			questionFK : req.body.questionFK,
            answerFK : req.body.answerFK
        });

        UserModel.findById(comment.user, function(err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }
            if (!user) {
                return res.status(404).json({
                    message: 'No such user',
                    error: err
                });
            }
            
            user.comments.push(comment);

            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user',
                        error: err
                    });
                }
            });
        });

        AnswerModel.findOne({_id: answerID}, function(err, answer) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting answer.',
                    error: err
                });
            }
            if (!answer) {
                return res.status(404).json({
                    message: 'No such answer.'
                });
            }
            var questionID;
            QuestionModel.findById(answer.questionFK, function(err, question) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting question.',
                        error: err
                    });
                }
                if (!question) {
                    return res.status(404).json({
                        message: 'No such question.'
                    });
                }
                questionID = question._id;
            });

            comment.save(function(err, comment) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating comment',
                        error: err
                    });
                }

                var commentID = comment._id;
                answer.comments.push(commentID);

                answer.save(function(err, answer) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating answer',
                            error: err
                        });
                    }
                    return res.redirect("/answers/all_answers/" + questionID);
                });
            });
        });
    },

    showComments: function(req, res) {
        // find question by reading its ID from the URL
        QuestionModel.findOne({_id: req.params.id}, function(err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question.',
                    error: err
                });
            }
            if (!question) {
                return res.status(404).json({
                    message: 'No such question.'
                });
            }
        
            var data = [];
            var comments = [];

            // loop through the question's answers and push them to new array
            for (var i in question.comments) {
                // find all answers for a given question
                CommentModel.findById(question.comments[i], function(err, comment) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when getting comment.',
                            error: err
                        });
                    }
                    if (!comment) {
                        return res.status(404).json({
                            message: 'No such comment.'
                        });
                    }
                    // find user who posted the answer
                    UserModel.findById(comment.user, function(err, user) {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when getting user.',
                                error: err
                            });
                        }
                        if (!user) {
                            return res.status(404).json({
                                message: 'No such user.'
                            });
                        }
                        comment.user = user;
                    });
                    // adds comment to the beginning of the array (no need for sorting)
                    comments.unshift(comment);
                });   
            }

            data.comments = comments;
            return res.render("comment/all_comments", data);
        });
    },

    showCommentsForAnswer: function(req, res) {
        // find question by reading its ID from the URL
        AnswerModel.findOne({_id: req.params.id}, function(err, answer) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting answer.',
                    error: err
                });
            }
            if (!answer) {
                return res.status(404).json({
                    message: 'No such answer.'
                });
            }
        
            var data = [];
            var comments = [];

            // loop through the question's answers and push them to new array
            for (var i in answer.comments) {
                // find all answers for a given question
                CommentModel.findById(answer.comments[i], function(err, comment) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when getting comment.',
                            error: err
                        });
                    }
                    if (!comment) {
                        return res.status(404).json({
                            message: 'No such comment.'
                        });
                    }
                    // find user who posted the answer
                    UserModel.findById(comment.user, function(err, user) {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when getting user.',
                                error: err
                            });
                        }
                        if (!user) {
                            return res.status(404).json({
                                message: 'No such user.'
                            });
                        }
                        comment.user = user;
                    });
                    // adds comment to the beginning of the array (no need for sorting)
                    comments.unshift(comment);
                });   
            }

            data.comments = comments;

            return res.render("comment/all_comments_for_answer", data);
        });
    },

    /**
     * CommentController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        CommentModel.findOne({_id: id}, function (err, Comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Comment',
                    error: err
                });
            }

            if (!Comment) {
                return res.status(404).json({
                    message: 'No such Comment'
                });
            }

            Comment.contents = req.body.contents ? req.body.contents : Comment.contents;
			Comment.publish_date = req.body.publish_date ? req.body.publish_date : Comment.publish_date;
			Comment.questionFK = req.body.questionFK ? req.body.questionFK : Comment.questionFK;
			
            Comment.save(function (err, Comment) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Comment.',
                        error: err
                    });
                }

                return res.json(Comment);
            });
        });
    },

    /**
     * CommentController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        CommentModel.findByIdAndRemove(id, function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Comment.',
                    error: err
                });
            }

            UserModel.findById(comment.user, function(err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting user',
                        error: err
                    });
                }
                if (!user) {
                    return res.status(404).json({
                        message: 'No such user',
                        error: err
                    });
                }
                
                // remove the answer we're deleting, from user's answers
                var index = user.comments.indexOf(comment._id);
                if (index !== -1) {
                    user.comments.splice(index, 1);
                }
    
                user.save(function (err, user) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating user',
                            error: err
                        });
                    }
                });
            });

            return res.status(204).json();
        });
    }
};
