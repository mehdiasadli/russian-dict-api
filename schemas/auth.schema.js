const { z } = require('zod');

exports.LoginSchema = z.object({
  body: z.object({
    username: z.string({ required_error: 'Username is required' }),
    password: z.string({ required_error: 'Password is requried' }),
  }),
});
