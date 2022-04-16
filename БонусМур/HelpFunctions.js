function getRandomInt(max) { // Возвращает число от 0 до max
  return Math.floor(Math.random() * max);
}
function getPositionAlongTheLine(x1, y1, x2, y2, percentage) {
  return {x : x1 * (1.0 - percentage) + x2 * percentage, y : y1 * (1.0 - percentage) + y2 * percentage};
}

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