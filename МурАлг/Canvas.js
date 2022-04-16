function DrawPoint(cx,cy){
	ctx.fillStyle = "lime";
	ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, 2 * Math.PI);
	ctx.fill();
	ctx.fillStyle = "black";
	ctx.lineWidth = 5;
	ctx.strokeStyle = '#003300';
	ctx.stroke();
}
function ShowPath(Path) //void
{
	ctx.clearRect (0, 0, canv.width, canv.height);
	for (let i = 0; i < Cities-1; i++) {
		if (i==0) ctx.beginPath();
        if (i==0) ctx.moveTo(coordsX[Path[i]], coordsY[Path[i]]);
		ctx.lineTo(coordsX[Path[i+1]], coordsY[Path[i+1]]);
	}
	ctx.closePath();  
	ctx.stroke();
	for (let i = 0; i < Cities; i++) {
		DrawPoint(coordsX[i],coordsY[i]);
	}
}

function ErasePastPath() {
	ctx.clearRect (0, 0, canv.width, canv.height);
	for (let i = 0; i < Cities; i++) {
		DrawPoint(coordsX[i],coordsY[i]);
	}
}
