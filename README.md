# Software Studio 2021 Spring
## Assignment 01 Web Canvas


### Scoring

| **Basic components**                             | **Score** | **Check** |
| :----------------------------------------------- | :-------: | :-------: |
| Basic control tools                              | 30%       | Y         |
| Text input                                       | 10%       | Y         |
| Cursor icon                                      | 10%       | Y         |
| Refresh button                                   | 10%       | Y         |

| **Advanced tools**                               | **Score** | **Check** |
| :----------------------------------------------- | :-------: | :-------: |
| Different brush shapes                           | 15%       | Y         |
| Un/Re-do button                                  | 10%       | Y         |
| Image tool                                       | 5%        | Y         |
| Download                                         | 5%        | Y         |

| **Other useful widgets**                         | **Score** | **Check** |
| :----------------------------------------------- | :-------: | :-------: |
| line shape brush, button hint                    | 1~5%      | Y         |


---

### How to use 

    The Page can be seperated by two parts：The tool bar at the left side, and the canvas itself .

#### Canvas：

    This part is where the user can draw their imagination on.

    Default paint style is pencil with color black and width 1px, and the user can draw the lines on the white part at the middle of the page while they click down the mouse and move it.

    Continue to move the mouse while mouse down can draw a continuous line.

#### Toolbar：
    
    The ToolBar contains all the paint style and functions, which is the place that user can choose the way and the tool they want to use now.

    Down below is the instruction of the use of every tool in the tool bar：

+ Basic Brush Component:

    + Brush Size:

        This is where you can change the brush width, the side bar down below it can slide from size 1px to 50px, changing the line you draw after.

    + Color Select:

        Click the side block with color, you can choose the brush color by simply click on the color you want.

+ Text function:

    + Font Style:
    
        You can choose the font style you want by choosing the font style at the menu next to it.

    + Font Size:

        You can select the font size at the text box next to it just by simply input the number inside.

        Remember if the input number is negative, the font size won't change.

+ Basic Tool Change:

    The Function down below will become image show on the left side in the tool bar.

    > If you don't know the button's function name, move your mouse to the button and stay for a while, then the function name of this button will show up as a little block.

    + Pencil:

        Change your brush to a continuous line when you hold and move it.

    + Eraser:

        Change your brush to an eraser that can clean the line your cursor holded and moved.

    + Text:

        Switch to text mode, and then if you click a place in canvas, the input box will show up, you can text your input into the box. Press the enter key to end the input, then your text will show up on the canvas.

    + Rectangle:

        Switch to rectangle, you can draw a rectangle by click on the canvas, then hold and move your cursor to adjust the size of it, release the mouse to insure and draw the rectangle on the canvas.

    + Circle:

        Draw a circle as same as Rectangle.

    + Triangle:

        Draw a triangle as same as Rectangle.

    + Undo:

        You can undo the lastest draw now by clicking this button.

    + Redo:

        You can redo the draw that you undo.

    + Upload:

        You can choose a picture upload to the canvas and draw on it.

    + Download:

        You can download the paint you draw on canvas.

    + Refresh:

        You can clear the whole canvas.

### Function description

    Additional function：Line shape style, button hint.

+ Line shape style：

    Click the button with a straight line at the left-hand side can let the user draw a straight line from where they start mousedown to where they release the mouse.

+ Button Hint：

    Stay on the button for a while, you can see the function name of this button.

### Gitlab page link

    https://108062109.gitlab.io/AS_01_WebCanvas

<style>
table th{
    width: 100%;
}
</style>