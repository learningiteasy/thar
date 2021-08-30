const express = require('express');

//Initiale Router
const router  = express.Router();

//Initiate Controller
const PublicController = require('../controller/PublicController');
const PageController   = require('../controller/PageController');
const { route } = require('./adminRoutes');
//Routes
router.get('/', PublicController.index);
router.get('/:slug', PageController.renderPage);
router.post('/contact/post_contact', PageController.postContact)


module.exports = router;
