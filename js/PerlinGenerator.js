/**
* PerlinGenerator.js
* @author Pierfrancesco Soffritti
*
*/

var gradientSizeTable = 256;

var gradientsSize = gradientSizeTable * 3;
var gradients = [];

var perm = [ 225, 155, 210, 108, 175, 199, 221, 144, 203, 116, 70, 213, 69, 158, 33, 252,
			5, 82, 173, 133, 222, 139, 174, 27,  9, 71, 90, 246, 75, 130, 91, 191,
			169, 138,  2, 151, 194, 235, 81, 7, 25, 113, 228, 159, 205, 253, 134, 142,
			248, 65, 224, 217, 22, 121, 229, 63, 89, 103, 96, 104, 156, 17, 201, 129,
			36, 8, 165, 110, 237, 117, 231, 56, 132, 211, 152, 20, 181, 111, 239, 218,
			170, 163, 51, 172, 157, 47, 80, 212, 176, 250, 87, 49, 99, 242, 136, 189,
			162, 115, 44, 43, 124, 94, 150, 16, 141, 247, 32, 10, 198, 223, 255, 72,
			53, 131, 84, 57, 220, 197, 58, 50, 208, 11, 241, 28, 3, 192, 62, 202,
			18, 215, 153, 24, 76, 41, 15, 179, 39, 46, 55, 6, 128, 167, 23, 188,
			106, 34, 187, 140, 164, 73, 112, 182, 244, 195, 227, 13, 35, 77, 196, 185,
			26, 200, 226, 119, 31, 123, 168, 125, 249, 68, 183, 230, 177, 135, 160, 180,
			12, 1, 243, 148, 102, 166, 38, 238, 251, 37, 240, 126, 64, 74, 161, 40,
			184, 149, 171, 178, 101, 66, 29, 59, 146, 61, 254, 107, 42, 86, 154, 4,
			236, 232, 120, 21, 233, 209, 45, 98, 193, 114, 78, 19, 206, 14, 118, 127,
			48, 79, 147, 85, 30, 207, 219, 54, 88, 234, 190, 122, 95, 67, 143, 109,
			137, 214, 145, 93, 92, 100, 245, 0, 216, 186, 60, 83, 105, 97, 204, 52 ];

function PerlinGenerator(seed) {
	// sets the seed for the Math.random() function
	Math.seedrandom(seed);
	initGradients();
}

// public
PerlinGenerator.prototype.noise = function(x, y, z) {
	var ix = Math.floor(x);
	// cast to int
	ix = parseInt("" +ix);
	var fx0 = x - ix;
	var fx1 = fx0 - 1;
	var wx = smooth(fx0);

	var iy = Math.floor(y);
	// cast to int
	iy = parseInt("" +iy);
	var fy0 = y - iy;
	var fy1 = fy0 - 1;
	var wy = smooth(fy0);

	var iz = Math.floor(z);
	// cast to int
	iz = parseInt("" +iz);
	var fz0 = z - iz;
	var fz1 = fz0 - 1;
	var wz = smooth(fz0);

	var vx0 = lattice(ix, iy, iz, fx0, fy0, fz0);
	var vx1 = lattice(ix + 1, iy, iz, fx1, fy0, fz0);
	var vy0 = lerp(wx, vx0, vx1);
		
	vx0 = lattice(ix, iy + 1, iz, fx0, fy1, fz0);
	vx1 = lattice(ix + 1, iy + 1, iz, fx1, fy1, fz0);
	var vy1 = lerp(wx, vx0, vx1);
		
	var vz0 = lerp(wy, vy0, vy1);
		
	vx0 = lattice(ix, iy, iz + 1, fx0, fy0, fz1);
	vx1 = lattice(ix + 1, iy, iz + 1, fx1, fy0, fz1);
	vy0 = lerp(wx, vx0, vx1);
		
	vx0 = lattice(ix, iy + 1, iz + 1, fx0, fy1, fz1);
	vx1 = lattice(ix + 1, iy + 1, iz + 1, fx1, fy1, fz1);
	vy1 = lerp(wx, vx0, vx1);
		
	var vz1 = lerp(wy, vy0, vy1);
		
	return lerp(wz, vz0, vz1);
}

// private
function initGradients() {
	for (var i=0; i<gradientSizeTable; i++) {
		var z = 1 - 2 * Math.random();
		var r = Math.sqrt(1 - z * z);
		var theta = 2 * Math.PI * Math.random();
		gradients[i * 3] = r * Math.cos(theta);
		gradients[i * 3 + 1] = r * Math.sin(theta);
		gradients[i * 3 + 2] = z;
	}
}

// private
function permutate(x) {
	var mask = gradientSizeTable - 1;
	return perm[x & mask];
}

// private
function index(ix, iy, iz) {
	return permutate(ix + permutate(iy + permutate(iz)));
}

// private
function lattice(ix, iy, iz, fx, fy, fz) {
	var vIndex = index(ix, iy, iz);
	var g = vIndex * 3;
	return gradients[g] * fx + gradients[g + 1] * fy + gradients[g + 2] * fz;
}

// private
function lerp(t, value0, value1) {
	return value0 + t * (value1 - value0);
}

// private
function smooth(x) {
	return x * x * (3 - 2 * x);
}