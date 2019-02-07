const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, required: true, unique: true, trim: true},
    password: {type: String, required: true}
});

/* Hashing a password before saving it to the database */
UserSchema.pre("save", function (next) {
    const user = this;
    bcrypt.hash(user.password, 12, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next()
    });
});

/* Authentication based on input */
UserSchema.statics.authenticate = function (username, password, callback) {
    this.findOne({username: username})
        .exec(function (err, user) {
            const error = new Error("Invalid username or password.");
            error.status = 401;
            if (err) {
                return callback(err);
            } else if (!user) {
                return callback(error);
            }
            bcrypt.compare(password, user.password, function (err, result) {
                if (result) {
                    return callback(null, user);
                }
                return callback(error);
            });
        });
};

module.exports = mongoose.model("User", UserSchema);