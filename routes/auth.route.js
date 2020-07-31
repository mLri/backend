const router = require('express').Router()

/* validation */
const { validateBody } = require('../validation/validation')
const { schemasAuth } = require('../validation/schema/auth.validate')

/* include controller */
const authController = require('../controllers/auth.controller')

router.post('/signup',
  validateBody(schemasAuth.signup),
  authController.signUp)

module.exports = router