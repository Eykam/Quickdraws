const outerBox = document.getElementById("outerbox");

let canvas = draw("main");

outerBox.appendChild(canvas);
outerBox.appendChild(createBirds());