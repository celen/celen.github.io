var canva = document.getElementById('canvas');
canva.width = window.innerWidth;
canva.height = window.innerHeight;

var ctx = canva.getContext('2d');

function clear() {
    ctx.clearRect(0, 0, canva.width, canva.height);
    ctx.fillStyle = 'rgba(0,0,0,1)';
	ctx.fillRect(0, 0, canva.width, canva.height);
}

var MAX_X = canva.width,
	MAX_Y = canva.height;

// by default
var N = 4;
var figure = [
				[0, 0, 0, 0],
				[0, 3, 3, 0],
				[0, 3, 3, 0],
				[0, 0, 0, 0],
			 ];
			 
// onload
if (location.hash) {
	var params = location.hash.substr(1, location.hash.length - 1);
	N = Math.floor(Math.sqrt(params.length));
	figure = [];
	for (var i = 0; i < N; i++)
		figure[i] = [];
	for (var i = 0; i < N*N; i++)
		figure[Math.floor(i / N)][i % N] = (isNaN(params[i])) ? 0 : parseInt(params[i]) % 10;
}

document.getElementById('n_value').value = N;
GenerateCBTable();
CreateTFractal();

//------------- Functions ----------------------------------------------
function CreateTFractal() {
	clear();
	var size = N;
	var countByX = Math.floor(MAX_X / size),
	countByY = Math.floor(MAX_Y / size);
	
	while ((countByX > 0) && (countByY > 0)) {
		for (var i = 0; i <= countByX; i++) {
			for (var k = 0; k <= countByY; k++) {
				PrintFigure(i * size, k * size, size, '255, 255, 255', 0.1);
			} // k
		} // i
	
		size *= 2;
		countByX = Math.floor(MAX_X / size),
		countByY = Math.floor(MAX_Y / size);
	}
}
			 
function PrintFigure(x, y, size, style, opacity) {
	var sizeElem = Math.floor(size / N);
	for (var i = 0; i < N; i++)
		for (var k = 0; k < N; k++)
			if (figure[i][k]>0) {
				ctx.fillStyle = 'rgba('+style+','+(opacity*figure[i][k])+')';
				ctx.fillRect(x + i * sizeElem, y + k * sizeElem, sizeElem, sizeElem);
			}
}

function GenerateCBTable() {
	var html = '<table>';
	for (var i = 0; i < N; i++) {
		html += '<tr>';
		for (var k = 0; k < N; k++) {
			var value = '';
			if (figure[i]) 
				if (figure[i][k])
					if (figure[i][k] > 0)
						value = figure[i][k];
			html += '<td><input class="num" type="text" id="cb_' + i + '_' + k + '" value="' + value + '" /></td>';
		}
		html += '</tr>';
	} // i
	html += '</table>';
	document.getElementById("cb_place").innerHTML = html;
}

document.getElementById('apply_n').onclick = function(evnt) {
	var tmp = parseInt(document.getElementById('n_value').value);
	if (isNaN(tmp)) {
		alert('Number, please!');
		return;
	}
	if (tmp == 0) {
		alert('Bigger then 0, please.');
		return;
	}
	N = tmp;
	GenerateCBTable();
}

document.getElementById('go').onclick = function(evnt) {
	var hash = '';
	figure = [];
	for (var i = 0; i < N; i++) {
		figure[i] = [];
		for (var k = 0; k < N; k++) {
			figure[i][k] = (document.getElementById('cb_' + i + '_' + k).value);
			if(figure[i][k])
				hash += figure[i][k];
			else
				hash += '0';			
		}
	}
	CreateTFractal();
	location.hash = hash;
}

document.getElementById('save').onclick = function(evnt) {
	window.open(document.getElementById("canvas").toDataURL("image/png"),"tfract_save");
}
