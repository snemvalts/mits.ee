const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MemberNoteSchema = new Schema({
    name: {type: String, required: true}
});

module.exports = mongoose.model("MemberNote", MemberNoteSchema);