const jwt = require('jsonwebtoken');
const HttpError = require('../lib/error');

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
module.exports = async function (req, res, next) {
  try {
    const header = req.headers.authorization;
    const token = header?.split(' ')?.[1] || null;

    if (!token) {
      throw new Error();
    }

    const payload = jwt.verify(token, process.env.SECRET_KEY);
    req.user = payload;

    next();
  } catch (error) {
    next(new HttpError('Unauthorized', 401));
  }
};
