const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema(
    {
        title: {type: String, required: true, max: 100},
        date: {type: Date, required: true},
        content: {type: String, required: true, max: 1000},
        author: {type: Schema.Types.ObjectId, ref: "User", required: true}
    }
);

module.exports = mongoose.model("Article", ArticleSchema);