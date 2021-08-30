const { body, validationResult } = require('express-validator')
const menuValidationRules = () => {
  return [
    // menuname must be an email
    body('name', 'Name is required').notEmpty(),
    body('url', 'Url is required').notEmpty(),
    body('status', 'Status required').notEmpty()
  ]
}

const menuValidate = (req, res, next) => {
  const validateErrors = validationResult(req)
  if (validateErrors.isEmpty()) {
    return next()
  }

  if(req.originalUrl == '/admin/menu/store')
    res.render('admin/menu/create', { errors: validateErrors.errors });
  else
    res.render('admin/menu/edit', { errors: validateErrors.errors, data:req.body });

}

module.exports = {
  menuValidationRules,
  menuValidate,
}
