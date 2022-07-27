const bt = document.querySelector('#bt');
let output = [];
exportData.addEventListener('click', (event) => {
    let checkboxes = document.querySelectorAll('input[name="elem"]:checked');
    checkboxes.forEach((checkbox) => {
        output.push(checkbox.value);
    });
    alert(output);
});   
console.log(output);

/*
do double push into main array, as exampel
[[Cu,Cu],[Ag,Ag]....]
after that use the function Object.fromEntries(output)
and tadaaaa you have an object of elements :)
*/