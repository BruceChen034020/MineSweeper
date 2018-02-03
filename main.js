/*
感謝您觀看這份程式碼
作品名稱: N/A
作者: 陳光穎 Bruce Chen
聯絡方式
Facebook連結: https://www.facebook.com/bruce.chen.372
    LINE ID: brucechen0
最後修改日期: 2017/2/3
    版本: N/A
發表於: https://brucechen034020.github.io/
    程式碼尺度
N/A
作者註解:
    1. 如本網頁有 bug 請用 Facebook(Messenger) 通知 Bruce Chen，謝謝。
  2. 如有任何建議，請用 Facebook(Messenger) 通知 Bruce Chen，謝謝。
*/

/* Global variables */
var grid; // Grid (2D Cell array)
var cols; // number of columns (int)
var rows; // number of rows (int)
var w = 20; // length of each cell (int)

var totalBees = 30; // number of mines (int)
var beeRatio = 0; // ratio of mines (int)

var useRatio = false; // true: There are totalBees mines. false: There are approximately cols*rows*beeRatio mines

var Sweeper; // Sweeper button (Button)
var Marker; // Marker button (Marker)
var marking; // User is now using marker rather than sweeper (bool)
var ActivatedMineCount; // (p)
/* p5 functions */
function setup() {
  createCanvas(401, 401);
  cols = floor(width / w);
  rows = floor(height / w);
  grid = make2DArray(cols, rows);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Cell(i, j, w);
    }
  }

  // Pick totalBees spots
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
  }


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
  ActivatedMineCount.value = "7 mines are activated."
}

function mousePressed() {
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      if (grid[i][j].contains(mouseX, mouseY)) {
        grid[i][j].reveal();

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
function make2DArray(cols, rows) { // make 2D array
  var arr = new Array(cols);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}
function gameOver() {
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].revealed = true;
    }
  }
}

function Sweeper_Clicked(){
  console.log("Sweeper");
}
function Marker_Clicked(){
  console.log("Marker");
}
