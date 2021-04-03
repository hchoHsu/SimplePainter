# Software Studio Assigment 1
This is a simple painter create by canvas.
About all the reference has been writen in the code.

Down below is an overview of this code.
## HTML structure

## CSS design

## JS function


## Problems Figuring now:
### Undo Redo:

for every mouse movement:
    clearRect
    Redraw
    Put the current element onto canvas
    Push the current element into array

Push element into array:
    basic component: {
        property:       ,
        start_position: ,   (x, y)
        end_position:   ,   (x, y) or (width, height)
        others:
    }

Redraw:
    check every element property
        if pencil:
            set brush size / color
            drawline();
        if eraser:
            set brush size / globalCompositeOperation
            drawline();
        if text:
            set font size / style / text
            drawText();