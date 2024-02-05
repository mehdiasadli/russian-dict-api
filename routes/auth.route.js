const router = require('express').Router();
const ValidationMiddleware = require('../middleware/validation.middleware');
const { LoginSchema } = require('../schemas/auth.schema');
const authController = require('../controllers/auth.controller');

router.route('/login').post(ValidationMiddleware(LoginSchema), authController.login);

module.exports = router;
