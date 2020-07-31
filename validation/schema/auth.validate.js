const Joi = require('@hapi/joi');

module.exports = {
  schemasAuth: {
    signup: Joi.object({
      first_name: Joi.string().min(3).max(30).required(),
      last_name: Joi.string().min(3).max(30).required(),
      password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/).required(),
      username: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
    }),
    signin: Joi.object({
      password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/).required(),
      username: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
    }),
    refresh_token: Joi.object({
      refresh_token: Joi.string().required()
    })
  }
}