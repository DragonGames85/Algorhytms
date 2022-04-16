$(function() {
setInterval(ReleaseAnts, 1000);
$("canvas").click(function(e) {
  if (Mouse_nest == true && !Nest_Added && Mouse_Wall == false) {
    Nest_Added = true; 
    DrawNest(e.pageX - e.target.offsetLeft,e.pageY - e.target.offsetTop+10);
    nest.x = e.pageX - e.target.offsetLeft;
    nest.y = e.pageY - e.target.offsetTop+10;
  }
  else if (Mouse_food == true && Mouse_Wall == false) {
    // let value = prompt("Задайте питательность источника");
    let value = prompt("Задайте питательность");
    DrawFood(e.pageX - e.target.offsetLeft,e.pageY - e.target.offsetTop+10, value);
    food.push({x: e.pageX - e.target.offsetLeft, y: e.pageY - e.target.offsetTop+10, v: value, found: false});
  }
  else if (Mouse_Wall == true) {
    DrawWall(e.pageX - e.target.offsetLeft,e.pageY - e.target.offsetTop+10);
    walls.push({
      x1: e.pageX - e.target.offsetLeft+20, 
      y1: e.pageY - e.target.offsetTop+30,
      x2: e.pageX - e.target.offsetLeft+20, 
      y2: e.pageY - e.target.offsetTop-10,
      x3: e.pageX - e.target.offsetLeft-20, 
      y3: e.pageY - e.target.offsetTop-10,
      x4: e.pageX - e.target.offsetLeft-20, 
      y4: e.pageY - e.target.offsetTop+30,
      type: 0
    });
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
  Mouse_Wall = false;
});
$('#food').click(function() { 
  Mouse_nest = false;
  Mouse_Wall = false;
  Mouse_food = true;
});
$('#wall').click(function() { 
  Mouse_nest = false;
  Mouse_food = false;
  Mouse_Wall = true;
});
$('#level').click(function() { 
  Nest_Added = true; 
  DrawNest(54,505);
  nest.x = 54;
  nest.y = 505;
  let value = 1;
  DrawFood(1170,45, value);
  food.push({x: 1170, y: 45, v: value});
  DrawLevelWall1(283,206);
  DrawLevelWall2(800,177);
  walls.push({
    x1: 283+400, 
    y1: 536,
    x2: 283+400, 
    y2: 206-20,
    x3: 283-20, 
    y3: 206-20,
    x4: 283-20, 
    y4: 536,
    type: 1
  });
  walls.push({
    x1: 800+200,
    x2: 800+200,
    x3: 800-20,
    x4: 800-20,
    y1: 177-20,
    y2: 0,
    y3: 0,
    y4: 177-20,
    type: 2
  });
});
$('#clear').click(function() { 
  nest = {x: 0,y: 0};
  Pheromones = [];
  AntsTO = [],
  AntsFROM = [],
  AntTrail = [],
  food = [];
  walls = [];
  RunANTS = false;
  Nest_Added = false;
  ctx.clearRect (0, 0, canvas.width, canvas.height);
  });
});