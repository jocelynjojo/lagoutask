

  2.1.2.1: When fulfilled, a promise: must not transition to any other state.







  2.1.3.1: When rejected, a promise: must not transition to any other state.







  2.2.1: Both `onFulfilled` and `onRejected` are optional arguments.
    2.2.1.1: If `onFulfilled` is not a function, it must be ignored.
      applied to a directly-rejected promise





      applied to a promise rejected and then chained off of





    2.2.1.2: If `onRejected` is not a function, it must be ignored.
      applied to a directly-fulfilled promise





      applied to a promise fulfilled and then chained off of






  2.2.2: If `onFulfilled` is a function,
    2.2.2.1: it must be called after `promise` is fulfilled, with `promise`’s fulfillment value as its first argument.



    2.2.2.2: it must not be called before `promise` is fulfilled


    2.2.2.3: it must not be called more than once.







  2.2.3: If `onRejected` is a function,
    2.2.3.1: it must be called after `promise` is rejected, with `promise`’s rejection reason as its first argument.



    2.2.3.2: it must not be called before `promise` is rejected


    2.2.3.3: it must not be called more than once.







  2.2.4: `onFulfilled` or `onRejected` must not be called until the execution context stack contains only platform code.
    `then` returns before the promise becomes fulfilled or rejected






    Clean-stack execution ordering tests (fulfillment case)





    Clean-stack execution ordering tests (rejection case)






  2.2.5 `onFulfilled` and `onRejected` must be called as functions (i.e. with no `this` value).
    strict mode


    sloppy mode



  2.2.6: `then` may be called multiple times on the same promise.
    2.2.6.1: If/when `promise` is fulfilled, all respective `onFulfilled` callbacks must execute in the order of their originating calls to `then`.
      multiple boring fulfillment handlers



      multiple fulfillment handlers, one of which throws



      results in multiple branching chains with their own fulfillment values



      `onFulfilled` handlers are called in the original order



        even when one handler is added inside another handler



    2.2.6.2: If/when `promise` is rejected, all respective `onRejected` callbacks must execute in the order of their originating calls to `then`.
      multiple boring rejection handlers



      multiple rejection handlers, one of which throws



      results in multiple branching chains with their own fulfillment values



      `onRejected` handlers are called in the original order



        even when one handler is added inside another handler




  2.2.7: `then` must return a promise: `promise2 = promise1.then(onFulfilled, onRejected)`

    2.2.7.1: If either `onFulfilled` or `onRejected` returns a value `x`, run the Promise Resolution Procedure `[[Resolve]](promise2, x)`

    2.2.7.2: If either `onFulfilled` or `onRejected` throws an exception `e`, `promise2` must be rejected with `e` as the reason.
      The reason is `undefined`






      The reason is `null`






      The reason is `false`






      The reason is `0`






      The reason is an error






      The reason is an error without a stack






      The reason is a date






      The reason is an object






      The reason is an always-pending thenable






      The reason is a fulfilled promise






      The reason is a rejected promise






    2.2.7.3: If `onFulfilled` is not a function and `promise1` is fulfilled, `promise2` must be fulfilled with the same value.
      `onFulfilled` is `undefined`



      `onFulfilled` is `null`



      `onFulfilled` is `false`



      `onFulfilled` is `5`



      `onFulfilled` is an object



      `onFulfilled` is an array containing a function



    2.2.7.4: If `onRejected` is not a function and `promise1` is rejected, `promise2` must be rejected with the same reason.
      `onRejected` is `undefined`



      `onRejected` is `null`



      `onRejected` is `false`



      `onRejected` is `5`



      `onRejected` is an object



      `onRejected` is an array containing a function




  2.3.1: If `promise` and `x` refer to the same object, reject `promise` with a `TypeError' as the reason.



  2.3.2: If `x` is a promise, adopt its state
    2.3.2.1: If `x` is pending, `promise` must remain pending until `x` is fulfilled or rejected.


    2.3.2.2: If/when `x` is fulfilled, fulfill `promise` with the same value.
      `x` is already-fulfilled


      `x` is eventually-fulfilled


    2.3.2.3: If/when `x` is rejected, reject `promise` with the same reason.
      `x` is already-rejected


      `x` is eventually-rejected



  2.3.3: Otherwise, if `x` is an object or function,
    2.3.3.1: Let `then` be `x.then`
      `x` is an object with null prototype


      `x` is an object with normal Object.prototype


      `x` is a function


    2.3.3.2: If retrieving the property `x.then` results in a thrown exception `e`, reject `promise` with `e` as the reason.
      `e` is `undefined`


      `e` is `null`


      `e` is `false`


      `e` is `0`


      `e` is an error


      `e` is an error without a stack


      `e` is a date


      `e` is an object


      `e` is an always-pending thenable


      `e` is a fulfilled promise


      `e` is a rejected promise


    2.3.3.3: If `then` is a function, call it with `x` as `this`, first argument `resolvePromise`, and second argument `rejectPromise`
      Calls with `x` as `this` and two function arguments


      Uses the original value of `then`


      2.3.3.3.1: If/when `resolvePromise` is called with value `y`, run `[[Resolve]](promise, y)`
        `y` is not a thenable
          `y` is `undefined`
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is `null`
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is `false`
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is `5`
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an object
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an array
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


        `y` is a thenable
          `y` is a synchronously-fulfilled custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an asynchronously-fulfilled custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-fulfilled one-time thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that tries to fulfill twice
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that fulfills but then throws
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an already-fulfilled promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an eventually-fulfilled promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-rejected custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an asynchronously-rejected custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-rejected one-time thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that immediately throws in `then`
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an object with a throwing `then` accessor
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an already-rejected promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an eventually-rejected promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


        `y` is a thenable for a thenable
          `y` is a synchronously-fulfilled custom thenable for a synchronously-fulfilled custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-fulfilled custom thenable for an asynchronously-fulfilled custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-fulfilled custom thenable for a synchronously-fulfilled one-time thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-fulfilled custom thenable for a thenable that tries to fulfill twice
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-fulfilled custom thenable for a thenable that fulfills but then throws
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-fulfilled custom thenable for an already-fulfilled promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-fulfilled custom thenable for an eventually-fulfilled promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-fulfilled custom thenable for a synchronously-rejected custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-fulfilled custom thenable for an asynchronously-rejected custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-fulfilled custom thenable for a synchronously-rejected one-time thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-fulfilled custom thenable for a thenable that immediately throws in `then`
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-fulfilled custom thenable for an object with a throwing `then` accessor
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-fulfilled custom thenable for an already-rejected promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-fulfilled custom thenable for an eventually-rejected promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an asynchronously-fulfilled custom thenable for a synchronously-fulfilled custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an asynchronously-fulfilled custom thenable for an asynchronously-fulfilled custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an asynchronously-fulfilled custom thenable for a synchronously-fulfilled one-time thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an asynchronously-fulfilled custom thenable for a thenable that tries to fulfill twice
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an asynchronously-fulfilled custom thenable for a thenable that fulfills but then throws
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an asynchronously-fulfilled custom thenable for an already-fulfilled promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an asynchronously-fulfilled custom thenable for an eventually-fulfilled promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an asynchronously-fulfilled custom thenable for a synchronously-rejected custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an asynchronously-fulfilled custom thenable for an asynchronously-rejected custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an asynchronously-fulfilled custom thenable for a synchronously-rejected one-time thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an asynchronously-fulfilled custom thenable for a thenable that immediately throws in `then`
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an asynchronously-fulfilled custom thenable for an object with a throwing `then` accessor
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an asynchronously-fulfilled custom thenable for an already-rejected promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an asynchronously-fulfilled custom thenable for an eventually-rejected promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-fulfilled one-time thenable for a synchronously-fulfilled custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-fulfilled one-time thenable for an asynchronously-fulfilled custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-fulfilled one-time thenable for a synchronously-fulfilled one-time thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-fulfilled one-time thenable for a thenable that tries to fulfill twice
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-fulfilled one-time thenable for a thenable that fulfills but then throws
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-fulfilled one-time thenable for an already-fulfilled promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-fulfilled one-time thenable for an eventually-fulfilled promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-fulfilled one-time thenable for a synchronously-rejected custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-fulfilled one-time thenable for an asynchronously-rejected custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-fulfilled one-time thenable for a synchronously-rejected one-time thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-fulfilled one-time thenable for a thenable that immediately throws in `then`
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-fulfilled one-time thenable for an object with a throwing `then` accessor
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-fulfilled one-time thenable for an already-rejected promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a synchronously-fulfilled one-time thenable for an eventually-rejected promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that tries to fulfill twice for a synchronously-fulfilled custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that tries to fulfill twice for an asynchronously-fulfilled custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that tries to fulfill twice for a synchronously-fulfilled one-time thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that tries to fulfill twice for a thenable that tries to fulfill twice
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that tries to fulfill twice for a thenable that fulfills but then throws
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that tries to fulfill twice for an already-fulfilled promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that tries to fulfill twice for an eventually-fulfilled promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that tries to fulfill twice for a synchronously-rejected custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that tries to fulfill twice for an asynchronously-rejected custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that tries to fulfill twice for a synchronously-rejected one-time thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that tries to fulfill twice for a thenable that immediately throws in `then`
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that tries to fulfill twice for an object with a throwing `then` accessor
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that tries to fulfill twice for an already-rejected promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that tries to fulfill twice for an eventually-rejected promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that fulfills but then throws for a synchronously-fulfilled custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that fulfills but then throws for an asynchronously-fulfilled custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that fulfills but then throws for a synchronously-fulfilled one-time thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that fulfills but then throws for a thenable that tries to fulfill twice
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that fulfills but then throws for a thenable that fulfills but then throws
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that fulfills but then throws for an already-fulfilled promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that fulfills but then throws for an eventually-fulfilled promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that fulfills but then throws for a synchronously-rejected custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that fulfills but then throws for an asynchronously-rejected custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that fulfills but then throws for a synchronously-rejected one-time thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that fulfills but then throws for a thenable that immediately throws in `then`
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that fulfills but then throws for an object with a throwing `then` accessor
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that fulfills but then throws for an already-rejected promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is a thenable that fulfills but then throws for an eventually-rejected promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an already-fulfilled promise for a synchronously-fulfilled custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an already-fulfilled promise for an asynchronously-fulfilled custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an already-fulfilled promise for a synchronously-fulfilled one-time thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an already-fulfilled promise for a thenable that tries to fulfill twice
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an already-fulfilled promise for a thenable that fulfills but then throws
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an already-fulfilled promise for an already-fulfilled promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an already-fulfilled promise for an eventually-fulfilled promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an already-fulfilled promise for a synchronously-rejected custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an already-fulfilled promise for an asynchronously-rejected custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an already-fulfilled promise for a synchronously-rejected one-time thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an already-fulfilled promise for a thenable that immediately throws in `then`
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an already-fulfilled promise for an object with a throwing `then` accessor
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an already-fulfilled promise for an already-rejected promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an already-fulfilled promise for an eventually-rejected promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an eventually-fulfilled promise for a synchronously-fulfilled custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an eventually-fulfilled promise for an asynchronously-fulfilled custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an eventually-fulfilled promise for a synchronously-fulfilled one-time thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an eventually-fulfilled promise for a thenable that tries to fulfill twice
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an eventually-fulfilled promise for a thenable that fulfills but then throws
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an eventually-fulfilled promise for an already-fulfilled promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an eventually-fulfilled promise for an eventually-fulfilled promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an eventually-fulfilled promise for a synchronously-rejected custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an eventually-fulfilled promise for an asynchronously-rejected custom thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an eventually-fulfilled promise for a synchronously-rejected one-time thenable
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an eventually-fulfilled promise for a thenable that immediately throws in `then`
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an eventually-fulfilled promise for an object with a throwing `then` accessor
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an eventually-fulfilled promise for an already-rejected promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


          `y` is an eventually-fulfilled promise for an eventually-rejected promise
            `then` calls `resolvePromise` synchronously


            `then` calls `resolvePromise` asynchronously


      2.3.3.3.2: If/when `rejectPromise` is called with reason `r`, reject `promise` with `r`
        `r` is `undefined`
          `then` calls `rejectPromise` synchronously


          `then` calls `rejectPromise` asynchronously


        `r` is `null`
          `then` calls `rejectPromise` synchronously


          `then` calls `rejectPromise` asynchronously


        `r` is `false`
          `then` calls `rejectPromise` synchronously


          `then` calls `rejectPromise` asynchronously


        `r` is `0`
          `then` calls `rejectPromise` synchronously


          `then` calls `rejectPromise` asynchronously


        `r` is an error
          `then` calls `rejectPromise` synchronously


          `then` calls `rejectPromise` asynchronously


        `r` is an error without a stack
          `then` calls `rejectPromise` synchronously


          `then` calls `rejectPromise` asynchronously


        `r` is a date
          `then` calls `rejectPromise` synchronously


          `then` calls `rejectPromise` asynchronously


        `r` is an object
          `then` calls `rejectPromise` synchronously


          `then` calls `rejectPromise` asynchronously


        `r` is an always-pending thenable
          `then` calls `rejectPromise` synchronously


          `then` calls `rejectPromise` asynchronously


        `r` is a fulfilled promise
          `then` calls `rejectPromise` synchronously


          `then` calls `rejectPromise` asynchronously


        `r` is a rejected promise
          `then` calls `rejectPromise` synchronously


          `then` calls `rejectPromise` asynchronously


      2.3.3.3.3: If both `resolvePromise` and `rejectPromise` are called, or multiple calls to the same argument are made, the first call takes precedence, and any further calls are ignored.
        calling `resolvePromise` then `rejectPromise`, both synchronously


        calling `resolvePromise` synchronously then `rejectPromise` asynchronously


        calling `resolvePromise` then `rejectPromise`, both asynchronously


        calling `resolvePromise` with an asynchronously-fulfilled promise, then calling `rejectPromise`, both synchronously


        calling `resolvePromise` with an asynchronously-rejected promise, then calling `rejectPromise`, both synchronously


        calling `rejectPromise` then `resolvePromise`, both synchronously


        calling `rejectPromise` synchronously then `resolvePromise` asynchronously


        calling `rejectPromise` then `resolvePromise`, both asynchronously


        calling `resolvePromise` twice synchronously


        calling `resolvePromise` twice, first synchronously then asynchronously


        calling `resolvePromise` twice, both times asynchronously


        calling `resolvePromise` with an asynchronously-fulfilled promise, then calling it again, both times synchronously


        calling `resolvePromise` with an asynchronously-rejected promise, then calling it again, both times synchronously


        calling `rejectPromise` twice synchronously


        calling `rejectPromise` twice, first synchronously then asynchronously


        calling `rejectPromise` twice, both times asynchronously


        saving and abusing `resolvePromise` and `rejectPromise`


      2.3.3.3.4: If calling `then` throws an exception `e`,
        2.3.3.3.4.1: If `resolvePromise` or `rejectPromise` have been called, ignore it.
          `resolvePromise` was called with a non-thenable


          `resolvePromise` was called with an asynchronously-fulfilled promise


          `resolvePromise` was called with an asynchronously-rejected promise


          `rejectPromise` was called


          `resolvePromise` then `rejectPromise` were called


          `rejectPromise` then `resolvePromise` were called


        2.3.3.3.4.2: Otherwise, reject `promise` with `e` as the reason.
          straightforward case


          `resolvePromise` is called asynchronously before the `throw`


          `rejectPromise` is called asynchronously before the `throw`


    2.3.3.4: If `then` is not a function, fulfill promise with `x`
      `then` is `5`


      `then` is an object


      `then` is an array containing a function


      `then` is a regular expression


      `then` is an object inheriting from `Function.prototype`



  2.3.4: If `x` is not an object or function, fulfill `promise` with `x`
    The value is `undefined`






    The value is `null`






    The value is `false`






    The value is `true`






    The value is `0`






    The value is `true` with `Boolean.prototype` modified to have a `then` method






    The value is `1` with `Number.prototype` modified to have a `then` method








  872 passing (16s)
