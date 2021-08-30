//Created On : 20/11/2020
//Author     : Rajath Eynetech

'use strict';
const dbConn = require('../config/db.config');
const moment = require('moment');

//Date Formating
function formatDate(date) {
  return moment(date).format('DD-MM-YYYY HH:mm a');
}

function formatStat(status) {
    if(status == 1)
      return 'Active';
    else
      return 'Inactive';
}

//Initialise Page
const Page = function(page){

  this.heading        = page.heading;
  this.content        = page.content;
  this.url_slug       = page.url_slug;
  this.banner_image   = page.banner_image;
  this.title          = page.title;
};




Page.getPages = function(result){

  dbConn.query("Select * from pages", function (err, res) {
    result(res);
  });

};


//Find by ID
Page.findById = function(id, result){

  dbConn.query("Select * from pages where id = ?",  id, function (err, res) {
      result(res[0]);
  });

};


Page.getTitle = function(slug, result){

  dbConn.query("Select * from pages where url_slug = ?",  slug, function (err, res) {
    result(res[0]);
  });

};




//Find By Slug
Page.findBySlug = function(slug, result){

  dbConn.query("Select * from pages where url_slug = ?",  slug, function (err, res) {
      result(res[0]);
  });

};


//Page Create
Page.create = function (newPage, result) {

  dbConn.query("INSERT INTO pages set ?", newPage, function (err, res) {
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

//Page Update
Page.update = function (id, updatePage, result) {
  dbConn.query("UPDATE pages set ? WHERE id = ?", [updatePage, id], function (err, res) {
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

//Page Delete
Page.delete = function(id, result){

  dbConn.query("DELETE FROM pages WHERE id = ?", [id], function(err, res){

      if(err)
        result(err, null);
      else
        result(null);

  });
}

module.exports = Page;
