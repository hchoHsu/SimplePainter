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
    isMoving : false,
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
                fillStyle: document.getElementById("color_select").value,
                line_property: 'End'
            }
        break;
        case 'image':
            new_elt = {
                property: 'image',
                file: cur_x,
                line_property: 'End'
            }
        break;
        case 'refresh':
            new_elt = {
                property: 'refresh',
                line_property: 'End'
            }
        break;
        case 'circle':
            new_elt = {
                property: 'circle',
                position_center: cur_x,
                radius: cur_y,
                strokeStyle: ctx.strokeStyle,
                lineWidth  : ctx.lineWidth,
                line_property: 'move'
            }
            if(!mouse.isHolding)
                new_elt.line_property = 'End';
        break;
        case 'rectangle':
            new_elt = {
                property: 'rectangle',
                position_UpRight: mouse.position_down,
                width: cur_x,
                height: cur_y,
                strokeStyle: ctx.strokeStyle,
                lineWidth  : ctx.lineWidth,
                line_property: 'move'
            }
            if(!mouse.isHolding)
                new_elt.line_property = 'End';
        break;
        case 'triangle':
            new_elt = {
                property: 'triangle',
                position_now: mouse.position_down,
                position_nxt: [cur_x, cur_y],
                strokeStyle : ctx.strokeStyle,
                lineWidth   : ctx.lineWidth,
                line_property: 'move'
            }
            if(!mouse.isHolding)
                new_elt.line_property = 'End';
        break;
    }
    return new_elt;
}
function canvas_push(property, cur_x, cur_y){
    let new_element = createElement(property, cur_x, cur_y);
    execution_array.push(new_element);
    // console.log("push " + new_element.property);
}
function canvas_redraw(){
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
                ctx.drawImage(cur.file, 0, 0, cvs.width, cvs.height);
            break;
            case 'refresh':
                ctx.clearRect(0, 0, cvs.width, cvs.height);
            break;
            case 'circle':
                ctx.strokeStyle = cur.strokeStyle;
                ctx.lineWidth   = cur.lineWidth;
                ctx.beginPath();
                ctx.arc(cur.position_center[0], cur.position_center[1], cur.radius, 0, 2 * Math.PI, true);
                ctx.stroke();
                ctx.closePath();
            break;
            case 'rectangle':
                ctx.strokeStyle = cur.strokeStyle;
                ctx.lineWidth   = cur.lineWidth;
                ctx.strokeRect(cur.position_UpRight[0], cur.position_UpRight[1], cur.width, cur.height);
            break;
            case 'triangle':
                ctx.strokeStyle = cur.strokeStyle;
                ctx.lineWidth   = cur.lineWidth;

                ctx.beginPath();
                ctx.moveTo(cur.position_nxt[0], cur.position_nxt[1]);
                ctx.lineTo(cur.position_now[0], cur.position_nxt[1]);
                ctx.lineTo((cur.position_nxt[0] + cur.position_now[0]) / 2, cur.position_now[1]);
                ctx.lineTo(cur.position_nxt[0], cur.position_nxt[1]);
                ctx.stroke();
                ctx.closePath();
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
    // console.log("pop " + cur.property);

    len--;
    while(len){
        cur = execution_array[len - 1];
        if(cur.property == 'text' || cur.property == 'refresh' || cur.property == 'image') break;
        if(cur.line_property == 'End') break;
        // console.log("pop " + cur.property);
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
                // console.log("pop " + cur.property);
                execution_array.push(cur);
                execution_redo.pop();
                break;
            }
            // console.log("pop " + cur.property);
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
function drawCircle(cur_x, cur_y){
    ctx.strokeStyle = document.getElementById("color_select").value;
    ctx.lineWidth   = document.getElementById("brush_size").value;
    
    ctx.beginPath();
    let center = [(mouse.position_down[0] + cur_x) / 2, (mouse.position_down[1] + cur_y) / 2,];
    let a = mouse.position_down[0] - cur_x;
    let b = mouse.position_down[1] - cur_y;
    let radius = Math.sqrt(a*a + b*b) / 2;
    ctx.arc(center[0], center[1], radius, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.closePath();

    canvas_push(mouse.property, center, radius);
}
function drawRect(cur_x, cur_y){
    ctx.strokeStyle = document.getElementById("color_select").value;
    ctx.lineWidth   = document.getElementById("brush_size").value;
    
    let width  = cur_x - mouse.position_down[0];
    let height = cur_y - mouse.position_down[1];

    ctx.strokeRect(mouse.position_down[0], mouse.position_down[1], width, height);

    canvas_push(mouse.property, width, height);
}
function drawTri(cur_x, cur_y){
    ctx.strokeStyle = document.getElementById("color_select").value;
    ctx.lineWidth   = document.getElementById("brush_size").value;

    ctx.beginPath();
    ctx.moveTo(cur_x, cur_y);
    ctx.lineTo(mouse.position_down[0], cur_y);
    ctx.lineTo((mouse.position_down[0] + cur_x) / 2, mouse.position_down[1]);
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
    
    canvas_push('image', img, 0);
}
function download_img(){
    let link = document.getElementById("download_link");
    link.download = "img.png";
    link.href = cvs.toDataURL("image/png");
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
        case 'circle':
            mouse.property = "circle";
            cvs.style.cursor = "url('img/circle.cur'), auto";
        break;
        case 'rectangle':
            mouse.property = "rectangle";
            cvs.style.cursor = "url('img/rectangle.cur'), auto";
        break;
        case 'triangle':
            mouse.property = "triangle";
            cvs.style.cursor = "url('img/triangle.cur'), auto";
            console.log(cvs.style.cursor);
        break;
    }
    // console.log("mouse's property: " + mouse.property);
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
        case 'circle':
            drawCircle(cur_x, cur_y);
        break;
        case 'rectangle':
            drawRect(cur_x, cur_y);
        break;
        case 'triangle':
            drawTri(cur_x, cur_y);
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

    if(mouse.property == 'circle' || mouse.property == 'rectangle' || mouse.property == 'triangle'){
        if(execution_array.length > 0){
            if(execution_array[execution_array.length - 1].property == mouse.property){
                if(execution_array[execution_array.length - 1].line_property != 'End')
                    canvas_Undo();
            }
        }
    }
    callMouseFunction(event.offsetX, event.offsetY);
    mouse.position_now = [event.offsetX, event.offsetY];
}
function mouseUp(event){
    // console.log("mouse up");
    if(!mouse.isHolding || mouse.isTyping) return;

    mouse.isHolding = false;
    mouse.position_up = [event.offsetX, event.offsetY];
    // before(position_now) & now(event.offset)
    if(mouse.property == 'circle' || mouse.property == 'rectangle' || mouse.property == 'triangle'){
        if(execution_array.length > 0){
            if(execution_array[execution_array.length - 1].property == mouse.property){
                if(execution_array[execution_array.length - 1].line_property != 'End')
                    canvas_Undo();
            }
        }
    }

    if(mouse.property == "text")
        callMouseFunction(event.clientX, event.clientY);
    else
        callMouseFunction(event.offsetX, event.offsetY);
    // console.log(execution_array[execution_array.length - 1]);
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
    document.getElementById("circle").addEventListener('click', function () {
        changeMouse('circle')}  , false);
    document.getElementById("rectangle").addEventListener('click', function () {
        changeMouse('rectangle')}  , false);
    document.getElementById("triangle").addEventListener('click', function () {
        changeMouse('triangle')}  , false);
    
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