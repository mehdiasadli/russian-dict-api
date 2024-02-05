const Word = require('../models/word.model');
const User = require('../models/user.model');
const HttpError = require('../lib/error');
const getPaginationData = require('../utils/get-pagination-data');

exports.createWord = async function (data) {
  try {
    const word = await Word.findOne({ word: data.word });

    if (word) {
      return;
    }

    return await Word.create(data);
  } catch (error) {
    console.error('Mongoose error', error);
  }
};

exports.findWord = async function (query) {
  const words = await Word.find({ word: { $in: query } }).select('word translations');
  return words;
};

exports.getWord = async function (id) {
  const word = await Word.findById(id);

  if (!word) {
    throw new HttpError('Word not found', 404);
  }

  return word;
};

exports.getWordsList = async function (query = {}, currentUserId) {
  const sortBy = query.sortBy ?? 'rank';
  const dir = query.dir ?? 'asc';
  const userId = query.user ?? currentUserId;
  const packet = query.packet;
  const regex = query.search ? { $regex: query.search, $options: 'i' } : null;
  const user = await User.findById(userId);

  if (!user) {
    throw new HttpError('User not found', 404);
  }

  const find = {
    $and: [
      query.pos ? { partOfSpeech: query.pos } : {},
      query.search
        ? { $or: [{ word: regex }, { plainWord: regex }, { translations: { $elemMatch: regex } }] }
        : {},
      packet === 'knows'
        ? { knows: { $in: [user._id] } }
        : packet === 'learning'
        ? { knows: { $nin: [user._id] } }
        : {},
    ],
  };

  const total = await Word.find(find).countDocuments();
  const paginationData = getPaginationData({ page: query.page, limit: query.limit, total });

  const result = await Word.find(find)
    .select('rank word translations favorites learning knows plainWord')
    .limit(paginationData.limit)
    .skip(paginationData.skip)
    .sort({ [sortBy === 'abc' ? 'plainWord' : sortBy]: dir === 'asc' ? 1 : -1 });

  return { result, isLastPage: paginationData.is_last_page };
};

// exports.getQuestions = async function (query = {}, currentUserId) {
//   const level = query.limit;
//   const count = query.count ?? 25;
//   const user = await User.findById(currentUserId);

//   if (!user) {
//     throw new HttpError('Unauthorized', 403);
//   }

//   await Word.find({ knows: { $nin: [user._id] } });
// };
