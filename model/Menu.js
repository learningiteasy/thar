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

//Initialise Menu
const Menu = function(menu){

  this.name           = menu.name;
  this.url            = menu.url;
  this.parent_id      = menu.parent_id;
  this.status         = menu.status;
};

//Header Menu
Menu.publicTree = function(result){

  let k = 1;
  dbConn.query("Select * from menus where parent_id = 0", function (err, res) {

    res.forEach(function(item, index){

        dbConn.query("Select * from menus where parent_id = ?", item.id, function (err, res2) {
            res[index]['sublime'] = res2;
            if(res.length == parseInt(k)){
              result(res);
            }
            k = parseInt(k)+parseInt(1);
        });
      
    });
  });

};

//Menu Tree
Menu.getTree = function(result){

  let k = 1;
  dbConn.query("Select * from menus where parent_id = 0", function (err, mainmenu) {

    mainmenu.forEach(function(item, index){

        dbConn.query("Select * from menus where parent_id = ?", item.id, function (err, submenu) {

            submenu = submenu.map(row => ({
              ...row,
              status:formatStat(row.status),
              created_at: formatDate(row.created_at)
            }));
            
            mainmenu[index]['sublime'] = submenu;

            if(mainmenu.length == parseInt(k)){

              mainmenu = mainmenu.map(row => ({
                ...row,
                status:formatStat(row.status),
                created_at: formatDate(row.created_at)
                
              }));

              result(mainmenu);
            }
            k = parseInt(k)+parseInt(1);
        });
      
    });
 

  });

};

//FindById
Menu.findById = function(id, result){

  dbConn.query("Select * from menus where id = ?",  id, function (err, res) {
      result(res[0]);
  });

};

//Menu Create
Menu.create = function (newMenu, result) {

  dbConn.query("INSERT INTO menus set ?", newMenu, function (err, res) {
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

//Menu Update
Menu.update = function (id, updateMenu, result) {
  dbConn.query("UPDATE menus set ? WHERE id = ?", [updateMenu, id], function (err, res) {
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

//Menu Delete
Menu.delete = function(id, result){

  dbConn.query("DELETE FROM menus WHERE id = ?", [id], function(err, res){

      if(err)
        result(err, null);
      else
        result(null);

  });
}

module.exports = Menu;
