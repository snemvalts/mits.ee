// Fix IntelliJ mongoose functions with this
// https://youtrack.jetbrains.com/issue/WEB-17099#focus=streamItem-27-1441265-0-0
const modelPath = "../models/";
//const User = require(modelPath + "user");
const Article = require(modelPath + "article");
const Semester = require(modelPath + "semester");
const Team = require(modelPath + "team");
const Member = require(modelPath + "member");
const Membership = require(modelPath + "membership");

const async = require("async");
const csv = require("fast-csv");
const mongoose = require("mongoose");

//const {body, validationResult} = require("express-validator/check");
//const {sanitizeBody} = require("express-validator/filter");

/* GET admin panel */
exports.indexGet = (req, res) => {
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
exports.blogArticleNewGet = (req, res) => {
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
exports.blogArticleDeleteGet = (req, res) => {
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

/* POST admin panel semester add */
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

/* POST admin panel multiple semesters add */
exports.semestersMultiplePost = (req, res, next) => {
    let semesters = [];
    csv.fromString(req.body.data.toString(), {
        headers: true,
        ignoreEmpty: true
    }).on("data", data => {
        data["_id"] = new mongoose.Types.ObjectId();
        semesters.push(data);
    }).on("end", () => {
        Semester.create(semesters, (err) => {
            if (err) return next(err);
            res.redirect("/admin/semestrid");
        });
    });
};

/* GET admin panel semester delete */
exports.semesterDeleteGet = (req, res, next) => {
    async.parallel({
        semester: callback => {
            Semester.findOne({_id: req.params.id}).exec(callback)
        },
        memberships: callback => {
            Membership.find({semester: req.params.id})
                .populate("team")
                .populate("member")
                .exec(callback)
        }
    }, (err, results) => {
        if (err) return next(err);
        if (!results.semester) return res.redirect("/admin/semestrid");

        res.render("admin/semesterDelete.hbs", {
            title: "Semestri kustutamine - Admin paneel - MITS",
            semester: results.semester,
            memberships: results.memberships
        });
    });
};

/* POST admin panel semester delete */
exports.semesterDeletePost = (req, res, next) => {
    Membership.findOne({semester: req.params.id}).exec((err, membership) => {
        if (err) return next(err);
        if (membership) {
            return res.redirect("/admin/semestrid/" + req.params.id + "/kustuta");
        }
        Semester.findOneAndDelete({_id: req.params.id}).exec((err) => {
            if (err) return next(err);
            return res.redirect("..");
        });
    });
};




/* GET admin panel members */
exports.membersGet = (req, res, next) => {
    async.parallel({
        members: callback => {
            Member.find({alumnus: false})
                .sort({firstName: 1, lastName: 1})
                .exec(callback)
        },
        alumni: callback => {
            Member.find({alumnus: true})
                .sort({firstName: 1, lastName: 1})
                .exec(callback)
        }
    }, (err, results) => {
        if (err) return next(err);
        res.render("admin/members.hbs", {
            title: "Liikmed - Admin paneel - MITS",
            members: results.members,
            alumni: results.alumni
        });
    });
};

/* POST admin panel member add */
exports.membersPost = (req, res, next) => {
    const member = new Member({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        alumnus: !!req.body.alumnus,
    });

    member.save((err, newMember) => {
        if (err) return next(err);
        return res.redirect("/admin/liikmed/" + newMember._id);
    });
};

/* POST admin panel multiple members add */
exports.membersMultiplePost = (req, res, next) => {
    let members = [];
    csv.fromString(req.body.data.toString(), {
        headers: true,
        ignoreEmpty: true
    }).on("data", data => {
        data["_id"] = new mongoose.Types.ObjectId();
        members.push(data);
    }).on("end", () => {
        Member.create(members, (err) => {
            if (err) return next(err);

            res.redirect("/admin/liikmed");
        });
    });
};

/* GET admin panel member delete */
exports.memberDeleteGet = (req, res, next) => {
    async.parallel({
        member: callback => {
            Member.findOne({_id: req.params.id}).exec(callback);
        },
        memberships: callback => {
            Membership.find({member: req.params.id})
                .populate("semester")
                .populate("team")
                .exec(callback)
        }
    }, (err, results) => {
        if (err) return next(err);
        if (!results.member) return res.redirect("/admin/liikmed");

        res.render("admin/memberDelete.hbs", {
            title: "Liikme kustutamine - Admin paneel - MITS",
            member: results.member,
            memberships: results.memberships
        });
    });
};

/* POST admin panel member delete */
exports.memberDeletePost = (req, res, next) => {
    Membership.findOne({member: req.params.id}).exec((err, membership) => {
        if (err) return next(err);
        if (membership) {
            return res.redirect("/admin/liikmed/" + req.params.id + "/kustuta");
        }
        Member.findOneAndDelete({_id: req.params.id}).exec((err) => {
            if (err) return next(err);
            return res.redirect("..");
        });
    });
};

/* GET admin panel member edit */
exports.memberEditGet = (req, res, next) => {
    async.parallel({
        member: callback => {
            Member.findOne({_id: req.params.id}).exec(callback)
        },
        memberships: callback => {
            Membership.find({member: req.params.id})
                .populate("semester")
                .populate("team")
                .exec(callback)
        },
        semesters: callback => {
            Semester.find({})
                .sort({year: -1, season: -1})
                .exec(callback)
        },
        teams: callback => {
            Team.find({})
                .sort({order: 1})
                .exec(callback)
        }
    }, (err, results) => {
        if (err) return next(err);
        if (!results.member) return res.redirect("/admin/liikmed");

        // Mongoose sorting by populated values is chaos, so I'm doing it here
        // See https://github.com/mrm8488/ama/issues/5
        try {
            results.memberships.sort((a, b) => {
                // Semesters descending
                if (a.semester.short > b.semester.short) return -1;
                if (a.semester.short < b.semester.short) return 1;
                // Team order ascending
                if (a.team.order > b.team.order) return 1;
                if (a.team.order < b.team.order) return -1;
                // Leader first (descending: 1 is leader, 0 is not)
                if (a.leader > b.leader) return -1;
                if (a.leader < b.leader) return 1;
                return 0;
            });
        } catch (e) {}

        res.render("admin/memberEdit.hbs", {
            title: "Liikme muutmine - Admin paneel - MITS",
            member: results.member,
            memberships: results.memberships,
            semesters: results.semesters,
            teams: results.teams
        });
    });
};

/* POST admin panel member edit */
exports.memberEditPost = (req, res, next) => {
    Member.findOne({_id: req.params.id}).exec((err, member) => {
        if (err) return next(err);
        if (!member) return res.redirect("/admin/liikmed");

        member.firstName = req.body.firstName;
        member.lastName = req.body.lastName;
        member.alumnus = !!req.body.alumnus;
        member.email = req.body.email;
        member.phone = req.body.phone;
        member.photo = req.body.photo;

        member.save((err) => {
            if (err) return next(err);
            return res.redirect("/admin/liikmed/" + req.params.id);
        });
    });
};

/* POST admin panel member photo upload */
exports.memberPhotoUploadPost = (req, res, next) => {
    Member.findOne({_id: req.params.id})
        .exec((err, member) => {
            if (err) return next(err);
            member.photo = req.file.filename;
            member.save((err) => {
                if (err) return next(err);
                return res.redirect("/admin/liikmed/" + req.params.id);
            });

        });
};





/* GET admin panel teams */
exports.teamsGet = (req, res) => {
    async.parallel({
        teams: callback => {
            Team.find({active: true})
                .sort({order: 1})
                .exec(callback)
        },
        inactive: callback => {
            Team.find({active: false})
                .sort({order: 1})
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

/* POST admin panel team add */
exports.teamsPost = (req, res, next) => {
    const team = new Team({
        name: req.body.name,
        short: req.body.short,
        order: req.body.order,
        active: !!req.body.active,
        description: req.body.description
    });

    team.save((err) => {
        if (err) return next(err);
        return res.redirect("/admin/tiimid");
    });
};

/* POST admin panel multiple teams add */
exports.teamsMultiplePost = (req, res, next) => {
    let teams = [];
    csv.fromString(req.body.data.toString(), {
        headers: true,
        ignoreEmpty: true
    }).on("data", data => {
        data["_id"] = new mongoose.Types.ObjectId();
        teams.push(data);
    }).on("end", () => {
        Team.create(teams, (err) => {
            if (err) return next(err);

            res.redirect("/admin/tiimid");
        });
    });
};

/* GET admin panel team delete */
exports.teamDeleteGet = (req, res, next) => {
    async.parallel({
        team: callback => {
            Team.findOne({_id: req.params.id}).exec(callback)
        },
        memberships: callback => {
            Membership.find({team: req.params.id})
                .populate("semester")
                .populate("member")
                .exec(callback)
        }
    }, (err, results) => {
        if (err) return next(err);
        if (!results.team) return res.redirect("/admin/tiimid");

        res.render("admin/teamDelete.hbs", {
            title: "Tiimi kustutamine - Admin paneel - MITS",
            team: results.team,
            memberships: results.memberships
        });
    });
};

/* POST admin panel team delete */
exports.teamDeletePost = (req, res, next) => {
    Membership.findOne({team: req.params.id}).exec((err, membership) => {
        if (err) return next(err);
        if (membership) {
            return res.redirect("/admin/tiimid/" + req.params.id + "/kustuta");
        }
        Team.findOneAndDelete({_id: req.params.id}).exec((err) => {
            if (err) return next(err);
            return res.redirect("..");
        });
    });
};

/* GET admin panel team edit */
exports.teamEditGet = (req, res, next) => {
    async.parallel({
        team: callback => {
            Team.findOne({_id: req.params.id}).exec(callback)
        },
        memberships: callback => {
            Membership.find({team: req.params.id})
                .populate("semester")
                .populate("member")
                .exec(callback)
        },
        semesters: callback => {
            Semester.find({})
                .sort({year: -1, season: -1})
                .exec(callback)
        },
        members: callback => {
            Member.find({})
                .sort({firstName: 1, lastName: 1})
                .exec(callback)
        }
    }, (err, results) => {
        if (err) return next(err);
        if (!results.team) return res.redirect("/admin/tiimid");

        // Mongoose sorting by populated values is chaos, so I'm doing it here
        // See https://github.com/mrm8488/ama/issues/5
        try {
            results.memberships.sort((a, b) => {
                // Semesters descending
                if (a.semester.short > b.semester.short) return -1;
                if (a.semester.short < b.semester.short) return 1;
                // Leader first (descending: 1 is leader, 0 is not)
                if (a.leader > b.leader) return -1;
                if (a.leader < b.leader) return 1;
                // First name ascending
                if (a.member.firstName > b.member.firstName) return 1;
                if (a.member.firstName < b.member.firstName) return -1;
                // Last name ascending
                if (a.member.lastName > b.member.lastName) return 1;
                if (a.member.lastName < b.member.lastName) return -1;
                return 0;
            });
        } catch (e) {}

        res.render("admin/teamEdit.hbs", {
            title: "Töögrupi muutmine - Admin paneel - MITS",
            team: results.team,
            memberships: results.memberships,
            semesters: results.semesters,
            members: results.members
        });
    });
};

/* POST admin panel team edit */
exports.teamEditPost = (req, res, next) => {
    Team.findOne({_id: req.params.id}).exec((err, team) => {
        if (err) return next(err);
        if (!team) return res.redirect("/admin/tiimid");

        team.name = req.body.name;
        team.short = req.body.short;
        team.order = req.body.order;
        team.active = !!req.body.active;
        team.description = req.body.description;

        team.save((err) => {
            if (err) return next(err);
            return res.redirect("/admin/tiimid");
        });
    });
};




/* GET admin panel memberships */
exports.membershipsGet = (req, res, next) => {
    async.parallel({
        semesters: callback => {
            Semester.find()
                .sort({year: -1, season: -1})
                .exec(callback)
        },
        members: callback => {
            Member.find()
                .sort({firstName: 1, lastName: 1})
                .exec(callback)
        },
        teams: callback => {
            Team.find()
                .sort({order: 1})
                .exec(callback)
        },
        memberships: callback => {
            Membership.find()
                .populate("semester")
                .populate("member")
                .populate("team")
                .exec(callback)
        }
    }, (err, results) => {
        if (err) return next(err);

        // Mongoose sorting by populated values is chaos, so I'm doing it here
        // See https://github.com/mrm8488/ama/issues/5
        try {
            results.memberships.sort((a, b) => {
                // Semesters descending
                if (a.semester.short > b.semester.short) return -1;
                if (a.semester.short < b.semester.short) return 1;
                // Team order ascending
                if (a.team.order > b.team.order) return 1;
                if (a.team.order < b.team.order) return -1;
                // Leader first (descending: 1 is leader, 0 is not)
                if (a.leader > b.leader) return -1;
                if (a.leader < b.leader) return 1;
                // First name ascending
                if (a.member.firstName > b.member.firstName) return 1;
                if (a.member.firstName < b.member.firstName) return -1;
                // Last name ascending
                if (a.member.lastName > b.member.lastName) return 1;
                if (a.member.lastName < b.member.lastName) return -1;
                return 0;
            });
        } catch (e) {}

        res.render("admin/memberships.hbs", {
            title: "Kuulumised - Admin paneel - MITS",
            members: results.members,
            semesters: results.semesters,
            teams: results.teams,
            memberships: results.memberships
        });
    });
};

/* POST admin panel membership add */
exports.membershipsPost = (req, res, next) => {
    const membership = new Membership({
        semester: req.body.semester,
        member: req.body.member,
        team: req.body.team,
        leader: !!req.body.leader
    });

    membership.save((err) => {
        if (err) return next(err);
        if (req.body.redirect) {
            return res.redirect(req.body.redirect);
        }
        return res.redirect("/admin/kuulumised");
    });
};

/* POST admin panel multiple memberships add */
/* not very asynchronous of me */
exports.membershipsMultiplePost = (req, res, next) => {
    csv.fromString(req.body.data.toString(), {
        headers: true,
        ignoreEmpty: true
    }).on("data", data => {
        async.parallel({
            semester: callback => {
                Semester.findOne({year: data.year, season: data.season})
                    .exec(callback)
            },
            member: callback => {
                Member.findOne({firstName: data.firstName, lastName: data.lastName})
                    .exec(callback)
            },
            team: callback => {
                Team.findOne({short: data.short})
                    .exec(callback)
            }
        }, (err, results) => {
            if (err) return next(err);

            const membership = new Membership({
                semester: results.semester._id,
                member: results.member._id,
                team: results.team._id,
                leader: data.leader,
            });

            membership.save(err => {
                if (err) return next(err);
            });
        });
    }).on("end", () => {
        return res.redirect("/admin/kuulumised");
    });
};

/* GET admin panel membership delete */
exports.membershipDeleteGet = (req, res, next) => {
    Membership.findOne({_id: req.params.id})
        .populate("semester")
        .populate("member")
        .populate("team")
        .exec((err, membership) => {
            if (err) return next(err);
            if (!membership) return res.redirect("/admin/kuulumised");

            res.render("admin/membershipDelete.hbs", {
                title: "Kuulumise kustutamine - Admin paneel - MITS",
                membership: membership
            });
        });
};

/* POST admin panel membership delete */
exports.membershipDeletePost = (req, res, next) => {
    Membership.findOneAndDelete({_id: req.params.id}).exec((err) => {
        if (err) return next(err);

        return res.redirect("..");
    });
};