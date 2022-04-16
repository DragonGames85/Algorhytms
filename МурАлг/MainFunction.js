$(function() {
	setInterval(ANT_ALGORHYTM, 10);
	$("canvas").click(function(e) {
		ctx.fillStyle = "lime";
        coordsX.push(e.pageX-e.target.offsetLeft);
        coordsY.push(e.pageY - e.target.offsetTop+10);
        Cities++;
        ctx.font = "italic 30pt Arial";
        Matrix = matrixArray(Cities,Cities);
		pheromones = matrixArray(Cities,Cities);
		ants = matrixArray(SetAnts,Cities);
		bestWay = [Cities];
        DrawPoint(e.pageX - e.target.offsetLeft,e.pageY - e.target.offsetTop+10);
	});
	$('#launch').click(function() { 
		ANTS_initialization();
		StartAnts = true;
	  });
	$('#stop').click(function() {
		StartAnts = false;
	});
	$('#random').click(function() { 
		let randomX, randomY;
		randomX = getRandomInt(canv.width);
		randomY=getRandomInt(canv.height);
		ctx.fillStyle = "lime";
        coordsX.push(randomX  );
        coordsY.push(randomY  );
        ctx.beginPath();
        ctx.moveTo(randomX  , randomY  );
        Cities++;
        Matrix = matrixArray(Cities,Cities);
		pheromones = matrixArray(Cities,Cities);
		ants = matrixArray(SetAnts,Cities);
		bestWay = [Cities];
        DrawPoint(randomX  ,randomY);
	});
	$('#clear').click(function() { 
		coordsX =[],
		coordsY =[],
		colors = [],
		bestWay = [],
		bestlength = 0,
		StartAnts=false,
		Cities = 0,
		IterCounter = 0,
		Matrix = [],
		pheromones = [],
		ants = [];
		ctx.clearRect (0, 0, canv.width, canv.height);
		$('#DATA').text(" Лучшая длина: " + Math.floor(bestlength) + " Итерация: " + IterCounter + "   ");
	});
});