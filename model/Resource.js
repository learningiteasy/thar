'use strict';
const dbConn = require('../config/db.config');
const moment = require('moment');



//Date Formating
function formatDate(date) {
  return moment(date).format('DD MMMM, YYYY');
}

//Initialise Page
const Resource = function(resource){

    this.title           = resource.title;
    this.content         = resource.content;
    this.downloadable    = resource.downloadable;
    this.banner          = resource.banner;
      
};
  

Resource.getResources = function(result){

    dbConn.query("Select * from resources", function (err, res) {

      res = res.map(row => ({
        ...row,
        created_at: formatDate(row.created_at)
      }));
      result(res);
    });
};


Resource.create = function (newResource, result) {

  dbConn.query("INSERT INTO resources set ?", newResource, function (err, res) {
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

//Find by ID
Resource.findById = function(id, result){

  dbConn.query("Select * from resources where id = ?",  id, function (err, res) {
      result(res[0]);
  });

};


Resource.update = function (id, updateResource, result) {

  dbConn.query("UPDATE resources set ? WHERE id = ?", [updateResource, id], function (err, res) {
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

Resource.delete = function(id, result){

  dbConn.query("DELETE FROM resources WHERE id = ?", [id], function(err, res){

      if(err)
        result(err, null);
      else
        result(null);

  });
}


module.exports = Resource;