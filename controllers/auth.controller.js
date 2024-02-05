const authService = require('../services/auth.service');

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.login = async function (req, res, next) {
  try {
    const response = await authService.login(req.body.username, req.body.password);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
