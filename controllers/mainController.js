const Article = require("../models/article");
const Event = require("../models/event");

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
    res.render("about", {
        title: "Meist",
        user: req.session.user
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
                .sort({"date": -1})
                .exec(callback);
        }
    }, (err, results) => {
        if (err) return next(err);

        res.render("events", {
            title: "Üritused",
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

            console.log(event);

            res.render("event", {
                title: "Üritus",
                user: req.session.user,
                event: event
            });
        });
};