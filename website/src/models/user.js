const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String, required: true, unique: true, trim: true,
  },
  password: { type: String, required: true },
});

/* Hashing a password before saving it to the database */
UserSchema.pre('save', (next) => {
  const user = this;
  // eslint-disable-next-line consistent-return
  bcrypt.hash(user.password, 12, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

/* Authentication based on input */
UserSchema.statics.authenticate = function auth(username, password, callback) {
  this.findOne({ username })
    // eslint-disable-next-line consistent-return
    .exec((err, user) => {
      const error = new Error('Invalid username or password.');
      error.status = 401;
      if (err) {
        return callback(err);
      } if (!user) {
        return callback(error);
      }
      bcrypt.compare(password, user.password, (errhash, isMatch) => {
        if (errhash) {
          return callback(errhash);
        }
        if (isMatch) {
          return callback(null, user);
        }
        return callback(error);
      });
    });
};

module.exports = mongoose.model('User', UserSchema);
