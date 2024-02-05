const mongoose = require('mongoose');
const { z } = require('zod');

exports.ParamIdSchema = z.object({
  params: z.object({
    id: z.string().refine((value) => mongoose.isValidObjectId(value), 'Invalid id'),
  }),
});
