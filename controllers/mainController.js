const modelPath = "../models/";
const Article = require(modelPath + "article");
const Event = require(modelPath + "event");
const Member = require(modelPath + "member");

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
    let members = ['Age', 'Hain', 'Hans Henrik', 'Karen', 'Leemet', 'Birgit', 'Andri', 'Silver', 'Merit', 'Joonas', 'Krister', 'Liis', 'Brigitta', 'Magnus', 'Karl Marten', 'Karel', 'Anette Maria', 'Alfred', 'Jürgen', 'Ludvig', 'Ingrid', 'Anett', 'Katrin', 'Allan', 'Laura', 'Jaanus', 'Annela', 'Maret', 'Toode', 'Pilleriin', 'Magnar', 'Marten', 'Patrick', 'Carmen', 'Hanna-Marii', 'Annilo', 'Ralf', 'Kairit', 'Bogdan', 'Säde Mai', 'Ott Kaarel', 'Robert', 'Jaan', 'Erik Martin', 'Haug', 'Maria', 'Carola', 'Lauri', 'Oliver-Erik', 'Joosep', 'Rain', 'Peeter', 'Nõmm', 'Triin Mirjam', 'Hanna', 'Egert', 'Carolin'];

    // Shuffle
    for (let i = members.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [members[i], members[j]] = [members[j], members[i]];
    }

    res.render("about", {
        title: "Meist - MITS",
        user: req.session.user,
        members: members
    });
    /*async.parallel({
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
    });*/
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

/* GET liikmed page */
exports.membersGet = (req, res, next) => {
    res.render("members", {
        title: "Liikmed - MITS",
        user: req.session.user
    });
};

/* GET liikmed page */
exports.membersGet = (req, res, next) => {
    res.render("members", {
        title: "Liikmed - MITS",
        user: req.session.user
    });
};

/* GET alumni page */
exports.alumniGet = (req, res, next) => {
    res.render("alumni", {
        title: "Vilistlased - MITS",
        user: req.session.user
    });
};