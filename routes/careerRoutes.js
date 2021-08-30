const express  = require('express');

//Initiale Router
const router  = express.Router();

//Initiate Controller
const PageController        = require('../controller/PageController');



//Routes
router.get('/', PageController.career_index);
router.post('/postCareer', PageController.postCareer);


module.exports = router;
