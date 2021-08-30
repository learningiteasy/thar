const Resource       = require('../model/Resource.js');
const UserDownload   = require('../model/UserDownload.js');


exports.index = function(req, res){

    Resource.getResources(function(result) {
        res.render('admin/resource/index', { resources : result })
    });
};


exports.create = function(req, res){

    res.render('admin/resource/create',  { errors: [] });

};


exports.store = function(req, res) {

    const new_resource        = new Resource(req.body);
    req.files.forEach(function(file){
        new_resource[file.fieldname] = file.filename;
    });
    Resource.create(new_resource, function(err){
        if(err){
            console.log(err);
            return;
        } else {

          req.flash("success", "Resource created successfully");
          Resource.getResources(function(result) {
            res.render('admin/resource/index', { resources : result })
          });
        }
    });

};



//Edit Page
exports.edit = function(req, res){

    Resource.findById(req.params.id, function(page){
        res.render('admin/resource/edit', {errors: [], data:page });
    });

};

//Update Page
exports.update = function(req, res){
    
    const update_resource = new Resource(req.body);
    if(req.hasOwnProperty('files') && req.files.length > 0)
            req.files.forEach(function(file){
                update_resource[file.fieldname] = file.filename;
            });
    else
        delete update_resource.downloadable; 
        delete update_resource.banner; 

    Resource.update(req.params.id, update_resource, function(err){
        if(err){
            console.log(err);
            return;
        } else {
            
          req.flash("success", "Resource updated successfully");
          Resource.getResources(function(result) {
            res.render('admin/resource/index', { resources : result })
          });
        }
    });

};



exports.destroy = function(req, res){
    Resource.delete(req.params.id, function(err){

          if(err)
            console.log(err);
          else
            req.flash("success", "Resource deleted successfully");
            Resource.getResources(function(result) {
                res.render('admin/resource/index', { resources : result })
            });
    });
};


exports.user_downloads = function(req, res){

    UserDownload.getRequests(function(result) {
        res.render('admin/resource/user_downloads', { user_downloads : result });
    });
};


exports.user_downloads_destroy = function(req, res){

    UserDownload.delete(req.params.id, function(err){

          if(err)
            console.log(err);
          else
            req.flash("success", "Download deleted successfully");
            UserDownload.getRequests(function(result) {
                res.render('admin/resource/user_downloads', { user_downloads : result });
            });
    });
};
