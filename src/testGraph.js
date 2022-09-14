const elements = {
  Cu:"Cu",
  Ag:"Ag",
  Ni:"Ni",
  Mg:"Mg",
  Fe:"Fe",
  Cr:"Cr",
  Al:"Al",
  Ti:"Ti",
  Si:"Si",
  Mo:"Mo",
  Zn:"Zn"
}
let cuArr = [];
let agArr = [];
let niArr = [];
let mgArr = [];
let feArr = [];
let crArr = [];
let alArr = [];
let tiArr = [];
let siArr = [];
let moArr = [];
let znArr = [];


const xlsx = require('xlsx');
const fs = require('fs');
let now = new Date();
const wb = xlsx.readFile(`24-7-2022.xlsx`);
const ws = wb.Sheets['Filtered data'];

let mainData = xlsx.utils.sheet_to_json(ws, {raw:false});

function pushToElemArr(data, elem){
  for(let i in elem){
      for(let j in data){
          if(elem[i] == "Cu"){

              cuArr.push(parseFloat(data[j][i]));




          }
          if(elem[i] == "Ag"){
              agArr.push(parseFloat(data[j][i]));
          }
          if(elem[i] == "Ni"){
              niArr.push(parseFloat(data[j][i]));
          }
          if(elem[i] == "Mg"){
              mgArr.push(parseFloat(data[j][i]));
          }
          if(elem[i] == "Fe"){
              feArr.push(parseFloat(data[j][i]));
          }
          if(elem[i] == "Cr"){
              crArr.push(parseFloat(data[j][i]));
          }
          if(elem[i] == "Al"){
              alArr.push(parseFloat(data[j][i]));
          }
          if(elem[i] == "Ti"){
              tiArr.push(parseFloat(data[j][i]));
          }
          if(elem[i] == "Si"){
              siArr.push(parseFloat(data[j][i]));
          }
          if(elem[i] == "Mo"){
              moArr.push(parseFloat(data[j][i]));
          }
          if(elem[i] == "Zn"){
              znArr.push(parseFloat(data[j][i]));
          }
      }
  }
  let myJsonString = JSON.stringify(cuArr);
  // console.log(myJsonString);

  // let worksheet = xlsx.utils.json_to_sheet(myJsonString);
  // let workbook = xlsx.utils.book_new();
  // xlsx.utils.book_append_sheet(workbook, worksheet, "Original data");
  // xlsx.write(workbook, {bookType:'xlsx', type:'binary'});
  // xlsx.write(workbook, {bookType:'xlsx', type:'buffer'});
  // xlsx.writeFile(workbook, `Cu.xlsx`); // writes the main excel
}
pushToElemArr(mainData, elements);

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
for (let i = 0; i < cuArr.length; i++){
  let item = cuArr[i];
  for (let j = 0; j < bins.length; j++){
    let bin = bins[j];
    if(item > bin.minNum && item <= bin.maxNum){
      bin.count++;
      break;  // An item can only be in one bin.
    }
  }  
}
console.log(bins[1].minNum);

let x = ["Apples","Apples","Apples","Oranges", "Bananas"]

let y = ["5","10","3","10","5"]

let data = [

  {

    histfunc: "count",
    y: y,
    x: x,
    type: "histogram",
    name: "count"
  }

]


Plotly.newPlot('myDiv', data)