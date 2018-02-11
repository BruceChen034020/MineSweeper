/*
感謝您觀看這份程式碼
作品名稱: Mine sweeper
作者: 陳光穎 Bruce Chen
聯絡方式
    Facebook連結: https://www.facebook.com/bruce.chen.372
    LINE ID: brucechen0
最後修改日期: 2017/2/11
版本: 1.0.0.8
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
var button4; // (Button)
var button5; // (Button)
var textBox1; // cols (Input)
var textBox2; // rows (Input)
var textBox3; // totalBees (Input)
var textBox4; // beeRatio (Input)
var label5; // score (Label)

var database; // firebase database
var Naive; // in setup step (bool)
var score; // points (int)
var highestScore; // highest score record (int)
var highestScoreMaker // (string)
var loading; // web page is loading
//var userName; // user name // (string)
var ol1; // online people list (ol)
var onlineList = []; // (list)
var ip; // ip adress of the client (string)
var p1; // how many people are online (p)
var p2; // contain online list (p)
var ol2; // activated bomb list (ol)
var activationList = []; // (Cell list)
var p4; // contain activation list (p)

var MaxCols = 40; // maximum amount of Cols
var MaxRows = 40; // maximum amout of rows

/* p5 functions */
function setup() {

  $.getJSON('https://freegeoip.net/json/', function(data) {
    console.log(JSON.stringify(data, null, 2));
    var userName = data['ip']
    userName += ' (' + (data['country_name']) + ')';
    localStorage.setItem("name", userName);
    ip = userName.replace('.', '-');
    ip = ip.replace('.', '-');
    ip = ip.replace('.', '-');
    ip = ip.replace('.', '-');
    ip = ip.replace(' ', '-');
    ip = ip.replace('(', '');
    ip = ip.replace(')', '');
    ip = '-' + ip;
  });
  Naive = true;
  score = 0;
  loading = true;

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

  // Initailize document.body elements
  label6 = createElement('label', 'Your name: ');
  label6.parent(document.body)
  textBox5 = createInput('');
  setTimeout(function(){ textBox5.value(localStorage.getItem('name')); }, 3000);
  button4 = createButton('Set');
  button4.mousePressed(button4_Clicked);
  createP('');

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
  grid = make2DArray(MaxCols, MaxRows);
  for (var i = 0; i < MaxCols; i++) {
    for (var j = 0; j < MaxRows; j++) {
      grid[i][j] = new Cell(i, j, w);
    }
  }
//button1_Clicked();
  var ref1 = database.ref('bee/-L4RHoBEvd-XDQJ7IBfR');
  var ref2 = database.ref('reveal/0');
  var ref3 = database.ref('size/-L4R24I9ESQ-G_xMicP0');
  var ref4 = database.ref('highest');
  var ref5 = database.ref('online');

  ref1.on('value', gotData1, errData1);
  ref2.on('value', gotData2, errData2);
  ref3.on('value', gotData3, errData3);
  ref4.on('value', gotData4, errData4);
  ref5.on('value', gotData5, errData5);





  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].countBees();
    }
  }

  /* Set other elements */
  label5 =  createElement('label');
  label5.parent(document.body);
  label5.html('75 points');
  label5.style('font-size', 72 + 'px');

  button5 = createButton('End game');
  button5.mousePressed(button5_Clicked);

  createP('');

  Sweeper = document.createElement("button");
  document.body.appendChild(Sweeper);
  Sweeper.innerHTML = "踩下去 Sweeper (S)";
  Sweeper.addEventListener("click", Sweeper_Clicked);

  Marker = document.createElement("button");
  document.body.appendChild(Marker);
  Marker.innerHTML = "標記地雷 Marker (M)";
  Marker.addEventListener("click", Marker_Clicked);

  ActivatedMineCount = document.createElement("p");
  document.body.appendChild(ActivatedMineCount);
  ActivatedMineCount.innerHTML = "7 mines are activated.";
  ActivatedMineCount.value = "7 mines are activated.";

  p4 = document.createElement('p');
  document.body.appendChild(p4);

  ol2 = createElement('ol');
  ol2.parent(p4);

  p1 = createP('3 people online');

  p2 = document.createElement("p");
  document.body.appendChild(p2);
//  ActivatedMineCount.innerHTML = " people online";
  //ActivatedMineCount.value = " people online";
  ol1 = createElement('ol');

  ol1.parent(p2);

  Sweeper_Clicked();

  setTimeout(sendOnline, 10000);

  var welcomeMessage = "歡迎來玩踩地雷!\r\n注意這些地雷不只是地雷，還是定時炸彈!\r\n一旦你有足夠的線索知道某一格是地雷時，請立刻標記它。如果在能知悉某格確定為地雷後20秒內沒有標記它，它就會爆炸，並且扣你20分。\r\n";
  var welcomeMessageEn = "Welcome to play mine sweeper!\r\nThese mines are not only mines but also time bombs.\r\nOnce you have sufficient information to know a cell is a bomb, you should immediately mark it. Otherwise, it will automatically explode in 20 seconds, and you will be taken 20 points off. The bombs will start timing only after you have sufficient information to locate it.";
  alert(welcomeMessage + welcomeMessageEn);
}
function mousePressed() { // (void)
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      if (grid[i][j].contains(mouseX, mouseY)) {
        if(grid[i][j].revealed){
          return;
        }
        grid[i][j].reveal(false);

        if (grid[i][j].bee && marking==false) {
          alert("踩到地雷了，扣40分。You denotated a mine. You are taken 40 points off");
          score -= 40;
        }

        if(!grid[i][j].bee && marking==true){
          alert("標錯了，扣4分。You marked the wrong cell. You are taken 4 points off.");
          score -= 4;
        }

        if(grid[i][j].bee && marking==true){
          score += 4;
        }

        if(!grid[i][j].bee && marking==false){
          score += 1;
        }

      }
    }
  }
}

function keyPressed(){
  console.log('Key: ' + keyCode);
  if(keyCode == 83){
    Sweeper_Clicked();
  }
  if(keyCode == 77){
    Marker_Clicked();
  }
}

function draw() {

  frameRate(10);
  background(255);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show();
      grid[i][j].countBee2();
      grid[i][j].countBee3();
      grid[i][j].countBee4();
      grid[i][j].countBee5();
      grid[i][j].countBee6();
    }
  }
  newActivationRule();
  label5.html(score + ' points');
  if(loading){
    label5.html('Loading...');
  }
  gameOver2();
  var listings = selectAll('.fuck');
  var n = listings.length;
  /*console.log('229: ' + n);
  console.log(p1.innerHTML);
  while(p1.innerHTML[0]!=' '){
    p1.innerHTML = p1.innerHTML.slice(1);
    console.log(p1.innerHTML);
    p1.value = p1.value.slice(1);
  }
  console.log(p1.innerHTML);
  var s = n + p1.innerHTML;
  console.log(s);
  console.log(ol1);*
  //setTimeout(function(){p1.innerHTML = s;}, 0);
  //p1.innerHTML = s;
  console.log(p1.innerHTML);
  //p1.value = n + p1.value;*/
  p1.html(n + ' people online');
  Elapse();
  actiList();
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
  console.log("Game over type 1");
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].revealed = true;
    }
  }
}
function gameOver2(){ // 判斷 wheter the game is over (void)
  var over = true;
  for(var i=0; i<cols; i++){
    for(var j=0; j<rows; j++){
      if(grid[i][j].revealed==false){
        over = false;
      }
    }
  }
  if(over){ // the game is over
    console.log("Game over type 2");
    setTimeout(function(){ alert("Game over!\r\nYour score: " + score + " points.\r\nYour highest score record: " + localStorage.getItem("score")
      + " points.\r\nGlobal highest score record: " + highestScore + ' points by ' + highestScoreMaker); score = 0;}, 0);

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
    if(score > localStorage.getItem("score")){
      localStorage.setItem("score", score);
    }
    if(highestScore < score){
      var ref = database.ref('highest');
      var data = {
        Name: localStorage.getItem("name"),
        Score: score
      }
      console.log(data);
      ref.set(data);
      setTimeout(function(){ alert('恭喜你破紀錄了! Congratulations! You broke the record!\r\nNew record: ' + highestScore + 'points by ' + highestScoreMaker );});
    }
  }
}

/* Events */
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

function button1_Clicked(){ // click (void)
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

function button2_Clicked(){ // click (void)
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

function button3_Clicked(){
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

function button4_Clicked(){ // click (void)
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
  Sweeper.style.backgroundColor = color(25, 23, 200, 50);
  Marker.style.backgroundColor = null;
}

function Marker_Clicked(){ // click (void)
  console.log("Marker");
  marking = true;
  Marker.style.backgroundColor = color(25, 23, 200, 50);
  Sweeper.style.backgroundColor = null;
}
