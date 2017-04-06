'use strict';
(function(){
	var c = document.getElementById('canvas');
	var ctx = c.getContext('2d');

	

	function rand(min, max){
		return Math.floor(Math.random() * (max - min) + min);
	}

	function randPoint(){
		return {x: rand(0, document.getElementById('canvas').getAttribute('width')),
				y: rand(0, document.getElementById('canvas').getAttribute('width'))
			}
	}

	
	function drawRedPolygon(points){
		ctx.beginPath();
		points.forEach(function(item, index, arr){
			ctx.font = "1em Arial";
			ctx.fillStyle = '#11bb11';
			ctx.strokeStyle="#FF0000";
			ctx.fillText(index,item.x,item.y);
			ctx.lineTo(item.x, item.y);

		});
		ctx.closePath();
		ctx.stroke();
	}

	function drawPolygon(points){
		ctx.beginPath();
		points.forEach(function(item, index, arr){
			ctx.font = "1em Arial";
			ctx.fillStyle = '#11bb11';
			ctx.strokeStyle="#000";
			ctx.fillText(index,item.x,item.y);
			ctx.lineTo(item.x, item.y);

		});
		ctx.closePath();
		ctx.stroke();
	}

	function drawRays(point1, point2) {
		ctx.beginPath();
		ctx.lineTo(point1.x, point1.y);
		ctx.lineTo(point2.x, point2.y);
		ctx.closePath();
		ctx.stroke();
	}

	function findBottomPointPosition(points){
		var min = 0;
		points.forEach(function(item, i, arr) {
			if(arr[min].y < item.y){
				min = i;
			}
		})
		return min;
	}

	function replaceFirstPoint(points) {
		var pos = findBottomPointPosition(points);
		var tmp = points[pos];
		points[pos] = points[0];
		points[0] = tmp;
	}

	function vectorMult(point1, point2){
		return point1.x * point2.x - point1.y+point2.y;
	}

	function vectLenght(point){
		return Math.sqrt(vectorMult(point, point));
	}

	function calcAngle(a, b) {
		var ONE_RADIAN = 57.295779513082;
        var deltaX, deltaY;

        //if the points are undefined, return a zero difference angle.
        if (!a || !b) return 0;

        deltaX = (b.x - a.x);
        deltaY = (b.y - a.y);

        if (deltaX == 0 && deltaY == 0) {
            return 0;
        }

        var angle = Math.atan2(deltaY, deltaX) * ONE_RADIAN;

        return angle;
	}

	function compareAngles(a, b) {
		if (a.angle < b.angle) return 1;
		if (a.angle > b.angle) return -1;
	}

	function sortByAngle(points) {
		var angles = [];
		angles = points.map(function(item, i, arr) {
			if(i != 0)
				return { angle: calcAngle(arr[0], item), pos:i};
		});
		angles.sort(compareAngles);
		angles.pop();
		angles.unshift({
			angle: calcAngle(points[0], points[findBottomPointPosition(points)]),
			pos: 0
		});
		console.log(angles)
		return angles.map(function(item) {
			console.log(points[item.pos])
			return points[item.pos];
		})
	}
	

	function det(x1,x2,y1,y2){
		return x1*y2-x2*y1; 
	}
	function sideOfPoint(det){
	    if (det > 0)
	        return -1;
	    else if (det < 0)
	        return 1;
	    else
	        return 0;
	}
	function lineMinusPointSide(line, point){
		var determ = det(line[1].x - line[0].x, point.x - line[0].x,
						 line[0].y - line[1].y, line[0].y - point.y);
		return (sideOfPoint(determ));
	}

	function make(points) {
		var res = [];
		res.push(points[0]);
		res.push(points[1]);
		for(var i=2;i<points.length;++i){
			console.log(res);
			var line = [
				{x:res[res.length-2].x,y:res[res.length-2].y},
				{x:res[res.length-1].x,y:res[res.length-1].y}
			];
			if(lineMinusPointSide(line, points[i]) == -1){
				res.push(points[i]);
			}else{
				res.pop();
				--i;
			}
		}
		return res;
	}

	var points = [];
	var container = [];
	for(var i=0;i<8;++i){
		points.push(randPoint());
	}
	replaceFirstPoint(points);
	//drawPolygon(points);
	points = sortByAngle(points); 
	//points = sortByX(points); 
	drawPolygon(points);
	drawRedPolygon(make(points));


	
})()	