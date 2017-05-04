/*global $, jQuery*/


$(document).ready(function () {
  'use strict';

/*event.preventDefault() gor IE9(event.returnValue = false)*/
  $.fn.eventPreventDefaultSafe = function () {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  };
/*-------------------------------------------------------*/


});

/*_____etc hints_____*/
/*jQuery Datepicker(datepicker-ru.js - is needed from jQueryUI i18n dir)*/
/*
  $.datepicker.setDefaults($.datepicker.regional[""]);
  $.datepicker.setDefaults($.datepicker.regional["ru"]);

  $(function () {
    $('.input_dater').datepicker({
      dateFormat: 'dd MM yy',
      minDate: new Date()
    });
  });
*/
