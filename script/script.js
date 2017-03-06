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