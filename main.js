//Main canvas used to draw final display
const canvas = document.getElementById('canvas');
const mainctx = canvas.getContext('2d');

//Secondary canvas used to draw the image and add color filters
const imageCanvas = document.getElementById('image-canvas');
const imagectx = imageCanvas.getContext('2d');
var imageFilter = 'invert(1)';

//Get image from DOM
const img = document.getElementById('image');

/*
* The reason we use two canvas is so that we can apply filters 
to the image separately from the main display
* This does mean that this code will not work in browsers that do not support canvas filtering
More details here: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter
*/
var velocity = [ 1, 1 ];
var position = [ 0, 0 ];

//Set up window resize event so that canvas matches screen size
window.addEventListener('resize', () => {
	//Update both canvas size
	canvas.width = document.documentElement.clientWidth;
	canvas.height = document.documentElement.clientHeight;
	imageCanvas.width = document.documentElement.clientWidth;
	imageCanvas.height = document.documentElement.clientHeight;
	position = [ canvas.width / 2, canvas.height / 2 ];
});
window.dispatchEvent(new Event('resize'));

function drawFrame() {
	//Draw image on image context first
	imagectx.clearRect(0, 0, canvas.width, canvas.height);
	imagectx.filter = imageFilter;
	imagectx.drawImage(img, position[0] - img.width / 2, position[1] - img.height / 2, img.width, img.height);

	//Draw image from the first canvas onto the second
	mainctx.beginPath();
	mainctx.fillStyle = 'black';
	mainctx.fillRect(0, 0, canvas.width, canvas.height);
	mainctx.drawImage(imageCanvas, 0, 0);
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
