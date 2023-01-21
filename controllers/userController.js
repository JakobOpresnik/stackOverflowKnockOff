var UserModel = require('../models/userModel.js');

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    /**
     * userController.list()
     */
    list: function (req, res) {
        UserModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            return res.json(users);
        });
    },

    /**
     * userController.showLogin()
     */
    showLogin: function(req, res) {
        res.render("user/login");   // displays user/login.hbs view
    },

    /**
     * userController.showRegister()
     */
    showRegister: function(req, res) {
        res.render("user/register");    // displays user/register.hbs view
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            return res.json(user);
        });
    },

    /**
     * userController.login()
     */
    login: function(req, res, next) {
        UserModel.authenticate(req.body.username, req.body.password, function(err, user) {
            if (err || !user) {
                var error = new Error("Wrong username or password");
                error.status = 401;
                return next(error);
            }
            else {
                req.session.userId = user._id;
                return res.redirect('/');
            }
        });
    },

    /**
     * finds user by ID (which is stored as a session variable)
     * prints out error if user couldn't be found
     * otherwise redirects us to 'user/profile' page
     */
    profile: function(req, res, next) {
        UserModel.findById(req.session.userId)
        .exec(function(err, user) {
            if (err) {
                return next(err);
            }
            else {
                if (user == null) {
                    var err = new Error("User not authenticated! Go back!");
                    err.status = 401;
                    return next(err);
                }
                else {
                    res.render('user/profile', user); // displays user/profile.hbs view
                }
            }
        });
    },

    /**
     * destroys session if it exists
     * if no error occur during session destruction, we are redirected to home page
     */
    logout: function(req, res, next) {
        if (req.session) {
            req.session.destroy(function(err) {
                if (err) {
                    return next(err);
                }
                else {
                    return res.redirect('/');
                }
            });
        }
    },

    /**
     * userController.create()
     */
    create: function (req, res) {
        var user = new UserModel({
			username : req.body.username,
			email : req.body.email,
			password : req.body.password,
            picture : '/images/' + req.file.filename,
            questions : [],
            answers : [],
            accepted_answers : [],
            comments : []
        });
        console.log(req.file.filename);

        user.save(function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating user',
                    error: err
                });
            }

            //return res.status(201).json(user);
            return res.redirect("/");
        });
    },

    /**
     * userController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.username = req.body.username ? req.body.username : user.username;
			user.email = req.body.email ? req.body.email : user.email;
			user.password = req.body.password ? req.body.password : user.password;
			
            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        UserModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
