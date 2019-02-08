const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SemesterSchema = new Schema({
    year: {type: Number, required: true},
    season: {type: String, enum: ["k", "s"], default: "k", required: true}
});

// Combination of year and season must be unique
SemesterSchema.index({ year: 1, season: 1 }, {unique: true});

// Virtual for short name
SemesterSchema.virtual("short").get(() => {
    //return `${this.year} ${this.season}`;
    return "wtf";
});

// Virtual for full name
SemesterSchema.virtual("full").get(() => {
    console.log(this.year, this.season);
    //return this.year + this.season === "k" ? " kevad" : " sügis";
    return "bbq";
});

module.exports = mongoose.model("Semester", SemesterSchema);