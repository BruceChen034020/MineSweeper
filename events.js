/*
版本: 1.0.0.16
*/

/* Value Events */
function sendOnline(){ // send a message to show you are online to the server
  var ref = database.ref('online/' + ip);
  var d = new Date();
  var data = {
    name: localStorage.getItem('name'),
    time: d.toString()
  }
  console.log(data);
  ref.set(data);
  setTimeout(sendOnline, 10000);
}

function gotData1(data){ // value beeData (void)
  console.log('got value bee');
  beeData = data.val();
  console.log(beeData);
  activationList = [];
  for(var i=0; i<cols; i++){
    for(var j=0; j<rows; j++){
      grid[i][j].bee = beeData['c'+i+'-'+j];
    }
  }
  Cell.prototype.countBeeReset();
  Cell.prototype.updateTotalBees();
 /*for(var k=0; k<7; k++){
  for(var i=0; i<cols; i++){
    for(var j=0; j<rows; j++){
      grid[i][j].countBees();

        grid[i][j].countBee2();
        grid[i][j].countBee3();
        grid[i][j].countBee4();
        grid[i][j].countBee5();
        grid[i][j].countBee6();
    }
  }
  if(k==3){
    Cell.prototype.countBeeReset2();
  }
}*/
}
function errData1(err){ // value revealData (void)
  console.log("Error!");
  console.log(err);
}

function gotData2(data){ // value reveal (void)
  console.log('got value reveal');
  revealData = data.val();
  console.log(revealData);
  for(var i=0; i<cols; i++){
    for(var j=0; j<rows; j++){
      grid[i][j].revealed = revealData['c'+i+'-'+j];
    }
  }
  Cell.prototype.countBeeReset();
 for(var k=0; k<7; k++){
  for(var i=0; i<cols; i++){
    for(var j=0; j<rows; j++){
      grid[i][j].countBees();

        grid[i][j].countBee2();
        grid[i][j].countBee3();
        grid[i][j].countBee4();
        grid[i][j].countBee5();
        grid[i][j].countBee6();
    }
  }
  if(k==3){
    Cell.prototype.countBeeReset2();
  }
 }
}

function errData2(err){ // value (void)
  console.log("Error!");
  console.log(err);
}

function gotData3(data){ // value size (void)
  console.log('got value size');
  sizeData = data.val();
  console.log(sizeData);
  activationList = [];
  var c = sizeData.Cols;
  var r = sizeData.Rows;
  cols = min(c, cols);
  rows = min(r, rows);

  widt = c * w + 1;
  heigh = r * w + 1;
  resizeCanvas(widt, heigh);
  if(Naive){
    cols = c;
    rows = r;
  }
if(!Naive){
  grid = make2DArray(max(c, cols), max(r, rows));
  for (var i = 0; i < max(c, cols); i++) {
    for (var j = 0; j < max(r, rows); j++) {
      grid[i][j] = new Cell(i, j, w);
    }
  }
  cols = c;
  rows = r;
  grid = make2DArray(cols, rows);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Cell(i, j, w);
    }
  }
  var ref1 = database.ref('bee/-L4RHoBEvd-XDQJ7IBfR');
  ref1.set(beeData);
  var ref2 = database.ref('reveal/0');
  ref2.set(revealData);
}
  Naive = false;
  Cell.prototype.updateCells();
  Cell.prototype.updateTotalBees();
}

function errData3(err){ // value (void)
  console.log("Error!");
  console.log(err);
}

function gotData4(data){ // value highest (void)
  console.log('got value highest');
  highest = data.val();
  console.log(highest);
  highestScore = highest['Score'];
  highestScoreMaker = highest['Name'];
  loading = false;
}

function errData4(err){ // value (void)
  console.log("Error!");
  console.log(err);
}

function gotData5(data){ // value online (void)

  var listings = selectAll('.fuck');
  for(var i=0; i<listings.length; i++){
    listings[i].remove();
  }

  var dt = data.val();

  if(dt==null){
    return;
  }

  var keys = Object.keys(dt);
  for(var i=0; i<keys.length; i++){
    var k = keys[i];
    var n = dt[k].name;
    var t = new Date(dt[k].time);

    var now = new Date();

    if(t.getTime() > now.getTime() - 30000){

      var li = createElement('li', n + ' is online');
      li.class('fuck');
      li.parent(ol1);

    }
  }

}

function errData5(err){ // value (void)
  console.log("Error!");
  console.log(err);
}

function errData4(err){ // value (void)
  console.log("Error!");
  console.log(err);
}

function gotData7(data){ // value reset (void)
  console.log('got Reset');
  score = 0;
}

function errData7(err){ // value (void)
  console.log("Error!");
  console.log(err);
}

/* Click Events */

function button1_Clicked(){ // click, set size (void)
  var ref7 = database.ref('reset/0');
  data = {random: random(1)};
  ref7.set(data);

  activationList = [];
  score = 0;
  var c = parseInt(textBox1.value());
  var r = parseInt(textBox2.value());
  if(c<=0 || r<=0){
    alert("The size you set doesn't make sense.");
    return;
  }
  if(c>MaxCols || r>MaxRows){
    alert('Your inputs exceed maximum size');
    return;
  }
  cols = min(c, cols);
  rows = min(r, rows);
  grid = make2DArray(c, r);

  for (var i = 0; i < c; i++) {

    for (var j = 0; j < r; j++) {

      grid[i][j] = new Cell(i, j, w);
    }
  }
  var ref1 = database.ref('bee/-L4RHoBEvd-XDQJ7IBfR');

  ref1.set(beeData);

  var ref2 = database.ref('reveal/0');
  ref2.set(revealData);

  cols = c;
  rows = r;
  resizeCanvas(cols * w + 1, rows * w + 1);

  var ref = database.ref('size/-L4R24I9ESQ-G_xMicP0');
  var data = {
    Cols: cols,
    Rows: rows
  }

  ref.set(data);

  if(useRatio){
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        grid[i][j].countBees();
      }
    }
  }else{
    PickSpots();
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        grid[i][j].countBees();
      }
    }
  }

}

function button2_Clicked(){ // click, set number of mines (void)
  var ref7 = database.ref('reset/0');
  data = {random: random(1)};
  ref7.set(data);

  activatinList = [];
  score = 0;
  if ( parseInt(textBox3.value()) > cols*rows){
    alert("The number of mines you set doesn't make sense.");
    return;
  }
  totalBees = parseInt(textBox3.value());
  useRatio = false;
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Cell(i, j, w);
    }
  }
  var ref1 = database.ref('bee/-L4RHoBEvd-XDQJ7IBfR');
  ref1.set(beeData);
  var ref2 = database.ref('reveal/0');
  ref2.set(revealData);
  PickSpots();
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].countBees();
    }
  }
}

function button3_Clicked(){ // click, set mine ratio (void)
  var ref7 = database.ref('reset/0');
  data = {random: random(1)};
  ref7.set(data);
console.log(data);
  activationList = [];
  score = 0;
  useRatio = true;
  beeRatio = parseFloat(textBox4.value());
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Cell(i, j, w);
    }
  }
  var ref1 = database.ref('bee/-L4RHoBEvd-XDQJ7IBfR');
  ref1.set(beeData);
  var ref2 = database.ref('reveal/0');
  ref2.set(revealData);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].countBees();
    }
  }
}

function button4_Clicked(){ // click, set username (void)
  /* Change username */
  var userName = textBox5.value();
  localStorage.setItem("name", userName);

  /* Send record */
  var reff = database.ref('record');
  var now = new Date();
  var data = {
    Ip: ip,
    Name: localStorage.getItem('name'),
    Time: now.toString()
  }
  console.log(data);
  reff.push(data);
}

function button5_Clicked(){
  gameOver();
}

function Sweeper_Clicked(){ // click (void)
  console.log("Sweeper");
  marking = false;
  /*Sweeper.style.backgroundColor = color(25, 23, 200, 50);
  Marker.style.backgroundColor = null;*/
}

function Marker_Clicked(){ // click (void)
  console.log("Marker");
  marking = true;
  /*Marker.style.backgroundColor = color(25, 23, 200, 50);
  Sweeper.style.backgroundColor = null;*/
}
