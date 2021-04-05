# Software Studio Assigment 1
This is a simple painter create by canvas.
About all the reference has been writen in the code.

Down below is an overview of this code.
## HTML structure

## CSS design

## JS function


## Record：
2021/04/05: The problem now is cannot load image since the image will take time to load, and the redraw function will break down by the loop without await, now is trying to fix it.

### Draw Layor：
+ If chose the botton: change the mouse property

1. mouseDown
    isHolding = true;
    set position down;
2. mouseMove
    callFunction：
        + call draw function (the draw function will push itself)
    set position now;
3. mouseUp
    isHolding = false;
    set position up;
    callFunction：