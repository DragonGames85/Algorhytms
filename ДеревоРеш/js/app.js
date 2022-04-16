import {
    ansButton,
    canvas,
    hSpacing,
    regex,
    resultButton,
    textArea,
    textAreaForTestingData
} from "./variables.js";
import { buildTree, Leaf} from "./algorithm.js"
import {xCorForRoot,yCorForRoot} from "./variables.js";
import {printTree,coordinates} from "./visualization.js";
import {classify} from "./visualization.js"

let text
export let header
let training_data
let myTree
export let height
let ctx = canvas.getContext("2d");
let textRow


function parse(){
    let endOfHeader =  text.slice(0, text.indexOf("\n")).length
    let header_cols = text.slice(0, text.indexOf("\n")).split(regex);
    const row_data = []
    let someString= ""
    for(let i = endOfHeader+1; i <= text.length;i++){
        if(text[i]!=="\n" && i!==text.length) {
            someString+=text[i]
        }
        else {
            row_data.push(someString.split(regex))
            someString = ""}
    }
    for(let row = 0; row<row_data.length; row++){
        for(let index = 0; index<row_data[row].length;index++){
            if(!isNaN(row_data[row][index])){
                row_data[row][index] = Number((row_data[row][index]))
            }
        }
    }
    return [row_data, header_cols]
}

function maxOfDictionary(dictionary){
    let maxValue = -10000000
    for(let char in dictionary){
        if(dictionary[char]> maxValue){
            maxValue = dictionary[char];
        }
    }
    return maxValue
}
function heightOfTree(node,n,numOfNodesOnLevel){
    if(node === NaN)
        return 0;
    let left, right;
    if(!(n in numOfNodesOnLevel)) numOfNodesOnLevel[n] = 0
    numOfNodesOnLevel[n]+=1
    if (!(node.trueBranch instanceof Leaf)) {
        left = heightOfTree(node.trueBranch,n+1,numOfNodesOnLevel);
    }else{
        left = -1;

        let nPlusOne = n+1
        if(!(nPlusOne in numOfNodesOnLevel)) numOfNodesOnLevel[nPlusOne] = 0
        numOfNodesOnLevel[nPlusOne]+=1
    }
    if (!(node.falseBranch instanceof Leaf)) {
        right = heightOfTree(node.falseBranch,n+1,numOfNodesOnLevel);
    }else{
        right = -1;
        let nPlusOne = n+1
        if(!(nPlusOne in numOfNodesOnLevel)) numOfNodesOnLevel[nPlusOne] = 0
        numOfNodesOnLevel[nPlusOne]+=1
    }
    let max = left > right ? left : right;
    return max+1;
}

resultButton.addEventListener("mousedown",function (e) {
    text =  textArea.value;
    const [training_dates,headers] =  parse()
    header = headers
    training_data = training_dates
    myTree = buildTree(training_data)
    console.log(myTree)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let numOfNodesOnLevel = {}
    let nodePointer = {}
    height = heightOfTree(myTree,0,numOfNodesOnLevel)
    canvas.setAttribute('height', ((height+1)*hSpacing+50).toString())
    let maxLength = maxOfDictionary(numOfNodesOnLevel)*80

    if (maxOfDictionary(numOfNodesOnLevel)<=4) maxLength = 800
    canvas.setAttribute('width', maxLength.toString())
    coordinates(myTree,0,numOfNodesOnLevel, nodePointer)
    myTree.y = yCorForRoot

    printTree(myTree,"",xCorForRoot,yCorForRoot,0,numOfNodesOnLevel)

})

ansButton.addEventListener("mousedown", function (e){
    let numOfNodesOnLevel = {}
    let nodePointer = {}
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    height = heightOfTree(myTree,0,numOfNodesOnLevel)
    canvas.setAttribute('height', ((height+1)*hSpacing+50).toString())
    coordinates(myTree,0,numOfNodesOnLevel, nodePointer)
    myTree.y = yCorForRoot
    printTree(myTree,"",xCorForRoot,yCorForRoot,0,numOfNodesOnLevel)
    textRow = textAreaForTestingData.value
    console.log(textRow)
    let testingData = textRow.split(regex)
    console.log(testingData)
    for(let i = 0; i< testingData.length; i++){
        console.log( testingData[i])
        if(!isNaN(testingData[i])){
            testingData[i] = Number((testingData[i]))
            console.log(testingData[i])
        }
    }
    classify(testingData,myTree,xCorForRoot,yCorForRoot, 0)
})