const { body, validationResult } = require('express-validator')
const userValidationRules = () => {
  return [
    // username must be an email
    body('first_name', 'First Name is required').notEmpty(),
    body('last_name', 'Last Name is required').notEmpty(),
    body('email', 'Email is required').notEmpty(),
    body('email', 'Enter a valid Email').isEmail().trim(),
    body('password').notEmpty()
                    .withMessage('Password is required.')
  ]
}

const validate = (req, res, next) => {
  const validateErrors = validationResult(req)
  if (validateErrors.isEmpty()) {
    return next()
  }

  if(req.originalUrl == '/admin/user/store')
    res.render('admin/user/create', { errors: validateErrors.errors });
  else
    res.render('admin/user/edit', { errors: validateErrors.errors, data:req.body });

}

module.exports = {
  userValidationRules,
  validate,
}
