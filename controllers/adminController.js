const User = require("../models/user");
const Article = require("../models/article");
const Semester = require("../models/semester");

const {body, validationResult} = require("express-validator/check");
const {sanitizeBody} = require("express-validator/filter");

/* GET admin panel */
exports.indexGet = (req, res, next) => {
    res.render("admin/index.hbs", {
        title: "Admin paneel - MITS",
    });
};

/* GET admin panel blog */
exports.blogGet = (req, res, next) => {
    Article.find({})
        .populate("author")
        .exec(function (err, articles) {
            if (err) return next(err);

            res.render("admin/blog.hbs", {
                title: "Blogi - Admin paneel - MITS",
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
                title: article.title + " - Admin paneel - MITS",
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
        title: "Uus blogipostitus - Admin paneel - MITS",
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
        title: "Blogiposti kustutamine - Admin paneel - MITS",
    });
};

/* POST admin panel blog article delete */
exports.blogArticleDeletePost = (req, res, next) => {
    Article.findOneAndDelete({_id: req.params.id}).exec((err) => {
        if (err) return next(err);
        return res.redirect("..");
    });
};



/* GET admin panel semesters */
exports.semestersGet = (req, res, next) => {
    Semester.find({})
        .sort({year: -1, season: -1})
        .exec((err, semesters) => {
            if (err) return next(err);

            res.render("admin/semesters.hbs", {
                title: "Semestrid - Admin paneel - MITS",
                semesters: semesters
            });
        });
};

/* POST admin panel new semester */
exports.semestersPost = (req, res, next) => {
    const semester = new Semester({
        year: req.body.year,
        season: req.body.season
    });

    semester.save(function (err) {
        if (err) return next(err);
        res.redirect("/admin/semestrid");
    });
};

/* GET admin panel semester delete */
exports.semesterDeleteGet = (req, res, next) => {
    Semester.findOne({_id: req.params.id}).exec((err, semester) => {
        if (err) return next(err);
        res.render("admin/semesterDelete.hbs", {
            title: "Semestri kustutamine - Admin paneel - MITS",
            semester: semester
        });
    });
};

/* POST admin panel semester delete */
exports.semesterDeletePost = (req, res, next) => {
    Semester.findOneAndDelete({_id: req.params.id}).exec((err) => {
        if (err) return next(err);
        return res.redirect("..");
    });
};