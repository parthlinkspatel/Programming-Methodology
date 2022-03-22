let robot = lib220.loadImageFromURL( 'https://people.cs.umass.edu/~joydeepb/robot.jpg');
//robot.show();

//removeBlueAndGreen(img: Image): Image
function removeBlueAndGreen(img){
  let robotCopy = img.copy();
  for(let i=0; i<robotCopy.width; ++i){
    for(let j=0; j<robotCopy.height; ++j){
      let pixelArr = robotCopy.getPixel(i,j);
      robotCopy.setPixel(i,j,[pixelArr[0],0,0]);
    }
  }
  return robotCopy;
  //robotCopy.show();
}

//removeBlueAndGreen(robot);

//makeGrayscale(img: Image): Image
function makeGrayscale(img){
  let grayScale = img.copy();
  for(let i=0; i<grayScale.width; ++i){
    for(let j=0; j<grayScale.height; ++j){
      let pixelArr = grayScale.getPixel(i,j)
      let mean = (pixelArr[0] + pixelArr[1] + pixelArr[2])/3;
      grayScale.setPixel(i,j,[mean,mean,mean]);
    }
  }
  return grayScale;
  //grayScale.show();
}


//imageMap(img: Image, func: (p: Pixel)=> Pixel): Image
function imageMap(img, func){
  let imgCopy = img.copy();
  for(let i=0; i<img.width; ++i){
    for(let j=0; j<img.height; ++j){
      let pix = func(img.getPixel(i,j));
      imgCopy.setPixel(i,j,[pix[0],pix[1],pix[2]]);
    }
  }
  return imgCopy;
  //imgCopy.show();
}

//red(p: Pixel): Pixel
function red(p){
  return [p[0],0,0];
}

//grayscale(p: Pixel): Pixel
function grayscale(p){
  let mean = (p[0] + p[1] + p[2])/3;
  return [mean, mean, mean];
}

//imageMap(robot, mapToRed);
//imageMap(robot, mapToGrayscale);

//mapToRed(imgage: Image): Image
function mapToRed(image){
  return imageMap(image, red);
}

//mapToGrayscale(img: Image): Image
function mapToGrayscale(image){
  return imageMap(image, grayscale);
}


test ( 'removeBlueAndGreen function definition is correct ' , function () { 
  const white = lib220.createImage(10, 10, [1,1,1]); 
  removeBlueAndGreen(white).getPixel(0 ,0);
// Need to use assert
});
test ( 'No blue or green in removeBlueAndGreen result ' , function () {
// Create a test image, of size 10 pixels x 10 pixels, and set it to all white. 
const white = lib220.createImage(10, 10, [1,1,1]);
// Get the result of the function.
const shouldBeRed = removeBlueAndGreen(white);
// Read the center pixel .
const pixelValue = shouldBeRed.getPixel(5,5);
// The red channel should be unchanged.
assert(pixelValue[0] === 1);
// The green channel should be 0.
assert(pixelValue[1] === 0);
// The blue channel should be 0.
assert(pixelValue[2] === 0);
});


function pixelEq (p1 , p2) { const epsilon = 0.002;
for (let i = 0; i < 3; ++i) {
if (Math.abs(p1[i]-p2[i]) > epsilon) { 
  return false;
} }
return true ; };
test ( 'Check pixel equality ' , function () {
const inputPixel = [0.5 , 0.5 , 0.5]
// Create a test image, of size 10 pixels x 10 pixels, and set it to the inputPixel 
const image = lib220.createImage(10, 10, inputPixel);
// Process the image .
const outputImage =
removeBlueAndGreen(image);
const centerPixel = outputImage.getPixel(5,5);
assert(pixelEq(centerPixel, [0.5,0,0]));
// Check the top−left corner pixel .
const cornerPixel = outputImage . getPixel (0 , 0); assert(pixelEq(cornerPixel , [0.5 , 0, 0]));
});

test('Check makeGrayscale method', function() {
  //creating a yellow 10x10p 
  const color = lib220.createImage(10,10,[0.3,0.3,0]);
  const shouldBeGrayscale = makeGrayscale(color);
  const pixVal = shouldBeGrayscale.getPixel(4,3);
  assert(pixVal[0] === 0.2);
  assert(pixVal[1] === 0.2);
  assert(pixVal[2] === 0.2);
});

test('Check mapToGrayscale method', function() {
  //creating a yellow 10x10p 
  const color = lib220.createImage(10,10,[0.3,0.3,0]);
  const shouldBeGrayscale = mapToGrayscale(color);
  const pixVal = shouldBeGrayscale.getPixel(4,3);
  assert(pixVal[0] === 0.2);
  assert(pixVal[1] === 0.2);
  assert(pixVal[2] === 0.2);
});

test ( 'check mapToRed function' , function () {
// Create a test image, of size 10 pixels x 10 pixels, and set it to all white. 
const white = lib220.createImage(10, 10, [1,1,1]);
// Get the result of the function.
const shouldBeRed = mapToRed(white);
// Read the center pixel .
const pixelValue = shouldBeRed.getPixel(5,5);
// The red channel should be unchanged.
assert(pixelValue[0] === 1);
// The green channel should be 0.
assert(pixelValue[1] === 0);
// The blue channel should be 0.
assert(pixelValue[2] === 0);
});