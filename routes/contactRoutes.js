const express  = require('express');

//Initiale Router
const router  = express.Router();

//Initiate Controller
const PageController        = require('../controller/PageController');


//Routes
router.get('/', PageController.contact);


module.exports = router;
