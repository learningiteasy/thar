'use strict';
const dbConn = require('../config/db.config');
const moment = require('moment');

//Date Formating
function formatDate(date) {
  return moment(date).format('DD-MM-YYYY HH:mm a');
}

const User = function(user){

  this.first_name     = user.first_name;
  this.last_name      = user.last_name;
  this.email          = user.email;
  this.password       = user.password;
};

User.getAll = function(result){

  dbConn.query("Select * from users", function (err, res) {

      res = res.map(row => ({
          ...row,
          created_at: formatDate(row.created_at)
      }));
      result(res);
  });

};

User.findById = function(id, result){

  dbConn.query("Select * from users where id = ?",  id, function (err, res) {
      result(res[0]);
  });

};

User.findByEmail = function(email, result){
  dbConn.query("Select * from users where email = ?",  email, function (err, res) {
      if(err) {
        result(err);
      }
      else{
        result(res[0]);
      }
  });
}

User.create = function (newUser, result) {
  dbConn.query("INSERT INTO users set ?", newUser, function (err, res) {
    if(err) {
      //console.log("error: ", err);
      result(err, null);
    }
    else{
      //console.log(res.insertId);
      result(null, res.insertId);
    }
  });
};

User.update = function (id, updateUser, result) {
  dbConn.query("UPDATE users set ? WHERE id = ?", [updateUser, id], function (err, res) {
    if(err) {
      //console.log("error: ", err);
      result(err, null);
    }
    else{
      //console.log(res.insertId);
      result(null);
    }
  });
};


User.delete = function (id, result) {

  dbConn.query("DELETE FROM users WHERE id = ?", [id], function(err, res){

      if(err)
        result(err, null);
      else
        result(null);

  });


};

module.exports = User;
