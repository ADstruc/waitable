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
  var NAME = 'waitableButton';

  var methods = {
    init: function(options) {
        var settings = $.extend({
            onClick: function() {
                throw 'You must define an onClick function which returns a jqXhr object';
            },
            baseClass: 'waitable-button',
            doneClass: 'waitable-button-done',
            failClass: 'waitable-button-fail',
            waitingClass: 'waitable-button-waiting'

        }, options);

        return this.each(function() {
            var $el = $(this),
                data = $el.data(NAME);

            if(!data) {
                data = {
                    inProgress: false
                };

                $el.data(NAME, data);
            }

            $el
            .addClass(settings.baseClass)
            .on('click', function(e) {
                // if we are waiting, do nothing on click
                if (true === data.inProgress) {
                    // @todo add an additional class if the user
                    //       clicks button while in waiting state
                    return;
                }

                 // put button into waiting state
                data.inProgress = true;
                $el.removeClass(settings.doneClass)
                   .removeClass(settings.failClass)
                   .addClass(settings.waitingClass);

                // call the user's callback and pass through context and event
                var xhr = settings.onClick.apply(this, e);
                
                if('object' !== typeof xhr || 
                   'function' !== typeof xhr.done || 
                   'function' !== typeof xhr.fail || 
                   'function' !== typeof xhr.always) {
                  $.error('Return from onClick handler does not implement promise methods');
                }
            
                xhr
                .done(function() {
                    if(data.deferred) {
                        data.deferred.resolveWith(arguments);
                    }

                    $el.addClass(settings.doneClass);
                })
                .fail(function() {
                    if(data.deferred) {
                        data.deferred.rejectWith(arguments);
                    }

                    $el.addClass(settings.failClass);
                })
                .always(function() {
                    $el.removeClass(settings.waitingClass);
                    data.inProgress = false;
                });
            });
        });
    },
    promise: function() {
        var data = $(this).data(NAME);

        if(!data) {
            $.error(NAME + ' has not been initialized on this element');
        }

        data.deferred = $.Deferred();

        return data.deferred.promise();
    }
  };

  $.fn[NAME] = function(method) {
    if(methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if('object' === typeof method || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' +  method + ' does not exist on jQuery.' + NAME);
    }
  };
})( jQuery );