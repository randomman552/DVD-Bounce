//Main canvas used to draw final display
const canvas = document.getElementById('canvas');
const mainctx = canvas.getContext('2d');

//Secondary canvas used to draw the image and add color filters
const imageCanvas = document.getElementById('image-canvas');
const imagectx = imageCanvas.getContext('2d');

//All filters in this list were generated using https://codepen.io/sosuke/pen/Pjoqqp
var imageFilterOptions = [
	'invert(90%) sepia(49%) saturate(5115%) hue-rotate(356deg) brightness(101%) contrast(106%)',
	'invert(7%) sepia(99%) saturate(7407%) hue-rotate(247deg) brightness(106%) contrast(143%)',
	'invert(24%) sepia(93%) saturate(6188%) hue-rotate(359deg) brightness(90%) contrast(126%)',
	'invert(14%) sepia(78%) saturate(5891%) hue-rotate(311deg) brightness(125%) contrast(112%)',
	'invert(90%) sepia(50%) saturate(992%) hue-rotate(101deg) brightness(107%) contrast(106%)',
	'invert(73%) sepia(79%) saturate(6164%) hue-rotate(93deg) brightness(129%) contrast(118%)',
	'invert(49%) sepia(100%) saturate(2654%) hue-rotate(6deg) brightness(110%) contrast(101%)',
	'invert(10%) sepia(80%) saturate(6614%) hue-rotate(278deg) brightness(119%) contrast(121%)'
];

//Intialise image filter variable and select a random starting filter
var imageFilter;
advanceImageFilter();

//Get image from DOM
const img = document.getElementById('image');

/*
* The reason we use two canvas is so that we can apply filters 
to the image separately from the main display
* Due to our use of filters, a browser without filter support will just see a black screen.
More details here: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter
*/
var velocity = [ canvas.width / 3000, canvas.width / 3000 ];
var position = [ 0, 0 ];

//Set up window resize event so that canvas size matches screen size
window.addEventListener('resize', () => {
	//Update both canvas size
	canvas.width = document.documentElement.clientWidth;
	canvas.height = document.documentElement.clientHeight;
	imageCanvas.width = document.documentElement.clientWidth;
	imageCanvas.height = document.documentElement.clientHeight;

	//Re calculate position and velocity
	if (position[0] + img.width >= canvas.width || position[0] - img.width < 0) {
		position = [ canvas.width / 2, canvas.height / 2 ];
	}
	if (position[1] + img.height >= canvas.height || position[1] - img.height < 0) {
		position = [ canvas.width / 2, canvas.height / 2 ];
	}
	velocity = [ canvas.width / 3000, canvas.width / 3000 ];

	//Redraw the current frame
	drawFrame();
});
window.dispatchEvent(new Event('resize'));

/**
 * Function randomly selects a color filter for the image
 * If the end of the list is reached it will loop around.
 */
function advanceImageFilter() {
	imageFilter = Math.floor(Math.random() * (imageFilterOptions.length - 1) + 1);
}

function drawFrame() {
	//Draw image on image context first
	imagectx.clearRect(0, 0, canvas.width, canvas.height);
	imagectx.filter = imageFilterOptions[imageFilter];
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
		advanceImageFilter();
	}
	if (position[1] + img.height / 2 > canvas.height || position[1] - img.height / 2 < 0) {
		velocity[1] = velocity[1] * -1;
		advanceImageFilter();
	}
}

//Set interval for fixed update and draw frame
const frameTime = 1000 / 60;
const updateTime = 1;

setInterval(drawFrame, frameTime);
setInterval(fixedUpdate, updateTime);
