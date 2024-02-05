const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    knows: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Word' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
