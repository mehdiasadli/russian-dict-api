const mongoose = require('mongoose');
const { PartOfSpeech, NounGender, VerbalAspect } = require('../lib/enums');

const WordSchema = new mongoose.Schema({
  rank: { type: Number, required: true, unique: true },
  word: { type: String, required: true },
  plainWord: { type: String, required: true },
  translations: { type: [String], default: [] },
  description: { type: String, default: '' },
  partOfSpeech: {
    type: String,
    enum: Object.values(PartOfSpeech),
    default: PartOfSpeech.o,
  },
  examples: {
    type: [
      {
        sentence: String,
        translation: String,
      },
    ],
    default: [],
  },
  related: { type: [{ word: String, translation: String }], default: [] },
  source: { type: String, required: true },
  // NOUN_ONLY
  isAnimate: Boolean,
  gender: {
    type: String,
    enum: Object.values(NounGender),
  },
  nounPartner: String,
  nounDeclension: {
    n: [String],
    g: [String],
    a: [String],
    d: [String],
    i: [String],
    p: [String],
  },
  // ADJ_ONLY
  adverbPartner: String,
  shortForms: {
    m: String,
    f: String,
    n: String,
    p: String,
  },
  degrees: {
    comparative: String,
    superlative: String,
  },
  // VERB_ONLY
  verbalAspect: {
    type: String,
    enum: Object.values(VerbalAspect),
  },
  aspectPair: [String],
  verbConjugation: {
    past: {
      m: String,
      f: String,
      n: String,
      p: String,
    },
    present: {
      fps: String,
      sps: String,
      tpp: String,
    },
  },
  imperativeMood: {
    s: String,
    p: String,
  },
  verbParticiples: {
    active_present: String,
    active_past: String,
    passive_present: String,
    passive_past: String,
    gerund_present: String,
    gerund_past: String,
  },
  // OTHER
  knows: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  },
});

module.exports = mongoose.model('Word', WordSchema);
