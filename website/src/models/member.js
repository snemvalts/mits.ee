const mongoose = require('mongoose');

const { Schema } = mongoose;

const MemberSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  alumnus: { type: Boolean, required: true },
  email: { type: String },
  phone: { type: String },
  photo: { type: String },
  notes: [{ type: Schema.Types.ObjectId, ref: 'MemberNote' }],
  memberships: [{ type: Schema.Types.ObjectId, ref: 'Membership' }],
});

// Virtual for full name
MemberSchema.virtual('fullName').get(() => `${this.firstName} ${this.lastName}`);

// Virtual for array of memberships that doesn't work
/* MemberSchema.virtual("memberships", {
    ref: "Membership",
    localField: "_id",
    foreignField: "member"
}); */

module.exports = mongoose.model('Member', MemberSchema);
