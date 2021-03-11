const num1El = document.getElementById('num1') as HTMLInputElement
const num2El = document.getElementById('num2') as HTMLInputElement
const btn = document.querySelector('button')!
// переменная btn может иметь значение null, поэтому в тайпскрипте
// можно это корректировать путем помещения соответствующего кода в условный оператор
// как показано низже, или указывать в конце выражения взятия дом элемента
// указывать знак !

// function add(num1: number, num2: number): number {
//     return num1 + num2;
// }
type NumOrStr = number | string;
// function add(num1: number | string, num2: number | string) {
function add(num1: NumOrStr, num2: NumOrStr) {
    if (typeof num1 === 'number' && typeof num2 === 'number') {
        return num1 + num2;
    } else if (typeof num1 === 'string' && typeof num2 === 'string') {
        return num1 + ' ' + num2;
    }
    return +num1 + +num2;
}
// if (btn) {
//     btn.addEventListener('click', () => {
//         const num1 = num1El.value
//         const num2 = num2El.value
//         const result = add(+num1, +num2)
//         console.log(result)
//     })
// }

// btn.addEventListener('click', () => {
//     const num1 = num1El.value
//     const num2 = num2El.value
//     const result = add(+num1, +num2)
//     console.log(result)
// })

type Result = { val: number; timestamp: Date }
interface ResultObj { val: number; timestamp: Date; }
// function printResult(resultObject: Result) {
function printResult(resultObject: ResultObj) {
    console.log(resultObject.val)
}

const numResults: Array<number> = [];
const textResults: string[] = [];
btn.addEventListener('click', () => {
    const num1 = num1El.value
    const num2 = num2El.value
    const result = add(+num1, +num2)
    const stringResult = add(num1, num2)
    numResults.push(result as number)
    textResults.push(stringResult as string)
    printResult({ val: result as number, timestamp: new Date() })
    console.log(numResults, textResults)
})

const myPromise = new Promise<string>((resolve, reject) => {
    setTimeout(() => {
        resolve('It worked!')
    }, 1000)
})
myPromise.then(result => console.log(result.split('w')))