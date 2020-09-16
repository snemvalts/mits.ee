const mongoose = require('mongoose');

const { Schema } = mongoose;

const ArticleSchema = new Schema({
  title: { type: String, required: true, max: 100 },
  url: { type: String, required: true },
  date: { type: Date, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Article', ArticleSchema);
