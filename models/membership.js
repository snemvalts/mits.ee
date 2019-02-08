const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MembershipSchema = new Schema({
    semester: {type: Schema.Types.ObjectId, ref: "Semester", required: true},
    team: {type: Schema.Types.ObjectId, ref: "Team", required: true},
    leader: {type: Boolean, required: true}
});

module.exports = mongoose.model("Membership", MembershipSchema);