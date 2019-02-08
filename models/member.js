const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MemberSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    alumnus: {type: Boolean, required: true},
    photo: {type: String},
    notes: [{type: Schema.Types.ObjectId, ref: "MemberNote"}]
});

MemberSchema.virtual("memberships", {
    ref: "Membership",
    localField: "_id",
    foreignField: "member"
});

module.exports = mongoose.model("Member", MemberSchema);