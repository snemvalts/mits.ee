const mongoose = require('mongoose');

const { Schema } = mongoose;

const moment = require('moment');
// moment.locale("et_EE");

const EventSchema = new Schema({
  title: { type: String },
  date: { type: Date },
  description: { type: String },
  image_url: { type: String },
  fb_url: { type: String },
}, { toJSON: { virtuals: true } });

// Virtual for pretty date
EventSchema.virtual('prettyDate').get(() => moment(this.date).format('LLLL'));

module.exports = mongoose.model('Event', EventSchema);
