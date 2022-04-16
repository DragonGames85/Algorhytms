  function SetGA() {
    CreateDistMatrix();
    InitChromosomes();
    BestResult();
  }

  function InitChromosomes() {
    var a = [Cities];
    for(let i=0; i<Cities; i++) {a[i] = i;}
    for(let i=0; i<NumChromosomes; i++) {
      a = shuffle(a);
      chromosomes.push(a);
      SelfDistance.push(undefined);
    }
  }
  function BestResult() {
    var FindBest = SelfDistance[0];
    for(let i=0; i < chromosomes.length; i++) {
      SelfDistance[i] = CountDistance(chromosomes[i]);
      if(SelfDistance[i] < FindBest) {
        FindBest = SelfDistance[i];
        BestIndex = i;
    }}

    if(bestValue > FindBest || bestValue == undefined) {
      BestWay = chromosomes[BestIndex].slice(0);
      bestValue = FindBest;
    } 
  }
  function NextIteration() {
    Iterations++;
    for(let i=0; i<chromosomes.length; i++) {
      if(chromosomes[i]===undefined) {
        var a = [Cities];
        for(let i=0; i<Cities; i++) {a[i] = i;}
        a = shuffle(a);
        chromosomes[i] = a.slice(0);
      }
    }
    CrossOver();
    Mutation();
    SeLection();
    BestResult();
  }
  function SeLection() {
    var TheBests = [], NewDistances = [], BestIndexes = [];
    for(let i=0; i<chromosomes.length; i++) {NewDistances.push(CountDistance(chromosomes[i]));}
    NewDistances.sort(compareNumbers);
    for(let i=0; i<chromosomes.length; i++) {
      for(let j=0; j<chromosomes.length; j++) {
        if (NewDistances[i] == CountDistance(chromosomes[j])) BestIndexes.push(j);
      }
    }
    for(let i=0; i<NumChromosomes; i++) {
      TheBests[i] = (chromosomes[BestIndexes[i]].slice(0));
    }
    for(let i=0; i<NumChromosomes; i++) {TheBests.push(chromosomes[BestIndex]);}
    chromosomes = TheBests;
  }
  function CrossOver() {
    var Pairs = [];
    for(let i=0; i < chromosomes.length; i++) {
      if( Math.random() < Crossover_kof ) {
        Pairs.push(i);
      }
    } 
    Pairs = shuffle(Pairs);
    for(let i=0; i<Pairs.length-1; i+=2) {
      chromosomes[Pairs[i]] = (Child(Pairs[i], Pairs[i+1]));
      chromosomes[Pairs[i+1]] = (Child(Pairs[i], Pairs[i+1]));
      Children+=2;
    }
  }
  function Child(p1, p2) {
    if (chromosomes[p1] === undefined) {alert(p1);console.log(chromosomes);}
    var 
      Child = [],
      Parent1 = chromosomes[p1].slice(0),
      Parent2 = chromosomes[p2].slice(0),
      P1_GEN, P2_GEN,
      Child_GEN = Parent1[getRandomInt(Parent1.length)];
      Child.push(Child_GEN);
    while(Child.length != chromosomes[p1].length) {
      P1_GEN = FatherGen(Parent1,Parent1.indexOf(Child_GEN));
      DeleteElement(Parent1,Child_GEN);
      P2_GEN = MotherGen(Parent2,Parent2.indexOf(Child_GEN)); 
      DeleteElement(Parent2,Child_GEN);
      if(Matrix[Child_GEN][P1_GEN] < Matrix[Child_GEN][P2_GEN]) {Child_GEN = P1_GEN;}
      else {Child_GEN = P2_GEN;}
      Child.push(Child_GEN);
    }
    return Child;
  }
  function FatherGen (arr,index) {
    if(index >= arr.length-1) {return arr[0];} 
    else {return arr[index+1];}
  }
  function MotherGen (arr,index) {
    if(index == 0) {return arr[arr.length-1];} 
    else {return arr[index-1];}
  }
  function Mutation() {
    for(var i=0; i<NumChromosomes; i++) {
      if(Math.random() < Mutation_kof) {
        chromosomes[i] = Mutate(chromosomes[i]);
        Mutations++;
      }
    }
  }
  function Mutate(way) {
    var 
      K1 = getRandomInt(way.length),
      K2 = getRandomInt(way.length),
      Index1, Index2, part1,part2,part3;
    if (K1>=K2) {Index1 = K2; Index2 = K1;}
    else {Index1 = K1; Index2 = K2; }
    part1 = way.slice(0,Index1),
    part2 = way.slice(Index1,Index2),
    part3 = way.slice(Index2,way.length);
    return part3.concat(part1).concat(part2);
  }
  function CountDistance(Chr) {
    var sum = Matrix[Chr[0]][Chr[Chr.length - 1]];
    for(var i=1; i<Chr.length; i++) {
      sum += Matrix[Chr[i]][Chr[i-1]];
    }
    return sum;
  }