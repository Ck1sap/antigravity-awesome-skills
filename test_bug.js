
function sumArray(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

const scores = [10, 20, 30];
console.log("Sum should be 60, but is:", sumArray(scores));
