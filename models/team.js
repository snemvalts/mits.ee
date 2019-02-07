const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
        name: {type: String, required: true},
        short: {type: String, required: true},
        active: {type: Boolean, required: true},
        leader: {type: Schema.Types.ObjectId, ref: "Member", required: true}
});

module.exports = mongoose.model("Team", TeamSchema);