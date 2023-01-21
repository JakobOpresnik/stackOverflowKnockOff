var AnswerModel = require('../models/answerModel.js');
var UserModel = require('../models/userModel.js');
var QuestionModel = require('../models/questionModel.js');

/**
 * answerController.js
 *
 * @description :: Server-side logic for managing answers.
 */
module.exports = {

    /**
     * answerController.list()
     */
    list: function (req, res) {
        AnswerModel.find(function (err, answers) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting answer.',
                    error: err
                });
            }

            return res.json(answers);
        });
    },

    /**
     * answerController.show()
     */
    show: function (req, res) {
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

            return res.json(answer);
        });
    },

    /**
     * 
     */
    showAddAnswer: function(req, res) {
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

            return res.render("answer/add", question);
        });
    },


    /**
     * 
     */
    showAnswers: function(req, res) {

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
            var answers_arr = [];
            // loop through the question's answers and push them to new array
            for (var i in question.answers) {
                // find all answers for a given question
                AnswerModel.findById(question.answers[i], function(err, answer) {
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
                    // find user who posted the answer
                    UserModel.findById(answer.user, function(err, user) {
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
                        answer.user = user;
                    });
                    
                    if (question.correct_answer != answer._id) {
                        // adds answer to the beginning of the array
                        answers_arr.push(answer);
                    }
                });
            }
            
            data.answers = answers_arr;

            return res.render("answer/all_answers", data);
        });
    },
    
    /**
     * marks a certain answers as correct for a particular question
     */
    makeCorrect: function(req, res) {
        // find answer we want to mark as correct
        AnswerModel.findById(req.params.id, function(err, answer) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting answer.',
                    error: err
                });
            }
            if (!answer) {
                return res.status(404).json({
                    message: 'No such answer.',
                    error: err
                });
            }

            // find question for which this answer is marked as correct
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

                for (var i in question.answers) {
                    AnswerModel.findById(question.answers[i], function(err, answer) {
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

                        // update answers which aren't correct
                        answer.accepted = false;

                        // save updated answer
                        answer.save(function(err) {
                            if (err) {
                                return res.status(500).json({
                                    message: 'Error when updating answer',
                                    error: err
                                });
                            }
                        });

                        UserModel.findById(answer.user, function(err, user) {
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
                            
                            if (!answer.accepted && user.accepted_answers.includes(answer._id)) {
                                // remove the accepted answer if it is no longer the accepted answer
                                var index = user.accepted_answers.indexOf(answer._id);
                                console.log("index: " + index);
                                console.log("id: " + answer._id);
                                if (index !== -1) {
                                    user.accepted_answers.splice(index, 1);
                                }
                            }
                
                            user.save(function (err, user) {
                                /*if (err) {
                                    return res.status(500).json({
                                        message: 'Error when updating user',
                                        error: err
                                    });
                                }*/
                            });
                        });
                    });
                }
                // update answer that is correct
                answer.accepted = true;

                // save updated answer
                answer.save(function(err) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating answer',
                            error: err
                        });
                    }
                });

                UserModel.findById(answer.user, function(err, user) {
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
                    
                    // add the accepted answer to user's accepted answers
                    user.accepted_answers.push(answer);
        
                    user.save(function (err, user) {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when updating user',
                                error: err
                            });
                        }
                    });
                });


                // update the question's correct answer
                question.correct_answer = req.params.id;

                var index = question.answers.indexOf(req.params.id);
                //var last_index = question.answers.length-1;

                // swap correct answer and first answer in array
                let tmp = question.answers[0];
                question.answers[0] = question.answers[index];
                question.answers[index] = tmp;

                //var correct_ans = question.answers.pop();
                var correct_ans = question.answers.shift();
                
                var data = [];
                data.answers = question.answers;
                // sort non-correct answers by publish date
                data.answers.sort((a, b) => {
                    return b.publish_date - a.publish_date;
                });

                // add the correct answer at the beginning
                data.answers.unshift(correct_ans);
                // reverse array so the correct answer is at the top
                //data.answers.reverse();

                question.save(function(err, question) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating question',
                            error: err
                        });
                    }
                    //return res.json({"accept": true});
                    return res.redirect("/questions/" + question._id);
                });
            });
        });
    },

    upvote: function(req, res) {
        AnswerModel.findById(req.params.id, function(err, answer) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting answer.',
                    error: err
                });
            }
            if (!answer) {
                return res.status(404).json({
                    message: 'No such answer.',
                    error: err
                });
            }
            // update the number of upvotes
            answer.upvotes++;
            // save updated answer
            answer.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating answer',
                        error: err
                    });
                }
                // find the question so that we can redirect
                // to its list of questions after updating the upvotes
                QuestionModel.findById(answer.questionFK, function(err, question) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when getting question.',
                            error: err
                        });
                    }
                    if (!question) {
                        return res.status(404).json({
                            message: 'No such question.',
                            error: err
                        });
                    }
                    return res.redirect("/answers/all_answers/" + question._id);
                });
            });
        });
    },

    downvote: function(req, res) {
        AnswerModel.findById(req.params.id, function(err, answer) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting answer.',
                    error: err
                });
            }
            if (!answer) {
                return res.status(404).json({
                    message: 'No such answer.',
                    error: err
                });
            }
            // update the number of downvotes
            answer.downvotes++;
            // save updated answer
            answer.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating answer',
                        error: err
                    });
                }
                // find the question so that we can redirect
                // to its list of questions after updating the downvotes
                QuestionModel.findById(answer.questionFK, function(err, question) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when getting question.',
                            error: err
                        });
                    }
                    if (!question) {
                        return res.status(404).json({
                            message: 'No such question.',
                            error: err
                        });
                    }
                    return res.redirect("/answers/all_answers/" + question._id);
                });
            });
        });
    },

    /**
     * 
     */
    create: function(req, res) {
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

        var answer = new AnswerModel({
            contents : req.body.contents,
            date_time : date_time,
            publish_date : new Date(),
            user : req.session.userId,
            questionFK : questionID,
            accepted : false,   // answer isn't accepted by default
            upvotes : 0,    // upvotes & downvotes are initially 0
            downvotes: 0
        });

        UserModel.findById(answer.user, function(err, user) {
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
            
            user.answers.push(answer);

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

            answer.save(function(err, answer) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating answer',
                        error: err
                    });
                }

                var answerID = answer._id;
                question.answers.push(answerID);

                question.save(function(err, question) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating question',
                            error: err
                        });
                    }
                    return res.redirect("/questions/" + questionID);
                })
            })
        })
    },

    /**
     * answerController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        AnswerModel.findOne({_id: id}, function (err, answer) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting answer',
                    error: err
                });
            }

            if (!answer) {
                return res.status(404).json({
                    message: 'No such answer'
                });
            }

            answer.contents = req.body.contents ? req.body.contents : answer.contents;
		    answer.publish_date = req.body.publish_date ? req.body.publish_date : answer.publish_date;
			answer.correct = req.body.correct ? req.body.correct : answer.correct;
			//answer.correct = true;

            answer.save(function (err, answer) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating answer.',
                        error: err
                    });
                }

                //return res.json(answer);
                return res.redirect("/answers/all_answers");
            });
        });
    },

    /**
     * answerController.remove()
     */
    remove: function (req, res) {
        // read the answer's ID from URL
        var id = req.params.id;

        // find answer with that URL
        AnswerModel.findById(id, function (err, answer) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting the answer.',
                    error: err
                });
            }
            if (!answer) {
                return res.status(404).json({
                    message: 'No such answer.',
                    error: err
                });
            }

            // find the question the answer belongs to
            QuestionModel.findById(answer.questionFK, function(err, question) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting the question',
                        error: err
                    });
                }
                if (!question) {
                    return res.status(404).json({
                        message: 'No such question.',
                        error: err
                    });
                }

                // remove the answers from array of answers
                var index = question.answers.indexOf(answer._id);
                if (index !== -1) {
                    question.answers.splice(index, 1);
                }

                // update the question's array of answers
                question.save(function (err, question) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating question.',
                            error: err
                        });
                    }
                });
            });

            UserModel.findById(answer.user, function(err, user) {
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
            });

            // remove the answer itself
            AnswerModel.findByIdAndRemove(answer._id, function(err, answer) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when deleting the answer.',
                        error: err
                    });
                }
                
                return res.render("index");
            });

        });
    }
};
