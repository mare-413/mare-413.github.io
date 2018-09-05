function onLoad() {
   document.getElementById("sudoku").addEventListener("click", () => launch("sudoku"));
   document.getElementById("minimax").addEventListener("click", () => launch("minimax"));
   document.getElementById("seek").addEventListener("click", () => launch("seek"));
}

function launch(doc) {
   var f = document.getElementById("frame");
   f.src = doc + "/index.html";
   f.onload = () => {
      f.height = f.contentWindow.height + 20;
      f.width = f.contentWindow.width + 20;
   }
}
