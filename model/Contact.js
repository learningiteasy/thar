'use strict';
const dbConn = require('../config/db.config');
const moment = require('moment');



//Date Formating
function formatDate(date) {
  return moment(date).format('DD MMMM, YYYY');
}

//Initialise Page
const Contact = function(contact){

    this.name          = contact.name;
    this.email         = contact.email;
    this.phone         = contact.phone;
    this.message       = contact.message;
      
};
  

Contact.getContacts = function(result){

    dbConn.query("Select * from contacts", function (err, res) {

      res = res.map(row => ({
        ...row,
        created_at: formatDate(row.created_at)
      }));
      result(res);
    });
};


Contact.create = function (newcontact, result) {

  dbConn.query("INSERT INTO contacts set ?", newcontact, function (err, res) {
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
Contact.findById = function(id, result){

  dbConn.query("Select * from contacts where id = ?",  id, function (err, res) {
      result(res[0]);
  });

};


Contact.update = function (id, updatecontact, result) {

  dbConn.query("UPDATE contacts set ? WHERE id = ?", [updatecontact, id], function (err, res) {
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

Contact.delete = function(id, result){

  dbConn.query("DELETE FROM contacts WHERE id = ?", [id], function(err, res){

      if(err)
        result(err, null);
      else
        result(null);

  });
}


module.exports = Contact;