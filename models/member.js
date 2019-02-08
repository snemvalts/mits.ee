const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MemberSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    alumnus: {type: Boolean, required: true},
    photo: {type: String},
    memberships: [{type: Schema.Types.ObjectId, ref: "Membership"}],
    notes: [{type: Schema.Types.ObjectId, ref: "MemberNote"}]
});

module.exports = mongoose.model("Member", MemberSchema);