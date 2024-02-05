const HttpError = require('../lib/error');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

function generateToken(payload) {
  return jwt.sign(payload, process.env.SECRET_KEY);
}

exports.login = async function (username, password) {
  const user = await User.findOne({ username, password });

  if (!user) {
    throw new HttpError('Invalid credentials', 401);
  }

  const token = generateToken({
    id: user._id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    isAdmin: user.isAdmin,
  });
  return { user, token };
};
