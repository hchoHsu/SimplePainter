/* Main Global Variables */
var cvs, ctx;
var execution_array = [];
var execution_redo  = [];
var isRedo = false;

var mouse = {
    property: 'pencil',
    position_down: [0, 0],
    position_now:  [0, 0],
    position_up:   [0, 0],

    isHolding: false,
    isTyping : false
}

/* Functions */
// Redrawing Array Functions
function createElement(property, cur_x, cur_y){
    isRedo = false;
    execution_redo.length = 0;

    let new_elt;
    switch (property){
        case 'pencil':
            new_elt =  {
                property: 'pencil',
                position_now: mouse.position_now,
                position_nxt: [cur_x, cur_y],  
                strokeStyle : ctx.strokeStyle,
                lineWidth   : ctx.lineWidth,
                line_property: 'move'
            }
            if(!mouse.isHolding)
                new_elt.line_property = 'End';
        break;
        case 'eraser':
            new_elt = {
                property: 'eraser',
                position_now: mouse.position_now,
                position_nxt: [cur_x, cur_y],
                strokeStyle : ctx.strokeStyle,
                lineWidth   : ctx.lineWidth,
                line_property: 'move'
            }
            if(!mouse.isHolding)
                new_elt.line_property = 'End';
        break;
        case 'text':
            new_elt = {
                property: 'text',
                position_up: mouse.position_up,
                font : ctx.font,
                fillText : cur_x,
                fillStyle: document.getElementById("color_select").value
            }
        break;
        case 'image':
            new_elt = {
                property: 'image',
                file: cur_x
            }
        break;
        case 'refresh':
            new_elt = {
                property: 'refresh'
            }
        break;
    }
    return new_elt;
}
function canvas_push(property, cur_x, cur_y){
    let new_element = createElement(property, cur_x, cur_y);
    execution_array.push(new_element);
    console.log("push " + new_element.property);

}
async function canvas_redraw(){
    let len = execution_array.length;
    if(len < 1) return;

    for(let idx = 0; idx < len; idx++){
        let cur = execution_array[idx];
        switch(cur.property)
        {
            case 'pencil':
                ctx.strokeStyle = cur.strokeStyle;
                ctx.lineWidth   = cur.lineWidth;
                ctx.beginPath();
                ctx.moveTo(cur.position_now[0], cur.position_now[1]);
                ctx.lineTo(cur.position_nxt[0], cur.position_nxt[1]);
                ctx.stroke();
                ctx.closePath();
            break;
            case 'eraser':
                ctx.globalCompositeOperation = 'destination-out';
                ctx.strokeStyle = cur.strokeStyle;
                ctx.lineWidth   = cur.lineWidth;
                ctx.beginPath();
                ctx.moveTo(cur.position_now[0], cur.position_now[1]);
                ctx.lineTo(cur.position_nxt[0], cur.position_nxt[1]);
                ctx.stroke();
                ctx.closePath();
                ctx.globalCompositeOperation = 'source-over';
            break;
            case 'text':
                ctx.font = cur.font;
                ctx.textBaseline = 'top';
                ctx.textAlign = 'left';
                let origin_fillStyle = ctx.fillStyle;
                ctx.fillStyle = cur.fillStyle;
                ctx.fillText(cur.fillText, cur.position_up[0] - 4, cur.position_up[1] - 4);
                ctx.fillStyle = origin_fillStyle;
            break;
            case 'image':
                // TODO:
                // The for loop will continue before the image loaded.
                // Fix the problem here.
                let img = new Image();
                const imageLoadPromise = new Promise(resolve => {
                    img.src = URL.createObjectURL(cur.file);
                    img.onload = function () {
                        ctx.drawImage(this, 0, 0, cvs.width, cvs.height);
                    };
                })
                await imageLoadPromise;
            break;
            case 'refresh':
                ctx.clearRect(0, 0, cvs.width, cvs.height);
            break;
        }
    }
}
function canvas_Undo(){
    let len = execution_array.length;
    if(len < 1) return;

    isRedo = true;
    let cur = execution_array[len - 1];
    execution_redo.push(cur);
    execution_array.pop();
    console.log("pop " + cur.property);

    len--;
    while(len){
        cur = execution_array[len - 1];
        if(cur.property != 'pencil' && cur.property != 'eraser') break;
        if(cur.line_property == 'End') break;
        console.log("pop " + cur.property);
        execution_redo.push(cur);
        execution_array.pop();
        len--;
    }

    ctx.clearRect(0, 0, cvs.width, cvs.height);
    canvas_redraw();
}
function canvas_Redo(){
    let len = execution_redo.length;
    if(len < 1 || !isRedo) return;

    let cur = execution_redo[len - 1];
    execution_redo.pop();
    execution_array.push(cur);

    if(cur.property == 'pencil' || cur.property == 'eraser'){
        len--;
        while(len){
            cur = execution_redo[len - 1];
            if(cur.property != 'pencil' && cur.property != 'eraser') break;
            if(cur.line_property == 'End'){
                console.log("pop " + cur.property);
                execution_array.push(cur);
                execution_redo.pop();
                break;
            }
            console.log("pop " + cur.property);
            execution_array.push(cur);
            execution_redo.pop();
            len--;
        }
    }

    ctx.clearRect(0, 0, cvs.width, cvs.height);
    canvas_redraw();
}
// drawer
function drawLine(cur_x, cur_y){
    ctx.strokeStyle = document.getElementById("color_select").value;
    ctx.lineWidth   = document.getElementById("brush_size").value;
    
    ctx.beginPath();
    ctx.moveTo(mouse.position_now[0], mouse.position_now[1]);
    ctx.lineTo(cur_x, cur_y);
    ctx.stroke();
    ctx.closePath();

    canvas_push(mouse.property, cur_x, cur_y);
}
function drawText(txt, fontSize, fontFamily){
    if(txt == '')   return;

    ctx.font = fontSize + ' ' + fontFamily;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    let origin_fillStyle = ctx.fillStyle;
    ctx.fillStyle = document.getElementById("color_select").value;
    ctx.fillText(txt, mouse.position_up[0] - 4, mouse.position_up[1] - 4);
    ctx.fillStyle = origin_fillStyle;
    
    canvas_push('text', txt, 0);
}
function enterPress (event){
    let keyCode = event.keyCode;
    if(keyCode === 13){
        drawText(this.value, this.style.fontSize, this.style.fontFamily);
        document.body.removeChild(this);
        mouse.isTyping = false;
    }
}
function addInput(cur_x, cur_y){
    let input = document.createElement('input');

    input.type = 'text';
    input.style.position = 'fixed';
    input.style.left = (cur_x - 4) + 'px';
    input.style.top  = (cur_y - 4) + 'px';
    input.style.fontSize   = document.getElementById("fontsize").value + 'px';
    input.style.fontFamily = document.getElementById("fontType").options[document.getElementById("fontType").selectedIndex].value;
    input.onkeydown = enterPress;

    document.body.appendChild(input);
    input.focus();
    mouse.isTyping = true;
}
// image control
function upload_img(input){
    let file = input.files[0];
    let img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function () {
        ctx.drawImage(this, 0, 0, cvs.width, cvs.height);
    };
    
    canvas_push('image', file, 0);
}
function download_img(){
    let link = document.getElementById("download_link");
    link.download = "img.jpg";
    link.href = cvs.toDataURL("image/jpeg");
    link.click();
}
// selector
function changeMouse (property){
    if(mouse.isTyping)
        property = 'text';

    switch (property){
        case 'pencil':
            mouse.property = "pencil";
            cvs.style.cursor = "url('img/pencil.cur'), auto";
        break;
        case 'eraser':
            mouse.property = "eraser";
            cvs.style.cursor = "url('img/eraser.cur'), auto";
        break;
        case 'text':
            mouse.property = "text";
            cvs.style.cursor = "text"
        break;
    }
    console.log("mouse's property: " + mouse.property);
}
function callMouseFunction (cur_x, cur_y){
    switch (mouse.property){
        case 'pencil':
            drawLine(cur_x, cur_y);
        break;
        case 'eraser':
            ctx.globalCompositeOperation = 'destination-out';
            drawLine(cur_x, cur_y);
            ctx.globalCompositeOperation = 'source-over';
        break;
        case 'text':
            // Will be called after the mouse is released
            if(!mouse.isHolding && !mouse.isTyping) addInput(cur_x, cur_y);
        break;
    }
}
// mouse action
function mouseDown(event){
    if(mouse.isTyping) return;

    mouse.position_down = [event.offsetX, event.offsetY];
    mouse.position_now  = [event.offsetX, event.offsetY];
    mouse.isHolding = true;
}
function mouseMove(event){
    if(!mouse.isHolding || mouse.isTyping) return;

    // ctx.clearRect(0, 0, cvs.width, cvs.height);
    // canvas_redraw();

    // before(position_now) & now(event.offset)
    callMouseFunction(event.offsetX, event.offsetY);
    mouse.position_now = [event.offsetX, event.offsetY];
}
function mouseUp(event){
    if(!mouse.isHolding || mouse.isTyping) return;

    // ctx.clearRect(0, 0, cvs.width, cvs.height);
    // canvas_redraw();

    mouse.isHolding = false;
    mouse.position_up = [event.offsetX, event.offsetY];
    // before(position_now) & now(event.offset)
    if(mouse.property == "text")
        callMouseFunction(event.clientX, event.clientY);
    else
        callMouseFunction(event.offsetX, event.offsetY);
}

window.onload = function ()
{
    cvs = document.getElementById("canvas");
    ctx = cvs.getContext("2d");

    // cvs.addListener: https://developer.mozilla.org/zh-CN/docs/Web/Events
    cvs.addEventListener('mousemove', mouseMove, false);
    cvs.addEventListener('mousedown', mouseDown, false);
    cvs.addEventListener('mouseup'  , mouseUp  , false);

    // Mouse Style
    document.getElementById("pencil").addEventListener('click', function () {
        changeMouse('pencil')}  , false);
    document.getElementById("eraser").addEventListener('click', function () {
        changeMouse('eraser')}  , false);
    document.getElementById("textInput").addEventListener('click', function () {
        changeMouse('text')}    , false);
    
    // Image Up/Down load
    document.getElementById("Upload").addEventListener('change', function () {
        upload_img(this)}       , false);
    document.getElementById("download").addEventListener('click', function () {
        download_img()}         , false);

    // Refresh
    let refresh = document.getElementById("refresh");
    let undoBtn = document.getElementById("Undo");
    let redoBtn = document.getElementById("Redo");
    refresh.addEventListener('click', function () {
        if (confirm('Are you sure you want to refresh')){
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            document.getElementById("Upload").value = '';
            canvas_push('refresh', 0, 0);
        }
    }  , false);
    undoBtn.addEventListener('click', function () {
        canvas_Undo();
    }  , false);
    redoBtn.addEventListener('click', function () {
        canvas_Redo();
    }  , false);
}