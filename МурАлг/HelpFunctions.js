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

function getRandomInt(max) { // Возвращает число от 0 до max
    return Math.floor(Math.random() * max);
  }
  
function shuffle(array) {	// Перемешивает числа в массиве
	array.sort(() => Math.random() - 0.5);
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
