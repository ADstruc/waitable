/*
 * Emulating ajax for examples
 */

var fakeAjax = function(method, delay) {

    var doneFuncs = [];
    var failFuncs = [];
    var alwaysFuncs = [];

    var fakePromise = {
        done: function(func) {
            doneFuncs.push(func);
            return this;
        },
        fail: function(func) {
            failFuncs.push(func);
            return this;
        },
        always: function(func) {
            alwaysFuncs.push(func);
            return this;
        }
    };

    setTimeout(function() {
        switch(method)
        {
            case 'done':
                $.each(doneFuncs, function(k, v) {
                   v.call();
                });
                break;
            case 'fail':
                $.each(failFuncs, function(k, v) {
                    v.call();
                });
                break;
        }

        $.each(alwaysFuncs, function(k, v) {
            v.call();
        });

    }, delay)

    return fakePromise;

};