/* global debounce */
/* global throttle */

debounce = function(fn, delay) {
    var timer = null;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
}

throttle = function(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last;
    var deferTimer;
    return function () {
        var context = scope || this;
        var now = new Date();
        var args = arguments;
        if (last && now < last + threshhold) {
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                    last = now;
                    fn.apply(context, args);
                }, threshhold);
        } else {
            last = now;
            fn.apply(context, args);
        }
    };
}
