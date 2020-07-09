## 简答题

### 谈谈你是如何理解js异步编程的，eventloop,消息队列都是做什么的，什么是宏任务，什么是微任务？

**答：**
1）js 异步编程的主要特点就是代码的执行顺序不是代码的编码顺序，并且能实现类似于多线程并发执行的效果，而无需阻塞线程。
2）所谓事件循环，其实是指渲染进程中的js引擎线程的执行循环。js 是单线程的，其实说的是jjs引擎线程是单线程的，js引擎线程在某个时间点只能执行一个任务，如果在执行任务的过程中，有其他任务产生，比如输入监听，js引擎线程就没办法接收并执行监听回调函数了，为了解决这个问题， 而产生的事件循环和消息队列。
3）消息队列中的包括宏任务队列和微任务队列，chromiun中还有延时队列（延时队列是一个哈希结构，里面的任务也是宏任务），每个宏任务会关联一个微任务队列
4）宏任务，包括主代码块和宏任务队列中的任务。宏任务队列中的任务，是在js引擎线程执行宏任务的过程中，其他线程（事件触发线程，定时触发器线程，异步http请求线程等）将任务推入宏任务队列中的。
5）微任务，是在执行宏任务/微任务过程中产生的，由js引擎线程推入微任务队列中
6）事件循环的过程是：
- js引擎线程执行一个宏任务
- 在当前宏任务执行结束之前，js引擎线程开始依次执行其关联的微任务队列中的微任务
- 当清空微任务队列中的任务时，宏任务结束，此时如果发现需要渲染，将控制权交给GUI渲染线程
- 渲染完毕，js引擎线程接管控制权，从宏任务队列中取出一个宏任务，并开始下一轮循环

7)需要注意的是，微任务的执行时间是会算在宏任务的执行时间里面的,,js引擎线程和GUI渲染线程是互斥的

## 代码题

### 一、 将下面的代码用promise的方式改进

<img src="./images/\image-20200705111557735.png" alt="image-20200705111557735" style="zoom:30%;" />

**答：**

``` javascript
 function doIt(){
    var a = await new Promise(function(resolve){
        setTimeout(function(){
            resolve('hello')
        },10)
        
    })
    var b = await new Promise(function(resolve){
        setTimeout(function(){
            resolve('logou')
        },10)
        
    })
    var c = await new Promise(function(resolve){
        setTimeout(function(){
            resolve('i love u')
        },10)
       
    })
    console.log(a + b + c)
}
doIt()
```

### 二、基于一下代码完成下面的四个练习

<img src="./images/\image-20200705111944456.png" alt="image-20200705111944456" style="zoom:80%;" />


#### 练习1：使用组合函数fp.flowRight()重新实现下面这个函数

<img src="./images/\image-20200705112145146.png" alt="image-20200705112145146" style="zoom:30%;" />

**答：**
``` javascript
let isLastInStock = fp.flowRight(fp.prop('in_stock'), fp.last)
```

#### 练习2：使用fp.flowRight(), fp.prop()和fp.first()获取第一个car的name
**答：**
``` javascript
let isFirstInStock = fp.flowRight(fp.prop('in_stock'), fp.first)
```


#### 练习3：使用帮助函数 _average 重构 averageDollarValue,使用函数组合的方式实现

<img src="./images/\image-20200705112515467.png" alt="image-20200705112515467" style="zoom:30%;" />

**答：**
``` javascript
let averageDollarValue = fp.flowRight(_average, fp.map(function(car){
    return car.dollar_value
}))
```


#### 练习4：使用flowRight 写一个sanitizeNames()函数，返回一个下划线连接的小写字符串，把数组中的name转换为这种形式：例如sanitizeNames(["hello World"])=>["hello_world"]

<img src="./images/\image-20200705112755588.png" alt="image-20200705112755588" style="zoom:33%;" />

**答：**
``` javascript
let sanitizeNames = fp.map(fp.flowRight(_underscore, fp.toLower))
```


### 三、基于下面提供的代码，完成后续的四个练习

<img src="./images/\image-20200705112927039.png" alt="image-20200705112927039" style="zoom:80%;" />

#### 练习1：使用fp.add(x,y) 和 fp.map(f,x)创建一个能让functor里的值增加的函数ex1

<img src="./images/\image-20200705113114998.png" alt="image-20200705113114998" style="zoom:33%;" />

**答：**
``` javascript
let ex1 = () => {
    return maybe.map(fp.map(fp.add(1)))._value
}
```


#### 练习2：实现一个函数ex2,能够使用fp.first获取列表的第一个元素

<img src="./images/\image-20200705113212300.png" alt="image-20200705113212300" style="zoom:33%;" />

**答：**
``` javascript
let ex2 = ()=>{
    return xs.map(fp.first)._value
}
```

#### 练习3：实现一个函数ex3,使用safeProp和fp.first找到user的名字的首字母

<img src="./images/\image-20200705113322588.png" alt="image-20200705113322588" style="zoom:33%;" />

**答：**
``` javascript
let ex3 = () => {
    return safeProp('name')(user).map(fp.first)._value
}
```
#### 练习4：使用Maybe重写ex4, 不要有if语句

<img src="./images/\image-20200705113435500.png" alt="image-20200705113435500" style="zoom:33%;" />

**答：**
``` javascript
let ex4 = function(n){
    return Maybe.of(n).map(parseInt)._value
}
```

### 三、手写实现MyPromise 源码
**要求：尽可能还原Promise 中的每一个API，并通过注释的放肆描述思路和原理**

**答：**
``` javascript
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
```