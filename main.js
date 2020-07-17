//Get canvas element and draw context for later use
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = document.getElementById('image');

var velocity = [ 1, 1 ];
var position = [ 0, 0 ];

//Set up window resize event so that canvas matches screen size
window.addEventListener('resize', () => {
	canvas.width = document.documentElement.clientWidth;
	canvas.height = document.documentElement.clientHeight;
	position = [ canvas.width / 2, canvas.height / 2 ];
});
window.dispatchEvent(new Event('resize'));

function drawFrame() {
	ctx.beginPath();
	ctx.rect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'white';
	ctx.fill();
	ctx.drawImage(img, position[0] - img.width / 2, position[1] - img.height / 2, img.width, img.height);
}

function fixedUpdate() {
	position = [ position[0] + velocity[0], position[1] + velocity[1] ];
	//Check if colliding with wall on x axis, or wall on y axis
	if (position[0] + img.width / 2 > canvas.width || position[0] - img.width / 2 < 0) {
		velocity[0] = velocity[0] * -1;
	}
	if (position[1] + img.height / 2 > canvas.height || position[1] - img.height / 2 < 0) {
		velocity[1] = velocity[1] * -1;
	}
}

//Set interval for fixed update and draw frame
const frameTime = 1000 / 60;
const updateTime = 1;

setInterval(drawFrame, frameTime);
setInterval(fixedUpdate, updateTime);
