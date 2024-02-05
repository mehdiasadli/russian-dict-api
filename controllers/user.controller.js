const userService = require('../services/user.service');

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
exports.createUser = async function (req, res, next) {
  try {
    const response = await userService.createUser(req.body);
    res.status(201).json(response);
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
exports.updateUser = async function (req, res, next) {
  try {
    const response = await userService.updateUser(req.params.id, req.body);
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
exports.manage = async function (req, res, next) {
  try {
    const response = await userService.manage(req.user.id, req.params.id);
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
exports.transfer = async function (req, res, next) {
  try {
    const response = await userService.transfer(
      req.params.user_id,
      req.params.word_id,
      req.params.from
    );
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
exports.deleteUser = async function (req, res, next) {
  try {
    await userService.deleteUser(req.params.id);
    res.status(200).json({ message: 'User deleted' });
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
exports.getUser = async function (req, res, next) {
  try {
    const response = await userService.getUser(req.params.id);
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
exports.getUsers = async function (req, res, next) {
  try {
    const response = await userService.getUsers();
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
