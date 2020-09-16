const mongoose = require('mongoose');

const { Schema } = mongoose;

const TeamSchema = new Schema({
  name: { type: String, required: true, unique: true },
  short: { type: String, required: true, unique: true },
  description: { type: String },
  order: { type: Number, required: true, default: 1 },
  active: { type: Boolean, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
});

// Virtual for array of memberships that doesn't work
/* TeamSchema.virtual("memberships", {
    ref: "Membership",
    localField: "_id",
    foreignField: "team"
}); */

module.exports = mongoose.model('Team', TeamSchema);
