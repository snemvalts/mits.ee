const User = require("../models/user");
const Article = require("../models/article");

const {body, validationResult} = require("express-validator/check");
const {sanitizeBody} = require("express-validator/filter");

/* GET admin panel */
exports.indexGet = (req, res, next) => {
    res.render("admin/index.hbs", {
        title: "Admin Panel",
    });
};

/* GET admin panel blog */
exports.blogGet = (req, res, next) => {
    Article.find({})
        .populate("author")
        .exec(function (err, articles) {
            if (err) return next(err);

            res.render("admin/blog.hbs", {
                title: "Admin Panel Blog",
                articles: articles
            });
        });
};

/* GET admin panel blog article edit */
exports.blogArticleEditGet = (req, res, next) => {
    Article.findById(req.params.id)
        .populate("author")
        .exec((err, article) => {
            if (err) return next(err);
            res.render("admin/blogArticleEdit.hbs", {
                title: "Admin Panel Blog | " + article.title,
                article: article
            });
        });
};

/* POST admin panel blog article edit */
exports.blogArticleEditPost = (req, res, next) => {
    Article.findById(req.params.id)
        .populate("author")
        .exec((err, article) => {
            if (err) return next(err);

            article.title = req.body.title;
            article.content = req.body.content;

            article.save(err => {
                if (err) return next(err);
                res.redirect("/admin/blog/" + article._id);
            });
        });
};

/* GET admin panel blog article new */
exports.blogArticleNewGet = (req, res, next) => {
    res.render("admin/blogArticleNew.hbs", {
        title: "Admin Panel New Blog Post",
    });
};

/* POST admin panel blog article new */
exports.blogArticleNewPost = (req, res, next) => {

    const article = new Article({
        title: req.body.title,
        date: new Date(),
        content: req.body.content,
        author: req.session.user
    });

    article.save(function (err) {
        if (err) return next(err);
        res.redirect("/admin/blog/" + article._id);
    });
};

/* GET admin panel blog article delete */
exports.blogArticleDeleteGet = (req, res, next) => {
    res.render("admin/blogArticleDelete.hbs", {
        title: "Admin Panel Blog Post Delete",
    });
};

/* POST admin panel blog article delete */
exports.blogArticleDeletePost = (req, res, next) => {
    Article.findOneAndDelete({_id: req.params.id}).exec((err) => {
        if (err) return next(err);
        return res.redirect("..");
    });
};