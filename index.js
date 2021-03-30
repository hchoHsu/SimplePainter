/* main variable */
var cvs, ctx;   // canvas object
var mouse = {   // global mouse object
    x: 0,
    y: 0,
    hold: false,    // mouse down or not
    
    // used to change the globalCompasiteOperation of ctx (eraser now)
    pen_style: "pencil",
    composite_op: "source-over",

    // Test element
    font: 'sans-serif',
    fontsize: '10px',
    hasInput: false
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

// reference: https://stackoverflow.com/questions/21011931/how-to-embed-an-input-or-textarea-in-a-canvas-element
function enterPress (event){
    // if enter is press, then drawText
    let keyCode = event.keyCode;
    if(keyCode === 13){
        drawText(this.value, parseInt(this.style.left, 10), parseInt(this.style.top, 10));
        document.body.removeChild(this);

        mouse.hasInput = false;
    }
}
function addInput (x, y){
    // if mouseUp, add Input element
    let input = document.createElement('input');

    input.type = 'text';
    input.style.position = 'fixed';
    input.style.left = (x - 4) + 'px';
    input.style.top  = (y - 4) + 'px';

    input.onkeydown = enterPress;

    document.body.appendChild(input);
    input.focus();

    mouse.hasInput = true;
}
function drawText (txt, xt, yt){
    // draw text on canvas
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    // ctx.font = font; // let user able to add text font and size
    ctx.fillText(txt, xt - 4, yt - 4);
}

/* mouse function */
function mouseMove (event){
    if (mouse.hold === true) {
        if (mouse.pen_style != "text")
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
        if(!mouse.hasInput && mouse.pen_style == "text"){
            // To understand the diff between clienX and pageX and offsetX:
            // https://kknews.cc/zh-tw/news/r3pzzr.html
            addInput(event.clientX, event.clientY);
        }
        else
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
    let fontType = document.getElementById("fontType");
    let fontSize  = document.getElementById("fontsize");
    textInput.addEventListener('click', function () {
        changeMouse('text')}  , false);
    fontType.addEventListener('change', function () {
        mouse.font = fontType.options[fontType.selectedIndex].value;
    } , false);
    fontSize.addEventListener('change', function () {
        mouse.fontsize = fontSize.value;
    } , false);

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