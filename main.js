/*
感謝您觀看這份程式碼
作品名稱: Mine sweeper
作者: 陳光穎 Bruce Chen
聯絡方式
Facebook連結: https://www.facebook.com/bruce.chen.372
    LINE ID: brucechen0
最後修改日期: 2017/2/4
    版本: 1.0.0.1
發表於: https://brucechen034020.github.io/
    程式碼尺度
N/A
作者註解:
    1. 如本網頁有 bug 請用 Facebook(Messenger) 通知 Bruce Chen，謝謝。
  2. 如有任何建議，請用 Facebook(Messenger) 通知 Bruce Chen，謝謝。
*/

/* Global variables */
var grid; // Grid (2D Cell array)
var cols = 20; // number of columns (int)
var rows = 20; // number of rows (int)
var w = 20; // length of each cell (int)

var totalBees = 30; // number of mines (int)
var beeRatio = 0; // ratio of mines (int)
var beeData = {}; // (Dictionary<ci-j, bool>)
var revealData = {}; // (Dictionary<ci-j, bool>)

var useRatio = false; // true: There are totalBees mines. false: There are approximately cols*rows*beeRatio mines

var Sweeper; // Sweeper button (Button)
var Marker; // Marker button (Marker)
var marking; // User is now using marker rather than sweeper (bool)
var ActivatedMineCount; // (p)
var button1; // (Button)
var button2; // (Button)
var button3; // (Button)
var textBox1; // cols (Input)
var textBox2; // rows (Input)
var textBox3; // totalBees (Input)
var textBox4; // beeRatio (Input)

var database; // firebase database

/* p5 functions */
function setup() {
  // Initialize Firebase
  var config = {
      apiKey: "AIzaSyDo0APvS5wobsjqTZLP3ZjztJweVPn4Tm4",
      authDomain: "minesweeper2-e610b.firebaseapp.com",
      databaseURL: "https://minesweeper2-e610b.firebaseio.com",
      projectId: "minesweeper2-e610b",
      storageBucket: "",
      messagingSenderId: "475599290511"
  };
  firebase.initializeApp(config);
  database = firebase.database();

  useRatio = false;

  textBox1 = createInput('20');
  label1 = createElement('label', 'columns');
  label1.parent(document.body);
  textBox2 = createInput('20');
  label2 = createElement('label', 'rows');
  label2.parent(document.body);
  button1 = createButton('Set');
  button1.mousePressed(button1_Clicked);
  createP('');

  textBox3 = createInput('30');
  label3 = createElement('label', 'mines / 個地雷');
  label3.parent(document.body);
  button2 = createButton('Set');
  button2.mousePressed(button2_Clicked);
  label4 = createElement('label', ' or 地雷比例 / Density of mines');
  textBox4 = createInput('0.5');
  button3 = createButton('Set');
  button3.mousePressed(button3_Clicked);
  createP('');

  createCanvas(401, 401);
  grid = make2DArray(cols, rows);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Cell(i, j, w);
    }
  }

  var ref1 = database.ref('bee/-L4RHoBEvd-XDQJ7IBfR');
  var ref2 = database.ref('reveal/0');
  var ref3 = database.ref('size/-L4R24I9ESQ-G_xMicP0');

  ref1.on('value', gotData1, errData1);
  ref2.on('value', gotData2, errData2);
  ref3.on('value', gotData3, errData3);

  /*ref1.set(beeData);
  ref2.set(revealData);*/




  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].countBees();
    }
  }

  /* Set other elements */
  createP('');

  Sweeper = document.createElement("button");
  document.body.appendChild(Sweeper);
  Sweeper.innerHTML = "踩下去 Sweeper";
  Sweeper.addEventListener("click", Sweeper_Clicked);

  Marker = document.createElement("button");
  document.body.appendChild(Marker);
  Marker.innerHTML = "標記地雷 Marker";
  Marker.addEventListener("click", Marker_Clicked);

  ActivatedMineCount = document.createElement("p");
  document.body.appendChild(ActivatedMineCount);
  ActivatedMineCount.innerHTML = "7 mines are activated.";
  ActivatedMineCount.value = "7 mines are activated.";


}

function mousePressed() {
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      if (grid[i][j].contains(mouseX, mouseY)) {
        grid[i][j].reveal(false);

        if (grid[i][j].bee) {
          gameOver();
        }

      }
    }
  }
}

function draw() {
  background(255);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show();
    }
  }
}

/* User defined functions */
function PickSpots(){ // Pick totalBees spots (void)
  var options = [];
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      options.push([i, j]);
    }
  }


  for (var n = 0; n < totalBees; n++) {
    var index = floor(random(options.length));
    var choice = options[index];
    var i = choice[0];
    var j = choice[1];
    // Deletes that spot so it's no longer an option
    options.splice(index, 1);
    grid[i][j].bee = true;
    beeData['c'+i+'-'+j] = true;
  }

  var ref = database.ref('bee/-L4RHoBEvd-XDQJ7IBfR');
  console.log('PickSpots');
  console.log(beeData);
  ref.set(beeData);
}
function make2DArray(cols, rows) { // make 2D array (2D array)
  var arr = new Array(cols);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}
function gameOver() { // (void)
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].revealed = true;
    }
  }
}

/* Events */
function gotData1(data){ // value beeData (void)
  console.log('got value bee');
  beeData = data.val();
  console.log(beeData);
  for(var i=0; i<cols; i++){
    for(var j=0; j<rows; j++){
      grid[i][j].bee = beeData['c'+i+'-'+j];
    }
  }
  for(var i=0; i<cols; i++){
    for(var j=0; j<rows; j++){
      grid[i][j].countBees();
    }
  }
}
function errData1(err){ // value revealData (void)
  console.log("Error!");
  console.log(err);
}

function gotData2(data){ // value size (void)
  console.log('got value reveal');
  revealData = data.val();
  console.log(revealData);
  for(var i=0; i<cols; i++){
    for(var j=0; j<rows; j++){
      grid[i][j].revealed = revealData['c'+i+'-'+j];
    }
  }
}

function errData2(err){ // value (void)
  console.log("Error!");
  console.log(err);
}

function gotData3(data){ // value (void)
  console.log('got value size');
  sizeData = data.val();
  console.log(sizeData);
  var c = sizeData.Cols;
  var r = sizeData.Rows;
  cols = min(c, cols);
  rows = min(r, rows);

  widt = c * w + 1;
  heigh = r * w + 1;
  resizeCanvas(widt, heigh);

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
}

function errData3(err){ // value (void)
  console.log("Error!");
  console.log(err);
}

function button1_Clicked(){ // click (void)
  var c = parseInt(textBox1.value());
  var r = parseInt(textBox2.value());
  cols = min(c, cols);
  rows = min(r, rows);
  grid = make2DArray(c, r);

  for (var i = 0; i < c; i++) {

    for (var j = 0; j < r; j++) {

      grid[i][j] = new Cell(i, j, w);
    }
  }
  var ref1 = database.ref('bee/-L4RHoBEvd-XDQJ7IBfR');
  console.log('button1');
    console.log(beeData);
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

function button2_Clicked(){ // click (void)
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

function button3_Clicked(){
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

function Sweeper_Clicked(){ // click (void)
  console.log("Sweeper");
  marking = false;
}

function Marker_Clicked(){ // click (void)
  console.log("Marker");
  marking = true;
}
