var cvs, ctx;

function mouseDown (event){
    let cx = event.pageX;
    let cy = event.pageY;

    console.log('(' + cx + ',' + cy + ')');
}

window.onload = function (){
    cvs = document.getElementById("canvas");
    ctx = cvs.getContext("2d");

    cvs.addEventListener('mousedown', mouseDown, false);
}