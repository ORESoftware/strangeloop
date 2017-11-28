const util = require('util');


//////////////////////////////////////////////////////////////////////////////////////////////////

function once(ctx, fn) {

    var callable = true;

    return function callOnce(err) {
        if (callable) {
            callable = false;
            fn.apply(ctx, arguments);
        }
        else {
            console.log(' => Strangeloop warning => function/callback was called more than once => \n' +
            fn ? fn.toString() : '');
            if(err){
                console.error(' => Strangeloop warning => \n', (err.stack || util.inspect(err)));
            }
        }
    }
}

exports.conditionalReturn = function (fn, cb) {

    if (typeof cb === 'function') {
        fn(once(undefined, function (err, val) {
            if (err) {
                console.error(err.stack);
            }
            if (arguments.length > 2) {
                console.error(' => Warning => Argument(s) lost in translation => ', util.inspect(arguments));
            }
            cb(err, val);
        }));
    }
    else {
        return new Promise(function (resolve, reject) {
            fn(once(undefined, function () {

                if (arguments.length > 2) {
                    console.error(' => Warning => Argument(s) lost in translation => ', util.inspect(arguments));
                }
                const args = Array.from(arguments);
                const err = args.shift();

                if (err) {
                    reject(err);
                }
                else {
                    //TODO: need to provide data about whether the server is live in this process or another process
                    resolve.apply(null, args);
                }
            }));
        });
    }

};
