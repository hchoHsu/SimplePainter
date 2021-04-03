/* main variable */
var cvs, ctx;   // canvas object
var execution_array = [];
var mouse = {   // global mouse object
    x: 0,
    y: 0,
    down_x: 0,
    down_y: 0,
    color: '#000000',
    Brushsize: 1,
    hold: false,    // mouse down or not
    
    // used to change the globalCompasiteOperation of ctx (eraser now)
    pen_style: "pencil",
    composite_op: "source-over",

    // Test element
    font: 'sans-serif',
    fontsize: 10,
    textInput: '',
    hasInput: false,
    text_x: 0,
    text_y: 0
}

/* draw functions */
function changeMouse (style){
    if (style !== "eraser")
        mouse.composite_op = "source-over";

    switch (style) {
        case 'pencil':
            mouse.pen_style = "pencil";
            cvs.style.cursor = "url('img/pencil.cur'), auto";
        break;
        case 'rect_s':
            mouse.pen_style = "rect_s";
            // TODO: add new cursor .png
        break;
        case 'text':
            mouse.pen_style = "text";
            cvs.style.cursor = "text"
        break;
        case 'eraser':
            mouse.pen_style = "eraser";
            mouse.composite_op = "destination-out"
            cvs.style.cursor = "url('img/eraser.cur'), auto";
        break;
    }

    console.log("change to" + style);
}

function drawLine (x2, y2){
    ctx.strokeStyle = document.getElementById("color_select").value;
    ctx.lineWidth = document.getElementById("brush_size").value;
    ctx.globalCompositeOperation = mouse.composite_op;
    ctx.beginPath();
    ctx.moveTo(mouse.x, mouse.y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

/* Redraw and Push */
function createElement(x, y)
{
    console.log("create");
    if(x == "Image"){
        return {
            property: 'image',
            input: y
        }
    }

    switch(mouse.pen_style)
    {
        case 'pencil':
            return {
                property: 'pencil',
                start_position_x: mouse.x,
                start_position_y: mouse.y,
                end_position_x: x,
                end_position_y: y,
                size: ctx.lineWidth,
                color: ctx.strokeStyle
            }
        case 'eraser':
            return {
                property: 'eraser',
                start_position_x: mouse.x,
                start_position_y: mouse.y,
                end_position_x: x,
                end_position_y: y,
                size: ctx.lineWidth
            }
        case 'text':
            return {
                property: 'text',
                start_position_x: mouse.text_x,
                start_position_y: mouse.text_y,
                textInput: mouse.textInput,
                textSize: mouse.fontsize,
                textStyle: mouse.font
            }
    }
}
function PushIntoArray(x, y){
    let elt = createElement(x, y);
    execution_array.push(elt);
}
function Redraw(){
    if(execution_array.length < 1) return;

    execution_array.forEach(obj => {
        switch(obj.property)
        {
            case 'pencil':
                ctx.strokeStyle = obj.color;
                ctx.lineWidth = obj.size;
                ctx.beginPath();
                ctx.moveTo(obj.start_position_x, obj.start_position_y);
                ctx.lineTo(obj.end_position_x, obj.end_position_y);
                ctx.stroke();
                ctx.closePath();
            break;
            case 'eraser':
                ctx.lineWidth = obj.size;
                ctx.globalCompositeOperation = "destination-out";
                ctx.beginPath();
                ctx.moveTo(obj.start_position_x, obj.start_position_y);
                ctx.lineTo(obj.end_position_x, obj.end_position_y);
                ctx.stroke();
                ctx.closePath();
                ctx.globalCompositeOperation = "source-over";
            break;
            case 'text':
                ctx.font = obj.textSize + 'px' + obj.textStyle;
                ctx.textBaseline = 'top';
                ctx.textAlign = 'left';
                ctx.fillText(obj.textInput, obj.start_position_x - 4, obj.start_position_y - 4);
            break;
            case 'image':
                let file = obj.input.files[0];
                let img = new Image();
                img.src = URL.createObjectURL(file);
                img.onload = function () {
                    ctx.drawImage(this, 0, 0, cvs.width, cvs.height);
                };
            break;
        }
    });
}

// Image function
function upload_img(input){
    let file = input.files[0];
    let img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function () {
        ctx.drawImage(this, 0, 0, cvs.width, cvs.height);
    };
    PushIntoArray("Image", input);
    console.log("draw Image");
}
function download_img(){
    let link = document.getElementById("download_link");
    link.download = "img.jpg";
    link.href = cvs.toDataURL("image/jpeg");
    link.click();
}

// reference: https://stackoverflow.com/questions/21011931/how-to-embed-an-input-or-textarea-in-a-canvas-element
function enterPress (event){
    // if enter is press, then drawText
    let keyCode = event.keyCode;
    if(keyCode === 13){
        drawText(this.value, parseInt(this.style.left, 10), parseInt(this.style.top, 10));
        document.body.removeChild(this);

        PushIntoArray(0, 0);
        mouse.hasInput = false;
    }
}
function addInput (x, y, xf, yf){
    // if mouseUp, add Input element
    let input = document.createElement('input');

    input.type = 'text';
    input.style.position = 'fixed';
    input.style.left = (x - 4) + 'px';
    input.style.top  = (y - 4) + 'px';
    input.style.fontSize = mouse.fontsize + 'px';

    input.onkeydown = enterPress;

    document.body.appendChild(input);
    input.focus();

    mouse.hasInput = true;
}
function drawText (txt, xt, yt){
    mouse.textInput = txt;
    ctx.font = mouse.fontsize + 'px ' + mouse.font;
    // draw text on canvas
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    // ctx.font = font; // let user able to add text font and size
    ctx.fillText(txt, mouse.text_x - 4, mouse.text_y - 4);
}

/* mouse function */
function mouseDown (event){
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    Redraw();

    mouse.down_x = mouse.x = event.offsetX;
    mouse.down_y = mouse.y = event.offsetY;
    
    mouse.hold = true;
    ctx.globalCompositeOperation = mouse.composite_op;

    console.log(mouse); // check where's the mouse
}
function mouseMove (event){
    if (mouse.hold === true) {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        Redraw();

        ctx.globalCompositeOperation = mouse.composite_op;
        switch (mouse.pen_style) {
            case 'pencil':
            case 'eraser':
                drawLine(event.offsetX, event.offsetY);
            break;
        }
        PushIntoArray(event.offsetX, event.offsetY);
        mouse.x = event.offsetX;
        mouse.y = event.offsetY;
    }
}
function mouseUp (event){
    if (mouse.hold === true) {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        Redraw();

        if(!mouse.hasInput && mouse.pen_style == "text"){
            // To understand the diff between clienX and pageX and offsetX:
            // https://kknews.cc/zh-tw/news/r3pzzr.html
            mouse.text_x = event.offsetX;
            mouse.text_y = event.offsetY;
            addInput(event.clientX, event.clientY);
        }
        else{
            drawLine(event.offsetX, event.offsetY);
            PushIntoArray(event.offsetX, event.offsetY);
        }
        mouse.down_x = mouse.x = 0;
        mouse.down_y = mouse.y = 0;
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
    let rect_s = document.getElementById("rectangle");
    // let circ_s = document.getElementById("circle");
    pencil.addEventListener('click', function () {
        changeMouse('pencil')}  , false);
    eraser.addEventListener('click', function () {
        changeMouse('eraser')}  , false);
    rect_s.addEventListener('click', function () {
        changeMouse('rect_s')}  , false);

    // Image
    let Image = document.getElementById("Upload");
    let Download = document.getElementById("download");
    Image.addEventListener('change', function () {
        upload_img(this);
    }, false);
    Download.addEventListener('click', function () {
        download_img();
    }, false);

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
        mouse.color = ctx.strokeStyle = color_selc.value;
    } , false);
    brush_size.addEventListener('change', function () {
        mouse.Brushsize = ctx.lineWidth = brush_size.value;
    }  , false);

    // Cursor style
    // reference: https://stackoverflow.com/questions/4564251/change-the-mouse-pointer-using-javascript

    // Refresh
    let refresh = document.getElementById("refresh");
    refresh.addEventListener('click', function () {
        if (confirm('Are you sure you want to refresh'))
            ctx.clearRect(0, 0, cvs.width, cvs.height);
    }  , false);
}

// https://stackoverflow.com/questions/17150610/undo-redo-for-paint-program-using-canvas