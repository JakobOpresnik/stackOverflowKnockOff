var express = require('express');
var router = express.Router();

var QuestionModel = require('../models/questionModel.js');


/**
 * GET home page
 * displays all existing questions (from all users)
 */
router.get('/', function(req, res, next) {

  QuestionModel.find(function(err, questions) {
    if (err) {
        return res.status(500).json({
            message: 'Error when getting question.',
            error: err
        });
    }
    var data = [];
    data.questions = questions;
    // sort questions by publish date
    data.questions.sort((a, b) => {
      return b.publish_date - a.publish_date;
    });
    return res.render("index", data);
  });
});

module.exports = router;
