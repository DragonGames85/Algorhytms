function Init() {
  for (let i=0; i<NumAnts; i++) {
    let a = getRandomInt(4);
    if (a == 0){AntsTO.push({
        x: getRandomInt(1236),
        y: getRandomInt(536), 
        carry: false, 
        food: {x: 0, y:0, value: 0, visited: false, cycle: false},
        PheroValue: 1,
        Targets: 0,
        edge: 0
      })}
    else if (a == 1) {AntsTO.push({x: 1236, y: getRandomInt(536), carry: false, food: {x: 0, y:0, value: 0, visited: false, cycle: false},PheroValue: 1, edge: 1})}
    else if (a == 2) {AntsTO.push({x: getRandomInt(1236), y: 536, carry: false, food: {x: 0, y:0, value: 0, visited: false, cycle: false},PheroValue: 1, edge: 2})}
    else {AntsTO.push({x: 0, y: getRandomInt(536), carry: false, food: {x: 0, y:0, value: 0, visited: false, cycle: false},PheroValue: 1, edge: 3})}
    AntsFROM.push({x: nest.x, y:nest.y, carry: false, food: {x: 0, y:0, value: 0, visited: false, cycle: false},PheroValue: 1, edge: 0})
  }
  AntTrail=matrixArray(1236*536,NumAnts);
  for (let i=0; i<NumAnts; i++) {AntTrail[0][i]={x: nest.x, y: nest.y, visited: false};}
}
function ReleaseAnts() {
  if (RunANTS) {

    DrawMap();

    let x1, x2,y1,y2,move = {x: 0, y: 0};
    for (let i=0; i<NumAnts; i++) {
      x1 = AntsFROM[i].x;
      y1 = AntsFROM[i].y;
      x2 = AntsTO[i].x;
      y2 = AntsTO[i].y;

      move = getPositionAlongTheLine(x1,y1,x2,y2,0.005);

      AntsFROM[i].x = move.x;
      AntsFROM[i].y = move.y;

      DrawAnt(move.x, move.y);
      ////////////////////////////////////////////////////////////////////////
      if (AntsTO[i].food.cycle == true) {
        if (AntsTO[i].food.visited == true && (Math.pow(x2-x1,2)+Math.pow(y2-y1,2))<=2) {
        AntsTO[i].x = AntTrail[AntsTO[i].Targets][i].x;
        AntsTO[i].y = AntTrail[AntsTO[i].Targets][i].y;
        AntsTO[i].Targets--;
        if (AntsTO[i].Targets == (-1)) {
          AntsTO[i].food.visited =false;  
          AntsTO[i].Targets = 0;
          if (Pheromones_at_nest.length > 1) {
            for (let m=0; m < Pheromones_at_nest.length; m++) {
              if (Pheromones_at_nest[m].power > BestPhero.pow) {
                BestPhero.pow = Pheromones_at_nest[m].power;
                BestPhero.id = Pheromones_at_nest[m].id;
              }
            }
            for (let j=0; j < AntsTO[BestPhero.id].PheroValue; j++) {
              AntTrail[j][i].x=AntTrail[j][BestPhero.id].x;
              AntTrail[j][i].y=AntTrail[j][BestPhero.id].y;
            }
              AntsTO[i].PheroValue = AntsTO[BestPhero.id].PheroValue;
          }
        }
        }
        else if (AntsTO[i].food.visited == false && (Math.pow(x2-x1,2)+Math.pow(y2-y1,2))<=2) {
          AntsTO[i].x = AntTrail[AntsTO[i].Targets][i].x;
          AntsTO[i].y = AntTrail[AntsTO[i].Targets][i].y;
          AntsTO[i].Targets++;
          if (AntsTO[i].Targets == AntsTO[i].PheroValue-1) {AntsTO[i].food.visited =true;}
        }
        let Probability = getRandomInt(200000);
        if (Probability > 190000) {OptimizePath(i);}
        for (let j = 0; j < AntsTO[i].PheroValue-1; j++) {
          let START_X = AntTrail[j][i].x, START_Y =  AntTrail[j][i].y;
          let FINISH_X = AntTrail[j+1][i].x, FINISH_Y = AntTrail[j+1][i].y;
          DrawPhero(START_X, FINISH_X, START_Y, FINISH_Y);
        }
      }///////////////////////////////////////////////////////////////////////////////////////////
      else {

      for (let k=0; k<food.length; k++) {
        if ((Math.pow(AntsFROM[i].x-food[k].x,2)+Math.pow(AntsFROM[i].y-food[k].y,2))<=30 && !AntsTO[i].carry) {TookFood(i,k)}
      }// Ловит Еду

      if ((Math.pow(x2-x1,2)+Math.pow(y2-y1,2))<=2){
        let a = getRandomInt(3);
        if (AntsTO[i].edge == a && a > 0) {a--;}
        else if (AntsTO[i].edge == a && a == 0) {a++;}
        if (a==0){AntsTO[i].x = getRandomInt(1236); AntsTO[i].y = getRandomInt(536); AntsTO[i].edge = 0;}
        else if (a == 1){AntsTO[i].x = getRandomInt(1236); AntsTO[i].y = getRandomInt(536);AntsTO[i].edge = 1;}
        else if (a == 2){AntsTO[i].x = getRandomInt(1236); AntsTO[i].y = getRandomInt(536);AntsTO[i].edge = 2;}
        else {AntsTO[i].x = getRandomInt(1236); AntsTO[i].y = getRandomInt(536);AntsTO[i].edge = 3;}

        AntTrail[AntsTO[i].PheroValue][i] = {x: x2, y: y2};
        AntsTO[i].PheroValue++;
      }

      if (TouchedWall(x1,y1,AntsTO[i].x,AntsTO[i].y) == true) {
        while (TouchedWall(x1,y1,AntsTO[i].x,AntsTO[i].y) == true) {
          let a = getRandomInt(3);
          if (AntsTO[i].edge == a && a > 0) {a--;}
          else if (AntsTO[i].edge == a && a == 0) {a++;}
          if (a==0){AntsTO[i].x = getRandomInt(1236); AntsTO[i].y = getRandomInt(536); AntsTO[i].edge = 0;}
          else if (a == 1){AntsTO[i].x = getRandomInt(1236); AntsTO[i].y = getRandomInt(536);AntsTO[i].edge = 1;}
          else if (a == 2){AntsTO[i].x = getRandomInt(1236); AntsTO[i].y = getRandomInt(536);AntsTO[i].edge = 2;}
          else {AntsTO[i].x = getRandomInt(1236); AntsTO[i].y = getRandomInt(536);AntsTO[i].edge = 3;}
        }
      }

    }///////////// ELSE NOT CYCLE
    if (FoundAllFood() == false && Pheromones_at_nest.length > 1) {
      let worst_id = 0;
      worst_id = WorstPheroID();
      let Probability = getRandomInt(100000);
      if (Probability > 99990) {
        let a = getRandomInt(3);
        if (a == 0){AntsTO[i].x = getRandomInt(1236); AntsTO[i].y = getRandomInt(536);}
        else if (a == 1){AntsTO[i].x = getRandomInt(1236); AntsTO[i].y = getRandomInt(536);}
        else if (a == 2){AntsTO[i].x = getRandomInt(1236); AntsTO[i].y = getRandomInt(536);}
        else {AntsTO[i].x = getRandomInt(1236); AntsTO[i].y = getRandomInt(536);}
        AntsTO[worst_id].carry = false;
        AntsFROM[worst_id].carry = false;
        AntsTO[worst_id].food.cycle = false;
        Pheromones_at_nest.splice(worst_id,1);
      }
    }
    } //////////FOR ANTS//////////// 
    requestAnimationFrame(ReleaseAnts);
  } /// if run /////
} //// FUNCTION /////

function TouchedWall(x1,y1,x2,y2){
  let check = 0;
  let START_X = x1, START_Y = y1;
  let FINISH_X = x2, FINISH_Y = y2;
  let MOVE = {x: START_X, y: START_Y};
  for (let i = 0.005; i <= 1; i+=0.005) {
    if (check == 1) {break;}
    MOVE = getPositionAlongTheLine(START_X, START_Y, FINISH_X, FINISH_Y,0.01);
    START_X = MOVE.x; START_Y = MOVE.y;
  for (let j = 0; j < walls.length; j++) {
    if (
      START_X  <= walls[j].x1 &&
      START_Y <= walls[j].y1 &&
      START_X  <= walls[j].x2 &&
      START_Y >= walls[j].y2 &&
      START_X  >= walls[j].x3 &&
      START_Y >= walls[j].y3 &&
      START_X  >= walls[j].x4 &&
      START_Y <= walls[j].y4
      ) {check = 1; break; }
    else {check = 0;}
  }
  }
  if (check == 1) {return true;}
  else {return false;}
}

function PathCrossWall(antIND){
  for (let m = 0; m < AntsTO[antIND].PheroValue-1; m++) {
    if (TouchedWall(AntTrail[m][antIND].x,AntTrail[m][antIND].y,AntTrail[m+1][antIND].x,AntTrail[m+1][antIND].y)) {return true;}
  }
  return false;
}

function TookFood(antIND, foodIND) 
{
  food[foodIND].found = true;
  AntsTO[antIND].carry = true;
  AntsFROM[antIND].carry = true;
  AntsTO[antIND].food.value = food[foodIND].v;
  AntsFROM[antIND].food.value = food[foodIND].v;
  AntsTO[antIND].food.x = food[foodIND].x;
  AntsTO[antIND].food.y = food[foodIND].y;
  AntsTO[antIND].food.visited = true;
  AntsTO[antIND].food.cycle = true;
  AntsTO[antIND].x = AntTrail[AntsTO[antIND].PheroValue-1][antIND].x; 
  AntsTO[antIND].y = AntTrail[AntsTO[antIND].PheroValue-1][antIND].y;
  AntTrail[AntsTO[antIND].PheroValue][antIND] = {x: AntsTO[antIND].food.x, y: AntsTO[antIND].food.y};
  AntsTO[antIND].PheroValue++;
  AntsTO[antIND].Targets = AntsTO[antIND].PheroValue-2;
  if (AntsTO[antIND].Targets == (-1)) {AntsTO[antIND].Targets++;}
  Pheromones_at_nest.push({id: antIND, power: PheroPower(antIND)})

}  

function PheroPower(antIND) {
  let sum = 0;
  for (let k=0; k<AntsTO[antIND].PheroValue-2; k++) {
    let 
    x1 = AntTrail[k][antIND].x,
    x2= AntTrail[k+1][antIND].x,
    y1=AntTrail[k][antIND].y,
    y2=AntTrail[k+1][antIND].y;
  sum+=(~~Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2)));
}
if (sum == 0) {sum += (~~Math.sqrt(Math.pow(nest.x-AntsTO[antIND].food.x, 2) + Math.pow(nest.y-AntsTO[antIND].food.y, 2)))}
return AntsTO[antIND].food.value/sum;
}

function InsideWall(x1,y1){
  let check = 0;
  for (let j = 0; j < walls.length; j++) {
    if (
      x1 <= walls[j].x1 &&
      y1 <= walls[j].y1 &&
      x1 <= walls[j].x2 &&
      y1 >= walls[j].y2 &&
      x1 >= walls[j].x3 &&
      y1 >= walls[j].y3 &&
      x1 >= walls[j].x4 &&
      y1 <= walls[j].y4
      ) {check = 1; break;} 
      else {check = 0;}
    }
    if (check == 1) {return true;}
    else {return false;}
}

function OptimizePath(antIND) {
  for (let k=1; k<AntsTO[antIND].PheroValue-1; k++) {
    let Old_power = PheroPower(antIND);
    let Probability = getRandomInt(200000);
    if (Probability < 200000 && Probability > 180000) { AntTrail[k][antIND].x+=5; if (Old_power > PheroPower(antIND) || PathCrossWall(antIND) == true){AntTrail[k][antIND].x-=5;}}
    if (Probability < 180000 && Probability > 160000) { AntTrail[k][antIND].x+=4; if (Old_power > PheroPower(antIND)|| PathCrossWall(antIND) == true){AntTrail[k][antIND].x-=4;}}
    if (Probability < 160000 && Probability > 140000) { AntTrail[k][antIND].x+=3; if (Old_power > PheroPower(antIND)|| PathCrossWall(antIND) == true){AntTrail[k][antIND].x-=3;}}
    if (Probability < 140000 && Probability > 120000) { AntTrail[k][antIND].x+=2; if (Old_power > PheroPower(antIND)|| PathCrossWall(antIND) == true){AntTrail[k][antIND].x-=2;}}
    if (Probability < 120000 && Probability > 100000) { AntTrail[k][antIND].x+=1; if (Old_power > PheroPower(antIND)|| PathCrossWall(antIND) == true){AntTrail[k][antIND].x-=1;}}
    if (Probability < 100000 && Probability > 80000) { AntTrail[k][antIND].x-=5; if (Old_power > PheroPower(antIND)|| PathCrossWall(antIND) == true){AntTrail[k][antIND].x+=5;}}
    if (Probability < 80000 && Probability > 60000) { AntTrail[k][antIND].x-=4; if (Old_power > PheroPower(antIND)|| PathCrossWall(antIND) == true){AntTrail[k][antIND].x+=4;}}
    if (Probability < 60000 && Probability > 40000) { AntTrail[k][antIND].x-=3; if (Old_power > PheroPower(antIND)|| PathCrossWall(antIND) == true){AntTrail[k][antIND].x+=3;}}
    if (Probability < 40000 && Probability > 20000) { AntTrail[k][antIND].x-=2; if (Old_power > PheroPower(antIND)|| PathCrossWall(antIND) == true){AntTrail[k][antIND].x+=2;}}
    if (Probability < 20000 && Probability > 10) { AntTrail[k][antIND].x-=1; if (Old_power > PheroPower(antIND)|| PathCrossWall(antIND) == true){AntTrail[k][antIND].x+=1;}}
    Probability = getRandomInt(200000);
    Old_power = PheroPower(antIND);
    if (Probability < 200000 && Probability > 180000) { AntTrail[k][antIND].y+=5; if (Old_power > PheroPower(antIND)|| PathCrossWall(antIND) == true){AntTrail[k][antIND].y-=5;}}
    if (Probability < 180000 && Probability > 160000) { AntTrail[k][antIND].y+=4; if (Old_power > PheroPower(antIND)|| PathCrossWall(antIND) == true){AntTrail[k][antIND].y-=4;}}
    if (Probability < 160000 && Probability > 140000) { AntTrail[k][antIND].y+=3; if (Old_power > PheroPower(antIND)|| PathCrossWall(antIND) == true){AntTrail[k][antIND].y-=3;}}
    if (Probability < 140000 && Probability > 120000) { AntTrail[k][antIND].y+=2; if (Old_power > PheroPower(antIND)|| PathCrossWall(antIND) == true){AntTrail[k][antIND].y-=2;}}
    if (Probability < 120000 && Probability > 100000) { AntTrail[k][antIND].y+=1; if (Old_power > PheroPower(antIND)|| PathCrossWall(antIND) == true){AntTrail[k][antIND].y-=1;}}
    if (Probability < 100000 && Probability > 80000) { AntTrail[k][antIND].y-=5; if (Old_power > PheroPower(antIND)|| PathCrossWall(antIND) == true){AntTrail[k][antIND].y+=5;}}
    if (Probability < 80000 && Probability > 60000) { AntTrail[k][antIND].y-=4; if (Old_power > PheroPower(antIND)|| PathCrossWall(antIND) == true){AntTrail[k][antIND].y+=4;}}
    if (Probability < 60000 && Probability > 40000) { AntTrail[k][antIND].y-=3; if (Old_power > PheroPower(antIND)|| PathCrossWall(antIND) == true){AntTrail[k][antIND].y+=3;}}
    if (Probability < 40000 && Probability > 20000) { AntTrail[k][antIND].y-=2; if (Old_power > PheroPower(antIND)|| PathCrossWall(antIND) == true){AntTrail[k][antIND].y+=2;}}
    if (Probability < 20000 && Probability > 10) { AntTrail[k][antIND].y-=1; if (Old_power > PheroPower(antIND)|| PathCrossWall(antIND) == true){AntTrail[k][antIND].y+=1;}}
  }
}

function FoundAllFood() {
  for (let e = 0; e < food.length; e++) {
    if (food[e].found == false) return false;
  }
  return true;
}

function WorstPheroID() {
  let min = 999999;
  let WorstID = 0;
  for  (let e = 0; e < Pheromones_at_nest.length; e++) {
    if (min >= Pheromones_at_nest[e].power) {min = Pheromones_at_nest[e].power; WorstID = Pheromones_at_nest[e].id}
  }
  return WorstID;
}