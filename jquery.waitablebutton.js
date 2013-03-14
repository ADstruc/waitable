/*
 * WaitableButton - jQuery Plugin
 *
 * Examples and documentation at: http://waitable.adstruc.com/
 *
 * Copyright (c) 2013 ADstruc Inc.
 *
 * Version: 0 (03/14/2013)
 * Requires: jQuery v1.5+
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

(function( $ ) {
  $.fn.waitableButton = function(options) {

    var waitingDataKey = 'waitable-button-waiting';

    var settings = $.extend({
        onClick: function() {
            throw 'You must define an onClick function which returns a jqXhr object';
        },
        doneClass: 'waitable-button-done',
        failClass: 'waitable-button-fail',
        waitingClass: 'waitable-button-waiting'

    }, options);

    return this.each(function() {

       $(this).on('click', function(e) {
           var $el = $(this);
           // if we are waiting, do nothing on click
           if (true === $el.data(waitingDataAttribute)) {
               // @todo add an additional class if the user
               //       clicks button while in waiting state
               return;
           }
           // put button into waiting state
           $el.data(waitingDataKey, true);
           // call the user's callback and pass through context and event
           var promise = settings.onClick.apply(this, e);
           // @todo check that has methods implemented by promise
           promise
            .done(function() {
                $el.addClass(settings.doneClass);
            })
            .fail(function() {
                $el.addClass(settings.failClass);
            })
            .always(function() {
                $el.removeClass(settings.doneClass);
                $el.removeClass(settings.failClass);
                $el.data(waitingDataKey, false);
            });
       });

    });

  };
})( jQuery );