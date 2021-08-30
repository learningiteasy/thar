'use strict';
const dbConn = require('../config/db.config');
const moment = require('moment');
  
//Initialise Page
const JobRequests = function(jobrequest){

    this.career_id           = jobrequest.career_id;
    this.name                = jobrequest.name;
    this.email               = jobrequest.email;
    this.phone               = jobrequest.phone;
    
};


JobRequests.getRequests = function(result){

    dbConn.query("select careers.title, job_requests.* from job_requests join careers on careers.id = job_requests.career_id", function (err, res) {
      result(res);
    });
};

JobRequests.create = function (newCareer, result) {

    dbConn.query("INSERT INTO job_requests set ?", newCareer, function (err, res) {
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
  

JobRequests.delete = function(id, result){

  dbConn.query("DELETE FROM job_requests WHERE id = ?", [id], function(err, res){

      if(err)
        result(err, null);
      else
        result(null);

  });
}

module.exports = JobRequests;
