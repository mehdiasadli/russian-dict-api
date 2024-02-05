const router = require('express').Router();
const AuthMiddleware = require('../middleware/auth.middleware');
const ValidationMiddleware = require('../middleware/validation.middleware');
const { ParamIdSchema } = require('../schemas/common.schema');
const { GetWordsListSchema, FindWordSchema } = require('../schemas/word.schema');
const wordController = require('../controllers/word.controller');

router
  .route('/')
  .get(AuthMiddleware, ValidationMiddleware(GetWordsListSchema), wordController.getWordsList);
router
  .route('/word')
  .get(ValidationMiddleware(FindWordSchema), AuthMiddleware, wordController.findWord);
router
  .route('/:id')
  .get(ValidationMiddleware(ParamIdSchema), AuthMiddleware, wordController.getWord);

module.exports = router;
