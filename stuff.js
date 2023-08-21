const size = 0.6;
let countryPolygons = [];
let x = 0;
let y = 0;
let z = 0;
let countryName = '';
let value;
let checkCountryConstant;
let mapCheck;

function convertPathToPolygons(path) {
  let coord_point = [0, 0];
  let polygons = [];
  let currentPolygon = [];

  for (const node of path) {
    if (node[0] == "m") {
      coord_point[0] += node[1] * size;
      coord_point[1] += node[2] * size;
      currentPolygon = [];
    } else if (node[0] == "M") {
      coord_point[0] = node[1] * size;
      coord_point[1] = node[2] * size;
      currentPolygon = [];
    } else if (node == "z") {
      currentPolygon.push([...coord_point]);
      polygons.push(currentPolygon);
    } else {
      currentPolygon.push([...coord_point]);
      coord_point[0] += node[0] * size;
      coord_point[1] += node[1] * size;
    }
  }
  
  return polygons;
}

function setup(){
	calculateBase();
	mapSetUp();
	w = createInput();
	button = createButton('submit');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  console.log("resized")
}

function draw(){
	createCanvas(windowWidth, windowHeight*1.3);
	const scaleFactor=width/1300;
	const sizeHeading = (windowHeight/20)*scaleFactor;
	const sizeSubHeading = (windowHeight/22)*scaleFactor;
	const sizeSubSubHeading = (windowHeight/30)*scaleFactor;
	const inputWidth = width/10;
	const inputHeight = (windowHeight/30)*scaleFactor;
	const inputHeading = (windowHeight/30)*scaleFactor;
	const buttonText = (windowHeight/50)*scaleFactor;
	const inputText = (windowHeight/45)*scaleFactor;
	stroke(0);
	strokeWeight(2);
	fill(255);
	imageMode(CENTER, TOP);
	textAlign(CENTER,TOP);
	textFont('Courier')
	textStyle(BOLD);
	push();
	textSize(sizeHeading);
	fill(0);
	strokeWeight(0.1);
	text('WORLD CARBON CLOCK', width/2, 50);
	textAlign(CENTER,TOP);
	textSize(sizeSubHeading);
	text('Carbon Emitted This Year:', width/2, 68+sizeHeading);
	strokeWeight(0.1);
	fill(255,0,0);
	textSize(sizeSubSubHeading);
	if (countryName==""){
		text("Click on or type in a country", width/2, 95+sizeSubHeading+sizeHeading+sizeSubHeading);
		text("to see it's individual carbon clock!", width/2, 95+sizeSubHeading+sizeHeading+sizeSubHeading+sizeSubSubHeading);
	}
	fill(0,0,0);
  w.position(width/2, 113+sizeSubHeading+sizeHeading+sizeSubHeading+sizeSubSubHeading+sizeSubHeading);
  w.size(inputWidth, inputHeight);
  w.style('font-size', str(inputText)+'px');
  button.position(width/2+inputWidth, 113+sizeSubHeading+sizeHeading+sizeSubHeading+sizeSubSubHeading+sizeSubHeading);
  button.size(inputWidth*5/6, inputHeight);
  button.style('font-size', str(buttonText)+'px');
  button.style('font', 'Courier');
  textSize(inputHeading);
  text("Type here: ", (width*3)/7, 105+sizeSubHeading+sizeHeading+sizeSubHeading+sizeSubSubHeading+sizeSubHeading);
	fill(0,0,0);
	textSize(sizeSubHeading);
	checkCountryConstant = constantCalc(countryName);
	if (countryName!=""){
			text(countryName + " Clock:", width/2, 80+sizeSubHeading+sizeHeading+sizeSubHeading);
			text(nfc(Math.round((x+millis())*checkCountryConstant,0))+' metric tons', width/2, 85+sizeSubHeading+sizeHeading+sizeSubHeading+sizeSubHeading);
	}
	textAlign(CENTER, TOP);
	text(nfc(Math.round((x+millis())/0.77674876847,0))+' metric tons', width/2, 70+sizeSubHeading+sizeHeading);
	pop();
  push();
  const moveY=height/7 + sizeSubHeading+sizeHeading+sizeSubHeading+sizeSubHeading+sizeSubHeading;
  const moveX=width/100;
  translate(moveX,moveY);
  scale(scaleFactor);
  let collision = false;
  for (let i = 0; i < countryPolygons.length; i++) {
    fill(150*(100*constantCalc(country[i].name)),(200*constantCalc(country[i].name)),28/(500*constantCalc(country[i].name)));
    if (!collision && mouseIsPressed) {
      collision = countryPolygons[i].some(poly => detectCollision(poly, (mouseX-moveX)/scaleFactor, (mouseY-moveY)/scaleFactor));
      if (collision) {
        fill('green');
        console.log(constantCalc(country[i].name))
        countryName=country[i].name;
        mapCheck =1;
      }
      mapCheck=0;
    }
    
    for (const poly of countryPolygons[i]) {
      beginShape();
      for (const vert of poly) {
        vertex(...vert);
      }
      endShape();
    }
  }
  button.mousePressed(buttonCountry);
  pop();
}

function buttonCountry(){
	countryName=w.value();
}

function calculateBase(){
	if (month()>=1){
		y=0;
		if (month()>=2){
			y+=31;
			if (month()>=3){
				y+=28;
				if (month()>=4){
					y+=31;
					if (month() >= 5){
						y+=30;
						if (month() >= 6){
							y+=31;
							if (month() >= 7){
								y+=30;
								if (month() >= 8){
									y+=31;
									if (month() >= 9){
										y+=31;
										if (month() >= 10){
											y+=30;
											if (month() >= 11){
												y+=31;
												if (month() >= 12){
													y+=30;
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	
	x=float(((y+(day()-1))*(8.64e+7))+((3.6e+6)*hour())+(60000*minute())+(1000*second()));
}


function mapSetUp(){
  for (let i = 0; i < country.length; i++) {
    countryPolygons.push(convertPathToPolygons(
      country[i].vertexPoint
    ));
  }
}

function detectCollision(polygon, x, y) {
  let c = false;
  // for each edge of the polygon
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    // Compute the slope of the edge
    let slope = (polygon[j][1] - polygon[i][1]) / (polygon[j][0] - polygon[i][0]);
    
    // If the mouse is positioned within the vertical bounds of the edge
    if (((polygon[i][1] > y) != (polygon[j][1] > y)) &&
        // And it is far enough to the right that a horizontal line from the
        // left edge of the screen to the mouse would cross the edge
        (x > (y - polygon[i][1]) / slope + polygon[i][0])) {
      
      // Flip the flag
      c = !c;
    }
  }
  return c;
}