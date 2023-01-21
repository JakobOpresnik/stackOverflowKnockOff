var express = require('express');
var router = express.Router();
var questionController = require('../controllers/questionController.js');

/*
 * GET
 */
router.get('/', questionController.list);
router.get('/post', questionController.showPost);
router.get('/my_questions', questionController.showMyQuestions);
router.get('/trending', questionController.showTrending);

/*
 * GET
 */
router.get('/:id', questionController.show);
router.get('/comment/:id', questionController.addComment);

/*
 * POST
 */
router.post('/', questionController.create);
router.post('/search', questionController.searchByTags);

/*
 * PUT
 */
router.put('/:id', questionController.update);

/*
 * DELETE
 */
router.delete('/:id', questionController.remove);


module.exports = router;
