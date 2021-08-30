const { body, validationResult } = require('express-validator')
const loginValidationRules = () => {
  return [
    // loginname must be an email
    body('username', 'Username is required').notEmpty(),
    body('username', 'Enter a valid Email').isEmail().trim(),
    body('password', 'Password is required').notEmpty()
  ]
}

const loginvalidate = (req, res, next) => {
  const validateErrors = validationResult(req)
  if (validateErrors.isEmpty()) {
    return next();
  }
  res.render('admin/login', { errors: validateErrors.errors });
}

module.exports = {
  loginValidationRules,
  loginvalidate,
}
