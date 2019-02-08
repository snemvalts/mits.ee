const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    name: {type: String, required: true},
    short: {type: String, required: true},
    description: {type: String},
    active: {type: Boolean, required: true}
});

module.exports = mongoose.model("Team", TeamSchema);