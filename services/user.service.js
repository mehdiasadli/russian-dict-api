const { default: mongoose } = require('mongoose');
const HttpError = require('../lib/error');
const User = require('../models/user.model');
const Word = require('../models/word.model');

exports.createUser = async function (data) {
  const user = await User.findOne({ username: data.username });

  if (user) {
    throw new HttpError('Username already in use', 409);
  }

  return await User.create(data);
};

exports.updateUser = async function (id, data) {
  const user = await User.findById(id);

  if (!user) {
    throw new HttpError('User not found', 404);
  }

  Object.assign(user, data);
  await user.save();

  return user;
};

exports.deleteUser = async function (id) {
  const user = await User.findById(id);

  if (!user) {
    throw new HttpError('User not found', 404);
  }

  const words = await Word.find({ knows: id });

  words?.forEach(async (w) => {
    w.knows = w.knows.filter((k) => k.toString() !== id);
    await w.save();
  });

  await User.findByIdAndDelete(id);

  return true;
};

exports.getUsers = async function () {
  return await User.find();
};

exports.getUser = async function (id) {
  const user = await User.findById(id);

  if (!user) {
    throw new HttpError('User not found', 404);
  }

  return user;
};

exports.manage = async function (userId, id) {
  const user = await User.findById(new mongoose.Types.ObjectId(userId));
  const word = await Word.findById(new mongoose.Types.ObjectId(id));

  if (!user) {
    throw new HttpError('Unauthorized', 401);
  }

  if (!word) {
    throw new HttpError('Word not found', 404);
  }

  if (!user.knows) {
    user.knows = [];
  }

  if (!word.knows) {
    word.knows = [];
  }

  if (user.knows.includes(id)) {
    user.knows = user.knows.filter((i) => String(i) !== String(id));
    word.knows = word.knows.filter((i) => String(i) !== String(userId));
  } else {
    user.knows.push(id);
    word.knows.push(userId);
  }

  await user.save();
  await word.save();

  return user;
};

exports.transfer = async function (userId, wordId, from = 'learning') {
  const user = await User.findById(userId);
  const word = await Word.findById(wordId);

  if (!user) {
    throw new HttpError('User not found', 404);
  }

  if (!word) {
    throw new HttpError('Word not found', 404);
  }

  if (from === 'learning') {
    user.learning = user.learning.filter((i) => String(i) !== String(wordId));
    user.knows.push(wordId);
  } else {
    user.knows = user.knows.filter((i) => String(i) !== String(wordId));
    user.learning.push(wordId);
  }

  await user.save();
  return {
    learning: user.learning,
    knows: user.knows,
  };
};
