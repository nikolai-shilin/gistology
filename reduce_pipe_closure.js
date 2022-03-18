const add = (num1) => {
  return (num2) => num1 + num2;
};
const divide = (num1) => {
  return (num2) => num2 / num1;
};
const multiply = (num1) => {
  return (num2) => num1 * num2;
};

// const apply = (...functions) => {
//   return (num) => functions.reduce((acc, fn) => fn(acc), num);
// };

// const result = apply(multiply(5), add(1), divide(2))(3);

// console.log(result); // == 8

// const apply = (fn0, fn1, fn2) => {
//   return (num) => fn2(fn1(fn0(num)))
// };

const pipeFn = (prevFn, nextFn) => (arg) => nextFn(prevFn(arg));

const apply = (...functions) => {
  return functions.reduce((prevFn, nextFn) => pipeFn(prevFn, nextFn));
};

const pipeline = apply(multiply(5), add(1), divide(2));

const result = pipeline(3);

console.log(result); // == 8
