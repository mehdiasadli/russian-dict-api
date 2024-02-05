const { z } = require('zod');
const { PartOfSpeech, Packets } = require('../lib/enums');
const { default: mongoose } = require('mongoose');

exports.GetWordsListSchema = z.object({
  query: z.optional(
    z.object({
      packet: z.optional(z.enum(['learning', 'knows'])),
      user: z.optional(z.string().refine((val) => mongoose.isValidObjectId(val), 'Invalid id')),
      search: z.optional(z.string().transform((val) => val.trim())),
      page: z.optional(
        z
          .string()
          .refine((val) => {
            const numeric = parseInt(val);
            if (isNaN(numeric) || !Number.isInteger(numeric) || numeric < 1) {
              return false;
            }

            return true;
          }, 'Page must be a positive integer')
          .transform((value) => parseInt(value))
      ),
      pos: z.optional(z.enum(Object.values(PartOfSpeech))),
      sortBy: z.optional(z.enum(['rank', 'abc'])),
      dir: z.optional(z.enum(['asc', 'desc'])),
      limit: z.optional(
        z
          .string()
          .refine((val) => {
            const numeric = parseInt(val);
            if (isNaN(numeric) || !Number.isInteger(numeric) || numeric < 10) {
              return false;
            }

            return true;
          }, 'Items per page must be a positive integer, greater than 9')
          .transform((value) => parseInt(value))
      ),
    })
  ),
});

exports.FindWordSchema = z.object({
  query: z.object({
    query: z.string({ required_error: 'Word query is required' }).transform((val) => {
      return val.split(',').map((v) => v.trim().toLowerCase());
    }),
  }),
});

exports.GetQuestionsSchema = z.object({
  query: z.object({
    level: z
      .enum(['1', '2', '3', '4', '5'], {
        invalid_type_error: 'Level must be one of those following values: 1, 2, 3, 4 or 5',
      })
      .transform((value) => parseInt(value)),
    count: z.optional(
      z
        .string()
        .refine((val) => {
          const numeric = parseInt(val);
          if (isNaN(numeric) || !Number.isInteger(numeric) || numeric < 1) {
            return false;
          }

          return true;
        }, 'Question count must be a positive integer')
        .transform((value) => parseInt(value))
    ),
  }),
});
