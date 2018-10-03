var fr;

function onLoad() {
   document.getElementById("sudoku").addEventListener("click", () => launch("sudoku"));
   document.getElementById("minimax").addEventListener("click", () => launch("minimax"));
   document.getElementById("seek").addEventListener("click", () => launch("seek"));
   document.getElementById("snake").addEventListener("click", () => launch("snake"));
   document.getElementById("blob").addEventListener("click", () => launch("blob"));
   document.getElementById("digitrec").addEventListener("click", () => launch("digitrec", true));
   document.getElementById("shaperec").addEventListener("click", () => launch("shaperec", true));
   document.getElementById("gravity").addEventListener("click", () => launch("gravity"));
   document.getElementById("life").addEventListener("click", () => launch("life"));
   document.getElementById("shortpath").addEventListener("click", () => launch("shortpath"));
}

function launch(doc, pre = false) {
   var f = document.getElementById("frame");
   var fd = document.getElementById("frame-div");
   f.width = fd.offsetWidth;
   f.height = fd.offsetHeight;
   f.src = doc + "/index.html";
   f.onload = () => {
      if (!pre) {
         var tw = f.contentWindow.width;
         var th = f.contentWindow.height;
         f.width = tw;
         f.height = th;
      } else {
         var tw = f.contentWindow.twidth;
         var th = f.contentWindow.theight;
         f.width = tw;
         f.height = th;
      }
      var fdi = document.getElementById("frame-div-ins");
      var st = "padding-left: ";
      st += (fd.offsetWidth / 2 - (tw + 20) / 2) + "px; padding-top: ";
      st += (fd.offsetHeight / 2 - (th + 20) / 2) + "px;";
      //fd.style = "padding-left: " + (340 + 500 - (f.contentWindow.width + 20) / 2) + "px; " + "padding-top: " + (615 / 2 - (f.contentWindow.height + 20) / 2) + "px";
      fr = f.contentWindow;
      fdi.style = st;
   }
}
