const HttpError = require('../lib/error');

/**
 *
 * @param {*} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
module.exports = async function (err, req, res, next) {
  console.log(err);

  if (err instanceof HttpError) {
    res.status(err.status).json(err.json());
  } else {
    res.status(500).json({ message: 'Something went wrong', status: 500 });
  }
};
