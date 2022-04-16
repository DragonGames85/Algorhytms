import {canvas, xCorForRoot,yCorForRoot,hSpacing,x,wSpace} from "./variables.js";
import {Leaf,DecisionNode} from "./algorithm.js"

let ctx = canvas.getContext("2d");

function drawNode(xCor, yCor, string, color){
    ctx.fillStyle = color
    ctx.fillRect(xCor,yCor,40,40)
    ctx.fillStyle = "black"
    ctx.stroke();
    ctx.fillText(string,xCor,yCor+25)
}

function drawLeaf(xCor, yCor, string, color){
    ctx.beginPath();
    ctx.arc(xCor, yCor, 20, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.fill()
    ctx.stroke();

    ctx.save()
    ctx.fillStyle = "black"
    ctx.translate( xCor-20, yCor+5)
    ctx.rotate(-20 * Math.PI / 180)
    ctx.textAlign = "left"
    ctx.fillText(string,0,0)

    ctx.restore()
}
let drawLine = function(x1, y1, x2, y2, color = 'gray') {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineJoin = 'miter';
    ctx.lineWidth = 1;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath()
    ctx.stroke();
}

//let wSpacing = 150
function forPredictions(predictions){
    let sumOfCounts = 0;
    let keys = []
    let finalString  = ""

    for(let label in predictions){
        sumOfCounts+=predictions[label]
    }
    for (let label in predictions){
        let percents = (predictions[label]/sumOfCounts)*100
        finalString+= label+" "+percents.toString()+"%"+"\n"
    }
    return finalString
}

export function coordinates(node,n,numOfNodesOnLevel, nodePointer){
    let canvasW = canvas.width
    if(!(n in nodePointer)) nodePointer[n] = 0
    nodePointer[n]+=1
    let step = canvasW/(numOfNodesOnLevel[n]+1)

    if(node instanceof Leaf){
        node.x = canvasW - nodePointer[n]*step
        node.y = n*hSpacing
        return;
    }

    node.x = canvasW - nodePointer[n]*step
    node.y = n*hSpacing
    let right = coordinates(node.trueBranch, n+1,numOfNodesOnLevel,nodePointer)
    let lef = coordinates(node.falseBranch,n+1,numOfNodesOnLevel, nodePointer)
}

export function printTree(node, spacing="",xCor, yCor, n,numOfNodesOnLevel){
    if (node instanceof Leaf){
        let prediction = forPredictions(node.predictions)
        let someString = "Predict "+ prediction
        drawLeaf(node.x,node.y,someString,"SeaGreen")
        return;
    }
    let wSpacing
    wSpacing = (canvas.width/(numOfNodesOnLevel[n]+1))/2

    //Node
    drawNode(node.x,node.y,node.question.repr(),"Aquamarine")
    //Рисуем линии
    //True
    drawLine(node.x+40,node.y+40,node.trueBranch.x,node.trueBranch.y)
    printTree(node.trueBranch,"",xCor+wSpacing,yCor+hSpacing,n+1,wSpacing,numOfNodesOnLevel)

    drawLine(node.x,node.y+40,node.falseBranch.x,node.falseBranch.y)
    printTree(node.falseBranch,"",xCor-wSpacing+30,yCor+hSpacing,n+1,wSpacing,numOfNodesOnLevel)
}

export function classify(row, node, xCor, yCor,n){
    if (node instanceof Leaf){
        let prediction = forPredictions(node.predictions)
        let someString = "Predict "+ prediction
        drawLeaf(node.x,node.y,someString,"MediumPurple")
        return;
    }

    let wSpacing
    wSpacing = wSpace/Math.pow(2,n)+20
    console.log(wSpacing)

    drawNode(node.x,node.y,node.question.repr(),"Blue")

    if (node.question.match(row)){
        return classify(row, node.trueBranch,xCor+wSpacing,yCor+hSpacing,n+1)
    }
    else {
        return classify(row, node.falseBranch,xCor-wSpacing+30,yCor+hSpacing,n+1)}
}
