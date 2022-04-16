$(function() {
  ctx = $('#canvas')[0].getContext("2d");
  Width = $('#canvas').width();
  Height = $('#canvas').height();
  setInterval(draw, 10);
  $("canvas").click(function(e) {
    if(!StartGA) {
      Cities++;
      coordsX.push( e.pageX - e.target.offsetLeft);
      coordsY.push(e.pageY - e.target.offsetTop);
    }
    $('#Points').text("Точек: " + Cities);
    $('#Iters').text("Итерация: " + Iterations);
    $('#Mutates').text("Мутировано: " + Mutations);
    $('#Children').text("Детей рождено: " + Children);
    $('#Best').text("Лучшее значение: " + ~~(bestValue));
  });
  
  $('#Random').click(function() {
    if(!StartGA) {
    Cities+=10;
    for(let i = 0; i<10; i++) {
      coordsX.push(getRandomInt(Width));
      coordsY.push(getRandomInt(Height));
    }
  }
  $('#Points').text("Точек: " + Cities);
  $('#Iters').text("Итерация: " + Iterations);
  $('#Mutates').text("Мутировано: " + Mutations);
  $('#Children').text("Детей рождено: " + Children);
  $('#Best').text("Лучшее значение: " + ~~(bestValue));
  });

  $('#Launch').click(function() { 
    if (Cities == 1) {alert("Добавьте хотя-бы ещё одну точку.");}
    else if (Cities == 0) {alert("В этом мире так одиноко.");}
    else {
      SetGA();
      StartGA = true;
    }
  });

  $('#Clear').click(function() {
    StartGA = false;
    coordsX = [],
    coordsY = [],
    bestValue= undefined, 
    BestWay = [],
    Cities = 0,
    Iterations = 0,
    chromosomes = [],
    SelfDistance = [];
    $('#Points').text("Точек: " + 0);
    $('#Iters').text("Итерация: " + 0);
    $('#Mutates').text("Мутировано: " + 0);
    $('#Children').text("Детей рождено: " + 0);
    $('#Best').text("Лучшее значение: " + 0);
  });

  $('#Stop').click(function() {
    StartGA = false;
    bestValue= undefined, 
    Mutations = 0,
    Children = 0,
    Iterations = 0,
    chromosomes = [],
    SelfDistance = [];
  });
});