const router = require('express').Router()

/* include route */
const auth_route = require('./auth.route')

router.use('/auth', auth_route)

module.exports = router