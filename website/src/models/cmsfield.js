const mongoose = require('mongoose');

const { Schema } = mongoose;

// not sure if this is how mongo works
const defaultValues = require('./cms-default-values.json');

const CMSFieldSchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  value: { type: String, required: true },
  css: { type: String, required: false },
});

const CMSField = mongoose.model('CMSField', CMSFieldSchema);

Object.keys(defaultValues).forEach((key) => {
  const field = new CMSField({
    key,
    value: defaultValues[key],
    css: '/* Add custom SCSS */',
  });

  field.save();
});

module.exports = CMSField;
