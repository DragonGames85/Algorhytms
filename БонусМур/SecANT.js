var 
  MouseClicked = false,
  canvas = document.getElementById('canvas'),
  ctx = canvas.getContext('2d'),
  Mouse_nest=false,
  Mouse_food = false,
  Nest_Added = false,
  nest = {x: 0,y: 0},
  AntsTO = [],
  Pheromones = [],
  AntsFROM = [],
  food = [],
  RunANTS = false,
  NumAnts = 5;
canvas.width = window.innerWidth-300;
canvas.height = window.innerHeight -210;
$(function() {
setInterval(ReleaseAnts, 1000);
$("canvas").click(function(e) {
  if (Mouse_nest == true && !Nest_Added) {
    Nest_Added = true; 
    DrawNest(e.pageX - e.target.offsetLeft,e.pageY - e.target.offsetTop+10);
    nest.x = e.pageX - e.target.offsetLeft;
    nest.y = e.pageY - e.target.offsetTop+10;
  }
  else if (Mouse_food == true) {
    DrawFood(e.pageX - e.target.offsetLeft,e.pageY - e.target.offsetTop+10);
    let value = prompt("Задайте питательность источника");
    ctx.font = "bold 16px Arial";
    ctx.fillText(value, e.pageX - e.target.offsetLeft-3, e.pageY - e.target.offsetTop-3);
    food.push({x: e.pageX - e.target.offsetLeft, y: e.pageY - e.target.offsetTop+10, v: value});
  }
});
$('#launch').click(function() {
  NumAnts = prompt("Сколько муравьев будет?");
  Init();
  RunANTS = true;
  ReleaseAnts();
  });
$('#nest').click(function() {
  Mouse_nest = true;
  Mouse_food = false;
});
$('#food').click(function() { 
  Mouse_nest = false;
  Mouse_food = true;
});
$('#clear').click(function() { 
  nest = {x: 0,y: 0};
  AntsTO = [];
  Pheromones = [];
  AntsFROM = [];
  food = [];
  RunANTS = false;
  Nest_Added = false;
  ctx.clearRect (0, 0, canvas.width, canvas.height);
  });
});

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

function DrawFood(cx,cy){
	ctx.fillStyle = "lime";
	ctx.beginPath();
  ctx.arc(cx, cy, 10, 0, 2 * Math.PI);
	ctx.fill();
	ctx.fillStyle = "black";
	ctx.lineWidth = 5;
	ctx.strokeStyle = '#003300';
	ctx.stroke();
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


function getRandomInt(max) { // Возвращает число от 0 до max
  return Math.floor(Math.random() * max);
}

function Init() {
  for (let i=0; i<NumAnts; i++) {
    let a = getRandomInt(4);
    if (a == 0){AntsTO.push({
        x: getRandomInt(1236),
        y: 0, 
        carry: false, 
        food: {x: 0, y:0, value: 0, visited: false},
        SelfPheromoneIndex: 0
      })}
    else if (a == 1) {AntsTO.push({x: 1236, y: getRandomInt(536), carry: false, food: {x: 0, y:0, value: 0, visited: false,SelfPheromoneIndex: 0}})}
    else if (a == 2) {AntsTO.push({x: getRandomInt(1236), y: 536, carry: false, food: {x: 0, y:0, value: 0, visited: false,SelfPheromoneIndex: 0}})}
    else {AntsTO.push({x: 0, y: getRandomInt(536), carry: false, food: {x: 0, y:0, value: 0, visited: false,SelfPheromoneIndex: 0}})}
    AntsFROM.push({x: nest.x, y:nest.y, carry: false, food: {x: 0, y:0, value: 0, visited: false,SelfPheromoneIndex: 0}})
  }

}
function ReleaseAnts() {
  if (RunANTS) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    DrawNest(nest.x,nest.y)
    DrawPheromons(Pheromones);
    for (let i=0; i<food.length; i++) {DrawFood(food[i].x,food[i].y);}
    let x1, x2,y1,y2,move = {x: 0, y: 0};
    x3 = nest.x; y3 = nest.y;
    for (let i=0; i<NumAnts; i++) {
      x1 = AntsFROM[i].x;
      y1 = AntsFROM[i].y;
      x2 = AntsTO[i].x;
      y2 = AntsTO[i].y;
      move = getPositionAlongTheLine(x1,y1,x2,y2,0.005);
      AntsFROM[i].x = move.x;
      AntsFROM[i].y = move.y;
      DrawAnt(move.x, move.y);
      for (let k=0; k<food.length; k++) {
      if ((Math.pow(AntsFROM[i].x-food[k].x,2)+Math.pow(AntsFROM[i].y-food[k].y,2))<=15 && !AntsTO[i].carry) {
        AntsTO[i].carry = true;
        AntsFROM[i].carry = true;
        AntsTO[i].food.value = food[k].v;
        AntsFROM[i].food.value = food[k].v;
        AntsTO[i].food.x = food[k].x;
        AntsTO[i].food.y = food[k].y;
        AntsTO[i].food.visited = true;
        AntsTO[i].x = nest.x; 
        AntsTO[i].y = nest.y;
        CreatePheromones(food[k].x, food[k].y, nest.x, nest.y, AntsTO[i].food.value);
        }} 
      // if (x1+0.5 >= x2 && y1+0.5 >= y2 && !AntsTO[i].carry){
      if ((Math.pow(x2-x1,2)+Math.pow(y2-y1,2))<=2 && !AntsTO[i].carry){
        let a = getRandomInt(4);
        if (a == 0){AntsTO[i].x = getRandomInt(1236); AntsTO[i].y = 0;}
        else if (a == 1){AntsTO[i].x = 1236; AntsTO[i].y = getRandomInt(536);}
        else if (a == 2){AntsTO[i].x = getRandomInt(1236); AntsTO[i].y = 536;}
        else {AntsTO[i].x = 0; AntsTO[i].y = getRandomInt(536);}

      }
      // if(x1+0.5 >= x2 && y1+0.5 >= y2 && AntsTO[i].carry) {
      if ((Math.pow(x2-x1,2)+Math.pow(y2-y1,2))<=2 && AntsTO[i].carry){
        if(AntsTO[i].food.visited) {
        AntsTO[i].x = nest.x;
        AntsTO[i].y = nest.y;
        AntsTO[i].food.visited = false;
        }
        else {
        AntsTO[i].x = AntsTO[i].food.x;
        AntsTO[i].y = AntsTO[i].food.y;
        AntsTO[i].food.visited = true;
        if (Pheromones.length > 1) {
          let BestPath = BetterPheromone();
          AntsTO[i].x = BestPath.x;
          AntsTO[i].y = BestPath.y;
          AntsTO[i].food.visited = true;
        }
        }
      } 
      if (Pheromones.length > 0) {
      if (!AntsTO[i].carry) {
          for (let k=0; k<Pheromones.length; k++) {
            for (let j=0; j<Pheromones[k].Coords.length; j++) {
              if ((Math.pow(AntsFROM[i].x-Pheromones[k].Coords[j].x,2)+Math.pow(AntsFROM[i].y-Pheromones[k].Coords[j].y,2))<=30) {
                AntsTO[i].food.value = Pheromones[k].Food_Value;
                AntsFROM[i].food.value = Pheromones[k].Food_Value;
                AntsTO[i].food.x = Pheromones[k].Food_Coords.x;
                AntsTO[i].food.y = Pheromones[k].Food_Coords.y;
                AntsTO[i].x = Pheromones[k].Food_Coords.x; 
                AntsTO[i].y = Pheromones[k].Food_Coords.y;
                break;
              }
          }
        }
      }
    }
    let Probability = getRandomInt(100000);
    if (Probability > 99990 && AntsTO[i].carry) {
      let a = getRandomInt(4);
      if (a == 0){AntsTO[i].x = getRandomInt(1236); AntsTO[i].y = 0;}
      else if (a == 1){AntsTO[i].x = 1236; AntsTO[i].y = getRandomInt(536);}
      else if (a == 2){AntsTO[i].x = getRandomInt(1236); AntsTO[i].y = 536;}
      else {AntsTO[i].x = 0; AntsTO[i].y = getRandomInt(536);}
      AntsTO[i].carry = false;
      AntsFROM[i].carry = false;
    }
    } //////////////////////////// 
    requestAnimationFrame(ReleaseAnts);
  }
}

function getPositionAlongTheLine(x1, y1, x2, y2, percentage) {
  return {x : x1 * (1.0 - percentage) + x2 * percentage, y : y1 * (1.0 - percentage) + y2 * percentage};
}

function CreatePheromones(FOOD_X, FOOD_Y, NEST_X, NEST_Y, FOOD_VALUE) {
  Pheromones.push({
    Length: ~~Math.sqrt(Math.pow(FOOD_X-NEST_X, 2) + Math.pow(FOOD_Y-NEST_Y, 2)),
    Food_Value: FOOD_VALUE,
    Coords: [],
    Food_Coords: {x: FOOD_X, y:FOOD_Y},
    Kof: FOOD_VALUE/(~~Math.sqrt(Math.pow(FOOD_X-NEST_X, 2) + Math.pow(FOOD_Y-NEST_Y, 2)))
  });
  let START_X = FOOD_X, START_Y = FOOD_Y;
  let FINISH_X = NEST_X, FINISH_Y = NEST_Y;
  let MOVE = {x: START_X, y: START_Y};
  for (let i = 0.005; i <= 1; i+=0.005) {
    MOVE = getPositionAlongTheLine(START_X, START_Y, FINISH_X, FINISH_Y,0.01);
    START_X = MOVE.x; START_Y = MOVE.y;
    Pheromones[Pheromones.length-1].Coords.push({x: MOVE.x, y: MOVE.y});
  }
}

function BetterPheromone(){
let BEST_X=Pheromones[0].Food_Coords.x, BEST_Y=Pheromones[0].Food_Coords.y, BestValue = 0;
for (let K=0; K<Pheromones.length; K++) {
if (Pheromones[K].Kof > BestValue) {BestValue = Pheromones[K].Kof; BEST_X=Pheromones[K].Food_Coords.x; BEST_Y=Pheromones[K].Food_Coords.y}
}
return {x: BEST_X, y: BEST_Y}
}
