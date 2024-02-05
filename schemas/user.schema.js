const { default: mongoose } = require('mongoose');
const { z } = require('zod');

exports.CreateUserSchema = z.object({
  body: z.object({
    firstName: z
      .string({ required_error: 'First name is required' })
      .min(2, 'First name must be larger than 2 characters')
      .regex(/^[a-zA-ZöğıəçşüÖĞIƏÇŞÜ-]+$/, 'Name can only include letters and hyphen'),
    lastName: z
      .string({ required_error: 'Last name is required' })
      .min(2, 'Last name must be larger than 2 characters')
      .regex(/^[a-zA-ZöğıəçşüÖĞIƏÇŞÜ-]+$/, 'Name can only include letters and hyphen'),
    username: z
      .string({ required_error: 'Username is required' })
      .min(4, 'Username must be larger than 4 characters')
      .regex(
        /^[a-zA-Z0-9_]+$/,
        'Username can only include alphanumerical characters and underscore'
      ),
    password: z
      .string({ required_error: 'Password is required' })
      .min(4, 'Password must be larger than 4 characters')
      .regex(/^\S+$/, 'Password can not include blank spaces'),
  }),
});

exports.ManageSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'Word id is required' })
      .refine((value) => mongoose.isValidObjectId(value), 'Invalid id'),
  }),
});

exports.TransferSchema = z.object({
  params: z.object({
    user_id: z
      .string({ required_error: 'User id is required' })
      .refine((value) => mongoose.isValidObjectId(value), 'Invalid id'),
    word_id: z
      .string({ required_error: 'User id is required' })
      .refine((value) => mongoose.isValidObjectId(value), 'Invalid id'),
    from: z.enum(['learning', 'knows']).default('learning'),
  }),
});
