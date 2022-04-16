import {header} from "./app.js"
function uniqueValues(rows, colum){
    let uniqueSet = new Set();
    for(let row in rows){
        uniqueSet.push(row[colum])
    }
    return uniqueSet
}

function labelCount(rows){
    let counts = {}
    for(let i = 0; i<rows.length; i++){
        //Здесь иммеется ввиду, что label в крайнем столбце
        let label = rows[i][rows[i].length -1]
        if (!(label in counts)){
            counts[label]=0
        }
        counts[label] += 1
    }
    return counts
}

function isNumeric(value){
    return (typeof value == "number")
}

class Question{
    constructor(column, value) {
        this.column = column
        this.value = value
    }

    match (row) {
        let val = row[this.column]
        if(isNumeric(val)){
            return val >= this.value
        }
        else return val===this.value
    };
    repr(){
        let condition = "=="
        if(isNumeric(this.value)){
            condition = ">="
        }
        return "Is "+ header[this.column] + condition + this.value
    }
}

function partition(rows, question){
    let trueRows = []
    let falseRows = []
    for(let i = 0; i<rows.length; i++) {
        if (question.match(rows[i]))
            trueRows.push(rows[i])
        else {
            falseRows.push(rows[i])
        }
    }
    return [trueRows, falseRows]
}

function gini(rows){
    let counts = labelCount(rows)
    let impurity = 1
    for(let label in counts){
        let probOfLabel = counts[label]/rows.length
        impurity -= Math.pow(probOfLabel,2)
    }
    return impurity
}

function infoGain(left, right, currentUncertainty){
    let p = left.length / (left.length + right.length)
    return (currentUncertainty - p * gini(left) - (1 - p) * gini(right))
}

function findTheBestSplit(rows){
    let bestGain = 0
    let bestQuestion = NaN
    let currentUncertainty = gini(rows)
    let nFeatures = rows[0].length-1
    for(let col = 0; col<nFeatures; col++){
        let values = new Set()

        for(let i = 0; i<rows.length; i++){
            values.add(rows[i][col])
        }
        for (let item of values){
            let question = new Question(col, item)

            const [trueRows, falseRows] = partition(rows, question)

            if (trueRows.length == 0 || falseRows.length == 0){
                continue
            }
            let gain = infoGain(trueRows, falseRows, currentUncertainty)
            if (gain >= bestGain){
                bestGain = gain
                bestQuestion = question
            }
        }
    }

    return [bestGain, bestQuestion]

}

export class Leaf{
    constructor(rows,x,y) {
        this.predictions = labelCount(rows)
        this.x = x
        this.y = y
    }
}
export class DecisionNode{
    constructor(question, trueBranch, falseBranch,x,y) {
        this.question = question
        this.trueBranch = trueBranch
        this.falseBranch = falseBranch
        this.x = x
        this.y = y
    }
}
let allOfGain = []
export function buildTree(rows, minGain = 0){
    const [gain, question] = findTheBestSplit(rows)
    if(gain!=0) allOfGain.push(gain)
    if (gain == 0){
        let leaf = new Leaf(rows)
        return new Leaf(rows)}
    const [trueRows, falseRows] = partition(rows,question)

    let trueBranch = buildTree(trueRows)
    let falseBranch = buildTree(falseRows)
    return new DecisionNode(question, trueBranch, falseBranch)
}
