var MyPromise = require('../index');

MyPromise.deferred = function(){
    var defer = {};
    defer.promise = new MyPromise(function(resolve, reject){
        defer.resolve = resolve;
        defer.reject = reject;
    })
    return defer;
}
module.exports = MyPromise