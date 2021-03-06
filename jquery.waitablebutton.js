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
        if(!$el.find('.waitable-button-spinner-container').length) {
            $('<div class="waitable-button-spinner-container"></div>')
                .append('<div class="waitable-button-spinner waitable-button-spinner-' + spinnerSize +'"></div>')
                .appendTo($el);
        }
    };

    var handleButtonClick = function($el, settings, data, buttonContent, baseClass) {
        $el.on('click', function(e) {
            // if we are waiting, do nothing on click
            if (true === data.inProgress || true === data.disabled) {
                // @todo add an additional class if the user
                //       clicks button while in waiting state
                return;
            }

            var height = 'border-box' === $el.css('box-sizing') ? $el.outerHeight() : $el.height();
            var width = 'border-box' === $el.css('box-sizing') ? $el.outerWidth() : $el.width();

            // set button dimensions explicitly
            $el.css('height', height)
                .css('width', width);

            // empty out button
            $el.html('');

            // append spinner
            appendSpinner($el, settings.spinnerSize);

            // show spinner
            showSpinner($el);

            // put button into waiting state
            data.inProgress = true;
            $el.removeClass(settings.doneClass)
                .removeClass(settings.failClass)
                .addClass(baseClass);

            // call the user's callback and pass through context and event
            var xhr = settings.onClick.call(this, e);

            if(false === xhr) {
                cleanup($el, data);
                $el.html(buttonContent);

                return;
            } else if('object' !== typeof xhr ||
               'function' !== typeof xhr.done ||
               'function' !== typeof xhr.fail ||
               'function' !== typeof xhr.always) {
              $.error('Return from onClick handler does not implement promise methods');
            }

            xhr.done(function() {
                    if(data.deferred) {
                        data.deferred.resolveWith($el.get(0), arguments);
                    }

                    if(settings.doneClass) {
                        $el.removeClass(baseClass)
                            .addClass(settings.doneClass);
                    }

                    if(settings.doneText) {
                        $el.html(settings.doneText)
                    } else {
                        $el.html(buttonContent);
                    }

                    if(true === settings.disabledOnDone) {
                        data.disabled = true;
                    }
                })
                .fail(function() {
                    if(data.deferred) {
                        data.deferred.rejectWith($el.get(0), arguments);
                    }

                    if(settings.failClass) {
                        $el.removeClass(baseClass)
                            .addClass(settings.failClass);
                    }

                    if(settings.failText) {
                        $el.html(settings.failText)
                    } else {
                        $el.html(buttonContent);
                    }
                })
                .always(function() {
                    cleanup($el, data);
                });
        });
    };

    var cleanup = function($el, data) {
        hideSpinner($el);
        data.inProgress = false;
        $el.css('height', '');
        $el.css('width', '');
    };

    var methods = {
        init: function(options) {
            var settings = $.extend({
                onClick: function() {
                    throw 'You must define an onClick function which returns a jqXhr object';
                },
                baseClass: '',
                doneClass: '',
                failClass: '',
                disabledOnDone: false,
                spinnerSize: 16
            }, options);

            // validate spinnerSize option
            if ($.inArray(settings.spinnerSize, [16, 32, 64])) {
                $.error('Spinner size should be 16, 32 or 64');
            }

            return this.each(function() {
                var $el = $(this),
                    data = $el.data(NAME),
                    buttonContent = $el.html(),
                    baseClass = $el.attr('class');

                if(!data) {
                    data = {
                        inProgress: false
                    };

                    $el.data(NAME, data);
                }

                // set waitable-button class
                $el.addClass('waitable-button');

                // handle button click
                handleButtonClick($el, settings, data, buttonContent, baseClass);
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
