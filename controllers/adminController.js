const User = require("../models/user");
const Article = require("../models/article");
const Semester = require("../models/semester");
const Team = require("../models/team");
const Member = require("../models/member");

const async = require("async");

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
        .exec((err, articles) => {
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

    article.save((err) => {
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

    semester.save((err) => {
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




/* GET admin panel members */
exports.membersGet = (req, res, next) => {
    async.parallel({
        members: callback => {
            Member.find({alumnus: false})
                .sort({lastName: 1})
                .exec(callback)
        },
        alumni: callback => {
            Member.find({alumnus: true})
                .sort({lastName: 1})
                .exec(callback)
        }
    }, (err, results) => {
        if (err) return err;
        res.render("admin/members.hbs", {
            title: "Liikmed - Admin paneel - MITS",
            members: results.members,
            alumni: results.alumni
        });
    });
};

/* POST admin panel new member */
exports.membersPost = (req, res, next) => {
    const member = new Member({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        alumnus: !!req.body.alumnus,
        photo: req.body.photo
    });

    member.save((err) => {
        if (err) return next(err);
        return res.redirect("/admin/liikmed");
    });
};

/* GET admin panel member delete */
exports.memberDeleteGet = (req, res, next) => {
    Member.findOne({_id: req.params.id}).exec((err, member) => {
        if (err) return next(err);
        res.render("admin/memberDelete.hbs", {
            title: "Liikme kustutamine - Admin paneel - MITS",
            member: member
        });
    });
};

/* POST admin panel member delete */
exports.memberDeletePost = (req, res, next) => {
    Member.findOneAndDelete({_id: req.params.id}).exec((err) => {
        if (err) return next(err);
        return res.redirect("..");
    });
};

/* GET admin panel member edit */
exports.memberEditGet = (req, res, next) => {
    Member.findOne({_id: req.params.id}).exec((err, member) => {
        if (err) return next(err);
        res.render("admin/memberEdit.hbs", {
            title: "Liikme muutmine - Admin paneel - MITS",
            member: member
        });
    });
};

/* POST admin panel member edit */
exports.memberEditPost = (req, res, next) => {
    Member.findOne({_id: req.params.id}).exec((err, member) => {
        if (err) return next(err);

        member.firstName = req.body.firstName;
        member.lastName = req.body.lastName;
        member.alumnus = !!req.body.alumnus;
        member.photo = req.body.photo;

        member.save((err) => {
            if (err) return next(err);
            return res.redirect("/admin/liikmed");
        });
    });
};





/* GET admin panel teams */
exports.teamsGet = (req, res, next) => {
    async.parallel({
        teams: callback => {
            Team.find({active: true})
                .exec(callback)
        },
        inactive: callback => {
            Team.find({active: false})
                .exec(callback)
        }
    }, (err, results) => {
        if (err) return err;
        res.render("admin/teams.hbs", {
            title: "Töögrupid - Admin paneel - MITS",
            teams: results.teams,
            inactive: results.inactive
        });
    });

};

/* POST admin panel new team */
exports.teamsPost = (req, res, next) => {
    const team = new Team({
        name: req.body.name,
        short: req.body.short,
        active: !!req.body.active,
        description: req.body.description
    });

    team.save((err) => {
        if (err) return next(err);
        return res.redirect("/admin/tiimid");
    });
};

/* GET admin panel team delete */
exports.teamDeleteGet = (req, res, next) => {
    Team.findOne({_id: req.params.id}).exec((err, team) => {
        if (err) return next(err);
        res.render("admin/teamDelete.hbs", {
            title: "Tiimi kustutamine - Admin paneel - MITS",
            team: team
        });
    });
};

/* POST admin panel team delete */
exports.teamDeletePost = (req, res, next) => {
    Team.findOneAndDelete({_id: req.params.id}).exec((err) => {
        if (err) return next(err);
        return res.redirect("..");
    });
};

/* GET admin panel team edit */
exports.teamEditGet = (req, res, next) => {
    Team.findOne({_id: req.params.id}).exec((err, team) => {
        if (err) return next(err);
        res.render("admin/teamEdit.hbs", {
            title: "Töögrupi muutmine - Admin paneel - MITS",
            team: team
        });
    });
};

/* POST admin panel team edit */
exports.teamEditPost = (req, res, next) => {
    Team.findOne({_id: req.params.id}).exec((err, team) => {
        if (err) return next(err);

        team.name = req.body.name;
        team.short = req.body.short;
        team.active = !!req.body.active;
        team.description = req.body.description;

        team.save((err) => {
            if (err) return next(err);
            return res.redirect("/admin/tiimid");
        });
    });
};