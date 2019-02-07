const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema({
        event_id: {type: String},
        title: {type: String},
        date: {type: Date},
        description: {type: String},
        location: {type: String},
        image_url: {type: String},
        fb_date: {type: String}
});

module.exports = mongoose.model("Event", EventSchema);