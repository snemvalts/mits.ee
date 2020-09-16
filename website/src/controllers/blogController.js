const Article = require('../models/article');

/* GET blog articles */
exports.blogGet = function (req, res, next) {
  Article.find({})
    .sort({ date: -1 })
    .populate('author')
    .exec((err, articles) => {
      if (err) return next(err);
      res.render('blog.hbs', {
        title: 'Blogi - MITS',
        user: req.session.user,
        articles,
      });
    });
};
