const express  = require('express');

//Initiale Router
const router  = express.Router();

//Initiate Controller
const PageController        = require('../controller/PageController');



//Routes
router.get('/', PageController.resource_index);
router.post('/postDownload', PageController.postDownload);

module.exports = router;
