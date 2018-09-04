function onLoad() {


   document.getElementById("sudoku").addEventListener("click", launch);
   console.log("loaded");
}

function launch() {
   console.log("sudok");

   var f = document.getElementById("frame");
   f.src = "sudoku/index.html";
   f.onload = () => {
      f.height = f.contentWindow.height;
   }
}
