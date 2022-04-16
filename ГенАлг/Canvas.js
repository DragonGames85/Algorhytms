function drawPoint(PX,PY) {
	ctx.fillStyle = "blue";
	ctx.beginPath();
  ctx.arc(PX, PY, 10, 0, 2 * Math.PI);
	ctx.fill();
	ctx.lineWidth = 3;
	ctx.strokeStyle = 'cyan';
	ctx.stroke();
}
function drawLines(array) {
  ctx.strokeStyle = 'cyan';
  ctx.beginPath();
  ctx.moveTo(coordsX[array[0]], coordsY[array[0]]);
  for(let i=1; i<array.length; i++) {
    ctx.lineTo( coordsX[array[i]], coordsY[array[i]])
  }
  ctx.lineTo(coordsX[array[0]], coordsY[array[0]]);
  ctx.stroke();
  ctx.closePath();
}
function draw() {
  if(StartGA) {
    NextIteration();
    $('#Points').text("Точек: " + Cities);
    $('#Iters').text("Итерация: " + Iterations);
    $('#Mutates').text("Мутировано: " + Mutations);
    $('#Children').text("Детей рождено: " + Children);
    $('#Best').text("Лучшее значение: " + ~~(bestValue));
  }
  ctx.clearRect(0, 0, Width, Height);
  if (Cities > 0) {
    if(BestWay.length === Cities) {
      drawLines(BestWay);
    }
    for(let i=0; i<Cities; i++) {
      drawPoint(coordsX[i],coordsY[i]);
    }
  }
}
