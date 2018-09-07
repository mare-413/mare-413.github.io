function onLoad() {
   document.getElementById("sudoku").addEventListener("click", () => launch("sudoku"));
   document.getElementById("minimax").addEventListener("click", () => launch("minimax"));
   document.getElementById("seek").addEventListener("click", () => launch("seek"));
}

function launch(doc) {
   var f = document.getElementById("frame");
   f.width = "1018";
   f.height = "615";
   f.src = doc + "/index.html";
   f.onload = () => {
      f.height = f.contentWindow.height + 20;
      f.width = f.contentWindow.width + 20;
   }
   var fd = document.getElementById("frame-div-ins");
   var st = "padding-left: ";
   st += (510 - (f.contentWindow.width + 20) / 2) + "px; padding-top: ";
   st += (290 - (f.contentWindow.height + 20) / 2) + "px;";
   //fd.style = "padding-left: " + (340 + 500 - (f.contentWindow.width + 20) / 2) + "px; " + "padding-top: " + (615 / 2 - (f.contentWindow.height + 20) / 2) + "px";
   fd.style = st;
}
