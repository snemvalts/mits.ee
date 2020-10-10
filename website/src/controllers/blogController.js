const Article = require('../models/article');

/* GET blog articles */
exports.blogGet = (req, res, next) => {
  Article.find({})
    .sort({ date: -1 })
    .populate('author')
    // eslint-disable-next-line consistent-return
    .exec((err, articles) => {
      if (err) return next(err);
      res.render('blog.hbs', {
        title: 'Blogi - MITS',
        user: req.session.user,
        articles,
      });
    });
};
