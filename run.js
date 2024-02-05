const connect = require('./config/db.config');
const getWordList = require('./utils/get-word-list');

module.exports = async () => {
  try {
    await connect();
    await getWordList('all', { start: 0, end: 10_000 });
  } catch (error) {
    console.error(error);
  }
};
