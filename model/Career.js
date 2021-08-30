'use strict';
const dbConn = require('../config/db.config');
const moment = require('moment');



//Date Formating
function formatDate(date) {
  return moment(date).format('DD MMMM, YYYY');
}

//Initialise Page
const Career = function(career){

    this.title           = career.title;
    this.content         = career.content;
      
};
  

Career.getCareers = function(result){

    dbConn.query("Select * from careers", function (err, res) {

      res = res.map(row => ({
        ...row,
        created_at: formatDate(row.created_at)
      }));
      result(res);
    });
};


Career.create = function (newCareer, result) {

  dbConn.query("INSERT INTO careers set ?", newCareer, function (err, res) {
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
Career.findById = function(id, result){

  dbConn.query("Select * from careers where id = ?",  id, function (err, res) {
      result(res[0]);
  });

};


Career.update = function (id, updateCareer, result) {

  dbConn.query("UPDATE careers set ? WHERE id = ?", [updateCareer, id], function (err, res) {
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

Career.delete = function(id, result){

  dbConn.query("DELETE FROM careers WHERE id = ?", [id], function(err, res){

      if(err)
        result(err, null);
      else
        result(null);

  });
}


module.exports = Career;