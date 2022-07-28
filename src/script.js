const bt = document.querySelector('#bt');
exportData.addEventListener('click', (event) => {
    let output = [];
    let timeMax = document.getElementById('maxF').value;
    let timeMin = document.getElementById('minF').value;
    let removeStart0TimeMin = parseInt(timeMin, 10);
    let removeStart0TimeMax = parseInt(timeMax, 10);

    if((removeStart0TimeMin == 0) || (removeStart0TimeMin == NaN)){
        removeStart0TimeMin = null;
    }
    if((removeStart0TimeMax == 0) || (removeStart0TimeMin == NaN)){
        removeStart0TimeMax = null;
    }

    let textField = document.querySelectorAll('input[name="text"]');
    

    let checkboxes = document.querySelectorAll('input[name="elem"]:checked');
    checkboxes.forEach((checkbox) => {
        output.push([checkbox.value, checkbox.value] );
    });
    let outPutObj = Object.fromEntries(output);
    console.log(outPutObj);
    console.log(removeStart0TimeMin);
    console.log(removeStart0TimeMax);
});   

/*
do double push into main array, as exampel
[[Cu,Cu],[Ag,Ag]....]
after that use the function Object.fromEntries(output)
and tadaaaa you have an object of elements :)
*/
