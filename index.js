/* main variable */
var cvs, ctx;   // canvas object
var mouse = {   // global mouse object
    x: 0,
    y: 0,
    hold: false,    // mouse down or not
    
    // used to change the globalCompasiteOperation of ctx (eraser now)
    pen_style: "pencil",
    composite_op: "source-over"
}

/* draw functions */
function change_color (color){

}
function change_size (size){
    ctx.lineWidth = size;
}

function changeMouse (style){
    if (style !== "eraser")
        mouse.composite_op = "source-over";

    switch (style) {
        case 'pencil':
            mouse.pen_style = "pencil";
        break;
        case 'text':
            mouse.pen_style = "text";
        break;
        case 'eraser':
            mouse.pen_style = "pencil";
            mouse.composite_op = "destination-out"
        break;
    }

    console.log("change to" + style);
}

function drawLine (x2, y2){
    ctx.beginPath();
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
    ctx.globalCompositeOperation = mouse.composite_op;

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

    // Tool bar
    let pencil = document.getElementById("pencil");
    let eraser = document.getElementById("eraser");
    pencil.addEventListener('click', function () {
        changeMouse('pencil')}  , false);
    eraser.addEventListener('click', function () {
        changeMouse('eraser')}  , false);

    // Text bar
    let textInput = document.getElementById("textInput");
    let fontSize  = document.getElementById("fontsize");
    textInput.addEventListener('click', function () {
        changeMouse('text')}  , false);
    fontSize.addEventListener('change', function () {
        ctx.font = fontSize.value;
    } , false)

    // Menu
    let color_selc = document.getElementById("color_select");
    let brush_size = document.getElementById("brush_size"); 
    color_selc.addEventListener('change', function () {
        ctx.strokeStyle = color_selc.value;
    } , false);
    brush_size.addEventListener('change', function () {
        ctx.lineWidth = brush_size.value;
        console.log(ctx.lineWidth);
    }  , false);

    // Refresh
    let refresh = document.getElementById("refresh");
    refresh.addEventListener('click', function () {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
    }  , false);
}