const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MemberSchema = new Schema({
        firstName: {type: String, required: true},
        lastName: {type: Date, required: true},
        alumnus: {type: Boolean, required: true},
        photo: {type: String}
});

module.exports = mongoose.model("Member", MemberSchema);