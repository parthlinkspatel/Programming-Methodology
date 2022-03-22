let url = 'https://people.cs.umass.edu/~joydeepb/robot.jpg';
let robot = lib220.loadImageFromURL(url);


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
}


//imageMapXY(img: Image, func: (img: Image, x: number, y: number) => Pixel): Image
function imageMapXY(img, func){
  let copy = img.copy();
  for(let i=0; i<img.width; ++i){
    for(let j=0; j<img.height; ++j){
      let array = func(img,i,j);
      copy.setPixel(i,j,array);
    }
  }
  return copy;
}

//imageMask(img: Image, cond: (img: Image, x: number, y: number) => boolean, maskValue: Pixel): Image
function imageMask(img, cond, maskValue){
  return imageMapXY(img, function(img,x,y){
    if(cond(img,x,y) === true){
      return maskValue;
    }
    else{
      return img.getPixel(x,y);
    }
  });
}

//imageMapCond(img: Image, cond: (img: Image, x: number, y: number) => boolean, func: (p: Pixel) => Pixel): Image
function imageMapCond(img, cond, func){
  return imageMapXY(img, function(img,x,y){
    if(cond(img,x,y) === true){
      let pixelX = x;
      let pixelY = y;
      return func(img.getPixel(x,y));
    }
    else{
      return img.getPixel(x,y);
    }
  });
}

//blurPixel(img: Image, x: number, y:number): Pixel
function blurPixel(img,x,y){
  let rgb = img.getPixel(x,y);
  let red = rgb[0];
  let green = rgb[1];
  let blue = rgb[2];
  let numPixels = 1;
  if(pixel(img, x-1, y-1)){
    numPixels = numPixels +1;
    rgb = img.getPixel(x-1,y-1);
    red = red + rgb[0];
    green = green + rgb[1];
    blue = blue + rgb[2];
  }
  if(pixel(img, x, y-1)){
    numPixels = numPixels +1;
    rgb = img.getPixel(x,y-1);
    red = red + rgb[0];
    green = green + rgb[1];
    blue = blue + rgb[2];
  }
  if(pixel(img, x+1, y-1)){
    numPixels = numPixels +1;
    rgb = img.getPixel(x+1,y-1);
    red = red + rgb[0];
    green = green + rgb[1];
    blue = blue + rgb[2];
    }
  if(pixel(img, x+1, y)){
    numPixels = numPixels +1;
    rgb = img.getPixel(x+1,y);
    red = red + rgb[0];
    green = green + rgb[1];
    blue = blue + rgb[2];
  }
  if(pixel(img, x+1, y+1)){
    numPixels = numPixels +1;
    rgb = img.getPixel(x+1,y+1);
    red = red + rgb[0];
    green = green + rgb[1];
    blue = blue + rgb[2];
  }
  if(pixel(img, x, y+1)){
    numPixels = numPixels +1;
    rgb = img.getPixel(x,y+1);
    red = red + rgb[0];
    green = green + rgb[1];
    blue = blue + rgb[2];
  }
  if(pixel(img, x-1, y+1)){
    numPixels = numPixels +1;
    rgb = img.getPixel(x-1,y+1);
    red = red + rgb[0];
    green = green + rgb[1];
    blue = blue + rgb[2];
  }
  if(pixel(img, x-1, y)){
    numPixels = numPixels +1;
    rgb = img.getPixel(x-1,y);
    red = red + rgb[0];
    green = green + rgb[1];
    blue = blue + rgb[2];
  }
  let avgR = red/numPixels;
  let avgG = green/numPixels;
  let avgB = blue/numPixels;
  return [avgR,avgG,avgB];
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

//blurImage(img:Image):Image
function blurImage(img){
  return imageMapXY(img, blurPixel);
}


//blurHalfImage(img: Image, left: boolean): Image
function blurHalfImage(img, left){
  let newImg = img.copy();
  if(left){
    return imageMapXY(img, function(img,x,y){
      if(x < (img.width/2)){
        return blurPixel(img, x, y);
      }
      else{ return img.getPixel(x,y); }
    });
  } else{
      return imageMapXY(img, function(img,x,y){
        if(x > (img.width/2)){
          return blurPixel(img, x, y);
        }
        else{ return img.getPixel(x,y); }
      });
  }
}

//let newRobot = blurHalfImage(robot, true);
//newRobot.show();

//isGrayish(p: Pixel): boolean
function isGrayish(p){
  let max = p[0];
  let min = p[0];
  for(let i=0; i<3; ++i){
    if(max < p[i]){
      max = p[i];
    } 
    if(min > p[i]){
      min = p[i];
    }
  }
  return (1/3) >= (max - min);
}



//makeGrayish(img: Image): Image
function makeGrayish(img){
  return imageMapCond(img, 
  function(img, x, y){ return !isGrayish(img.getPixel(x,y));}, 
  function(p){
    let mean = (p[0] + p[1] + p[2])/3;
    return [mean, mean, mean];
  });
}
makeGrayish(robot).show();

//grayHalfImage(img: Image): Image
function grayHalfImage(img){
  return imageMapCond(img,
  function(img, x, y){ return y < img.height/2;},
  function(p){
    let mean = (p[0] + p[1] + p[2])/3;
    return [mean, mean, mean];
  });
}
//grayHalfImage(robot).show();

//saturateHigh(img: Image): Image
function saturateHigh(img){
  return imageMapCond(img,
  function(img, x, y){
    let pixel = img.getPixel(x,y);
    if(pixel[0] > (2/3)){ return true;}
    else if(pixel[1] > (2/3)){ return true;}
    else if(pixel[2] > (2/3)){ return true;}
    else{ return false;}
  },
  function(p){
    if(p[0] > (2/3)){ p[0] = 1;}
    if(p[1] > (2/3)){ p[1] = 1;}
    if(p[2] > (2/3)){ p[2] = 1;}
    return [p[0],p[1],p[2]];
  });
}
//saturateHigh(robot).show();

//blackenLow(img: Image): Image
function blackenLow(img){
  return imageMapCond(img,
  function(img, x, y){
    let pixel = img.getPixel(x,y);
    if(pixel[0] < (1/3)){ return true;}
    else if(pixel[1] < (1/3)){ return true;}
    else if(pixel[2] < (1/3)){ return true;}
    else{ return false;}
  },
  function(p){
    if(p[0] < (1/3)){ p[0] = 0;}
    if(p[1] < (1/3)){ p[1] = 0;}
    if(p[2] < (1/3)){ p[2] = 0;}
    return [p[0],p[1],p[2]];
  });
}
//blackenLow(robot).show();

//reduceFunctions(fa: ((p: Pixel) => Pixel)[] ): ((x: Pixel) => Pixel)
function reduceFunctions(fa){
  return function(x){
    return fa.reduce((x,f) => f(x),x);
  }
}

//contrastGray(img: Image): Image
function contrastGray(img){
  //saturateHighP(p : Pixel): Pixel
  function saturateHighP(p){
    if(p[0] > 2/3){
      p[0] = 1.0;
    }
    if(p[1] > 2/3){
      p[1] = 1.0;
    }
    if(p[2] > 2/3){
      p[2] = 1.0;
    }
    return p;
  }
  //blackenLowP(p: Pixel): Pixel
  function blackenLowP(p){
    if(p[0] < 1/3){
      p[0] = 0.0;
    }
    if(p[1] < 1/3){
      p[1] = 0.0;
    }
    if(p[2] < 1/3){
      p[2] = 0.0;
    }
    return p;
  }
  //makeGrayishP(p: Pixel): Pixel
  function makeGrayishP(p){
    if(isGrayish(p)){
      let mean = (p[0] + p[1] + p[2])/3;
      return [mean, mean, mean];
    } else {
      return p;
    }
  }
  return imageMap(img, reduceFunctions([saturateHighP, blackenLowP, makeGrayishP]));
}

//contrastGray(robot).show();



test('imageMapXY function definition is correct', function() {
  function identity(image, x, y) { return image.getPixel(x, y); }
  let inputImage = lib220.createImage(10, 10, [0, 0, 0]);
  let outputImage = imageMapXY(inputImage, identity);
  let p = outputImage.getPixel(0, 0); // output should be an image, getPixel works
  assert(p[0] === 0);
  assert(p[1] === 0);
  assert(p[2] === 0);
  assert(inputImage !== outputImage); // output should be a different image object
});

function pixelEq (p1, p2) {
  const epsilon = 0.002;
  for (let i = 0; i < 3; ++i) {
    if (Math.abs(p1[i] - p2[i]) > epsilon) { return false; }
  }
  return true;
};
test('identity function with imageMapXY', function() {
  let identityFunction = function(image, x, y ) {
    return image.getPixel(x, y);
  };
  let inputImage = lib220.createImage(10, 10, [0.2, 0.2, 0.2]);
  inputImage.setPixel(0, 0, [0.5, 0.5, 0.5]);
  inputImage.setPixel(5, 5, [0.1, 0.2, 0.3]);
  inputImage.setPixel(2, 8, [0.9, 0.7, 0.8]);
  let outputImage = imageMapXY(inputImage, identityFunction);
  assert(pixelEq(outputImage.getPixel(0, 0), [0.5, 0.5, 0.5]));
  assert(pixelEq(outputImage.getPixel(5, 5), [0.1, 0.2, 0.3]));
  assert(pixelEq(outputImage.getPixel(2, 8), [0.9, 0.7, 0.8]));
  assert(pixelEq(outputImage.getPixel(9, 9), [0.2, 0.2, 0.2]));
});

test('testing imageMask()', function(){
  const robotAfter = imageMask(robot, function(img,x,y){ return (y % 10 === 0); }, [1,0,0]);
  const pixel1 = robotAfter.getPixel(10,0);
  const pixel2 = robot.getPixel(5,5);
  assert(pixel1[0] === 1);
  assert(pixel1[1] === 0);
  assert(pixel2[0] !== 1 && pixel2[1] !== 0 && pixel2[2] !== 0);
});

test('testing imageMapCond() and imageMask()', function(){
  const img1 = imageMapCond(robot, function(img,x,y){return(y%10 === 0);}, function(p){ return [1,0,0];});
  const img2 = imageMask(robot, function(img,x,y){ return (y % 10 === 0); }, [1,0,0]);
  assert(img1.getPixel(10,10)[0] === img2.getPixel(10,10)[0]);
  assert(img1.getPixel(100,100)[0] === img2.getPixel(100,100)[0]);
  assert(img1.getPixel(0,0)[0] === img2.getPixel(0,0)[0]);
});

test('testing blurHalfImage() method', function(){
  const image1 = lib220.createImage(2,2,[1,0,0]);
  image1.setPixel(0,0,[1,1,0]);
  image1.setPixel(0,1,[1,0,0]);
  image1.setPixel(1,0,[1,1,0]);
  assert(image1.getPixel(1,1)[2] === 0);
  const image2 = blurHalfImage(image1, true);
  assert(image2.getPixel(1,1)[2] === 0);
  assert(image2.getPixel(0,0)[2] === 0);
  assert(image2.getPixel(0,1)[0] === 1);
});

