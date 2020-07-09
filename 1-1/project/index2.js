const fp = require('lodash/fp')
const {Maybe, Container} = require('./support')
let safeProp = fp.curry(function(x,o){
    console.log(x, o, o[x])
    return Maybe.of(o[x])
})
let user = {id: 2, name: 'Albert'}
let ex3 = () => {
    return safeProp('name')(user).map(fp.first)._value
}
console.log(ex3())

let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
let ex2 = ()=>{
    return xs.map(fp.first)._value
}
console.log(ex2())

let maybe = Maybe.of([5,6,1])
let ex1 = () => {
    return maybe.map(fp.map(fp.add(1)))._value
}
console.log(ex1())

let ex4 = function(n){
    return Maybe.of(n).map(parseInt)._value
}
console.log(ex4(10),ex4())