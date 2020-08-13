const router = require('express').Router()

/* validation */
const { validateBody } = require('../validation/validation')
const { schemasAuth } = require('../validation/schema/auth.validate')

/* include controller */
const authController = require('../controllers/auth.controller')

/* include helpers */
const { checkAuth } = require('../helpers/token.helper')

router.get('/', (req, res) => {
  res.json({
    name: 'tosaporn',
    status: true
  })
})

router.get('/account',
  checkAuth,
  authController.account)

router.post('/signin',
  validateBody(schemasAuth.signin),
  authController.signIn)

router.post('/signup',
  validateBody(schemasAuth.signup),
  authController.signUp)

router.post('/refresh_token',
  validateBody(schemasAuth.refresh_token),
  authController.refreshToken)

module.exports = router