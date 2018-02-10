/*
感謝您觀看這份程式碼
作品名稱: Mine sweeper
作者: 陳光穎 Bruce Chen
聯絡方式
    Facebook連結: https://www.facebook.com/bruce.chen.372
    LINE ID: brucechen0
最後修改日期: 2017/2/10
版本: 1.0.0.8
發表於: https://brucechen034020.github.io/
程式碼尺度
  N/A
作者註解:
  1. 如本網頁有 bug 請用 Facebook(Messenger) 通知 Bruce Chen，謝謝。
  2. 如有任何建議，請用 Facebook(Messenger) 通知 Bruce Chen，謝謝。
*/
function Cell(i, j, w) {
  this.i = i; // column index (int)
  this.j = j; // row index (int)
  this.x = i * w; // location (int)
  this.y = j * w; // 同上 (int)
  this.w = w; // length of the square cell (int)
  this.neighborCount = 0; // # of bee neibors (int)
  this.bee = false; // bee == mine (bool)
  this.known = false; // this cell is known to be not mine (bool)
  this.unknownNeighbor = 76; // how many neighbors are unknownNeighbor (int)
  this.beeLeft = 76; // how many neibors of unknown are mines
  this.beeActivated = false; // bee is activated
  this.AActivated = false; // permanently activated
  beeData['c'+i+'-'+j] = false;
  if(random(1)<beeRatio && useRatio==true){
    this.bee = true;
    beeData['c'+i+'-'+j] = true;
  }
  this.revealed = false; // (bool)
  revealData['c'+i+'-'+j] = false;

  this.print = function(){
    console.log('Cell(', + this.i + ', ' + this.j + ')');
  }

  this.toString = function(){
    return 'Cell(', + this.i + ', ' + this.j + ')';
  }
}

Cell.prototype.countBeeReset = function(){
  for(var i=0; i<cols; i++){
    for(var j=0; j<rows; j++){
      grid[i][j].known = false;
      grid[i][j].unknownNeibor = 76;
      grid[i][j].beeLeft = 76;
      grid[i][j].beeActivated = false;
    }
  }
}

Cell.prototype.countBeeReset2 = function(){
  for(var i=0; i<cols; i++){
    for(var j=0; j<rows; j++){
      grid[i][j].known = false;
      grid[i][j].beeActivated = false;
    }
  }
}

Cell.prototype.updateCells = function(){
  for(var i=0; i<cols; i++){
    for(var j=0; j<rows; j++){
      grid[i][j].revealed = revealData['c'+i+'-'+j];
      grid[i][j].bee = beeData['c'+i+'-'+j];
    }
  }
  for(var i=0; i<cols; i++){
    for(var j=0; j<rows; j++){
      grid[i][j].countBees();
    }
  }
}

Cell.prototype.show = function() { // update screen
  stroke(0);
  noFill();
  rect(this.x, this.y, this.w, this.w);
  if (this.revealed) {
    if(this.AActivated){
      fill(127, 0, 0);
      rect(this.x, this.y, this.w, this.w);
    }
    if (this.bee) {
      fill(127);
      ellipse(this.x + this.w * 0.5, this.y + this.w * 0.5, this.w * 0.5);
    } else {
      fill(200);
      rect(this.x, this.y, this.w, this.w);
      if (this.neighborCount > 0) {
        textAlign(CENTER);
        fill(0);
        text(this.neighborCount, this.x + this.w * 0.5, this.y + this.w - 6);
      }
    }
  }
  if(loading){
    text('?', this.x + this.w * 0.5, this.y + this.w - 6);
  }
}

Cell.prototype.countBees = function() { // Count how many bees are in the neighbour (void)
  if (this.bee) {
    this.neighborCount = -1;
    return;
  }
  var total = 0;
  for (var xoff = -1; xoff <= 1; xoff++) {
    var i = this.i + xoff;
    if (i < 0 || i >= cols) continue;

    for (var yoff = -1; yoff <= 1; yoff++) {
      var j = this.j + yoff;
      if (j < 0 || j >= rows) continue;

      var neighbor = grid[i][j];
      if (neighbor.bee) {
        total++;
      }
    }
  }
  this.neighborCount = total;
}

Cell.prototype.countBee2 = function(){ // update unknownNeighbor (void)
  if(this.revealed && (!this.bee) ){
    this.known = true;
  }
  if (this.bee) {
    this.neighborCount = -1;
    return;
  }
  var total = 0;
  for (var xoff = -1; xoff <= 1; xoff++) {
    var i = this.i + xoff;
    if (i < 0 || i >= cols) continue;

    for (var yoff = -1; yoff <= 1; yoff++) {
      var j = this.j + yoff;
      if (j < 0 || j >= rows) continue;
      if(xoff == 0 && yoff == 0) continue;
      var neighbor = grid[i][j];

      if ((!neighbor.known)&&(!(neighbor.bee&&neighbor.revealed))) {
        total++;

      }
    }
  }
  this.unknownNeighbor = total;
  if(0==this.beeLeft && this.revealed){
    for (var xoff = -1; xoff <= 1; xoff++) {
      var i = this.i + xoff;
      if (i < 0 || i >= cols) continue;

      for (var yoff = -1; yoff <= 1; yoff++) {
        var j = this.j + yoff;
        if (j < 0 || j >= rows) continue;
        if(xoff == 0 && yoff == 0) continue;
        var neighbor = grid[i][j];
        if(!neighbor.bee)
          neighbor.known = true;
      }
    }
    this.unknownNeighbor = 0;
  }
}

Cell.prototype.countBee3 = function(){ // activate neighbors (void)
  /*if(this.i==0&&this.j==1){
    console.log('unknownNeighbor = ' + this.unknownNeighbor);
    console.log('beeLeft = ' + this.beeLeft);
  }*/

  if(this.unknownNeighbor==this.beeLeft && this.beeLeft>0 && this.revealed){
    for (var xoff = -1; xoff <= 1; xoff++) {
      var i = this.i + xoff;
      if (i < 0 || i >= cols) continue;

      for (var yoff = -1; yoff <= 1; yoff++) {
        var j = this.j + yoff;
        if (j < 0 || j >= rows) continue;
        if(xoff == 0 && yoff == 0) continue;
        var neighbor = grid[i][j];
        if (!neighbor.known) {

          neighbor.beeActivated = true;
        }
      }
    }
  }
}

Cell.prototype.countBee4 = function(){ // update beeLeft (void)
  var total = 0; // known & bee
  for (var xoff = -1; xoff <= 1; xoff++) {
    var i = this.i + xoff;
    if (i < 0 || i >= cols) continue;

    for (var yoff = -1; yoff <= 1; yoff++) {
      var j = this.j + yoff;
      if (j < 0 || j >= rows) continue;
      if(xoff == 0 && yoff == 0) continue;
      var neighbor = grid[i][j];
      if (neighbor.revealed && neighbor.bee) {
        total++;
      }
    }
  }
  this.beeLeft = this.neighborCount - total;
}

Cell.prototype.countBee5 = function(){ // Special case activation 1-2-1 (void)
  if(this.i<=0 || this.i>=cols-1){
    return;

  }
  if(this.j<=0 || this.j>=rows-1){
    return;
  }
  if(this.beeLeft==2
      && grid[this.i-1][this.j-1].known==false
      && grid[this.i-1][this.j].known==false
      && grid[this.i-1][this.j+1].known==false
      && grid[this.i][this.j-1].beeLeft==1 && grid[this.i][this.j-1].revealed
      && grid[this.i][this.j+1].beeLeft==1 && grid[this.i][this.j+1].revealed
      && grid[this.i+1][this.j-1].known==true
      && grid[this.i+1][this.j].known==true
      && grid[this.i+1][this.j+1].known==true
    ){
      grid[this.i-1][this.j-1].beeActivated = true;
      grid[this.i-1][this.j+1].beeActivated = true;
    }
    if(this.beeLeft==2
        && grid[this.i+1][this.j-1].known==false
        && grid[this.i+1][this.j].known==false
        && grid[this.i+1][this.j+1].known==false
        && grid[this.i][this.j-1].beeLeft==1 && grid[this.i][this.j-1].revealed
        && grid[this.i][this.j+1].beeLeft==1 && grid[this.i][this.j+1].revealed
        && grid[this.i-1][this.j-1].known==true
        && grid[this.i-1][this.j].known==true
        && grid[this.i-1][this.j+1].known==true
      ){
        grid[this.i+1][this.j-1].beeActivated = true;
        grid[this.i+1][this.j+1].beeActivated = true;
      }
      if(this.beeLeft==2
          && grid[this.i-1][this.j-1].known==false
          && grid[this.i][this.j-1].known==false
          && grid[this.i+1][this.j-1].known==false
          && grid[this.i-1][this.j].beeLeft==1 && grid[this.i-1][this.j].revealed
          && grid[this.i+1][this.j].beeLeft==1 && grid[this.i+1][this.j].revealed
          && grid[this.i-1][this.j+1].known==true
          && grid[this.i][this.j+1].known==true
          && grid[this.i+1][this.j+1].known==true
        ){
          grid[this.i-1][this.j-1].beeActivated = true;
          grid[this.i+1][this.j-1].beeActivated = true;
        }
        if(this.beeLeft==2
            && grid[this.i-1][this.j+1].known==false
            && grid[this.i][this.j+1].known==false
            && grid[this.i+1][this.j+1].known==false
            && grid[this.i-1][this.j].beeLeft==1 && grid[this.i-1][this.j].revealed
            && grid[this.i+1][this.j].beeLeft==1 && grid[this.i+1][this.j].revealed
            && grid[this.i-1][this.j-1].known==true
            && grid[this.i][this.j-1].known==true
            && grid[this.i+1][this.j-1].known==true
          ){
            grid[this.i-1][this.j+1].beeActivated = true;
            grid[this.i+1][this.j+1].beeActivated = true;
          }
}

Cell.prototype.countBee6 = function(){ // Special case 1-2-2-1 (void)
  if(this.i<=0 || this.i>=cols-2){
    return;

  }
  if(this.j<=0 || this.j>=rows-2){
    return;
  }
  if(this.beeLeft==2
      && grid[this.i-1][this.j-1].known==false
      && grid[this.i-1][this.j].known==false
      && grid[this.i-1][this.j+1].known==false
      && grid[this.i-1][this.j+2].known==false
      && grid[this.i][this.j-1].beeLeft==1 && grid[this.i][this.j-1].revealed
      && grid[this.i][this.j+1].beeLeft==2 && grid[this.i][this.j+1].revealed
      && grid[this.i][this.j+2].beeLeft==1 && grid[this.i][this.j+2].revealed
      && grid[this.i+1][this.j-1].known==true
      && grid[this.i+1][this.j].known==true
      && grid[this.i+1][this.j+1].known==true
      && grid[this.i+1][this.j+1].known==true
    ){
      grid[this.i-1][this.j].beeActivated = true;
      grid[this.i-1][this.j+1].beeActivated = true;
    }
    if(this.beeLeft==2
        && grid[this.i+1][this.j-1].known==false
        && grid[this.i+1][this.j].known==false
        && grid[this.i+1][this.j+1].known==false
        && grid[this.i+1][this.j+2].known==false
        && grid[this.i][this.j-1].beeLeft==1 && grid[this.i][this.j-1].revealed
        && grid[this.i][this.j+1].beeLeft==2 && grid[this.i][this.j+1].revealed
        && grid[this.i][this.j+2].beeLeft==1 && grid[this.i][this.j+2].revealed
        && grid[this.i-1][this.j-1].known==true
        && grid[this.i-1][this.j].known==true
        && grid[this.i-1][this.j+1].known==true
        && grid[this.i-1][this.j+1].known==true
      ){
        grid[this.i+1][this.j].beeActivated = true;
        grid[this.i+1][this.j+1].beeActivated = true;
      }

      if(this.beeLeft==2
          && grid[this.i-1][this.j-1].known==false
          && grid[this.i][this.j-1].known==false
          && grid[this.i+1][this.j-1].known==false
          && grid[this.i+2][this.j-1].known==false
          && grid[this.i-1][this.j].beeLeft==1 && grid[this.i-1][this.j].revealed
          && grid[this.i+1][this.j].beeLeft==2 && grid[this.i+1][this.j].revealed
          && grid[this.i+2][this.j].beeLeft==1 && grid[this.i+2][this.j].revealed
          && grid[this.i-1][this.j+1].known==true
          && grid[this.i][this.j+1].known==true
          && grid[this.i+1][this.j+1].known==true
          && grid[this.i+2][this.j+1].known==true
        ){
          grid[this.i][this.j-1].beeActivated = true;
          grid[this.i+1][this.j-1].beeActivated = true;
        }
        if(this.beeLeft==2
            && grid[this.i-1][this.j+1].known==false
            && grid[this.i][this.j+1].known==false
            && grid[this.i+1][this.j+1].known==false
            && grid[this.i+2][this.j+1].known==false
            && grid[this.i-1][this.j].beeLeft==1 && grid[this.i-1][this.j].revealed
            && grid[this.i+1][this.j].beeLeft==2 && grid[this.i+1][this.j].revealed
            && grid[this.i+2][this.j].beeLeft==1 && grid[this.i+2][this.j].revealed
            && grid[this.i-1][this.j-1].known==true
            && grid[this.i][this.j-1].known==true
            && grid[this.i+1][this.j-1].known==true
            && grid[this.i+2][this.j-1].known==true
          ){
            grid[this.i][this.j+1].beeActivated = true;
            grid[this.i+1][this.j+1].beeActivated = true;
          }
}

Cell.prototype.contains = function(x, y) { // A position (of the mouse) in contained in the cell
  return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w);
}

Cell.prototype.reveal = function(recur) { // reveal recur=this is called by a recursive call; default=false.
  this.revealed = true;
  if(!this.bee) this.known = true;
  revealData['c'+this.i+'-'+this.j] = true;
  if(recur){
    score++;
  }

  var ref = database.ref('reveal/0');

  if (this.neighborCount == 0) {
    // flood fill time
    this.floodFill();
  }
  if(!recur)
    ref.set(revealData);
}

Cell.prototype.floodFill = function() { // flood fill
  for (var xoff = -1; xoff <= 1; xoff++) {
    var i = this.i + xoff;
    if (i < 0 || i >= cols) continue;

    for (var yoff = -1; yoff <= 1; yoff++) {
      var j = this.j + yoff;
      if (j < 0 || j >= rows) continue;

      var neighbor = grid[i][j];
      // Note the neighbor.bee check was not required.
      // See issue #184
      if (!neighbor.revealed) {
        neighbor.reveal(true);
      }
    }
  }
}
