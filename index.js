/* main variable */
var cvs, ctx;   // canvas object
var mouse = {   // global mouse object
    x: 0,
    y: 0,

    hold: false     // mouse down or not
}

/* draw functions */
function drawLine (x2, y2){
    ctx.beginPath();
    ctx.stroleStyle = 'black';
    ctx.lineWidth = 1;
    ctx.moveTo(mouse.x, mouse.y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

/* mouse function */
function mouseMove (event){
    if (mouse.hold === true) {
        drawLine(event.offsetX, event.offsetY);
        mouse.x = event.offsetX;
        mouse.y = event.offsetY;
    }
}
function mouseDown (event){
    mouse.x = event.offsetX;
    mouse.y = event.offsetY;

    mouse.hold = true;
    console.log(mouse); // check where's the mouse
}
function mouseUp (event){
    if (mouse.hold === true) {
        drawLine(event.offsetX, event.offsetY);
        mouse.x = 0;
        mouse.y = 0;
        mouse.hold = false;
    }
    console.log(mouse); // check where's the mouse
}

/* main function */
window.onload = function (){
    cvs = document.getElementById("canvas");
    ctx = cvs.getContext("2d");

    // cvs.addListener: https://developer.mozilla.org/zh-CN/docs/Web/Events
    cvs.addEventListener('mousemove', mouseMove, false);
    cvs.addEventListener('mousedown', mouseDown, false);
    cvs.addEventListener('mouseup'  , mouseUp  , false);
}