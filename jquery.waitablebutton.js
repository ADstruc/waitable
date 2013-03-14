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

    var showSpinner = function($el) {
        $el.find('.waitable-button-spinner-container').show();
    };

    var hideSpinner = function($el) {
        $el.find('.waitable-button-spinner-container').hide();
    };

    var appendSpinner = function($el, spinnerSize) {
        if(-1 === [16, 32, 64].indexOf(spinnerSize)) {
            $.error('Spinner size should be 16, 32 or 64');
        }

        if(!$el.find('.waitable-button-spinner-container').length) {
            $('<div class="waitable-button-spinner-container"></div>')
                .append('<div class="waitable-button-spinner waitable-button-spinner-' + spinnerSize +'"></div>')
                .appendTo($el);
        }
    };

    var methods = {
        init: function(options) {
            var settings = $.extend({
                onClick: function() {
                    throw 'You must define an onClick function which returns a jqXhr object';
                },
                doneClass: 'waitable-button-done',
                failClass: 'waitable-button-fail',
                spinnerSize: 16,
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

                // get some properties of the button
                var height = $el.outerHeight();
                var width = $el.outerWidth();
                var buttonContent = $el.html();
                var baseClass = $el.attr('class');

                // set button dimensions explicitly
                $el.css('height', height);
                $el.css('width', width);

                $el
                .addClass('waitable-button')
                .on('click', function(e) {
                    // if we are waiting, do nothing on click
                    if (true === data.inProgress) {
                        // @todo add an additional class if the user
                        //       clicks button while in waiting state
                        return;
                    }

                    // empty out button
                    $el.html('');

                    // append spinner 
                    appendSpinner($el, settings.spinnerSize);
                    
                    // show spinner
                    showSpinner($el);

                    // put button into waiting state
                    data.inProgress = true;
                    $el
                    .removeClass(settings.doneClass)
                    .removeClass(settings.failClass)
                    .addClass(baseClass);

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
                            data.deferred.resolveWith(this, arguments);
                        }

                        $el
                        .removeClass(baseClass)
                        .addClass(settings.doneClass);
                    })
                    .fail(function() {
                        if(data.deferred) {
                            data.deferred.rejectWith(this, arguments);
                        }

                        $el
                        .removeClass(baseClass)
                        .addClass(settings.failClass);
                    })
                    .always(function() {
                        hideSpinner($el);
                        $el.html(buttonContent);
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