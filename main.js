//Get window dimensions
var dimensions = [ document.documentElement.clientWidth, document.documentElement.clientHeight ];

//All filters in this list were generated using https://codepen.io/sosuke/pen/Pjoqqp
var colors = [ 'red', 'blue', 'orange', 'lime', 'cyan', 'magenta', 'yellow' ];
var colorIndex = Math.floor(Math.random() * (colors.length - 1) + 1);
const imgDiv = document.getElementById('image');
var imgDims = [ Number(imgDiv.style.width.replace('px', '')), Number(imgDiv.style.height.replace('px', '')) ];
advanceImageFilter();

var velocity = [ dimensions[0] / 3000, dimensions[0] / 3000 ];
var position = [ dimensions[0] / 2, dimensions[1] / 2 ];

//Set up window resize event so that canvas size matches screen size
window.addEventListener('resize', () => {
	dimensions = [ document.documentElement.clientWidth, document.documentElement.clientHeight ];

	//Re-size the image to be appropriate to screen size
	const newimgWidth = dimensions[0] / 5;
	imgDiv.style.width = `${newimgWidth}px`;
	imgDiv.style.height = `${newimgWidth / 1.6}px`;
	imgDims = [ Number(imgDiv.style.width.replace('px', '')), Number(imgDiv.style.height.replace('px', '')) ];

	//Re-calculate position and velocity
	if (position[0] + imgDims[0] / 2 >= dimensions[0] || position[0] - imgDims[0] / 2 < 0) {
		position = [ dimensions[0] / 2, dimensions[1] / 2 ];
	}
	if (position[1] + imgDims[1] / 2 >= dimensions[1] || position[1] - imgDims[1] / 2 < 0) {
		position = [ dimensions[0] / 2, dimensions[1] / 2 ];
	}
	velocity = [ Math.abs(velocity[0]) / velocity[0], Math.abs(velocity[1]) / velocity[1] ];
	velocity = [ velocity[0] * (dimensions[0] / 3000), velocity[1] * (dimensions[0] / 3000) ];
});
window.dispatchEvent(new Event('resize'));

/**
 * Advances to the next color
 * If the end of the list is reached it will loop around.
 */
function advanceImageFilter() {
	colorIndex += 1;
	if (colorIndex >= colors.length) {
		colorIndex = 0;
	}
	imgDiv.style.color = colors[colorIndex];
}

function fixedUpdate() {
	position = [ position[0] + velocity[0], position[1] + velocity[1] ];
	//Check if colliding with wall on x axis, or wall on y axis
	if (position[0] + imgDims[0] / 2 > dimensions[0] || position[0] - imgDims[0] / 2 < 0) {
		velocity[0] = velocity[0] * -1;
		advanceImageFilter();
	}
	if (position[1] + imgDims[1] / 2 > dimensions[1] || position[1] - imgDims[1] / 2 < 0) {
		velocity[1] = velocity[1] * -1;
		advanceImageFilter();
	}
	imgDiv.style.left = `${position[0] - imgDims[0] / 2}px`;
	imgDiv.style.top = `${position[1] - imgDims[1] / 2}px`;
}

//Set interval for fixed update
const updateTime = 1;

setInterval(fixedUpdate, updateTime);
