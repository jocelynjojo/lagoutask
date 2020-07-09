/* 先设置出promise的三种状态*/
var PENDING = 'PENDING'
var FULFILLED = 'FULFILLED'
var REJECTED = 'REJECTED'
function MyPromise(fn) {
    this.status = PENDING; // 初始状态为pending
    this.value = null; // 初始化value
    this.reason = null; // 初始化reason

    // 构造函数里面添加两个数组存储成功和失败的回调
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    // resolve方法参数是value
    //在resolve 函数时不需要关心value的类型，一切类型判断放到then中进行
    function resolve(value) {
        var run = function () {
            if (this.status == PENDING) {
                // 只有pending 状态才会转变为其他状态，这里需要判断，避免同时执行了resolve和reject
                this.status = FULFILLED;
                this.value = value;
                // 当resolve 是异步执行时，then方法会先执行，
                // then方法中的onFulFilled回调就需要存在队列中，等待resolve改变时执行
                this.onFulfilledCallbacks.forEach(callback => {
                    callback(value);
                });
            }
        };
        // then 中的回调函数延迟执行
        setTimeout(run.bind(this), 0);
    }

    // reject方法参数是reason, 解析同上
    function reject(reason) {
        var run = function () {
            if (this.status == PENDING) {
                this.status = REJECTED;
                this.reason = reason;
                this.onRejectedCallbacks.forEach(callback => {
                    callback(reason);
                });
            }
        };
        // then 中的回调函数延迟执行
        setTimeout(run.bind(this), 0);
    }

    try {
        fn(resolve.bind(this), reject.bind(this));
    } catch (error) {
        reject(error);
    }
}
function deepResolvePromise(promise, x, resolve, reject) {
    // 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
    // 这是为了防止死循环
    if (promise === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
    }

    // 如果 x 为 Promise ，则使 promise 接受 x 的状态
    if (x instanceof MyPromise) {
        // 如果 x 处于等待态， promise 需保持为等待态直至 x 被执行或拒绝
        if (x.status === PENDING) {
            x.then(function (y) {
                deepResolvePromise(promise, y, resolve, reject);
            }, reject);
        } else if (x.status === FULFILLED) {
            // 如果 x 处于执行态，用相同的值执行 promise
            resolve(x.value);
        } else if (x.status === REJECTED) {
            // 如果 x 处于拒绝态，用相同的据因拒绝 promise
            reject(x.reason);
        }
    }
    // 如果 x 为对象或者函数
    else if (x && (typeof x === 'object' || typeof x === 'function')) {

        try {
            // 把 x.then 赋值给 then 
            var then = x.then;
        } catch (error) {
            // 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
            return reject(error);
        }

        // 如果 then 是函数
        if (typeof then === 'function') {
            var called = false;
            // 将 x 作为函数的作用域 this 调用之
            // 传递两个回调函数作为参数，第一个参数叫做 resolvePromise ，第二个参数叫做 rejectPromise
            try {
                then.call(
                    x,
                    // 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
                    function (y) {
                        // 如果 resolvePromise 和 rejectPromise 均被调用，
                        // 或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
                        // 实现这条需要前面加一个变量called
                        if (called) return;
                        called = true;
                        deepResolvePromise(promise, y, resolve, reject);
                    },
                    // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
                    function (r) {
                        if (called) return;
                        called = true;
                        reject(r);
                    });
            } catch (error) {
                // 如果调用 then 方法抛出了异常 e：
                // 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
                if (called) return;

                // 否则以 e 为据因拒绝 promise
                reject(error);
            }
        } else {
            // 如果 then 不是函数，以 x 为参数执行 promise
            resolve(x);
        }
    } else {
        // 如果 x 不为对象或者函数，以 x 为参数执行 promise
        resolve(x);
    }
}
MyPromise.prototype.then = function (onFulfilled, onRejected) {
    var that = this;   // 保存一下this

    // then 方法一定返回一个promis，所以这里需要return promise
    // 返回的promise 不能等于 onFulfilled 回调函数返回的值，否则会抛出TypeError的错误，所以，需要记录下promise
    var promise2 = new MyPromise(function (resolvePromise, rejectPromise) {
        // 执行then方法时，需要判断当前promise的状态，如果时fullfilled/rejected直接调用回调函数函数
        // 如果pendding状态，需要推入队列，等待状态改变时执行
        // 如果onFulfilled不是函数，给一个默认函数，返回value

        switch (that.status) {

            case PENDING:
                that.onFulfilledCallbacks.push(function () {
                    // 这里 的try catch 一定要放在function 内部，因为是需要捕获异步调用时的错误
                    try {
                        if (typeof onFulfilled !== 'function') {
                            // 如果onFulfilled不是函数，直接把当前值传到下一个then回调
                            resolvePromise(that.value);
                        } else {
                            // 如果onFulfilled是函数，需要判断返回的值，并进行深度递归（promise深度promise的清空）
                            // 因为它需要告诉then返回的promise它状态改变了
                            var x = onFulfilled(that.value);
                            deepResolvePromise(promise2, x, resolvePromise, rejectPromise);
                        }
                    } catch (error) {
                        rejectPromise(error);
                    }
                });
                that.onRejectedCallbacks.push(function () {
                    try {
                        if (typeof onRejected !== 'function') {
                            rejectPromise(that.reason);
                        } else {
                            var x = onRejected(that.reason);
                            deepResolvePromise(promise2, x, resolvePromise, rejectPromise);
                        }
                    } catch (error) {
                        rejectPromise(error);
                    }
                });
                break;
            case FULFILLED:
                setTimeout(function () {
                    try {
                        if (typeof onFulfilled !== 'function') {
                            resolvePromise(that.value);
                        } else {
                            var x = onFulfilled(that.value);
                            deepResolvePromise(promise2, x, resolvePromise, rejectPromise);
                        }
                    } catch (error) {
                        rejectPromise(error);
                    }
                }, 0);

                break;
            case REJECTED:
                setTimeout(function () {
                    try {
                        if (typeof onRejected !== 'function') {
                            rejectPromise(that.reason);
                        } else {
                            var x = onRejected(that.reason);
                            deepResolvePromise(promise2, x, resolvePromise, rejectPromise);
                        }
                    } catch (error) {
                        rejectPromise(error);
                    }
                }, 0);

                break;

        }


    });

    return promise2;

}
MyPromise.resolve = function (val) {
    if (val instanceof MyPromise) {
        return val;
    }

    return new MyPromise(function (resolve) {
        resolve(val);
    });
}

MyPromise.reject = function (reason) {
    return new MyPromise(function (resolve, reject) {
        reject(reason);
    });
}

MyPromise.all = function (promiseList) {
    var resPromise = new MyPromise(function (resolve, reject) {
        var count = 0;
        var result = [];
        var length = promiseList.length;

        if (length === 0) {
            return resolve(result);
        }

        promiseList.forEach(function (promise, index) {
            MyPromise.resolve(promise).then(function (value) {
                count++;
                result[index] = value;
                if (count === length) {
                    resolve(result);
                }
            }, function (reason) {
                reject(reason);
            });
        });
    });

    return resPromise;
}

MyPromise.race = function (promiseList) {
    var resPromise = new MyPromise(function (resolve, reject) {
        var length = promiseList.length;

        if (length === 0) {
            return resolve();
        } else {
            for (var i = 0; i < length; i++) {
                MyPromise.resolve(promiseList[i]).then(function (value) {
                    return resolve(value);
                }, function (reason) {
                    return reject(reason);
                });
            }
        }
    });

    return resPromise;
}

MyPromise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected);
}
// finally , 无论什么状态都会实现fn方法，并且，如果是fulffile，返回都promis也是fulfill，reject，最后也会抛出错误
MyPromise.prototype.finally = function (fn) {
    return this.then(function (value) {
        return MyPromise.resolve(fn()).then(function () {
            return value;
        });
    }, function (error) {
        return MyPromise.resolve(fn()).then(function () {
            throw error
        });
    });
}


module.exports = MyPromise