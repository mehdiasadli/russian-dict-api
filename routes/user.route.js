const router = require('express').Router();
const AuthMiddleware = require('../middleware/auth.middleware');
const ValidationMiddleware = require('../middleware/validation.middleware');
const { ParamIdSchema } = require('../schemas/common.schema');
const { CreateUserSchema, ManageSchema, TransferSchema } = require('../schemas/user.schema');
const userController = require('../controllers/user.controller');

router
  .route('/')
  .post(ValidationMiddleware(CreateUserSchema), userController.createUser)
  .get(AuthMiddleware, userController.getUsers);
router
  .route('/:id')
  .get(ValidationMiddleware(ParamIdSchema), AuthMiddleware, userController.getUser)
  .put(ValidationMiddleware(ParamIdSchema), AuthMiddleware, userController.updateUser)
  .delete(ValidationMiddleware(ParamIdSchema), AuthMiddleware, userController.deleteUser);
router
  .route('/:id/manage')
  .put(ValidationMiddleware(ManageSchema), AuthMiddleware, userController.manage);
router
  .route('/:user_id/:word_id/:from')
  .put(ValidationMiddleware(TransferSchema), AuthMiddleware, userController.transfer);

module.exports = router;
