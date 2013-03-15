Waitable Button
========

End button mashing for good

Ever had this problem?: A user clicks a button, kicking off some background processing before they can continue. In order to encourage patience and reassure them that something is actually happening, you've implemented spinners and progress bars. But, your button still says click me, so your user get's bored and starts mashing it like Whack-a-Mole. Ugh.

Well, we came up with a solution, and we're calling it the Waitable Button.

The Waitable button is a jQuery plugin that allows you to quickly create a unified waiting state look for your buttons that trigger AJAX actions. By simply providing a function which returns a jqXhr or jQuery promise, waitable button takes care of the boilerplate of setting up waiting indicators, double submit prevention, and so much more!*


*Actually, that's all it does. But quick, [watch this!](http://www.youtube.com/watch?v=6lCGzO-6Zgc)

### Basic Setup
The most basic setup only requires that you provide an object with an onClick function. This function must return a jQuery promise or deferred (which waitable button binds onto).
```javascript
jQuery('#my-button').waitableButton({
    onClick: function() {
        return jQuery.ajax({
            url: 'http://jsonip.com/'
        });
    }
});
```

Likely, you need to do more than just fire off an AJAX request (perhaps consume the returned data?). You can do all of this inside the onClick function and as long as you alway return the jqXhr/promise waitable button will still be able to handle the button state changes.

```javascript
jQuery('#my-button').waitableButton({
    onClick: function() {
        var req = jQuery.ajax({
            url: 'http://jsonip.com/'
        });
        
        req.done(function(resp) {
          alert('Your IP address is ' + resp.ip);
        });
        
        req.fail(function() {
          alert('Oops! Something went wrong!');
        });
        
        return req;
    }
});
```

### Promise
If you'd like to take advantage of [jQuery's promise](http://api.jquery.com/jQuery.Deferred/) support, you can use the promise method on waitableButton. This will return a promise that proxies for the promise from the onClick function. Since the onClick function has not been called at this point, it is not possible to return the jqXhr/promise returned by that function. If you need direct access to the jqXhr object, you will need to do that from inside the onClick function. For most uses, the returned promise will behave the same as attached callbacks onto a jqXhr would.

```javascript
jQuery('#my-button').waitableButton({
    onClick: function() {
        return jQuery.ajax({
            url: 'http://jsonip.com/'
        });
    }
});

var promise = jQuery('#my-button').waitableButton('promise');
promise.done(function(resp) {
  alert('Your IP address is ' + resp.ip);
});
promise.fail(function() {
  alert('Oops! Something went wrong!');
});

```

### More options
If you want to customize how waitable button styles your buttons, we've provided a few options that you can set during initialization.

Option         | Expected             | Description                                                                                                           | Default
---------------|----------------------|-----------------------------------------------------------------------------------------------------------------------|------------------
doneClass      | Array or String      | These replaces the classes on the button after the jqXhr/promise completes successfully                               | ~
doneText       | String               | Replacement text for the button after the jqXhr/promise completes successfully                                        | ~ (Original text)
disabledOnDone | Boolean              | If true, after the jqXhr/promise completes successfully, subsequent clicks on the button do not retrigger the request | false
failClass      | Array or String      | These replaces the classes on the button if the jqXhr/promise fails                                                   | ~
failText       | String               | Replacement text for the button if the jqXhr/promise fails                                                            | ~ (Original text)
spinnerSize    | Integer (16, 32, 64) | Size of the spinner in pixels                                                                                         | 16

### Contributing
We welcome all contributions (please fork and submit a pull request)! We came up with this during one of our hack days, and would love to see what sorts of ideas you all have!

### License
MIT Licensed
Copyright (c) 2013 ADstruc Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
