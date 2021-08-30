const express          = require('express');
const path             = require('path');
const bodyParser       = require('body-parser');
const flash            = require('connect-flash');
const session          = require('express-session');
const adminRoutes      = require('./routes/adminRoutes');
const pageRoutes       = require('./routes/pageRoutes');
const resourceRoutes   = require('./routes/resourceRoutes');
const careerRoutes     = require('./routes/careerRoutes');
const contactRoutes    = require('./routes/contactRoutes');

const Menu             = require('./model/Menu');
const Page             = require('./model/Page');
const Setting          = require('./model/Setting');
const Resource         = require('./model/Resource');
const passport         = require('passport');
const unless           = require('express-unless');

//Initiate App
const app     = express();


//Passport Config

require('./config/Authenticate')(passport);


//Passport Middleware
//Express Session

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


//View Templates
app.engine('ejs', require('express-ejs-extend')); // add this line
app.set('views', path.join(__dirname, 'resources'));
app.set('view engine', 'ejs');

//Set Public path
app.use("/static", express.static(__dirname + '/static'));
app.use("/uploads", express.static(__dirname + '/uploads'));
app.use("/node_modules", express.static(__dirname + '/node_modules'));


//Express Messages Middleware
app.use(flash());


app.use(function (req, res, next) {
  res.locals.messages  = require('express-messages')(req, res);
  next();
});


//Populating Header Menu
app.use(function (req, res, next) {
  Menu.publicTree(function(result) {
    res.locals.publicMenu = result;
    next();
  });
});

app.use(function (req, res, next) {
  Page.getTitle(req.url.slice(1),function(result) {

    if(result){
      res.locals.meta_title   = result.title;
      res.locals.page_heading = result.heading;
      res.locals.page_image   = result.banner_image;

    } else {
      res.locals.meta_title   = '';
      res.locals.page_heading = '';
      res.locals.page_image   = '';
    }
    next();
  });
});



//Populating Settings
app.use(function (req, res, next) {
  Setting.Appearance(function(result) {
    res.locals.Appearance = result;
    next();
  });
});

//Populating Settings
app.use(function (req, res, next) {
  Resource.getResources(function(result) {

    if(result.length > 0){
      res.locals.Downloadables = result;
    } else {
      res.locals.Downloadables = [];
    }


    next();
  });
});



//GROUP APP ROUTES
pageRoutes.unless    = unless;
app.use('/', pageRoutes.unless({ path: ['/admin','/resources','/careers','/contact']}));
app.use('/admin', adminRoutes);
app.use('/resources', resourceRoutes);
app.use('/careers', careerRoutes);
app.use('/contact', contactRoutes);

// Handle 404 - Keep this as a last route
app.use(function(req, res, next) {
  res.status(404);
  res.render('public/404');
});


//Listening Server
app.listen(3005, function(){
  console.log('Server is working on port 3005');
});

