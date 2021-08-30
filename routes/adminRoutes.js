const express          = require('express');
const passport         = require('passport');
const multer           = require('multer');
const path             = require('path');
const { userValidationRules, validate } = require('./validators/userValidator.js');
const { loginValidationRules, loginvalidate } = require('./validators/loginValidator.js');
const { menuValidationRules, menuValidate } = require('./validators/menuValidator.js');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

const app              = express();

//Initiale Router
const router  = express.Router();

//Initiate Controller
const AdminController       = require('../controller/AdminController');
const LoginController       = require('../controller/LoginController');
const UserController        = require('../controller/UserController');
const MenuController        = require('../controller/MenuController');
const SettingsController    = require('../controller/SettingsController');
const PageController        = require('../controller/PageController');
const ResourceController    = require('../controller/ResourceController');
const CareerController      = require('../controller/CareerController');
const ContactController     = require('../controller/ContactController');


checkAuth = (req, res, next) =>
{ 
  if(app.locals.auth != 1)
    return res.redirect('/admin/login');
  else
    next();
}

//Routes
router.get('/', checkAuth, AdminController.index);
router.get('/login', LoginController.login);
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/admin/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }

      app.locals.auth = 1;
      return res.redirect('/admin');
    });
  })(req, res, next);
});

router.get('/logout', function(req, res, next) {
    app.locals.auth = 0;
    return res.redirect('/admin/login');
});




//Image Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
      console.log(file);
      cb(null, Date.now() + path.extname(file.originalname));
  }
});


const fileFilter = (req, file, cb) => {

  console.log(file.mimetype);

  if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'application/pdf') {
      cb(null, true);
  } else {
      cb(null, false);
  }
}


const upload          = multer({ storage: storage, fileFilter: fileFilter });
const videoupload     = multer({ storage: storage });
//End Image Upload

//User Module
router.get('/users', checkAuth, UserController.index);
router.get('/user/create', UserController.create);
router.get('/user/edit/:id', UserController.edit);
//Store with validation
router.post('/user/store',  userValidationRules(), validate, UserController.store);
router.post('/user/update/:id', userValidationRules(), validate, UserController.update);
router.post('/user/destroy/:id', userValidationRules(), validate, UserController.destroy);

//Menu Module
router.get('/menus', checkAuth, MenuController.index);
router.get('/menu/create', MenuController.create);
router.get('/menu/edit/:id', MenuController.edit);
router.get('/menu/destroy/:id', MenuController.destroy);

//MenuStore with validation
router.post('/menu/store',  menuValidationRules(), menuValidate, checkAuth, MenuController.store);
router.post('/menu/update/:id', menuValidationRules(), menuValidate, checkAuth, MenuController.update);

//Sub Menu
router.get('/menu/submenu/:parent', checkAuth, MenuController.submenu);

//Menu Page
router.get('/pages', checkAuth, PageController.index);
router.get('/page/create', PageController.create);
router.get('/page/edit/:id', PageController.edit);
router.get('/page/destroy/:id', PageController.destroy);

//PageStore with validation
router.post('/page/store',  upload.single('banner_image'), PageController.store);
router.post('/page/update/:id',  upload.single('banner_image'), PageController.update);

//Settings Module
router.get('/settings', checkAuth, SettingsController.index);
router.post('/setting/upload_logo', upload.single('logo'), checkAuth, SettingsController.uploadlogo);
router.post('/setting/store_banner', videoupload.single('video_url'), SettingsController.storeBanner);
router.post('/setting/store_footer', SettingsController.storeFooter);


//Resource Module
router.get('/resources', checkAuth, ResourceController.index);
router.get('/resource/create', ResourceController.create);
router.get('/resource/edit/:id', ResourceController.edit);
router.get('/resource/destroy/:id', ResourceController.destroy);
router.post('/resource/store', upload.any(), ResourceController.store);
router.post('/resource/update/:id', upload.any(), ResourceController.update);


//Career Module
router.get('/careers', checkAuth, CareerController.index);
router.get('/career/create', CareerController.create);
router.get('/career/edit/:id', CareerController.edit);
router.get('/career/destroy/:id', CareerController.destroy);
router.post('/career/store',  CareerController.store);
router.post('/career/update/:id', CareerController.update);


//Job Requests
router.get('/job_requests', checkAuth, CareerController.job_requests);
router.get('/job_request/destroy/:id', CareerController.job_destroy);



router.get('/web_enquiries', checkAuth, ContactController.web_enquiries);
router.get('/web_enquiries/destroy/:id', ContactController.web_enquiry_destroy);


//user_downloads

router.get('/user_downloads', checkAuth, ResourceController.user_downloads);
router.get('/user_downloads/destroy/:id', ResourceController.user_downloads_destroy);




router.post('/uploader', multipartMiddleware, function(req, res) {
    var fs = require('fs');

    fs.readFile(req.files.upload.path, function (err, data) {
        var newPath = __dirname + '/../static/uploads/' + req.files.upload.name;
        fs.writeFile(newPath, data, function (err) {
            if (err) console.log({err: err});
            else {
                html = "";
                html += "<script type='text/javascript'>";
                html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
                html += "    var url     = \"/static/uploads/" + req.files.upload.name + "\";";
                html += "    var message = \"Uploaded file successfully\";";
                html += "";
                html += "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
                html += "</script>";

                res.send(html);
            }
        });
    });
});


module.exports = router;
