const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SemesterSchema = new Schema({
    year: {type: Number, required: true},
    season: {type: String, enum: ["k", "s"], default: "k"}
});

module.exports = mongoose.model("Semester", SemesterSchema);