var express = require('express');
var router = express.Router();
var answerController = require('../controllers/answerController.js');

/*
 * GET
 */
router.get('/', answerController.list);
router.get('/add/:id', answerController.showAddAnswer);
router.get('/all_answers/:id', answerController.showAnswers);

/*
 * POST
 */
router.post('/', answerController.create);
router.post('/correct/:id', answerController.makeCorrect);
router.post('/upvote/:id', answerController.upvote);
router.post('/downvote/:id', answerController.downvote);

/*
 * PUT
 */
router.put('/:id', answerController.update);

/*
 * DELETE
 */
router.delete('/:id', answerController.remove);

module.exports = router;