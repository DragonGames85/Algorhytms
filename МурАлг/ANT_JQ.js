var 
canv = document.getElementById('canvas'),
ctx = canv.getContext('2d'),
coordsX =[],
coordsY =[],
bestWay = [],
bestlength = 0,
StartAnts=false,
Cities = 0,
IterCounter = 0,
Matrix = [],
pheromones = [],
ants = [],
SetAnts = 50,
alpha = 1,               // Насколько доверяем феромонам
beta = 5,                // Насколько видим города
rho = 0.001,              // Фактор исчезновения феромонов
Q = 1.0;                 // Фактор распространения феромонов
canv.width = window.innerWidth-300;
canv.height = window.innerHeight -210;

$(function() {
	setInterval(ANT_ALGORHYTM, 10);
	$("canvas").click(function(e) {
		ctx.fillStyle = "lime";
        coordsX.push(e.pageX-e.target.offsetLeft);
        coordsY.push(e.pageY - e.target.offsetTop+10);
        Cities++;
        ctx.font = "italic 30pt Arial";
        Matrix = matrixArray(Cities,Cities);
		pheromones = matrixArray(Cities,Cities);
		ants = matrixArray(SetAnts,Cities);
		bestWay = [Cities];
        DrawPoint(e.pageX - e.target.offsetLeft,e.pageY - e.target.offsetTop+10);
	});
	$('#launch').click(function() { 
		ANTS_initialization();
		StartAnts = true;
	  });
	$('#stop').click(function() {
		StartAnts = false;
	});
	$('#random').click(function() { 
		let randomX, randomY;
		randomX = getRandomInt(canv.width);
		randomY=getRandomInt(canv.height);
		ctx.fillStyle = "lime";
        coordsX.push(randomX  );
        coordsY.push(randomY  );
        ctx.beginPath();
        ctx.moveTo(randomX  , randomY  );
        Cities++;
        Matrix = matrixArray(Cities,Cities);
		pheromones = matrixArray(Cities,Cities);
		ants = matrixArray(SetAnts,Cities);
		bestWay = [Cities];
        DrawPoint(randomX  ,randomY);
	});
	$('#clear').click(function() { 
		coordsX =[],
		coordsY =[],
		colors = [],
		bestWay = [],
		bestlength = 0,
		StartAnts=false,
		Cities = 0,
		IterCounter = 0,
		Matrix = [],
		pheromones = [],
		ants = [];
		ctx.clearRect (0, 0, canv.width, canv.height);
		$('#DATA').text(" Лучшая длина: " + Math.floor(bestlength) + " Итерация: " + IterCounter + "   ");
	});
});

// Code
function matrixArray(rows,columns){
    var arr = [];
    for(var i=0; i<rows; i++){
      arr[i] = [];
      for(var j=0; j<columns; j++){
        arr[i][j] = 0;
      }
    }
    return arr;
}

function DrawPoint(cx,cy){
	ctx.fillStyle = "lime";
	ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, 2 * Math.PI);
	ctx.fill();
	ctx.fillStyle = "black";
	ctx.lineWidth = 5;
	ctx.strokeStyle = '#003300';
	ctx.stroke();
}

////////////////////////////////////////////////////////////////
//////////////			МУРАВЬИННЫЙ АЛГОРИТМ      //////////////
////////////////////////////////////////////////////////////////

function getRandomInt(max) { // Возвращает число от 0 до max
    return Math.floor(Math.random() * max);
  }
  
function shuffle(array) {	// Перемешивает числа в массиве
	array.sort(() => Math.random() - 0.5);
}

function CreatePheromones(pheromones) //void
{
	for (let i = 0; i < Cities; i++) {
		for (let j = 0; j < Cities; j++) {
			pheromones[i][j] = 0.01;
		}
	}
}

function CreateAnts(ants) //void
{
	for (let i = 0; i < SetAnts; i++) {
		var start = (1+getRandomInt(32767)) % Cities;
		var way = [Cities];
		for (let j = 0; j < Cities; j++) {
			way[j] = j;
		}
		shuffle(way);
		var index = IndexOf(start, way);
		let t = way[0];		//swap(way[0],way[index])
		way[0] = way[index];
		way[index] = t;
		for (let j = 0; j < Cities; j++) {
			ants[i][j] = way[j];
		}
	}
}

function CreateDistMatrix() { //void
for (let j=0; j<coordsX.length; j++) {
	for (let i=0; i<coordsX.length; i++) {
		if (i!=j) {
		Matrix[j][i] = ~~Math.sqrt(Math.pow(Math.abs(coordsX[j]-coordsX[i]),2)+Math.pow(Math.abs(coordsY[j]-coordsY[i]),2));
		}
		else {Matrix[i][j] = Math.pow(10, 1000);}
	}
}
}

function IndexOf(VarFind,arr)
{
	for (let i = 0; i < Cities; i++) {
		if (arr[i] == VarFind) return i;
	}
}

function Length(arr, Matrix)
{
	var ans = 0.0;
	for (let i = 0; i < Cities - 1; i++) {
		ans += Matrix[arr[i]][arr[i + 1]];
	}
	return ans;
}

function FindBestWay(ants, Matrix, bestWay) //void
{
	var bestlength = Length(ants[0], Matrix);
	let AntIndex = 0;
	for (let i = 1; i < SetAnts; i++) {
		var len = Length(ants[i], Matrix);
		if (len < bestlength) {
			bestlength = len;
			AntIndex = i;
		}
	}
	for (let i = 0; i < Cities; i++) {
		bestWay[i] = ants[AntIndex][i];
	}
}

function Probability(from, Tabu, pheromones, Matrix, RandomTable) //void (Вероятность похода муравья к другому городу)
{
	var tau = [Cities], Sum = 0;
	for (let i = 0; i < Cities; i++) {tau[i] = 0.0;}
	for (let i = 0; i < Cities; i++) {
		if (i != from && Tabu[i] != true) {
			tau[i] = (Math.pow(pheromones[from][i],alpha)) * (Math.pow((1.0 / Matrix[from][i]), beta));
		}
		Sum += tau[i];
	}
	for (let i = 0; i < Cities; i++) {
		RandomTable[i] = tau[i] / Sum;
	}
}

function NextCity(from, Tabu, pheromones, Matrix)
{
	var RandomTable = [Cities];
	Probability(from, Tabu	, pheromones, Matrix, RandomTable);
	var cum = [Cities + 1];
	cum[0] = 0.0;
	for (let i = 0; i < Cities; i++) {
		cum[i + 1] = cum[i] + RandomTable[i];
	}
	var RK = Math.random();
	for (let i = 0; i < Cities; i++) {
		if (RK >= cum[i] && RK < cum[i + 1]) {
			return i;
		}
	}
}

function CreateWay(start, pheromones, Matrix,  newPath) // void
{
	var Path = [Cities];
	var Tabu = [Cities];
	for (let i = 0; i < Cities; i++) {
		Tabu[i] = false;
	}
	Path[0] = start;
	Tabu[start] = true;
	for (let i = 0; i < Cities - 1; i++) {
		var from = Path[i];
		var next = NextCity(from, Tabu, pheromones, Matrix);
		Path[i + 1] = next;
		Tabu[next] = true;
	}
	for (let i = 0; i < Cities; i++) {
		newPath[i] = Path[i];
	}
}

function UpdateAnts(ants, pheromones, Matrix) //void
{
	for (let i = 0; i < SetAnts; i++) {
		var start = (1+getRandomInt(32767)) % Cities;
		var newPath = [Cities];
		CreateWay(start, pheromones, Matrix, newPath);
		for (let j = 0; j < Cities; j++) {
			ants[i][j] = newPath[j];
		}
	}
}

function AntOnEdge(from, to, AntTrail)
{
	let FromIndex = IndexOf(from, AntTrail);
	if (FromIndex == 0 && AntTrail[1] == to) return true;
	else if (FromIndex == 0 && AntTrail[Cities - 1] == to) return true;
	else if (FromIndex == 0) return false;
	else if (FromIndex == Cities - 1 && AntTrail[Cities - 2] == to) return true;
	else if (FromIndex == Cities - 1 && AntTrail[0] == to) return true;
	else if (FromIndex == Cities - 1) return false;
	else if (AntTrail[FromIndex - 1] == to) return true;
	else if (AntTrail[FromIndex + 1] == to) return true;
	else return false;
}

function UpdatePheromones(ants, pheromones, Matrix) //void
{
	for (let i = 0; i < Cities; i++) {
		for (let j = i + 1; j < Cities; j++) {
			for (let k = 0; k < SetAnts; k++) {
				let length = Length(ants[k], Matrix);
				let decrease = (1.0 - rho) * pheromones[i][j];
				let increase = 0.0;
				if (AntOnEdge(i, j, ants[k]) == true) {
					increase = Q / length;
				}
				pheromones[i][j] = increase + decrease;
				if (pheromones[i][j] < 0.01) {
					pheromones[i][j] = 0.01;
				}
				pheromones[j][i] = pheromones[i][j];
			}
		}
	}
}

function ShowPath(Path) //void
{
	ctx.clearRect (0, 0, canv.width, canv.height);
	for (let i = 0; i < Cities-1; i++) {
		if (i==0) ctx.beginPath();
        if (i==0) ctx.moveTo(coordsX[Path[i]], coordsY[Path[i]]);
		ctx.lineTo(coordsX[Path[i+1]], coordsY[Path[i+1]]);
	}
	ctx.closePath();  
	ctx.stroke();
	for (let i = 0; i < Cities; i++) {
		DrawPoint(coordsX[i],coordsY[i]);
	}
}

function ErasePastPath() {
	ctx.clearRect (0, 0, canv.width, canv.height);
	for (let i = 0; i < Cities; i++) {
		DrawPoint(coordsX[i],coordsY[i]);
	}
}

function ANTS_initialization(){
	CreateDistMatrix();
	CreateAnts(ants);
	CreatePheromones(pheromones);
	bestWay = [Cities];
	FindBestWay(ants, Matrix, bestWay);
	bestlength = Length(bestWay, Matrix);
	bestlength += Matrix[bestWay[0]][bestWay[Cities - 1]];
	ShowPath(bestWay);
}

function ANT_ALGORHYTM() {
	if (StartAnts) {
	let NewBestWay = [Cities];
	UpdateAnts(ants, pheromones, Matrix);
	UpdatePheromones(ants, pheromones, Matrix);
	FindBestWay(ants, Matrix, NewBestWay);
	var currbestlength = Length(NewBestWay, Matrix);
	currbestlength += Matrix[NewBestWay[0]][NewBestWay[Cities - 1]];
	if (currbestlength < bestlength) { 
		ErasePastPath();
		ShowPath(NewBestWay);
		bestlength = currbestlength;
		for (let i = 0; i < Cities; i++) {
			bestWay[i] = NewBestWay[i];
		}
	}
	IterCounter++;
	ShowPath(bestWay);
	$('#DATA').text(" Лучшая длина: " + Math.floor(bestlength) + " Итерация: " + IterCounter + "   ");
}
}
