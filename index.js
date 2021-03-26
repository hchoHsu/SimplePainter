/* main variable */

// canvas object
var cvs, ctx;

// global mouse object
var mouse = {
    x: undefined,
    y: undefined
}

function mouseDown (event){
    mouse.x = event.pageX;
    mouse.y = event.pageY;

    console.log(mouse);
}

window.onload = function (){
    cvs = document.getElementById("canvas");
    ctx = cvs.getContext("2d");

    // cvs.addListener:
    // mousemove (detect the mouse moving or not)
    // mousedown (detect the mouse down)
    cvs.addEventListener('mousedown', mouseDown, false);
}