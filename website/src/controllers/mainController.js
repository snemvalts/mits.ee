/* eslint-disable consistent-return */
/* eslint-disable import/no-dynamic-require */
import async, { reject } from 'async';
import axios from 'axios';
import { promises } from 'fs';
import { resolve } from 'path';
import Article from '../models/article';
import Event from '../models/event';
import CMSField from '../models/cmsfield'

/* GET index page */
exports.indexGet = (req, res, next) => {

  const queries = [
    Article.find({}).sort({ date: -1 }).limit(3).populate('author'),
    Event.find({ date: { $gte: new Date() } }).sort({ date: 1 }),
    CMSField.findOne({'key': 'cta_text'}),
    CMSField.findOne({'key': 'people_container'}),
    CMSField.findOne({'key': 'sponsors'}),
    CMSField.findOne({'key': 'partners'})
  ]

  Promise.all(queries)
  .then((results) => {    
    res.render('index', {
      title: 'MAT-INF tudengiselts',
      user: req.session.user,
      articles: results[0],
      events: results[1],
      cmsFields: {
        cta_text: results[2].value,
        people_container: results[3].value,
        sponsors: results[4].value,
        partners: results[5].value
      }
    });
  })
  .catch((error) => {
    return next(error);
  });
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
  async.parallel({
    new_events: (callback) => {
      Event.find({ date: { $gte: new Date() } })
        .sort({ date: 1 })
        .exec(callback);
    },
    old_events: (callback) => {
      Event.find({ date: { $lte: new Date() } })
        .limit(9)
        .sort({ date: -1 })
        .exec(callback);
    },
  }, (err, results) => {
    if (err) return next(err);

    res.render('events', {
      title: 'Üritused - MITS',
      user: req.session.user,
      new_events: results.new_events,
      old_events: results.old_events,
    });
  });
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
