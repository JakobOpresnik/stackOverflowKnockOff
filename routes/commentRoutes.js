var express = require('express');
var router = express.Router();
var CommentController = require('../controllers/CommentController.js');

/*
 * GET
 */
router.get('/', CommentController.list);
router.get('/add/:id', CommentController.showAddComment);
router.get('/add_for_answer/:id', CommentController.showAddCommentForAnswer);
router.get('/all_comments/:id', CommentController.showComments);
router.get('/all_comments_for_answer/:id', CommentController.showCommentsForAnswer);

/*
 * GET
 */
router.get('/:id', CommentController.show);

/*
 * POST
 */
router.post('/', CommentController.create);
router.post('/answers', CommentController.createForAnswer);

/*
 * PUT
 */
router.put('/:id', CommentController.update);

/*
 * DELETE
 */
router.delete('/:id', CommentController.remove);

module.exports = router;
