const User                          = require('../model/User');
const bcrypt                        = require('bcrypt');


//User Listing
exports.index  = function(req, res){
  User.getAll(function(result) {
    res.render('admin/user/index', { users : result })
  });
}

//Create User
exports.create = function(req, res){
   res.render('admin/user/create', {errors: []});
};

//Edit User
exports.edit = function(req, res){

    User.findById(req.params.id, function(user){
        res.render('admin/user/edit', {errors: [], data:user });
    });

};

//Update User
exports.update = function(req, res){

    const update_user = new User(req.body);
    //Hashing the paswword
    bcrypt.genSalt(10, function(err, salt){

              bcrypt.hash(update_user.password, salt, function(err, hash){
              update_user.password = hash;
              User.update(req.params.id, update_user, function(err){
                  if(err){
                      console.log(err);
                      return;
                  } else {
                    req.flash("success", "User updated successfully");
                    res.redirect('/admin/users');
                  }
              });

          });

    });

};

exports.store = function(req, res) {

    const new_user   = new User(req.body);
    bcrypt.genSalt(10, function(err, salt){

              bcrypt.hash(new_user.password, salt, function(err, hash){
              new_user.password = hash;
              User.create(new_user, function(err){
                  if(err){
                      console.log(err);
                      return;
                  } else {

                    req.flash("success", "User created successfully");
                    res.redirect('/admin/users');
                  }
              });

          });

      });

};



exports.destroy = function(req, res){
    User.delete(req.params.id, function(err){

          if(err)
            console.log(err);
          else
            req.flash("success", "User deleted successfully");
            User.getAll(function(result) {
                res.render('admin/user/index', { users : result })
            });
    });
};




