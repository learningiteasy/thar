const Menu                          = require('../model/Menu');
const bcrypt                        = require('bcrypt');


//Menu Listing
exports.index  = function(req, res){
  Menu.getTree(function(result) {
    res.render('admin/menu/index', { menus : result })
  });
}

//Create Menu
exports.create = function(req, res){
   let parent_id = 0;
   res.render('admin/menu/create', {errors: [], parent_id:parent_id });
};

//Edit Menu
exports.edit = function(req, res){

    Menu.findById(req.params.id, function(menu){
        res.render('admin/menu/edit', {errors: [], data:menu });
    });

};

//Update Menu
exports.update = function(req, res){

    const update_menu = new Menu(req.body);
    
    Menu.update(req.params.id, update_menu, function(err){
        if(err){
            console.log(err);
            return;
        } else {
          req.flash("success", "Menu updated successfully");
          Menu.getTree(function(result) {
            res.render('admin/menu/index', { menus : result })
          });
        }
    });

};

exports.destroy = function(req, res){
    Menu.delete(req.params.id, function(err){

          if(err)
            console.log(err);
          else
            req.flash("success", "Menu deleted successfully");
            Menu.getTree(function(result) {
              res.render('admin/menu/index', { menus : result })
            });
    });
};

exports.submenu = function(req, res){
  res.render('admin/menu/create', {errors: [], parent_id:req.params.parent });
}

exports.store = function(req, res) {

    const new_menu   = new Menu(req.body);
    Menu.create(new_menu, function(err){
        if(err){
            console.log(err);
            return;
        } else {

          req.flash("success", "Menu created successfully");
          Menu.getTree(function(result) {
            res.render('admin/menu/index', { menus : result })
          });
        }
    });

};
