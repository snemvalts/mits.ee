const mongoose = require('mongoose');

const { Schema } = mongoose;

const moment = require('moment');
// moment.locale("et_EE");

const EventSchema = new Schema({
  event_id: { type: String },
  title: { type: String },
  date: { type: Date },
  description: { type: String },
  location: { type: String },
  image_url: { type: String },
  fb_date: { type: String },
}, { toJSON: { virtuals: true } });

// Virtual for pretty date
EventSchema.virtual('prettyDate').get(function () {
  return moment(this.date).format('LLLL');
});

module.exports = mongoose.model('Event', EventSchema);
