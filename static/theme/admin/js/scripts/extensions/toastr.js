/*=========================================================================================
	File Name: toastr.js
	Description: Toastr notifications
	----------------------------------------------------------------------------------------
	Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
	Author: Pixinvent
	Author URL: hhttp://www.themeforest.net/user/pixinvent
==========================================================================================*/
$(document).ready(function () {

  $('#validate_msg li').each(function(i)
  {
    toastr.error($(this).attr('rel'));
  });

});
