

function myFunc(){
   document.getElementById("hello").innerHTML = "Hello World";
}

function submit(){
   const elem1 = document.getElementById('chk1').value;
   var result=" "; 
   if (elem1.checked == true){
     let ss1 = document.getElementById("chk1").value;
     result = ss1 + ","; 
   } 
}

const minH = document.getElementById('minF');
const maxH = document.getElementById('maxF');
const out = document.getElementById('outPut');

function testH(){
   out.innerHTML = `Minimum: ${minH.value}, ` + `Maximum: ${maxH.value}` 
}

btn1.addEventListener('click', testH);

function toggle(source) {
   let checkboxes = document.querySelectorAll('input[type="checkbox"]');
   for (let i = 0; i < checkboxes.length; i++) {
       if (checkboxes[i] != source)
           checkboxes[i].checked = source.checked;
   }
}
