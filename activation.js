/*
版本: 1.0.0.6
*/
var dict = {}; // dictionary<cell(String), time left(int)> // time left unit: decisecond

function actiList(){ // handle activationList (void)
  for(var i=0; i<cols; i++){
    for(var j=0; j<rows; j++){
      if(grid[i][j].beeActivated && !grid[i][j].revealed){
        if(!activationList.includes(grid[i][j])){
          activationList.push(grid[i][j]);
          dict[grid[i][j].toString()] = 200;
        }

      }
      if(activationList.includes(grid[i][j]) && grid[i][j].revealed){

        removeFirstCell(activationList, grid[i][j]);
      }
    }
  }
  updateActivation();
}

function Activation(cell, timeleft){ // Class.
  this.TimeLeft = timeleft;
  this.Cell = cell;
}

function removeFirstCell(list, toRemove){ // (void)

  var n = list.length;
  var index = 0;
  for(var i=0; i<n; i++){
    if(list[i].i==toRemove.i && list[i].j==toRemove.j){
      index = i;
    }
  }
  for(var i=index; i<n-1; i++){
    list[i] = list[i+1];
  }
  list.pop();
}

function updateActivation(){ // update the activation information on the screen (void)
  var listings = selectAll('.shit');
  var n = listings.length;
  setText(ActivatedMineCount, n + ' mines are activated.');

  var listings = selectAll('.shit');
  for(var i=0; i<listings.length; i++){
    listings[i].remove();
  }

  var dt = activationList;

  if(dt==null){
    return;
  }

  for(var i=0; i<dt.length; i++){

      var li = createElement('li', 'Mine: ' + dict[dt[i].toString()]/10 + ' seconds left');
      li.class('shit');
      li.parent(ol2);


  }
}

function Elapse(){ // update dict (void)
  //var keys = Object.keys(dict);

  for(var i=0; i<activationList.length; i++){
    //var k = keys[i];
    var k = activationList[i];
    dict[k.toString()]--;
    if(dict[k.toString()]<0){
      removeFirstCell(activationList, k);

      k.AActivated = true;

      k.reveal(false);
      alert("地雷自爆，扣20分。One mine exploded. You are taken 20 points off.");
      score -= 20;
    }
  }
}
