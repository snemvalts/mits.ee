const modelPath = "../models/";
const Article = require(modelPath + "article");
const Event = require(modelPath + "event");
const Member = require(modelPath + "member");
const Semester = require(modelPath + "semester");
const Team = require(modelPath + "team");
const Membership = require(modelPath + "membership");

const async = require("async");

/* GET index page */
exports.indexGet = (req, res, next) => {
    async.parallel({
        articles: callback => {
            Article.find({})
                .sort({"date": -1})
                .limit(3)
                .populate("author")
                .exec(callback);
        },
        events: callback => {
            Event.find({"date": {"$gte": new Date()}})
                .sort({"date": 1})
                .exec(callback);
        }
    }, (err, results) => {
        if (err) return next(err);

        res.render("index", {
            title: "MITS",
            user: req.session.user,
            articles: results.articles,
            events: results.events
        });
    });
};

/* GET about page */
exports.aboutGet = (req, res, next) => {
    async.parallel({
        members: callback => {
            Member.find({photo: {$ne: ""}, alumnus: false})
                .exec(callback)
        }
    }, (err, results) => {
        if (err) return next(err);

        // Shuffle members
        let members = results.members;
        for (let i = members.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [members[i], members[j]] = [members[j], members[i]];
        }

        res.render("about", {
            title: "Meist - MITS",
            user: req.session.user,
            members: members
        });
    });
};

/* GET events page */
exports.eventsGet = (req, res, next) => {
    async.parallel({
        new_events: callback => {
            Event.find({"date": {"$gte": new Date()}})
                .sort({"date": 1})
                .exec(callback);
        },
        old_events: callback => {
            Event.find({"date": {"$lte": new Date()}})
                .limit(9)
                .sort({"date": -1})
                .exec(callback);
        }
    }, (err, results) => {
        if (err) return next(err);

        res.render("events", {
            title: "Üritused - MITS",
            user: req.session.user,
            new_events: results.new_events,
            old_events: results.old_events
        });
    });
};

/* GET events query page */
exports.eventsQueryGet = (req, res, next) => {
    Event.find({})
        .skip(Number(req.params.skip))
        .limit(10)
        .sort({date: -1})
        .exec((err, events) => {
            if (err) return next(err);

            const out = {
                more: events.length > 9,
                events: events.slice(0,9)
            };

            return res.json(out);
        });
};

/* GET event page */
exports.eventGet = (req, res, next) => {
    Event.findOne({"event_id": req.params.id})
        .exec((err, event) => {
            if (err) return next(err);

            res.render("event", {
                title: event.title + " - MITS",
                user: req.session.user,
                event: event
            });
        });
};

/* GET members page */
/* sorry */
/* I'll buy you a drink if you don't tell anyone about this */
exports.membersGet = (req, res, next) => {
    async.parallel({
        currentSemester: callback => {
            Semester.findOne({})
                .sort({year: -1, season: -1})
                .exec(callback)
        },
        teams: callback => {
            Team.find({active: true})
                .sort({order: 1})
                .exec(callback);
        },
        members: callback => {
            Member.find({alumnus: false})
                .sort({firstName: 1, lastName: 1})
                .exec(callback);
        }
    }, (err, results) => {
        if (err) return next(err);
        let currentSemester = results.currentSemester;
        let teams = results.teams;
        let members = results.members;

        Membership.find({})
            .populate("semester")
            .populate("member")
            .populate("team")
            .exec((err, memberships) => {
                if (err) return next(err);

                // Sorting memberships by semester ascendingly
                // Sorry again
                try {
                    memberships.sort((a, b) => {
                        if (a.semester.short > b.semester.short) return 1;
                        return -1;
                    });
                } catch (e) {}

                // Adding memberships to members
                // Really sorry
                for (let membership of memberships) {
                    let memberIndex = members.findIndex(element => {
                        return element._id.toString() === membership.member._id.toString();
                    });

                    if (memberIndex !== -1) {
                        members[memberIndex].memberships.push(membership);
                    }
                }

                // Adding members to teams based on the current semester membership
                // Terribly sorry
                for (let member of members) {
                    for (let membership of member.memberships) {
                        if (membership.semester._id.toString() === currentSemester._id.toString()) {
                            let teamIndex = teams.findIndex(element => {
                                return element._id.toString() === membership.team._id.toString();
                            });

                            if (teamIndex !== -1) {
                                // leaders go to the beginning
                                if (membership.leader) {
                                    teams[teamIndex].members.unshift(member);
                                } else {
                                    teams[teamIndex].members.push(member);
                                }
                            }
                        }
                    }
                }

                let juhatus = teams.slice(0, 3);
                let tiimid = teams.slice(3);

                res.render("members", {
                    title: "Liikmed - MITS",
                    user: req.session.user,
                    juhatus: juhatus,
                    tiimid: tiimid
                });
            });
    });
};


/* GET alumni page */
exports.alumniGet = (req, res, next) => {
    async.parallel({
        alumni: callback => {
            Member.find({alumnus: true})
                .sort({firstName: 1, lastName: 1})
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

        let alumni = results.alumni;

        try {
            results.memberships.sort((a, b) => {
                if (a.semester.short > b.semester.short) return 1;
                return -1;
            });
        } catch (e) {}

        for (let membership of results.memberships) {
            let alumnusIndex = alumni.findIndex(element => {
                return element._id.toString() === membership.member._id.toString();
            });

            if (alumnusIndex !== -1) {
                alumni[alumnusIndex].memberships.push(membership);
            }
        }

        res.render("alumni", {
            title: "Vilistlased - MITS",
            user: req.session.user,
            alumni: alumni
        });
    });
};