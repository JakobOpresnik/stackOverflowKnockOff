var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');

// library for working with files
var multer = require('multer');
// location where we'll be saving files
var upload = multer({ dest: 'public/images/' });

/*
 * GET
 */
router.get('/', userController.list);
router.get('/login', userController.showLogin);
router.get('/register', userController.showRegister);
router.get('/profile', userController.profile);
router.get('/logout', userController.logout);

/*
 * GET
 */
router.get('/:id', userController.show);

/*
 * POST
 */
router.post('/', upload.single("picture"), userController.create);
router.post('/login', userController.login);

/*
 * PUT
 */
router.put('/:id', userController.update);

/*
 * DELETE
 */
router.delete('/:id', userController.remove);

module.exports = router;
