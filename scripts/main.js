function onLoad() {
   document.getElementById("sudoku").addEventListener("click", () => launch("sudoku"));
   document.getElementById("minimax").addEventListener("click", () => launch("minimax"));
   document.getElementById("seek").addEventListener("click", () => launch("seek"));
   document.getElementById("snake").addEventListener("click", () => launch("snake"));
}

function launch(doc) {
   var f = document.getElementById("frame");
   var fd = document.getElementById("frame-div");
   f.width = fd.offsetWidth;
   f.height = fd.offsetHeight;
   f.src = doc + "/index.html";
   f.onload = () => {
      f.height = f.contentWindow.height;
      f.width = f.contentWindow.width;
      var fdi = document.getElementById("frame-div-ins");
      var st = "padding-left: ";
      st += (fd.offsetWidth / 2 - (f.contentWindow.width + 20) / 2) + "px; padding-top: ";
      st += (fd.offsetHeight / 2 - (f.contentWindow.height + 20) / 2) + "px;";
      //fd.style = "padding-left: " + (340 + 500 - (f.contentWindow.width + 20) / 2) + "px; " + "padding-top: " + (615 / 2 - (f.contentWindow.height + 20) / 2) + "px";
      fdi.style = st;
   }
}
