const HttpError = require('../lib/error');

/**
 *
 * @param {import('zod').AnyZodObject} schema
 * @returns {(req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => void}
 */
module.exports = function (schema) {
  return async function (req, res, next) {
    try {
      const result = await schema.safeParseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      if (result.error) {
        throw result.error;
      }

      req.body = result.data.body ?? req.body;
      req.params = result.data.params ?? req.params;
      req.query = result.data.query ?? req.query;

      next();
    } catch (error) {
      next(new HttpError(error?.errors?.[0]?.message, 400));
    }
  };
};
