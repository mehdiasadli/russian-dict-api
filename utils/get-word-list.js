const getWordListFromPage = require('./get-word-list-from-page');

async function getWordList(list = 'all', options = {}) {
  const { start = 0, end = 5000 } = options;
  let count = start;

  const result = [];

  try {
    while (count <= end) {
      const out = await getWordListFromPage(count, list);
      count += 50;
      if (count % 100 === 0) {
        console.log(`${count} words have been added successfully...`);
      }
      result.push(out);
    }

    console.log('DONE...');
    return result;
  } catch (error) {
    console.error(error);
  }
}

module.exports = getWordList;
