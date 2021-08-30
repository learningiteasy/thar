const Contact        = require('../model/Contact.js');

exports.web_enquiries = function(req, res){

    Contact.getContacts(function(result) {
        res.render('admin/contact/web_enquiries', { web_enquiries : result });
    });
};


exports.web_enquiry_destroy = function(req, res){
    Contact.delete(req.params.id, function(err){

          if(err)
            console.log(err);
          else
            req.flash("success", "Request deleted successfully");
            Contact.getContacts(function(result) {
                res.render('admin/contact/web_enquiries', { web_enquiries : result });
            });
    });
};

