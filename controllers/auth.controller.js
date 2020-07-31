/* include module */
const bcrypt = require('bcrypt')
const { verify } = require('jsonwebtoken')

/* include models */
const User = require('../models/user.model')

/* include helpers */
const { createAccessToken, createRefreshToken } = require('../helpers/token.helper')

module.exports.signUp = async (req, res) => {
  try {
    const { first_name, last_name, username, password } = req.body

    /* check exists user */
    const user = await User.findOne({ username }).lean()
    if (user) throw 'user has already exists!'

    /* hash password */
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    /* create new user */
    const new_user = new User({
      first_name,
      last_name,
      username,
      password: hashPassword
    })

    const create_user = await new_user.save()

    res.json(create_user)
  } catch (error) {
    res.status(400).json({ error_status: true, message: error })
  }
}

module.exports.signIn = async (req, res) => {
  try {
    const { username, password } = req.body

    /* check user */
    const user = await User.findOne({ username }).lean()
    if (!user) throw 'username or password was wrong!'

    /* check password */
    const comparePassword = await bcrypt.compare(password, user.password)
    if (!comparePassword) throw 'username or password was wrong!'

    /* genarate access token */
    const access_token = createAccessToken({
      user_id: user._id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name
    })

    /* genarate refresh token */
    const refresh_token = createRefreshToken({ user_id: user._id })

    res.json({
      access_token,
      refresh_token,
      username: user.username
    })
  } catch (error) {
    res.status(400).json({ error_status: true, message: error })
  }
}

module.exports.refreshToken = async (req, res) => {
  try {
    let refresh_token = req.body.refresh_token
    if (!refresh_token) throw 'refresh_token not found!'

    const payload = verify(refresh_token, process.env.REFRESH_TOKEN_SECRET)
    if (!payload) throw 'can not verify refresh_token!'

    /* token is valid, check user exist */
    const user = await User.findOne({ _id: payload.user_id }).lean()
    if (!user) throw 'user not found!'

    /* genarate access token */
    const access_token = createAccessToken({
      user_id: user._id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name
    })

    /* genarate refresh token */
    refresh_token = createRefreshToken({ user_id: user._id })

    res.json({ 
      access_token,
      refresh_token,
      username: user.username,
    })
  } catch (error) {
    res.status(400).json({ error_status: true, message: error })
  }
}

module.exports.account = async (req, res) => {
  try {
    const { user_id } = req.user

    const user = await User.findOne({ _id: user_id })
    if (!user) throw 'not found user!'

    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ error_status: true, message: error })
  }
}