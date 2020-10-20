/* eslint-disable consistent-return */
/* eslint-disable import/no-dynamic-require */
import Event from '../models/event';
import fields from '../helpers/dbHelper';

/* GET index page */
exports.indexGet = (req, res, next) => {
  const queries = fields.get(req.url);

  Promise.all(queries)
    .then((results) => {
      const [articles, events, cmsFields] = results;
      res.render('index', {
        title: 'MAT-INF tudengiselts',
        user: req.session.user,
        articles,
        events,
        cmsFields,
      });
    })
    .catch((error) => next(error));
};

/* GET about page */
exports.aboutGet = (req, res) => {
  res.render('about', {
    title: 'Meist - MITS',
    user: req.session.user,
  });
};

/* GET events page */
exports.eventsGet = (req, res, next) => {
  const queries = fields.get(req.url);

  Promise.all(queries)
    .then((results) => {
      const [newEvents, oldEvents] = results;
      res.render('events', {
        title: 'Üritused - MITS',
        user: req.session.user,
        newEvents,
        oldEvents,
      });
    })
    .catch((error) => next(error));
};

/* GET events query page */
exports.eventsQueryGet = (req, res, next) => {
  Event.find({})
    .skip(Number(req.params.skip))
    .limit(10)
    .sort({ date: -1 })
    .exec((err, events) => {
      if (err) return next(err);

      const out = {
        more: events.length > 9,
        events: events.slice(0, 9),
      };

      return res.json(out);
    });
};

/* GET event page */
exports.eventGet = (req, res, next) => {
  Event.findOne({ event_id: req.params.id })
    .exec((err, event) => {
      if (err) return next(err);
      if (!event) {
        res.status(404);
        return res.render('404.hbs', {
          title: 'Lehekülge ei leitud! - MITS',
        });
      }

      res.render('event', {
        title: `${event.title} - MITS`,
        user: req.session.user,
        event,
      });
    });
};

/* GET mentor page */
exports.mentorGet = (req, res) => {
  res.render('mentor', {
    title: 'Mentorprogramm - MITS',
    user: req.session.user,
  });
};
