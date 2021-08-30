//Created On : 02/12/2020
//Author     : Rajath Eynetech

'use strict';
const dbConn = require('../config/db.config');
const moment = require('moment');

//Initialise Menu
const Setting = function(setting){

    this.setting_key    = setting.setting_key;
    this.setting_value  = setting.setting_value;

};


//Menu Create
Setting.create = function (newSetting, result) {

  var sevalue = newSetting.setting_key;
  dbConn.query("Select * from settings where setting_key =  ?", newSetting.setting_key, function (err, res) {

      if(res.length <= 0){
        dbConn.query("INSERT INTO settings set ?", newSetting, function (err, res2) {
          if(err) {
            //console.log("error: ", err);
            result(err, null);
          }
          else{

            //console.log(res.insertId);
            result(null, res2.insertId);
          }
        });
      } else {
          
          // Collecting Data from existed array
          var existedArray    = JSON.parse(res[0].setting_value);
          // New data array
          var dataArray       = JSON.parse(newSetting.setting_value);

          for(var prop in dataArray) {
            existedArray[prop] = dataArray[prop];
          }

          //console.log(existedArray);

          dbConn.query("UPDATE settings set setting_value = ? WHERE setting_key = ?", [JSON.stringify(existedArray), newSetting.setting_key], function (err, res2) {
                if(err) {
                  result(err, null);
                }
                else{
                  result(null, res2.insertId);
                }
          });
      }


  });

    
  
};

Setting.Appearance = function(result){

  dbConn.query("Select * from settings where setting_key = 'appearance'", function (err, res) {

    if(res.length > 0)
      result(JSON.parse(res[0].setting_value));
    else
      result({});
  });

};
  

module.exports = Setting;