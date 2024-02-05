const axios = require('axios');
const cheerio = require('cheerio');
const constants = require('../lib/constants');
const { PartOfSpeech, VerbalAspect, NounGender } = require('../lib/enums');

/**
 *
 * @param {cheerio.CheerioAPI} $
 */
function getCommonInfo($) {
  return {
    translations: getTranslations($),
    description: getDescription($),
    examples: getExamples($),
    related: getRelated($),
  };
}

/**
 *
 * @param {cheerio.CheerioAPI} $
 */
function getNounInfo($) {
  return {
    isAnimate: getIsAnimate($),
    gender: getGender($),
    nounPartner: getNounPartner($),
    nounDeclension: getNounDeclension($),
  };
}

/**
 *
 * @param {cheerio.CheerioAPI} $
 */
function getAdjectiveInfo($) {
  return {
    adverbPartner: getAdverbPartner($),
    shortForms: getShortForms($),
    degrees: getDegrees($),
  };
}

/**
 *
 * @param {cheerio.CheerioAPI} $
 */
function getVerbInfo($) {
  return {
    verbalAspect: getVerbalAspect($),
    aspectPair: getAspectPair($),
    verbConjugation: {
      past: getPastConjugation($),
      present: getPresentConjugation($),
    },
    imperativeMood: getImperative($),
    verbParticiples: getVerbParticiples($),
  };
}

/**
 *
 * @param {cheerio.CheerioAPI} $
 */
function getOverview($) {
  return $('.section.basics .overview');
}

/**
 *
 * @param {cheerio.CheerioAPI} $
 */
function getPOS($) {
  const overview = getOverview($);
  const mainDescription = $(overview).find('p').toArray()?.[0];

  if (!mainDescription) {
    return PartOfSpeech.o;
  }

  const txt = $(mainDescription).text();

  if (!txt) {
    return PartOfSpeech.o;
  }

  const pos = txt.split(',')?.[0]?.trim();

  if (!pos) {
    return PartOfSpeech.o;
  }

  switch (pos) {
    case PartOfSpeech.n:
      return PartOfSpeech.n;
    case PartOfSpeech.adj:
      return PartOfSpeech.adj;
    case PartOfSpeech.v:
      return PartOfSpeech.v;
    default:
      return PartOfSpeech.o;
  }
}

/**
 *
 * @param {cheerio.CheerioAPI} $
 */
function getVerbalAspect($) {
  const overview = getOverview($);
  const mainDescription = $(overview).find('p').toArray()?.[0];

  if (!mainDescription) {
    return null;
  }

  const txt = $(mainDescription).text();

  if (!txt) {
    return null;
  }

  const aspect = txt.split(',')?.[1]?.trim();

  switch (aspect) {
    case VerbalAspect.p:
      return VerbalAspect.p;
    case VerbalAspect.i:
      return VerbalAspect.i;
    case VerbalAspect.b:
      return VerbalAspect.b;
    default:
      return VerbalAspect.o;
  }
}

/**
 *
 * @param {cheerio.CheerioAPI} $
 */
function getAspectPair($) {
  const overview = getOverview($);
  const secondaryDescription = $(overview).find('p').toArray()?.[1];

  if (!secondaryDescription) {
    return null;
  }

  const partners = $(secondaryDescription).find('a')?.toArray();

  if (!partners || partners.length === 0) {
    return null;
  }

  return partners.map((pa) => $(pa).text()?.trim()?.toLowerCase());
}

const imperativeMap = {
  1: 's',
  2: 'p',
};

/**
 *
 * @param {cheerio.CheerioAPI} $
 */
function getImperative($) {
  const imperatives = $('.table-container.imperatives table tbody tr')?.toArray();

  if (!imperatives || imperatives.length <= 1) {
    return null;
  }

  const result = {
    s: '',
    p: '',
  };

  imperatives.forEach((im, i) => {
    if (i !== 0) {
      const w = $(im).find('td')?.text()?.trim()?.toLowerCase();

      if (w) {
        result[imperativeMap[i]] = w;
      }
    }
  });

  return result;
}

const pastConjMap = {
  1: 'm',
  2: 'f',
  3: 'n',
  4: 'p',
};

/**
 *
 * @param {cheerio.CheerioAPI} $
 */
function getPastConjugation($) {
  const pastConj = $('.table-container.past table tbody tr')?.toArray();

  if (!pastConj || pastConj.length <= 1) {
    return null;
  }

  const result = {
    m: '',
    f: '',
    n: '',
    p: '',
  };

  pastConj.forEach((pc, i) => {
    if (i !== 0) {
      const w = $(pc).find('td')?.text()?.trim()?.toLowerCase();

      if (w) {
        result[pastConjMap[i]] = w;
      }
    }
  });

  return result;
}

const presentConjMap = {
  0: 'fps',
  1: 'sps',
  5: 'tpp',
};

/**
 *
 * @param {cheerio.CheerioAPI} $
 */
function getPresentConjugation($) {
  const presentConj = $('.table-container.presfut table tbody tr')?.toArray();

  if (!presentConj || presentConj.length === 0) {
    return null;
  }

  const result = {
    fps: '',
    sps: '',
    tpp: '',
  };

  presentConj.forEach((pc, i) => {
    if (i === 0 || i === 1 || i === 5) {
      const row = $(pc).find('td')?.toArray();

      if (row && row.length === 2) {
        const [p, f] = row;

        let res = '';
        if ($(p).text()?.trim() === '-') {
          res = $(f).text()?.trim()?.toLowerCase();
        } else {
          res = $(p).text()?.trim()?.toLowerCase();
        }

        if (res) {
          result[presentConjMap[i]] = res;
        }
      }
    }
  });

  return result;
}

const particlesMap = {
  0: 'active_present',
  1: 'active_past',
  2: 'passive_present',
  3: 'passive_past',
  4: 'gerund_present',
  5: 'gerund_past',
};

/**
 *
 * @param {cheerio.CheerioAPI} $
 */
function getVerbParticiples($) {
  const particles = $('.participles .table-container table tbody tr')?.toArray();

  if (!particles || particles.length === 0) {
    return null;
  }

  const result = {
    active_present: '',
    active_past: '',
    passive_present: '',
    passive_past: '',
    gerund_present: '',
    gerund_past: '',
  };

  particles.forEach((pa, i) => {
    const el = $(pa).find('td')?.toArray()?.[0];

    if (el) {
      const p = $(el).find('p');
      let txt = '';
      if (p.length > 1) {
        txt = $(p)
          .toArray()
          ?.map((t) => $(t).text()?.trim()?.toLowerCase())
          ?.join(', ');
      } else {
        txt = p?.text()?.trim()?.toLowerCase();
      }

      if (txt) {
        result[particlesMap[i]] = txt;
      }
    }
  });

  return result;
}

/**
 *
 * @param {cheerio.CheerioAPI} $
 */
function getGender($) {
  const overview = getOverview($);
  const mainDescription = $(overview).find('p').toArray()?.[0];

  if (!mainDescription) {
    return NounGender.o;
  }

  const txt = $(mainDescription).text();

  if (!txt) {
    return NounGender.o;
  }

  const gender = txt.split(',')?.[1]?.trim();

  switch (gender) {
    case NounGender.m:
      return NounGender.m;
    case NounGender.f:
      return NounGender.f;
    case NounGender.n:
      return NounGender.n;
    default:
      return NounGender.o;
  }
}

/**
 *
 * @param {cheerio.CheerioAPI} $
 */
function getIsAnimate($) {
  const overview = getOverview($);
  const mainDescription = $(overview).find('p').toArray()?.[0];

  if (!mainDescription) {
    return false;
  }

  const txt = $(mainDescription).text();

  if (!txt) {
    return false;
  }

  const animacy = txt.split(',')?.[2]?.trim();

  switch (animacy) {
    case 'animate':
      return true;
    default:
      return false;
  }
}

/**
 *
 * @param {cheerio.CheerioAPI} $
 */
function getTranslations($) {
  const trs = $('.section.translations ul li')?.toArray();

  if (!trs || trs.length === 0) {
    return [];
  }

  return trs.map((tr) => {
    const t = $(tr).find('div.content p.tl')?.text()?.trim()?.toLowerCase();
    return t ?? '';
  });
}

/**
 *
 * @param {cheerio.CheerioAPI} $
 */
function getDescription($) {
  const desc = $('.section.usage div.content p')?.text();
  return desc ?? 'No Description';
}

/**
 *
 * @param {cheerio.CheerioAPI} $
 */
function getExamples($) {
  const examples = $('.section.sentences ul.sentences li.sentence')?.toArray();

  if (!examples || examples.length === 0) {
    return [];
  }

  return examples
    .map((ex) => {
      const ru = $(ex).find('span.ru')?.text()?.trim();
      const en = $(ex).find('span.tl span')?.text()?.trim();

      if (!ru || !en) {
        return undefined;
      }

      return {
        sentence: ru,
        translation: en,
      };
    })
    .filter((e) => e !== undefined);
}

/**
 *
 * @param {cheerio.CheerioAPI} $
 */
function getRelated($) {
  const related = $('.section.relateds2 ul li')?.toArray();

  if (!related || related.length === 0) {
    return [];
  }

  return related
    .map((re) => {
      const w = $(re).find('a')?.text()?.trim()?.toLowerCase();
      const t = $(re).find('span')?.text()?.trim()?.toLowerCase();

      if (!w || !t) {
        return undefined;
      }

      return {
        word: w,
        translation: t,
      };
    })
    .filter((e) => e !== undefined);
}

/**
 *
 * @param {cheerio.CheerioAPI} $
 */
function getNounPartner($) {
  const overview = getOverview($);
  const secondaryDescription = $(overview).find('p').toArray()?.[1];

  if (!secondaryDescription) {
    return null;
  }

  const txt = $(secondaryDescription).text();

  if (!txt || txt.includes('word')) {
    return null;
  }

  return txt.split(' ')?.[1]?.trim()?.toLowerCase() || null;
}

const declensionMap = {
  0: 'n',
  1: 'g',
  2: 'd',
  3: 'a',
  4: 'i',
  5: 'p',
};

/**
 *
 * @param {cheerio.CheerioAPI} $
 */
function getNounDeclension($) {
  const declension = $('.section.declension.noun table tbody tr')?.toArray();

  if (!declension || declension.length === 0) {
    return null;
  }

  const result = {
    n: [],
    g: [],
    a: [],
    d: [],
    i: [],
    p: [],
  };

  declension.forEach((de, i) => {
    const [s, p] = $(de).find('td')?.toArray();

    if (s && p) {
      const st = $(s).find('p')?.text();
      const pt = $(p).find('p')?.text();

      if (st && pt) {
        result[declensionMap[i]]?.push(st, pt);
      }
    }
  });

  return result;
}

/**
 *
 * @param {cheerio.CheerioAPI} $
 */
function getAdverbPartner($) {
  const overview = getOverview($);
  const secondaryDescription = $(overview).find('p').toArray()?.[1];

  if (!secondaryDescription) {
    return null;
  }

  const txt = $(secondaryDescription).text();

  if (!txt || txt.includes('word')) {
    return null;
  }

  return txt.split(' ')?.[1]?.trim()?.toLowerCase() || null;
}

const shortFormsMap = {
  0: 'm',
  1: 'f',
  2: 'n',
  3: 'p',
};

/**
 *
 * @param {cheerio.CheerioAPI} $
 */
function getShortForms($) {
  const shortForms = $('.section.adjective.shorts div table tbody tr')?.toArray();

  if (!shortForms || shortForms.length === 0) {
    return null;
  }

  const result = {
    m: '',
    f: '',
    n: '',
    p: '',
  };

  shortForms.forEach((sf, i) => {
    const s = $(sf).find('td');

    if (s) {
      const st = $(s).text();
      if (st) {
        result[shortFormsMap[i]] = st;
      }
    }
  });

  return result;
}

const degreeMap = {
  0: 'comparative',
  1: 'superlative',
};

/**
 *
 * @param {cheerio.CheerioAPI} $
 */
function getDegrees($) {
  const degrees = $('.section.comparatives div table tbody tr')?.toArray();

  if (!degrees || degrees.length === 0) {
    return {
      comparative: null,
      superlative: null,
    };
  }

  const result = {
    comparative: null,
    superlative: null,
  };

  degrees.forEach((de, i) => {
    const txt = $(de).find('td')?.text()?.trim()?.toLowerCase();

    if (txt) {
      result[degreeMap[i]] = txt;
    }
  });

  return result;
}

async function getWordData(link, { word, rank }) {
  try {
    const response = await axios.get(constants.BASE + link);
    const $ = cheerio.load(response.data);

    const pos = getPOS($);

    const common = getCommonInfo($);
    const specific =
      pos === PartOfSpeech.adj
        ? getAdjectiveInfo($)
        : pos === PartOfSpeech.n
        ? getNounInfo($)
        : pos === PartOfSpeech.v
        ? getVerbInfo($)
        : {};

    return {
      rank,
      word,
      plainWord: word.normalize('NFD').replace(/[\u0300-\u0305f]/g, ''),
      partOfSpeech: pos,
      source: constants.BASE + link,
      ...common,
      ...specific,
    };
  } catch (error) {
    console.error(error);
  }
}

module.exports = getWordData;
