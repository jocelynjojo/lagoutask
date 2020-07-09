const fp = require('lodash/fp')

const cars = [
    { name: 'Ferrari FF', horsepower: 660, dollar_value: 700000, in_stock: true },
    { name: 'Spyker C12 Zagato1', horsepower: 650, dollar_value: 648000, in_stock: false },
    { name: 'Jaguar XKR-S', horsepower: 550, dollar_value: 132000, in_stock: false },
    { name: 'Audi R8', horsepower: 525, dollar_value: 114200, in_stock: false },
    { name: 'Aston Martin One-77', horsepower: 750, dollar_value: 1850000, in_stock: true },
    { name: 'Pagani Huayra', horsepower: 700, dollar_value: 1300000, in_stock: false },
]
let isLastInStock1 = function(cars){
    let last_car = fp.last(cars)
    return fp.prop('in_stock', last_car)
}
var bool1  = isLastInStock1(cars)
console.log('subject 1 origin:', bool1)

let isLastInStock = fp.flowRight(fp.prop('in_stock'), fp.last)
var bool1_2  = isLastInStock(cars)
console.log('subject 1 change:', bool1_2)

let isFirstInStock = fp.flowRight(fp.prop('in_stock'), fp.first)
var bool2  = isFirstInStock(cars)
console.log('subject 2 change:', bool2)

let _average = function(xs){
    return fp.reduce(fp.add, 0, xs) / xs.length
}
let averageDollarValue3 = function(cars){
    let dollar_values = fp.map(function(car){
        return car.dollar_value
    },cars)
    return _average(dollar_values)
}
var bool3  = averageDollarValue3(cars)
console.log('subject 3 origin:', bool3)

let averageDollarValue = fp.flowRight(_average, fp.map(function(car){
    return car.dollar_value
}))
var bool3_2  = averageDollarValue(cars)
console.log('subject 3 change:', bool3_2)

let _underscore = fp.replace(/\W+/g,'_');
let sanitizeNames = fp.map(fp.flowRight(_underscore, fp.toLower))
console.log('subject 4 change:', sanitizeNames(["hello World", "test It Again"]))