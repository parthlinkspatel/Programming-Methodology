let robot = lib220.loadImageFromURL( 'https://people.cs.umass.edu/~joydeepb/robot.jpg');

//highlightEdges(img: Image): Image
function highlightEdges(img){
  let robotCopy = img.copy();
  for(let i=0; i<robotCopy.width; ++i){
    for(let j=0; j<robotCopy.height-1; ++j){
      let pixelArr = robotCopy.getPixel(i,j);
      let m1 = (pixelArr[0]+pixelArr[1]+pixelArr[2])/3;
      let pixelArr2 = robotCopy.getPixel(i, j+1);
      let m2 = (pixelArr2[0]+pixelArr2[1]+pixelArr2[2])/3;
      robotCopy.setPixel(i,j,[Math.abs(m1-m2),Math.abs(m1-m2),Math.abs(m1-m2)]);
    }
    robotCopy.setPixel(i,robotCopy.height-1,[0,0,0]);
  }
  return robotCopy;
}

highlightEdges(robot).show();


//blur(img: Image): Image
function blur(img){
  let copy = img.copy();
  for(let i=0; i<copy.width; ++i){
    for(let j=0; j<copy.height; ++j){
      let rgb = img.getPixel(i,j);
      let red = rgb[0];
      let green = rgb[1];
      let blue = rgb[2];
      let numPixels = 1;
      if(pixel(copy, i-1, j-1)){
        numPixels = numPixels +1;
        rgb = img.getPixel(i-1,j-1);
        red = red + rgb[0];
        green = green + rgb[1];
        blue = blue + rgb[2];
      }
      if(pixel(copy, i, j-1)){
        numPixels = numPixels +1;
        rgb = img.getPixel(i,j-1);
        red = red + rgb[0];
        green = green + rgb[1];
        blue = blue + rgb[2];
      }
      if(pixel(copy, i+1, j-1)){
        numPixels = numPixels +1;
        rgb = img.getPixel(i+1,j-1);
        red = red + rgb[0];
        green = green + rgb[1];
        blue = blue + rgb[2];
      }
      if(pixel(copy, i+1, j)){
        numPixels = numPixels +1;
        rgb = img.getPixel(i+1,j);
        red = red + rgb[0];
        green = green + rgb[1];
        blue = blue + rgb[2];
      }
      if(pixel(copy, i+1, j+1)){
        numPixels = numPixels +1;
        rgb = img.getPixel(i+1,j+1);
        red = red + rgb[0];
        green = green + rgb[1];
        blue = blue + rgb[2];
      }
      if(pixel(copy, i, j+1)){
        numPixels = numPixels +1;
        rgb = img.getPixel(i,j+1);
        red = red + rgb[0];
        green = green + rgb[1];
        blue = blue + rgb[2];
      }
      if(pixel(copy, i-1, j+1)){
        numPixels = numPixels +1;
        rgb = img.getPixel(i-1,j+1);
        red = red + rgb[0];
        green = green + rgb[1];
        blue = blue + rgb[2];
      }
      if(pixel(copy, i-1, j)){
        numPixels = numPixels +1;
        rgb = img.getPixel(i-1,j);
        red = red + rgb[0];
        green = green + rgb[1];
        blue = blue + rgb[2];
      }
      let avgR = red/numPixels;
      let avgG = green/numPixels;
      let avgB = blue/numPixels;
      copy.setPixel(i,j,[avgR, avgG, avgB]);
    }
  }
  return copy;
  //copy.show();
}

//pixel(img: Image, i: Integer, j:Integer): boolean
function pixel(img, i,j){
  //checks if the pixel is valid
  if(i === -1 || i===img.width || j===-1 || j===img.height){
    return false;
  }
  else {
    return true;
  }
}

//blur(robot);


//imageMap(img: Image, func: (p: Pixel)=> Pixel): Image
function imageMap(img, func){
  let imgCopy = img.copy();
  for(let i=0; i<img.width; ++i){
    for(let j=0; j<img.height; ++j){
      let pix = func(imgCopy.getPixel(i,j));
      imgCopy.setPixel(i,j,[pix[0],pix[1],pix[2]]);
    }
  }
  return imgCopy;
  //imgCopy.show();
}

//swapGBHelper(p: Pixel): Pixel
function swapGBHelper(p){
  return [p[0], p[2], p[1]];
}

//swapGB(img: Image): Image
function swapGB(img){
  return imageMap(img, swapGBHelper);
}

swapGB(robot).show();

//shiftRGBHelper(p: Pixel): Pixel
function shiftRGBHelper(p){
  return [p[2], p[0], p[1]];
}

//shiftRGB(img, Image): Image
function shiftRGB(img){
  return imageMap(img, shiftRGBHelper);
}

shiftRGB(robot).show();

test('testing swapGB method', function(){
  const yellow = lib220.createImage(10,10,[1,1,0]);
  const swappedYellow = swapGB(yellow);
  const pixel1 = swappedYellow.getPixel(1,1);
  assert(pixel1[2] === 1);
  assert(pixel1[1] === 0);
  assert(pixel1[0] === 1);
  //testing corner pixel
  const pixel2 = swappedYellow.getPixel(9,9);
  assert(pixel2[2] === 1);
  assert(pixel2[1] === 0);
  assert(pixel2[0] === 1);
});

test('testing shiftRGB method', function(){
  const yellow = lib220.createImage(10,10,[1,1,0]);
  const swappedYellow = shiftRGB(yellow);
  const pixel1 = swappedYellow.getPixel(1,1);
  assert(pixel1[2] === 1);
  assert(pixel1[1] === 1);
  assert(pixel1[0] === 0);
  //testing corner pixel
  const pixel2 = swappedYellow.getPixel(9,9);
  assert(pixel2[2] === 1);
  assert(pixel2[1] === 1);
  assert(pixel2[0] === 0);
});

test('testing highlightEdges() method', function(){
  const image1 = lib220.createImage(2,2,[0,0,0]);
  image1.setPixel(0,0,[1,1,1]);
  image1.setPixel(0,1,[1,0,0]);
  image1.setPixel(1,0,[0,1,0]);
  assert(image1.getPixel(1,1)[2] === 0);
  const image2 = highlightEdges(image1);
  assert(image2.getPixel(1,1)[0] === 0);
  assert(image2.getPixel(0,1)[0] === 0);
});


test('testing blur() method', function(){
  const image1 = lib220.createImage(2,2,[1,0,0]);
  image1.setPixel(0,0,[1,1,0]);
  image1.setPixel(0,1,[1,0,0]);
  image1.setPixel(1,0,[1,1,0]);
  assert(image1.getPixel(1,1)[2] === 0);
  const image2 = blur(image1);
  assert(image2.getPixel(1,1)[2] === 0);
  assert(image2.getPixel(0,0)[2] === 0);
  assert(image2.getPixel(0,1)[0] === 1);

});