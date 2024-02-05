const wordService = require('../services/word.service');

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.getWord = async function (req, res, next) {
  try {
    const response = await wordService.getWord(req.params.id);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.findWord = async function (req, res, next) {
  try {
    const response = await wordService.findWord(req.query.query);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.getWordsList = async function (req, res, next) {
  try {
    const response = await wordService.getWordsList(req.query, req.user.id);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
