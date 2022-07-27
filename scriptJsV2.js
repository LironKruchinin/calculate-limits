// import xlsx from 'xlsx';
const xlsx = require('xlsx');
// import * as fs from 'fs';
const fs = require('fs');
// import math from 'mathjs';
const math = require('mathjs');
let selectedFile = document.getElementById('input').files[0];
  
document.addEventListener('drop', (event) => {
	event.preventDefault();
	event.stopPropagation();

	for (const f of event.dataTransfer.files) {
        selectedFile = f.path;
        console.log(selectedFile);
	}
});

document.addEventListener('dragover', (e) => {
	e.preventDefault();
	e.stopPropagation();
});


/* importing excel file */

const wb = xlsx.readFile(`${selectedFile}`, {dateNF: "dd/mm/yyyy"});
const ws = wb.Sheets["Book1"];


/* Reads excel and converts data to json */ 
let mainData = xlsx.utils.sheet_to_json(ws, {raw:false});

fs.writeFileSync("./jsonDataOriginal.json", JSON.stringify(mainData, null, 2) );


/* Global variables to use */
let timeMin = document.getElementById('minF');
let timeMax = document.getElementById('maxF');
let repairStrHeb = 'שיפוץ';
let engString = 'engine_num';
const limKeyWord = "Lim";
let isChangeLim = true;
let repeatStr = 'דגימה חוזרת';
let engRemStr = 'הסרת מנוע';
let copyLim = [];
let dataUnderLim = [];
let dataOverLim = [];
// exports.engSn = engSn;



/* Array for elements that can be edited easily */
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


/* Creates an array for default limits */
function getDefaultLim(jFile){
    let temp = [];
    for(let e in jFile[0]){
        if(e.includes(limKeyWord)){
            copyLim[e] = jFile[0][e];
            temp.push([e, copyLim[e]])

        }
    }
    copyLim = Object.fromEntries(temp);
    return copyLim;
}

copyLim = getDefaultLim(mainData);// gets default lim function


function isAbove(line, limits){
   for(let e in elements){
       if(limits[e + limKeyWord] <= line[e]){
           return true;
       }
   }
   return false;
}




function filterEng(jFile){
   let start = 0;
   let end = 0;
   let isAboveBool = false;
   for(let i = 0; i < jFile.length; i++){
    isAboveBool = isAboveBool || isAbove(jFile[i],copyLim);
       if((jFile[i].Actions == repairStrHeb) || (i == jFile.length - 1) || (jFile[i].Reason == engRemStr)
        || (jFile[i].engine_num != jFile[i+1].engine_num)) 
       {
           end = i;
           if(!isAboveBool){
               for(let j = start; j <= end; j++){
                   dataUnderLim.push(jFile[j]);
                }
                 
           } else {
            for(let j = start; j <= end; j++){
                dataOverLim.push(jFile[j]);
             }
           }
           start =  end + 1;
           isAboveBool = false;
       }
       fs.writeFileSync('./engineOverLim.json', JSON.stringify(dataOverLim, null, 2)); //writes json file
       fs.writeFileSync('./engineUnderLim.json', JSON.stringify(dataUnderLim, null, 2)); //writes json file
   }
}


 
function countLim(jFile, lim, elem,){
    let countOverLim = 0;
    let countHalfLim = 0;
    let isAboveBool = false;
    for(let i in elem){
        for(let j in jFile){
            if(jFile[j][i] > copyLim[i + limKeyWord]){
                countOverLim ++;
            } else if(jFile[j][i] > copyLim[i + limKeyWord] / 2 ) {
                countHalfLim ++;
            }
        }
    }
    jFile.push("", {"time_fix":'Count Over Lim', "Cu":countOverLim});
    jFile.push({"time_fix":'Count half Lim', "Cu":countHalfLim});
}

/* 
This function edits the data in the json
such as converts hh:mm to hh
engines to numbers
*/
function parseJsonFile(jFile){
    for(let i = 0; i < jFile.length; i ++){
        let obj = jFile[i];
        for(let prop in obj){
            if(obj.hasOwnProperty(prop) && !isNaN(obj[prop])){
                obj[prop] = +obj[prop]; 
            }


            /* Checks if eng is not empty, if not it splits and returns only numbers */
            if((prop == engString) && (obj[prop].length > 0) ){ 
                let engSplit = obj[prop].split('-');
                obj[prop] = parseFloat(engSplit[1]);
            }

            if((prop == 'time_original') || (prop == 'time_fix') && (obj[prop].length > 0)){
                let hour = obj[prop].split(':');
                obj[prop] = parseFloat(hour[0]);
            }

            
        }
    }
}

fs.writeFileSync('./jsonDataOriginal.json', JSON.stringify(mainData, null, 2)); //writes json file


/* */
function calcOneElem(jFile,elem){
    let temp = [];
    let results = [];
    for(let i = 0 ; i < jFile.length; i++){
        console.log(elem);
        temp.push(jFile[i][elem]);
        }
    let std = math.std(temp);
    let avg = math.mean(temp);

    return [avg,std, 3*std + avg];
}
function calcAllElem(jFile,elem){
    let results;
    let avgArr = [["time_fix", "Avg"]];
    let stdArr = [["time_fix", "Stdev"]];
    let limArr = [["time_fix", "Lim"]];
    for(let e in elem){
        results = calcOneElem(jFile, e);
        avgArr.push([e, results[0]]);
        stdArr.push([e, results[1]]);
        limArr.push([e, results[2]]);
    }
   return  [Object.fromEntries(avgArr),
            Object.fromEntries(stdArr),
            Object.fromEntries(limArr)];       
       
}
results = calcAllElem(mainData, elements);  //Calc all json elements function


/* This function gets a string that is not wanted to the repeated test and filters it out */
function remRepeatedTests(jFile, repeatStr){
    let remRepeatedTest = [];
    for(let i = 0; i < jFile.length; i++){
        if((jFile[i].Reason != repeatStr)) {
            remRepeatedTest.push(jFile[i]);
        } 
    }
    return remRepeatedTest;
}




function timeRepairFix(jFile){
    let difference = 0;
    let engSn = jFile[0]

    for(let i = 0; i < jFile.length; i++){
        if(engSn != jFile[i].engine_num){
            difference = 0;
            engSn = jFile[i].engine_num;
            
        }
        jFile[i].time_fix = jFile[i].time_original - difference;
        if((jFile[i].Desicion == engRemStr) || (jFile[i].Actions == repairStrHeb)) {
            difference = jFile[i].time_original;
        }
    }
    
}





function writeExcelFile(){
    const worksheet = xlsx.utils.json_to_sheet(mainData);
    const wsFiltered = xlsx.utils.json_to_sheet(jsonFiltered);
    const wsEngineOverLim = xlsx.utils.json_to_sheet(engOverLim);
    const wsEngineUnderLim = xlsx.utils.json_to_sheet(engUnderLim);
    const wsEngineUnderLimNew = xlsx.utils.json_to_sheet(engUnderLimNew);
    const wsEngineUnderLimOld = xlsx.utils.json_to_sheet(engUnderLimOld);
    
    const workbook = xlsx.utils.book_new();
    
    xlsx.utils.book_append_sheet(workbook, worksheet, "Original data");  //Creates a sheet for original data
    xlsx.utils.book_append_sheet(workbook, wsFiltered, "Filtered data");  //Creates a sheet for original data
    xlsx.utils.book_append_sheet(workbook, wsEngineUnderLim, "Engine batch under Limit");  //Creates a sheet for original data
    xlsx.utils.book_append_sheet(workbook, wsEngineUnderLimNew, "New engine batch Under LIM");  //Creates a sheet for original data
    xlsx.utils.book_append_sheet(workbook, wsEngineUnderLimOld, "Old engine batch Under LIM");  //Creates a sheet for original data
    xlsx.utils.book_append_sheet(workbook, wsEngineOverLim, "Engine batch over Limit");  //Creates a sheet for original data

    xlsx.write(workbook, {bookType:'xlsx', type:'binary'});
    xlsx.write(workbook, {bookType:'xlsx', type:'buffer'});
    xlsx.writeFile(workbook, 'dataExcel.xlsx'); // writes the main excel
}

function remFilesAfterUse(){
    fs.unlinkSync('jsonDataOriginal.json');
    fs.unlinkSync('engineUnderLim.json');
    fs.unlinkSync('engineUnderLimNew.json');
    // fs.unlinkSync('engineUnderLimOld.json');
    fs.unlinkSync('engineOverLim.json');
    fs.unlinkSync('jsonEngUnderLimNew.json');
    fs.unlinkSync('jsonFilteredHours.json');
    fs.unlinkSync('jsonFiltered.json');
    fs.unlinkSync('jsonFilteredHours.json');
    fs.unlinkSync('engineOverLim.json');
}




function timeSort(jFile, timeMin, timeMax){

    let sortEngByH = [];
    for(let i = 0; i < jFile.length; i++){


        if((jFile[i].time_fix >= timeMin) && (jFile[i].time_fix <= timeMax)){
            sortEngByH.push(jFile[i]);
        }
    }

    return sortEngByH;
}
function timeCheckButton(jFile, timeMin, timeMax){
    if(!timeMin){
        timeMin = 0;
    }
    if(!timeMax){
        timeMax = Number.MAX_SAFE_INTEGER;
    }
    return timeSort(jFile, timeMin.value, timeMax.value);
}


function writeDifferentLims(jFile, isOverWrite, elem, lim){
    let temp = [];
    let pushJson = [["time_fix", "Lim"]];
    if(isOverWrite){
        for(let i in elem){
            copyLim[i + limKeyWord] = lim[2][i];
            temp.push([i + limKeyWord, copyLim[i + limKeyWord]]);
        }
        for(let i in elem){
            for(let j in jFile){
                jFile[j][i + limKeyWord] = copyLim[i + limKeyWord];
            }

        }
        jFile.push('', lim[0], lim[1], lim[2]);
        
    } else {
        for(let e in jFile[0]){
            if(e.includes(limKeyWord)){
                copyLim[e] = jFile[0][e];
                temp.push([e, copyLim[e]]);
            }
        }
        copyLim = Object.fromEntries(temp);
    }
    // jFile.push("", [Object.fromEntries(pushJson)]);
    copyLim = Object.fromEntries(temp);

    return copyLim;
}

parseJsonFile(mainData); //Write basic changes to JSON function

fs.writeFileSync('./jsonDataOriginal.json', JSON.stringify(mainData, null, 2)); //writes json file

fs.writeFileSync('./jsonFiltered.json', JSON.stringify(remRepeatedTests(mainData, repeatStr), null, 2)); //writes json file

let jsonFiltered = require('../jsonFiltered.json');
// let jsonFiltered = require('./jsonFiltered.json');


fs.writeFileSync('./jsonDataOriginal.json', JSON.stringify(mainData, null, 2)); //writes json file
timeRepairFix(mainData);


timeRepairFix(jsonFiltered);
// timeCheckButton(jsonFiltered, 0, 50);
jsonFiltered = jsonFiltered.flat();


fs.writeFileSync(`./jsonFilteredHours.json`, JSON.stringify(timeCheckButton(jsonFiltered, timeMin.value, timeMax.value), null, 2)); //writes json file


fs.writeFileSync('./jsonFiltered.json', JSON.stringify(jsonFiltered, null, 2)); //writes json file

// fs.writeFileSync('./jsonFilteredTest.json', JSON.stringify(filterEng(mainData), null, 2)); //writes json file

// writeDifferentLims(mainData, isChangeLim, elements, results);
// writeDifferentLims(mainData, isChangeLim, elements, results);

writeDifferentLims(jsonFiltered, isChangeLim, elements, calcAllElem(jsonFiltered,elements));
countLim(jsonFiltered, copyLim, elements);
fs.writeFileSync('./jsonFiltered.json', JSON.stringify(jsonFiltered, null, 2)); //writes json file

filterEng(mainData);
let engOverLim = require('../engineOverLim.json');
let engUnderLim = require('../engineUnderLim.json');
writeDifferentLims(engOverLim, isChangeLim, elements, calcAllElem(engOverLim,elements));
countLim(engOverLim, copyLim, elements);

writeDifferentLims(engUnderLim, isChangeLim, elements, calcAllElem(engUnderLim,elements));
countLim(engUnderLim, copyLim, elements);



fs.writeFileSync(`./jsonEngUnderLimNew.json`, JSON.stringify(timeCheckButton(engUnderLim, timeMin.value, timeMax.value), null, 2)); //writes json file
fs.writeFileSync(`./jsonEngUnderLimOld.json`, JSON.stringify(timeCheckButton(engUnderLim, 30, 0), null, 2)); //writes json file

let engUnderLimNew = require('../jsonEngUnderLimNew.json');
writeDifferentLims(engUnderLimNew, isChangeLim, elements, calcAllElem(engUnderLimNew,elements));
countLim(engUnderLimNew, copyLim, elements);

let engUnderLimOld = require('../jsonEngUnderLimOld.json');
writeDifferentLims(engUnderLimOld, isChangeLim, elements, calcAllElem(engUnderLimOld,elements));
countLim(engUnderLimOld, copyLim, elements);

fs.writeFileSync(`./jsonEngUnderLimNew.json`, JSON.stringify(timeCheckButton(engUnderLim, timeMin.value, timeMax.value), null, 2)); //writes json file
fs.writeFileSync(`./jsonEngUnderLimOld.json`, JSON.stringify(timeCheckButton(engUnderLim, 30, 0), null, 2)); //writes json file


writeExcelFile();
// remFilesAfterUse();