const mongoose = require('mongoose');
const { Schema } = mongoose;

// not sure if this is how mongo works
const defaultValues = {
  cta_text: `
    <h1>Hei!</h1>
    <h2>Liitumine MITSi on avatud!</h2>
    <a class="btn gradient"
       href="/liitumine"
       target="_blank" rel="noopener">Liitu</a>
  `,
}
const CMSFieldSchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  value: { type: String, required: true },
});

const CMSField = mongoose.model('CMSField', CMSFieldSchema);

Object.keys(defaultValues).forEach((key) => {
  const field = new CMSField({
    key,
    value: defaultValues[key],
  });

  field.save();
});

module.exports = CMSField;