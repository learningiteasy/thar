'use strict';
const dbConn = require('../config/db.config');
const moment = require('moment');
  
//Initialise Page
const UserDownloads = function(userdownload){

    this.resource_id         = userdownload.resource_id;
    this.name                = userdownload.name;
    this.email               = userdownload.email;
    this.phone               = userdownload.phone;
    
};


UserDownloads.getRequests = function(result){

    dbConn.query("select resources.title, user_downloads.* from user_downloads join resources on resources.id = user_downloads.resource_id", function (err, res) {
      result(res);
    });
};

UserDownloads.create = function (newDownload, result) {

    dbConn.query("INSERT INTO user_downloads set ?", newDownload, function (err, res) {
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
  

UserDownloads.delete = function(id, result){

  dbConn.query("DELETE FROM user_downloads WHERE id = ?", [id], function(err, res){

      if(err)
        result(err, null);
      else
        result(null);

  });
}

module.exports = UserDownloads;
