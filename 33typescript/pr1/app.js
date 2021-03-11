"use strict";
const num1El = document.getElementById('num1');
const num2El = document.getElementById('num2');
const btn = document.querySelector('button');
// function add(num1: number | string, num2: number | string) {
function add(num1, num2) {
    if (typeof num1 === 'number' && typeof num2 === 'number') {
        return num1 + num2;
    }
    else if (typeof num1 === 'string' && typeof num2 === 'string') {
        return num1 + ' ' + num2;
    }
    return +num1 + +num2;
}
// function printResult(resultObject: Result) {
function printResult(resultObject) {
    console.log(resultObject.val);
}
const numResults = [];
const textResults = [];
btn.addEventListener('click', () => {
    const num1 = num1El.value;
    const num2 = num2El.value;
    const result = add(+num1, +num2);
    const stringResult = add(num1, num2);
    numResults.push(result);
    textResults.push(stringResult);
    printResult({ val: result, timestamp: new Date() });
    console.log(numResults, textResults);
});
const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('It worked!');
    }, 1000);
});
myPromise.then(result => console.log(result.split('w')));
