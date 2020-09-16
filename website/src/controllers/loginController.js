const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const User = require('../models/user');

/* GET login form */
exports.loginGet = (req, res, next) => {
  if (req.session && req.session.userID) {
    return res.redirect('/admin');
  }
  res.render('login.hbs', {
    title: 'Login',
  });
};

/* POST login form */
exports.loginPost = [

  /* Validate input */
  body('username')
    .isLength({ min: 3, max: 32 }).trim().withMessage('Usernames are 3-32 characters.')
    .matches('^[A-Za-z0-9_]+$', '')
    .withMessage('Usernames match /^[A-Za-z0-9_]+$/'),
  body('password')
    .isLength({ min: 8, max: 1024 }).withMessage('Passwords are 8-1024 characters.'),
  sanitizeBody('username').trim().escape(),

  (req, res, next) => {
    if (req.session && req.session.userID) {
      return res.redirect('/admin');
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render('login.hbs', {
        title: 'Login',
        username: req.body.username,
        errors: errors.array(),
      });
    }

    User.authenticate(req.body.username, req.body.password, (err, user) => {
      if (err) {
        return next(err);
      }
      req.session.userID = user._id;
      req.session.user = user;
      return res.redirect('/admin');
    });
  },
];

/* GET register form */
exports.registerGet = (req, res, next) => {
  if (req.session && req.session.userID) {
    return res.redirect('/admin');
  }
  res.render('register.hbs', {
    title: 'Register',
  });
};

/* POST register form */
/* Does not really matter right now */
exports.registerPost = [

  /* Validate input */
  body('username')
    .isLength({ min: 3, max: 32 }).trim().withMessage('Usernames should be 3-32 characters.')
    .matches('^[A-Za-z0-9_]+$', '')
    .withMessage('Usernames should match /^[A-Za-z0-9_]+$/'), // TODO: https://express-validator.github.io/docs/custom-error-messages.html
  /* .custom(value => {
            User.findOne({username: value}).then(user => {
                if (user) {
                    return Promise.reject("Username is already in use.");
                }
            });
        }) */
  body('password')
    .isLength({ min: 8, max: 1024 }).withMessage('Passwords are 8-1024 characters.')
  // https://stackoverflow.com/a/46013025
    .custom((value, { req }) => {
      if (value !== req.body.password2) {
        throw new Error("Passwords don't match.");
      } else {
        return value;
      }
    }),

  (req, res, next) => {
    if (req.session && req.session.userID) {
      return res.redirect('/admin');
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render('register.hbs', {
        title: 'Register',
        username: req.body.username,
        errors: errors.array(),
      });
    }

    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });

    user.save((err) => {
      if (err) {
        return next(err);
      }
      req.session.userID = user._id;
      req.session.user = user;
      return res.redirect('/admin');
    });
  },
];

/* GET logout */
exports.logout = (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
    });
  }
  return res.redirect('/');
};
