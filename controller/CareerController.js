const Career        = require('../model/Career.js');
const JobRequest    = require('../model/JobRequest.js');

exports.index = function(req, res){

    Career.getCareers(function(result) {
        res.render('admin/career/index', { careers : result })
    });
};


exports.create = function(req, res){

    res.render('admin/career/create',  { errors: [] });

};


exports.store = function(req, res) {

    const new_career        = new Career(req.body);
    Career.create(new_career, function(err){
        if(err){
            console.log(err);
            return;
        } else {

          req.flash("success", "Career created successfully");
          Career.getCareers(function(result) {
            res.render('admin/career/index', { careers : result })
          });
        }
    });

};



//Edit Page
exports.edit = function(req, res){

    Career.findById(req.params.id, function(page){
        res.render('admin/career/edit', {errors: [], data:page });
    });

};

//Update Page
exports.update = function(req, res){
    
    const update_career = new Career(req.body);
    Career.update(req.params.id, update_career, function(err){
        if(err){
            console.log(err);
            return;
        } else {
          req.flash("success", "Career updated successfully");
          Career.getCareers(function(result) {
            res.render('admin/career/index', { careers : result })
          });
        }
    });

};


exports.destroy = function(req, res){
    Career.delete(req.params.id, function(err){

          if(err)
            console.log(err);
          else
            req.flash("success", "Career deleted successfully");
            Career.getCareers(function(result) {
                res.render('admin/career/index', { careers : result })
            });
    });
};

exports.job_requests = function(req, res){

    JobRequest.getRequests(function(result) {
        res.render('admin/career/job_requests', { job_requests : result });
    });
};


exports.job_destroy = function(req, res){
    JobRequest.delete(req.params.id, function(err){

          if(err)
            console.log(err);
          else
            req.flash("success", "Request deleted successfully");
            JobRequest.getRequests(function(result) {
                res.render('admin/career/job_requests', { job_requests : result });
            });
    });
};

