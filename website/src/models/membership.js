const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MembershipSchema = new Schema({
    semester: {type: Schema.Types.ObjectId, ref: "Semester", required: true},
    team: {type: Schema.Types.ObjectId, ref: "Team", required: true},
    member: {type: Schema.Types.ObjectId, ref: "Member", required: true},
    leader: {type: Boolean, required: true}
});

// Combination of semester, team and member must be unique
MembershipSchema.index({semester: 1, team: 1, member: 1}, {unique: true});

module.exports = mongoose.model("Membership", MembershipSchema);