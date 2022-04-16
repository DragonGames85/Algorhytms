function DrawNest(cx,cy){
	ctx.fillStyle = "red";
	ctx.beginPath();
  ctx.moveTo(cx+20, cy);
  ctx.lineTo(cx, cy+20);
  ctx.lineTo(cx-20, cy);
  ctx.lineTo(cx, cy-20);
  ctx.lineTo(cx+20, cy+2);
	ctx.fill();
	ctx.fillStyle = "black";
	ctx.lineWidth = 5;
	ctx.strokeStyle = '#003300';
	ctx.stroke();
}

function DrawFood(cx,cy, value){
	ctx.fillStyle = "lime";
	ctx.beginPath();
  ctx.arc(cx, cy, 10, 0, 2 * Math.PI);
	ctx.fill();
	ctx.fillStyle = "black";
	ctx.lineWidth = 5;
	ctx.strokeStyle = '#003300';
	ctx.stroke();
  ctx.font = "bold 16px Arial";
  ctx.fillText(value, cx-3, cy-13);
}

function DrawAnt(cx,cy){
	ctx.fillStyle = "red";
	ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, 2 * Math.PI);
	ctx.fill();
	ctx.fillStyle = "black";
	ctx.lineWidth = 2;
	ctx.strokeStyle = '#003300';
	ctx.stroke();
}
function DrawPhero(x1,x2,y1,y2){
ctx.fillStyle = "black";
ctx.beginPath();
ctx.moveTo(x1, y1);
ctx.lineTo(x2, y2);
ctx.fill();
ctx.stroke();
}
function DrawAllPhero(arr){
  for (let e = 0; e < arr.length-4; e+=4) {
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.moveTo(arr[e], arr[e+1]);
  ctx.lineTo(arr[e+3], arr[e+4]);
  ctx.fill();
  ctx.stroke();
  }
  }
function DrawLevelWall1(cx,cy){
	ctx.fillStyle = "black";
	ctx.beginPath();
  ctx.moveTo(cx+400, 536);
  ctx.lineTo(cx+400, cy-20);
  ctx.lineTo(cx-20, cy-20);
  ctx.lineTo(cx-20, 536);
	ctx.fill();

}
function DrawLevelWall2(cx,cy){
	ctx.fillStyle = "black";
	ctx.beginPath();
  ctx.moveTo(cx+200, 0);
  ctx.lineTo(cx+200, cy-20);
  ctx.lineTo(cx-20, cy-20);
  ctx.lineTo(cx-20, 0);
	ctx.fill();

}
function DrawWall(cx,cy){
	ctx.fillStyle = "black";
	ctx.beginPath();
  ctx.moveTo(cx+20, cy+20);
  ctx.lineTo(cx+20, cy-20);
  ctx.lineTo(cx-20, cy-20);
  ctx.lineTo(cx-20, cy+20);
  ctx.lineTo(cx+20, cy+20);
	ctx.fill();

}

function DrawPheromons(arr){
  if (arr.length > 0) {
  for (let m = 0; m < arr.length; m++) {
    for (let d = 0; d < arr[m].Coords.length; d+=10) {
    let cx = arr[m].Coords[d].x;
    let cy = arr[m].Coords[d].y;
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(cx, cy, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#003300';
    ctx.stroke();
    }
  }
  }
}

function DrawMap() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  DrawNest(nest.x,nest.y)
  for (let i=0; i<walls.length; i++) {
    if (walls[i].type == 0) {DrawWall(walls[i].x1-20,walls[i].y1-20);}
    else if (walls[i].type == 1) {DrawLevelWall1(283,206);}
    else {DrawLevelWall2(800,177);}
  }
  for (let i=0; i<food.length; i++) {DrawFood(food[i].x,food[i].y,food[i].v);}
}