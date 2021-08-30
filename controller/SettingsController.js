const Setting                          = require('../model/Setting');

exports.index = function(req, res){
    res.render('admin/settings/index');
};

exports.uploadlogo = function(req, res){
    
    var dataArray    = JSON.stringify({ 'logo' : req.file.filename });
    var settingArray = { 'setting_key' : 'appearance', 'setting_value' : dataArray };

    Setting.create(settingArray, function(err){

        if(err){
            
            console.log(err);
            return;

        } else {

          req.flash("success", "Setting updated successfully");
          res.redirect('/admin/settings');
        }

    });

}


exports.storeBanner = function(req, res){

    //Updating Video URL
    if(req.file){
        req.body.video_url = req.file.filename;
    }
    
    var settingArray = { 'setting_key' : 'appearance', 'setting_value' : JSON.stringify(req.body) };
    Setting.create(settingArray, function(err){

        if(err){
            
            console.log(err);
            return;

        } else {

          req.flash("success", "Setting updated successfully");
          res.redirect('/admin/settings');
        }

    });

}

exports.storeFooter = function(req, res){

    var settingArray = { 'setting_key' : 'appearance', 'setting_value' : JSON.stringify(req.body) };

    Setting.create(settingArray, function(err){

        if(err){
            
            console.log(err);
            return;

        } else {

          req.flash("success", "Setting updated successfully");
          res.redirect('/admin/settings');
        }

    });

}