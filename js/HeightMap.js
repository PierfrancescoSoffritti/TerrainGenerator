/**
* HeightMap.js
* @author Pierfrancesco Soffritti
*
*/

var heights;
var size;
var perlin;

function HeightMap(sizeP, seed) {

	size = sizeP;

	heights = createMultidimensionalArray(size, size);
	initMultidimensionalArray(heights);

	perlin = new PerlinGenerator(seed);
}

function initMultidimensionalArray(array) {
	for(var i=0; i<array.length; i++) {
		for( var j=0; j<array[0].length; j++) {
			array[i][j] = 0;
		}
	}
}

function createMultidimensionalArray(length) {
	var arr = new Array(length || 0), i = length;

	if (arguments.length > 1) {
		var args = Array.prototype.slice.call(arguments, 1);
		while(i--)
			arr[length-1 - i] = createMultidimensionalArray.apply(this, args);
	}

	return arr;
}

// public
HeightMap.prototype.addPerlinNoise = function(f) {
	for (var i=0; i<size; i++) {
		for (var j=0; j<size; j++) {
			heights[i][j] += perlin.noise(f * i / size, f * j / size, 0);
		}
	}
}

/*
* this step displaces the height elements according to another Perlin noise map
*  with a much higher frequency. It is very similar to creating an ocean wave effect.
*  
*  The d parameter determines the maximum distance an element can move. 
*  The f parameter is again the frequency. 
*/
// public
HeightMap.prototype.perturb = function(f, d) {
	var u, v;
	var temp = createMultidimensionalArray(size, size);
	initMultidimensionalArray(temp);

	for (var i=0; i<size; ++i) {
		for (var j=0; j<size; ++j) {
			u = i + (perlin.noise(f * i / size, f * j / size, 0) * d);
			v = j + (perlin.noise(f * i / size, f * j / size, 1) * d);

			// cast to int
			u = parseInt("" +u);
			v = parseInt("" +v);

			// clamp
			if (u < 0) u = 0;
			if (u >= size) u = size - 1;
			
			if (v < 0) v = 0;
			if (v >= size) v = size - 1;
			
			temp[i][j] = heights[u][v];
		}
	}
	
	heights = temp;
}

/*
* What this function does is go through every elements Moore neighbourhood (excluding itself)
* and look for the lowest point, the match.
* If the difference between the element and its match is between 0 and a smoothness factor,
* some of the height will be transferred.
*/
// public
HeightMap.prototype.erode = function(smoothness) {
	for (var i=1; i<size-1; i++) {
		for (var j=1; j<size-1; j++) {
			var d_max = 0.0;
			var match = [ 0, 0 ];
			
			for (var u=-1; u<=1; u++) {
				for (var v=-1; v<=1; v++) {
					if(Math.abs(u) + Math.abs(v) > 0) {
						var d_i = heights[i][j] - heights[i + u][j + v];
						if (d_i > d_max) {
							d_max = d_i;
							match[0] = u; match[1] = v;
						}
					}
				}
			}
			
			if(0 < d_max && d_max <= (smoothness / size)) {
				var d_h = 0.5 * d_max;
				heights[i][j] -= d_h;
				heights[i + match[0]][j + match[1]] += d_h;
			}
		}
	}
}

/*
* this function will smooth it out a bit. We’ll use a standard 3×3 box filter
*/
// public
HeightMap.prototype.smoothen = function() {
	for (var i=1; i<size-1; ++i) {
		for (var j=1; j<size-1; ++j) {
			var total = 0.0;
			for (var u=-1; u<=1; u++) {
				for (var v=-1; v<=1; v++) {
					total += heights[i + u][j + v];
				}
			}
			
			heights[i][j] = total / 9.0;
		}
	}
}

HeightMap.prototype.setHeights = function(heightsV) {
	heights = heightsV;
}
	
HeightMap.prototype.getHeights = function() {
	return heights;
}
	
HeightMap.prototype.setSize = function(sizeV) {
	size = sizeV;
}
	
HeightMap.prototype.getSize = function() {
	return size;
}
	
HeightMap.prototype.getPerlinGenerator = function() {
	return perlin;
}
	
HeightMap.prototype.setPerlinGenerator = function(perlinV) {
	perlin = perlinV;
}

// naive implementation
HeightMap.prototype.offsetValues = function(factor) {
	// get min and max height
	for(var i=0; i<heights.length; i++) {
		for(var j=0; j<heights[0].length; j++) {
			heights[i][j] = (heights[i][j] + 0.5) * factor;
		}
	}
}

HeightMap.prototype.printInfo = function() {
	// get min and max height
	var min = 10000, max = -10000;
	for(var i=0; i<heights.length; i++) {
		for(var j=0; j<heights[0].length; j++) {
			// min
			if(heights[i][j] < min)
				min = heights[i][j];
				// max
			if(heights[i][j] > max)
				max = heights[i][j];
		}
	}

	console.log("min: " +min +"  max: " +max);
}

	
HeightMap.prototype.toString = function() {

	// too heavy to execute. The arrays are too big
	/*
	for(var i=0; i<size; i++) {
		for(var j=0; j<size; j++) {
			console.log(heights[i][j] +", ");
		}
	}
	*/
	console.log("toString => HeightMap size: " +heights.length +" x " +heights[0].length);
	//console.log(heights[10][10]);
}
