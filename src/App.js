
/*
{
  CU:[1,2,3,4,5,6]

}
*/

// const data = {};
// const ctx = document.getElementById('myChart').getContext('2d');
// const myChart = new Chart(ctx, {
//     type: 'bar',
//     data: {
//         labels: 'Cu',
//         datasets: [{
//             label: 'Number of GitHub Stars',
//             data: data,
//         }, ],
//     },
//     options: {
//         backgroundColor: [
//             'rgba(255, 99, 132, 0.2)',  // Bar 1
//             'rgba(54, 162, 235, 0.2)',  // Bar 2
//             'rgba(255, 206, 86, 0.2)',  // Bar 3
//             'rgba(75, 192, 192, 0.2)',  // Bar 4
//             'rgba(153, 102, 255, 0.2)', // Bar 5
//             'rgba(255, 159, 64, 0.2)'   // Bar 6
//         ],
//         borderWidth: 2,
//         borderColor: 'black'
//     }
// });
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
// console.log(cuArr);
let histGenerator = d3.bin()
    .domain([0,20])
    .thresholds(15)

let cuBin = histGenerator(cuArr);
console.log(cuBin);
// set the dimensions and margins of the graph
// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);



// get the data
d3.csv("../23-7-2022.xlsx").then( function(data) {

  // X axis: scale and draw:
  const x = d3.scaleLinear()
      .domain([0, 1000])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, width]);
  svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

  // set the parameters for the histogram
  const histogram = d3.histogram()
      .value(function(d) { return d.price; })   // I need to give the vector of value
      .domain(x.domain())  // then the domain of the graphic
      .thresholds(x.ticks(70)); // then the numbers of bins

  // And apply this function to data to get the bins
  const bins = histogram(data);

  // Y axis: scale and draw:
  const y = d3.scaleLinear()
      .range([height, 0]);
      y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
  svg.append("g")
      .call(d3.axisLeft(y));

  // append the bar rectangles to the svg element
  svg.selectAll("rect")
      .data(bins)
      .join("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return `translate(${x(d.x0)}, ${y(d.length)})`})
        .attr("width", function(d) { return x(d.x1) - x(d.x0)-1})
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill", function(d){ if(d.x0<140){return "orange"} else {return "#69b3a2"}})

  // Append a vertical line to highlight the separation
  svg
    .append("line")
      .attr("x1", x(140) )
      .attr("x2", x(140) )
      .attr("y1", y(0))
      .attr("y2", y(1600))
      .attr("stroke", "grey")
      .attr("stroke-dasharray", "4")
  svg
    .append("text")
    .attr("x", x(190))
    .attr("y", y(1400))
    .text("threshold: 140")
    .style("font-size", "15px")

});