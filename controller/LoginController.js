const passport = require('passport');
const express      = require('express');
const app = express();

exports.login = function(req, res){
   res.render('admin/login', {errors: app.locals.errors});
};
