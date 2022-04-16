function shuffle(arr) {
  arr.sort(() => Math.random() - 0.5);
  return arr;
}

function DeleteElement (arr,element) {
  var index = arr.indexOf(element);
  arr.splice(index, 1);
}

function swap (arr, Index1, Index2) {
  let t = arr[Index1];
  arr[Index1] = arr[Index2];
  arr[Index2] = t;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function compareNumbers(a, b) {
  return a - b;
}
 function CreateDistMatrix() {
    Matrix = [Cities]
    for(var i=0; i<Cities; i++) {
      Matrix[i] = [Cities]
      for(var j=0; j<Cities; j++) {
        Matrix[i][j] = ~~Math.sqrt(Math.pow(coordsX[i]-coordsX[j], 2) + Math.pow(coordsY[i]-coordsY[j], 2));
      }
    }
  }