var QuestionModel = require('../models/questionModel.js');
var AnswerModel = require('../models/answerModel.js');
const CommentModel = require('../models/commentModel.js');
var UserModel = require('../models/userModel.js');

/**
 * questionController.js
 *
 * @description :: Server-side logic for managing questions.
 */
module.exports = {

    /**
     * questionController.list()
     */
    list: function (req, res) {
        QuestionModel.find(function (err, questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question.',
                    error: err
                });
            }
            
            return res.json(questions);
        });
    },

    /**
     * questionController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        QuestionModel.findOne({_id: id}, function (err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question.',
                    error: err
                });
            }
            // only update question if it exists
            if (question) {
                // update views
                question.views++;
                question.popularity = question.views / 5;

                // save updated question
                question.save(function (err, question) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating question',
                            error: err
                        });
                    }

                    return res.render("questions/full_question", question);
                });
            }
            else {
                return res.render("questions/full_question", question);
            }
        });
    },

    showDelete: function(req, res) {
        res.render("questions/delete");
    },

    /**
     * questionController.showPost()
     */
    showPost: function(req, res) {
        res.render("questions/post");
    },

    /**
     * questionController.showMyQuestions()
     */
    showMyQuestions: function(req, res) {
        // find questions posted by currently logged in user
        QuestionModel.find({"user": req.session.userId}, function(err, questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }
            var data = [];
            data.questions = questions;
            // sort questions by publish date
            data.questions.sort((a, b) => {
                return b.publish_date - a.publish_date;
            });
            return res.render("questions/my_questions", data);
        });
    },

    showTrending: function(req, res) {
        QuestionModel.find(function(err, questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question.',
                    error: err
                });
            }
            // only add popular questions (more than 0.5 popularity - more than 15 clicks in 30 minutes)
            var data = [];
            var popularQuestions = [];
            for (var i in questions) {
                if (questions[i].popularity >= 0.5) {
                    popularQuestions.push(questions[i]);
                }
            }
            data.questions = popularQuestions;
            // sort questions by publish date
            data.questions.sort((a, b) => {
                return b.popularity - a.popularity;
            });
            return res.render("questions/trending", data);
          });
    },

    addComment: function(req, res) {
        QuestionModel.findById(req.params.id, function (err, question) {
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

        });
    },

    searchByTags: function(req, res) {
        QuestionModel.find({"tags": req.body.tags}, function(err, questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting questions.',
                    error: err
                });
            }
            var data = [];
            data.questions = questions;
            // sort questions by publish date
            data.questions.sort((a, b) => {
                return b.publish_date - a.publish_date;
            });
            return res.render("questions/questions_by_tags", data);
        })
    },

    /**
     * questionController.create()
     */
    create: function (req, res) {
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

        var question = new QuestionModel({
			title : req.body.title,
			contents : req.body.contents,
			tags : req.body.tags,
            date_time : date_time,
			publish_date : new Date(),
            user : req.session.userId,
            answers : [],  // initially an empty array of answers
            correct_answer : null,  // correct answer initially isn't chosen
            views : 0,   // no views initially
            popularity : 0  // popularity is initially 0
        });

        UserModel.findById(question.user, function(err, user) {
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
            
            user.questions.push(question);

            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user',
                        error: err
                    });
                }
            });
        });

        question.save(function (err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when updating question',
                    error: err
                });
            }

            //return res.status(201).json(question);
            return res.redirect("/");
        });
    },

    /**
     * questionController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        QuestionModel.findOne({_id: id}, function (err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question',
                    error: err
                });
            }

            if (!question) {
                return res.status(404).json({
                    message: 'No such question'
                });
            }

            question.title = req.body.title ? req.body.title : question.title;
			question.contents = req.body.contents ? req.body.contents : question.contents;
			question.tags = req.body.tags ? req.body.tags : question.tags;
			question.publish_date = req.body.publish_date ? req.body.publish_date : question.publish_date;
			
            question.save(function (err, question) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating question.',
                        error: err
                    });
                }

                return res.json(question);
            });
        });
    },

    /**
     * questionController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        // find the question we want to delete
        QuestionModel.findById(id, function(err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting the question.',
                    error: err
                });
            }
            if (!question) {
                return res.status(404).json({
                    message: 'No such question.',
                    error: err
                });
            }
            // delete all of the question's answers
            for (var i in question.answers) {
                AnswerModel.findByIdAndRemove(question.answers[i], function(err, answer) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when deleting the answer.',
                            error: err
                        });
                    }
                    /*UserModel.findById(answer.user, function(err, user) {
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
                        
                        // remove the answers we are deleting, from user's array of answers
                        var index = user.answers.indexOf(answer._id);
                        if (index !== -1) {
                            user.answers.splice(index, 1);
                        }
            
                        user.save(function (err, user) {
                            if (err) {
                                return res.status(500).json({
                                    message: 'Error when updating user',
                                    error: err
                                });
                            }
                        });
                    });*/
                });
            }
            // delete all of the question's comments
            for (var i in question.comments) {
                CommentModel.findByIdAndRemove(question.comments[i], function(err, comment) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when deleting the comment.',
                            error: err
                        });
                    }
                    /*UserModel.findById(comment.user, function(err, user) {
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
                        
                        // remove the comments we are deleting, from user's array of comments
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
                    });*/
                });
            }

            UserModel.findById(question.user, function(err, user) {
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
                
                // remove the question we are deleting, from user's array of questions
                var index = user.questions.indexOf(question._id);
                if (index !== -1) {
                    user.questions.splice(index, 1);
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
        });


        // delete the question itself
        QuestionModel.findByIdAndRemove(id, function(err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the question.',
                    error: err
                });
            }

            //return res.status(204).json();
            return res.render("index");
        });
    }
};
