var canv = document.getElementById("canvas"),
    ctx = canv.getContext('2d');

let size = document.getElementById('input-in'),
    button = document.getElementById('button1'),
    button2 = document.getElementById('button2'),
    button3 = document.getElementById('button3'),
    button4 = document.getElementById("button4");

var canvasWidth = 500,
    canvasHeight = 500;

canv.width = canvasWidth;
canv.height = canvasHeight;
canv.style.backgroundColor = "white"
var cellWidth;
var cellHeight;
var ROW;
var begin, end;
var cells;


function matrixArray(rows){
    var arr = [];
    for(let i=0; i< rows; i++){
		    const row = [];
			for (let j = 0; j < rows; j++){
				row.push(0);
			}
			arr.push(row);
		  }
    return arr;
  }

button.onclick =  function(){
	ROW = size.value;
	cellWidth =  (canvasWidth) / ROW;
    cellHeight = (canvasHeight) / ROW;
	buildingField();
	alert("Создайте стены лабиринта, и нажмите Начало и конец");
	canv.addEventListener('mousedown', handleMouseDown, false)
    canv.addEventListener('mouseup', handleMouseUp, false)
}

button2.onclick = function(){
	let i = 0;
	alert( "Нажмите на начало и конец лабиринта");
	canv.removeEventListener('mousedown', handleMouseDown, false)
    canv.removeEventListener('mouseup', handleMouseUp, false)
	canv.addEventListener('click', roud1);
	function roud1(event){
		var cellUnderCursor = getCellByPosition(event)
		if (cellUnderCursor.solid !== false) {
			cellUnderCursor.fill('red');
		}
		if ( i === 0 ){
			begin = cellUnderCursor;
			i++
		}
		else if ( i === 1) {
			end = cellUnderCursor;
			canv.removeEventListener('click',roud1);
		}
	}
}

function buildingField(){
	cells = matrixArray(ROW);
	let top = -cellWidth, left = -cellHeight;

	for(let i = 0; i < ROW;  i++){
		top += cellWidth;
		for(let j = 0; j < ROW; j++){
			left += cellHeight;
			var cell = {
				top: top,
				left: left,
				solid: false,
				index_i:i,
				index_j:j,
				closed: false,
				visited:false,
				F: 0,
				G: 0,
				parents: null,

				fill: function (colour) {
					this.solid = !this.solid;
					ctx.fillStyle = this.solid ? '#fff' : colour;
					ctx.fillRect(this.left-0.5, this.top-0.5, cellWidth, cellHeight);
					if(this.solid){this.drawBorder()}
				},
				drawBorder: function () {
					ctx.beginPath();
					ctx.strokeStyle = 'black';
					ctx.moveTo(this.left - 0.5, this.top - 0.5)
					ctx.lineTo(this.left - 0.5, this.top + cellWidth - 0.5)
					ctx.lineTo(this.left + cellHeight - 0.5, this.top + cellWidth - 0.5)
					ctx.lineTo(this.left + cellHeight - 0.5, this.top - 0.5)
					ctx.lineTo(this.left - 0.5, this.top - 0.5)
					ctx.stroke()
				},
			}
			cells[i][j] = cell;
			cell.fill('#000');
			cell.drawBorder();
		}
		left = -cellHeight;
	}
ctx.beginPath();
ctx.strokeStyle = 'black';
ctx.moveTo(0,  0)
ctx.lineTo( 0,  500)
ctx.lineTo(500, 500)
ctx.lineTo(500, 0)
ctx.lineTo(0.5,  0.5)
ctx.stroke()

}

function getCellByPosition(event) {  
	var x = event.layerX-event.target.offsetLeft-20,
        y = event.layerY-event.target.offsetTop-20,
	    topIndex = Math.floor(x / cellHeight),
	    leftIndex = Math.floor(y / cellWidth);
	return cells[leftIndex][topIndex];
}

var filling = false;

function fillCellAtPositionIfNeeded(event, filling) {
	var cellUnderCursor = getCellByPosition(event)
	if (cellUnderCursor.solid !== filling) {
		cellUnderCursor.fill("black")
	}
}
function handleMouseDown(event) {
	filling = !getCellByPosition(event).solid
	fillCellAtPositionIfNeeded(event, filling)

	canv.addEventListener('mousemove', handleMouseMove, false)
}

function handleMouseUp() {
	canv.removeEventListener('mousemove', handleMouseMove)
}

function handleMouseMove(event) {
	fillCellAtPositionIfNeeded(event, filling)
}

function delay(delayInms) {
	return new Promise(resolve => {
	  setTimeout(() => {
		resolve(2);
	  }, delayInms);
	});
}

button3.onclick = function() {
 A_Star();
}

async function A_Star(){
	end.solid = true;
	begin.solid = true;
	var openSet = [];
	openSet.push(begin);
    begin.visited = true;
	var flag = 0;

	while(openSet.length > 0){
	var lowInd = 0;
	for(var i=0; i<openSet.length; i++) {
		if(openSet[i].F< openSet[lowInd].F) { lowInd = i; }
	}
	var currentNode = openSet[lowInd];
	openSet.splice(lowInd,1);

	if (currentNode == end) {
        while(currentNode.parents) {
			currentNode.solid = !currentNode.solid;
          currentNode.fill("red");
          currentNode = currentNode.parents;
        }
		flag++;
		break;
    }

	  currentNode.closed = true;
	  var neighbors = getneighbors(currentNode, end);

	  for(var i=0, il = neighbors.length; i < il; i++) {
		  var neighbor = neighbors[i];
			  if (!neighbor.visited) {
				fillPoint(neighbor);
				await delay(20);
				openSet.push(neighbor);
				neighbor.visited = true; 
			  }
		  }
	}
	  if(flag === 0){alert("Путь не найден");}
}
function fillPoint(neighbor){neighbor.fill("blue");}

function getneighbors(current,end) {
	var ret = [],
	i = current.index_i;
	j = current.index_j;
	var gScore = current.G + cellHeight;

	if( i > 0  && cells[i-1][j].solid && !cells[i-1][j].closed){
		if(gScore < cells[i-1][j].G || !cells[i-1][j].visited){
		cells[i-1][j].parents = current;
		MetodManchetena(cells[i-1][j], end);
		}
		ret.push(cells[i-1][j]);
	}

	if( i < ROW-1  && cells[i+1][j].solid && !cells[i+1][j].closed){
		if(gScore < cells[i+1][j].G || !cells[i+1][j].visited){
		cells[i+1][j].parents = current;
		MetodManchetena(cells[i+1][j], end);
		}
		ret.push(cells[i+1][j]);
	}

	if( j > 0  && cells[i][j-1].solid && !cells[i][j-1].closed){
		if(gScore < cells[i][j-1].G || !cells[i][j-1].visited){
		cells[i][j-1].parents = current;
		MetodManchetena(cells[i][j-1], end);
		}
		ret.push(cells[i][j-1]);
	}

	if( j < ROW-1  && cells[i][j+1].solid && !cells[i][j+1].closed){
		if(gScore < cells[i][j+1].G || !cells[i][j+1].visited){
		cells[i][j+1].parents = current;
		MetodManchetena(cells[i][j+1], end);
		}
		ret.push(cells[i][j+1]);
	}
	return ret;
}

function MetodManchetena(currentNode, end){
	currentNode.G = cellHeight + currentNode.parents.G;
	H = Math.abs(end.top - currentNode.top) + Math.abs(end.left - currentNode.left);
	currentNode.F = H + currentNode.G;		
}
button4.onclick = function buildingMaze(){
	var matrix = matrixArray(ROW);
	for(let i = 0; i < ROW; i++){
		for(let j = 0; j < ROW; j++){
			cells[i][j].fill("black");
		    matrix[i][j] = false;
		}
	}
	const road = {
			x:0,
			y:0  }

	matrix[0][0] = true;
	cells[0][0].fill("black");
	while(!emptyRoad(matrix)){
		drawMaze(road, matrix);
	}
	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.moveTo(0,  0)
	ctx.lineTo( 0,  500)
	ctx.lineTo(500, 500)
	ctx.lineTo(500, 0)
	ctx.lineTo(0.5,  0.5)
	ctx.stroke()

}
function emptyRoad(matrix){
	for (let y = 0; y < ROW; y += 2) {
		for (let x = 0; x < ROW; x += 2) {
			if (!matrix[y][x]) {
				return false;
			}
		}
	}
	return true;
}
function drawMaze(road, matrix){
	const currentPoint = [];

	if ((road.x - 2) >= 0) {
		currentPoint.push([-2, 0]);
	}

	if ((road.x + 2) < ROW ) {
		currentPoint.push([2, 0]);
	}

	if ((road.y - 2) >= 0) {
		currentPoint.push([0, -2]);
	}

	if ((road.y + 2) < ROW) {
		currentPoint.push([0, 2]);
	}
	const index = Math.floor(Math.random() * currentPoint.length);
	const [dx, dy] = currentPoint[index];
	road.x += dx;
	road.y += dy;

	if ( !matrix[road.y][road.x]) {
		matrix[road.y][road.x] = true;
		cells[road.y][road.x].fill("black");
		matrix[road.y - dy / 2][road.x - dx / 2] = true;
		cells[road.y- dy / 2][road.x- dx / 2].fill("black");
	}
}

