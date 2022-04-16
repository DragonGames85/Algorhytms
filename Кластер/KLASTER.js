
var canv = document.getElementById("canvas");
var ctx = canv.getContext('2d');

var canvasWidth = 1230;
var canvasHeight = 560;
canv.width = canvasWidth;
canv.height = canvasHeight;

canv.style.backgroundColor = "black";

const arrayKlacterPoint = [];
var number = 0;
let quantity = 0;
var flagForfunctionColour = 0;
let button1 = document.getElementById('button');
let input1 = document.getElementById('input');
let button2 = document.getElementById('hieristic');
let button3 = document.getElementById('ost');

canv.addEventListener('click', GetKlaster);

button1.onclick =  function(){
    quantity = input1.value;
}

button2.onclick = function(){
    hierarchicClaster();
}

button3.onclick = function(){
    spanningTree();
}
function GetKlaster(event) {
    var point = {
        x:event.layerX-event.target.offsetLeft,
        y:event.layerY-event.target.offsetTop,
        index: number,
        claster: [],
        radius:5,
        parent: null,
        near_x:event.layerX-event.target.offsetLeft,
        near_y:event.layerY-event.target.offsetTop,
        fillArc: function(colour){
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
            ctx.fillStyle = colour;
            ctx.fill();
        },
        getClaster: function(point){
            this.claster.push(point);
        }
    }
    arrayKlacterPoint.push(point);
    point.getClaster(number);
    number++;
    point.fillArc("white");
}

function hierarchicClaster(){
if (flagForfunctionColour === 0){
    var array = arrayKlacterPoint.slice(0);
    while(array.length >= quantity){
         var min = {
                value: 10000000000000,
                index_i: 0,
                index_j: 0
        }
        for(var i = 0; i < array.length; i++){
           for(var j = 0; j < array.length; j++){
                var d = euclideanDistance(array[i], array[j]);
                if((min.value > d) && (i !== j)){
                        min.value = d;  
                        min.index_j = j;
                        min.index_i = i;
                }
            }    
        }

        if(array.length > quantity){
            UnityKlaster(min.index_i, min.index_j, array);
            array.splice(min.index_j, 1);
            }
        else{
            fillClasters(array);
            break;
            }
        }
    }
}

function UnityKlaster(point_1, point_2, array){
    for(var i = 0; i < array[point_2].claster.length; i++){
        array[point_1].getClaster(array[point_2].claster[i]);
    }
    array[point_2] = 0;
    var X = 0, Y = 0;
    for(var i = 0; i < array[point_1].claster.length; i++){
        X += arrayKlacterPoint[array[point_1].claster[i]].near_x;
        Y += arrayKlacterPoint[array[point_1].claster[i]].near_y;
    }
    X = Math.floor(X/array[point_1].claster.length);
    Y = Math.floor(Y/array[point_1].claster.length);
    array[point_1].near_x = X;
    array[point_1].near_y = Y;
}
function euclideanDistance(point_1, point_2){
    var D = Math.sqrt((point_1.near_x - point_2.near_x)**2 + (point_1.near_y - point_2.near_y)**2);
    return D;
}
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

function fillClasters(array){
  flagForfunctionColour++;
  for(var i = 0; i < array.length; i++){
      var color = 'rgb(' + Math.round(Math.random()*255) + ',' + Math.round(Math.random()*255) + ',' + Math.round(Math.random()*255) +')';
      for(var j = 0; j < array[i].claster.length; j++){
        arrayKlacterPoint[array[i].claster[j]].fillArc(color);
       } 
    }
}

function spanningTree(){
    var n = arrayKlacterPoint.length;
    var matrix = matrixArray(n);

    for(var i = 0; i < n; i++){
        for(var j = 0; j < n; j++){
            matrix[i][j] = euclideanDistance(arrayKlacterPoint[i], arrayKlacterPoint[j]);
        }
    }
    var Tree = algorithmPrima(matrix, n);
    var edge = 0;
    while((quantity-1) > edge){
    max = {
        value: 0,
        i: 0,
        j: 0
    }
    for(var i = 0; i < n; i++){
        for(var j = 0; j < n; j++){
            if (Tree[i][j] > max.value && i != j){
                max.value = Tree[i][j];
                max.i = i;
                max.j = j;
            }
        }
    }
    Tree[max.i][max.j] = 0;
    Tree[max.j][max.i] = 0;
    edge++;
 }
  fillmatrix(Tree);
}

function algorithmPrima(G, n){
    var x, y, no_edge = 0;         
    var spanningTree = matrixArray(n);
    var selected = [];
    for (var i = 0; i < n; i++) selected[i] = 0;

    selected[0] = true;   

    while (no_edge < (n - 1)) {

        var min = 100000000000000;
        x = 0;
        y = 0;

        for (var i = 0; i < n; i++) {
            if (selected[i]) {
                for (var j = 0; j < n; j++) {
                    if (!selected[j] && G[i][j]) { 
                        if (min > G[i][j]) {
                            min = G[i][j];
                            x = i;
                            y = j;
                        }

                    }
                }
            }
        }
        spanningTree[x][y] = G[x][y];
        spanningTree[y][x] = G[x][y];
        selected[y] = true; 
        no_edge++;
    }
    return spanningTree;
}

function fillmatrix(Tree){
    var n = arrayKlacterPoint.length;
	var i, R = [];
  for (i = 0; i < n; i++) R[i] = 0;
  for (i = 0; i < n; i++){
    if (R[i] === 0) { 
        var color = 'rgb(' + Math.round(Math.random()*255) + ',' + Math.round(Math.random()*255) + ',' + Math.round(Math.random()*255) +')';
        arrayKlacterPoint[i].fillArc(color);
        DFS(R, i, color);
    }
  }

function DFS( R, cnum, color ) {
        R[cnum] = cnum + 1;
		for (var i = 0; i < n; i++) {
			if (Tree[cnum][i] !== 0 && R[i] === 0){ 
                arrayKlacterPoint[i].fillArc(color);
                DFS(R, i, color)
            }
		}
}
}