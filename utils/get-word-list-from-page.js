const axios = require('axios');
const cheerio = require('cheerio');
const constants = require('../lib/constants');
const getWordInfo = require('../utils/get-word-info');
const { createWord } = require('../services/word.service');

async function getWordListFromPage(start = 0, list = 'all') {
  try {
    const res = await axios.get(`${constants.BASE}/list/${list}?start=${start}`);
    const $ = cheerio.load(res.data);

    const words = $('table.wordlist tbody tr').toArray();

    const result = [];
    words.forEach(async (word) => {
      const [rank, w] = $(word).find('td').toArray();
      const link = $(w).find('a');

      const href = $(link).attr('href');

      if (href) {
        const out = await getWordInfo(href, {
          word: $(link).text(),
          rank: parseInt($(rank).text()),
        });
        result.push(out);

        await createWord(out);
      }
    });

    return result;
  } catch (error) {
    console.error('Something wrong happened on start number ' + start);
  }
}

module.exports = getWordListFromPage;
