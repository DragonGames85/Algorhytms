import {arrayOfWeights} from "./weights.js";
import {
    backColor,
    border,
    borderColor,
    canvas,
    ctx, H,
    shapeAmount,
    shapeWidth,
    W
} from "./variables.js";
import {sigmoid} from "./neuralNetwork.js";

let vector = Array(25).fill(0);
canvas.style.display = 'block'
cells()


function cells() {
    let y;
    let x = y = 0
    // массив фигур
    let cells = []
    let h;
    let w = h = shapeWidth
    cellInitialization()


    function cellInitialization() {
        for (let i = 0; i < shapeAmount; i++) {
            let cell = new Cell(x, y)//Новая ячейка
            x += w
            if (x == W) {
                y += h
                x = 0
            }
            cells.push(cell)
        }
        drawCells()
    }

    function Cell(x, y) {
        this.x = x
        this.y = y
        this.color = backColor
        this.isSelected = false
    }

    function drawCells() {
        ctx.clearRect(0, 0, W, H)

        for (let i = 0; i < cells.length; i++) {
            let cell = cells[i]
            ctx.beginPath()
            ctx.rect(cell.x, cell.y, w, h)
            ctx.fillStyle = cell.color
            ctx.lineWidth = border
            ctx.strokeStyle = borderColor
            ctx.fill()
            ctx.stroke()

        }
    }
    //Обработчик событий
    canvas.onclick = click
    function click(e) {
        let clickX = e.pageX - canvas.offsetLeft,
            clickY = e.pageY - canvas.offsetTop

        for (let i = 0; i < cells.length; i++) {
            let cell = cells[i]
            if (clickX > cell.x && clickX < (cell.x + w) && clickY > cell.y && clickY < (cell.y + h)) {
                if (cell.isSelected == false) {
                    cell.isSelected = true
                    cell.color = 'black'
                    vector[(cell.x)/100+((cell.y)/100)*5] = 1
                } else {
                    cell.isSelected = false
                    cell.color = backColor
                    vector[(cell.x)/100+((cell.y)/100)*5] = 0
                }

                drawCells()
            }
        }
    }
    const clearButton = document.getElementById('buttonClear')
    clearButton.addEventListener('mousedown',function (){
        for (let i = 0; i < cells.length; i++) {
            let square = cells[i]
            square.isSelected = false
            square.color = backColor
        }
        vector = Array(25).fill(0);
        drawCells()
    })
}


const resultButton = document.getElementById('buttonResult')
resultButton.addEventListener('mousedown',function (){
    alert(likely(neuronFunction(vector)))
} );

function neuronFunction(input){
    let activations = input
    for (let layer of arrayOfWeights) {
        activations = layer.map(weights => {
            return sigmoid(math.dot(activations, weights))
        })
    }
    return activations
}

let likely = function (array){
   let maxValue = -1
    let ans = ''
    for (let i = 0; i<array.length; i++) {
        let value = array[i];
        if(value>maxValue){
            maxValue = value
            ans = i
        }
    }
    return ans
}