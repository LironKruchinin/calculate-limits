let arr = [
  0.7,0.8,1.2,0.7,1,2.7,1,0.6,1.3,2.6,0.9,1.2,0.7,0.6,1.5,2.2,1.9,1,1.2,1.1,5.8,3.8,4.4,2.7,1.2
];

// let histGenerator = d3.bin()
//   .domain([0,1])    // The first number is the base value that you start, and the second number is how much does the number jump
//   .thresholds(19);  // number of bins

// let bins = histGenerator(arr);
// console.log(bins);


let bins = [];
let binCount = 0;
let interval = .2;
let numOfBuckets = 5;

//Setup Bins
for(let i = 0; i < numOfBuckets; i += interval){
  bins.push({
    binNum: binCount,
    minNum: i,
    maxNum: i + interval,
    count: 0,
  })
  binCount++;
}

//Loop through data and add to bin's count
for (let i = 0; i < arr.length; i++){
  let item = arr[i];
  for (let j = 0; j < bins.length; j++){
    let bin = bins[j];
    if(item > bin.minNum && item <= bin.maxNum){
      bin.count++;
      break;  // An item can only be in one bin.
    }
  }  
}
console.log(bins);