const Page                          = require('../model/Page');
const Resource                      = require('../model/Resource');
const Career                        = require('../model/Career');
const JobRequest                    = require('../model/JobRequest');
const UserDownload                  = require('../model/UserDownload');
const Contact                       = require('../model/Contact');

const nodemailer                    = require('nodemailer');

const reCAPTCHA = require('recaptcha2');

var recaptcha = new reCAPTCHA({

  siteKey: '6LfoT6waAAAAAPKnKE5KhQcxbB9_cL7xMjtNfmYO', 
  secretKey: '6LfoT6waAAAAAIILcfvW37xGo3haQ0JlkaVTZf6o',
  ssl: true
});

 

exports.index = function(req, res){

    Page.getPages(function(result) {
        res.render('admin/page/index', { pages : result })
    });
};

exports.create = function(req, res){

    res.render('admin/page/create',  { errors: [] });

};


exports.store = function(req, res) {

    req.body.banner_image = req.file.filename;
    const new_page        = new Page(req.body);
    Page.create(new_page, function(err){
        if(err){
            console.log(err);
            return;
        } else {

          req.flash("success", "Page created successfully");
          Page.getPages(function(result) {
            res.render('admin/page/index', { pages : result })
          });
        }
    });

};


//Edit Page
exports.edit = function(req, res){

    Page.findById(req.params.id, function(page){
        res.render('admin/page/edit', {errors: [], data:page });
    });

};

//Update Page
exports.update = function(req, res){
    
    if(req.file){  
        req.body.banner_image   = req.file.filename;
    } else {
        req.body.banner_image   = req.body.old_image; 
    }

    const update_page = new Page(req.body);
    
    Page.update(req.params.id, update_page, function(err){
        if(err){
            console.log(err);
            return;
        } else {
          req.flash("success", "page updated successfully");
          Page.getPages(function(result) {
            res.render('admin/page/index', { pages : result })
          });
        }
    });

};

exports.destroy = function(req, res){
    Page.delete(req.params.id, function(err){

          if(err)
            console.log(err);
          else
            req.flash("success", "page deleted successfully");
            Page.getPages(function(result) {
                res.render('admin/page/index', { pages : result })
            });
    });
};


exports.renderPage = function(req, res){
    
    Page.findBySlug(req.params.slug, function(page, err){

        if(err){
            console.log(err);
            return;
        } else {
            if(page != undefined)
                res.render('public/page', { page:page });
            else
                res.render('public/404');
        }

    });
    
};


exports.resource_index = function(req, res){

    Resource.getResources(function(result) {
        res.render('public/resources',  { resources: result, msg:'' });
    });

};

isValidEmail = () => function(email){

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());

};

exports.postDownload = function(req, res){

    const user_download        = new UserDownload(req.body);
    
    const { name, email, phone } = req.body
    if (name && email &&  phone && isValidEmail(email)) { 
        
        UserDownload.create(user_download, function(err){
            if(err){
                console.log(err);
                return;
            } else {
               
                Resource.findById(req.body.resource_id, function(resource){

                    var file = 'uploads/'+resource.downloadable;
                    res.download(file);

                });
                
            }
        });
    } else {

        Resource.getResources(function(result) {
            res.render('public/resources',  { resources: result, msg:'Please fill all fields!' });
        });

    }

};



exports.career_index = function(req, res){

    Career.getCareers(function(result) {
        res.render('public/careers',  { careers: result});
    });

};


exports.postCareer = function(req, res){

    const new_career        = new JobRequest(req.body);
    JobRequest.create(new_career, function(err){
        if(err){
            console.log(err);
            return;
        } else {

          req.flash("success", "Career created successfully");
          Career.getCareers(function(result) {
            res.render('public/careers',  { careers: result});
          });
        }
    });

};




exports.contact = function(req, res){

    let message = '';
    console.log(req.body.msg);
    if(req.query.msg){

        message = req.query.msg;
    }

    Page.getTitle('contact',function(result) {
                               
        res.render('public/contact',  { errors: [], page_heading:'Contact' , page_image : result.banner_image,  msg : message, meta_title:result.title });
                               
    });
};

exports.postContact = function(req, res){

    const { name, email, phone, message } = req.body
    if (name && email &&  phone && isValidEmail(email)) { 



                recaptcha.validateRequest(req)
                .then(function(){
                    
                    const new_contact        = new Contact(req.body);
                    Contact.create(new_contact, function(err){

                        if(err){

                           res.redirect('/contact?msg=failed');

                        } else {



                            var transporter = nodemailer.createTransport({
                
                                host: "mail.tharprocess.com",
                                port: 587,
                                tls:{
                                    rejectUnauthorized: false
                                },
                                auth: {

                                  user: "noreply@tharprocess.com",
                                  pass: "Qwerty@789"

                                }

                            });

                            var mailOptions = {
                                
                                from: 'noreply@tharprocess.com',
                                to: 'thar-info@tharprocess.com',
                                subject: 'An Enquiry From Website',
                                html: '<table border="1" style="border-collapse: collapse;"><tr><td align="center" colspan="2" style="background: #7ab759;color: #fff;font-size: 18px;">Tharprocess Website Enquiry</td></tr><tr><th align="left">Name: </th><td>'+name+'</td><tr><tr><th align="left">Email: </th><td>'+email+'</td><tr><tr><th align="left">Phone: </th><td>'+phone+'</td><tr><tr><th align="left">Message: </th><td>'+message+'</td><tr></table>'
                            };

                            transporter.sendMail(mailOptions, function(error, info){
                                if (error) {
                                    res.redirect('/contact?msg=failed');
                                } else {
                                    res.redirect('/contact?msg=success');
                                }
                            });


                          
                        }

                    });
                })
                .catch(function(errorCodes){
                    
                   res.redirect('/contact?msg=recaptcha');

                });


    } else {

        req.flash('error', 'Please fill all fields');
        res.render('public/contact',  { errors: [] });
    }


   

};
