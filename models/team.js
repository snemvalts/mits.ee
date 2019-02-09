const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    name: {type: String, required: true, unique: true},
    short: {type: String, required: true, unique: true},
    description: {type: String},
    order: {type: Number, required: true, default: 1},
    active: {type: Boolean, required: true}
});

module.exports = mongoose.model("Team", TeamSchema);