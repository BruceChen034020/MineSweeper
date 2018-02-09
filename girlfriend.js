/*
Your girlfriend does all of the works for you
女朋友就是工具人(O)
版本: 1.0.0.0
*/
function writeText(object, string){
    object.innerHTML += string;
    object.value = object.innerHTML;
}
function clearText(object){
    object.innerHTML = "";
    object.value = "";
}
function setText(object, string){
    clearText(object);
    writeText(object, string);
}
function isIn(object, list){
    for(var i=0; i<list.length; i++){
        if(object == list[i]){
            return true;
        }
    }
    return false;
}

function girlfriend(){
    this.word_tokenize = function(str){
        var res = str.split(" ");
        punctuation = [',', '.', '?', '!'];
        for(var i=0; i<res.length; i++){
            if(isIn(res[i].slice(-1), punctuation) && res[i].length > 1){
                res.push(res[i].slice(-1));
                res[i] = res[i].slice(0, -1);
            }
        }
        for(var i=0; i<res.length; i++){
            if(res[i].includes("n't") && res[i] !== "n't"){
                res[i] = res[i].slice(0, -3);
                res.push("n't");
            }
            if(res[i].includes("'") && res[i] !== "n't" && res[i][0] !== "'"){
                res2 = res[i].split("'");
                res2[1] = "'" + res2[1];
                res[i] = res2[0];
                res.push(res2[1]);
            }
            if(res[i].includes(",") && res[i].length > 1){
                res2 = res[i].split(',');
                res[i] = res2[0];
                res.push(res2[1]);
            }
        }
        for(var i=0; i<res.length; i++){
            if(res[i].includes("[") && res[i].length > 1){
                res.push("[");
                res[i] = res[i].slice(1);
            }
            if(res[i].includes("]") && res[i].length > 1){
                res.push("]");
                res[i] = res[i].slice(0, -1);
            }
        }
        return res;
    }

    this.zeros = function(n){
        list = [];
        for(var i=0; i<n; i++){
            list[i] = 0;
        }
        return list;
    }

    this.index = function(list, element){
        for(var i=0; i<list.length; i++){
            if(list[i] == element){
                return i;
            }
        }
        alert("Error:\r\nNot found.\r\ngf.index");
    }
    this.matmul = function(a, b) {
        var aNumRows = a.length, aNumCols = a[0].length,
            bNumRows = b.length, bNumCols = b[0].length,
            m = new Array(aNumRows);  // initialize array of rows
        for (var r = 0; r < aNumRows; ++r) {
          m[r] = new Array(bNumCols); // initialize the current row
          for (var c = 0; c < bNumCols; ++c) {
            m[r][c] = 0;             // initialize the current cell
            for (var i = 0; i < aNumCols; ++i) {
              m[r][c] += a[r][i] * b[i][c];
            }
          }
        }
        return m;
    }
    this.add = function( mA, mB ) {

        var result = [];

        result = new Array( mA.length );
        for ( var i = 0; i < result.length; i++ ) {

            result[ i ] = new Array( mA[ i ].length );
            for ( var j = 0; j < result[ i ].length; j++ ) {

                result[ i ][ j ] = mA[ i ][ j ] + mB[ i ][ j ];
            }
        }

        return result;
    }

    this.relu = function(list){
        var result = [];
        result = new Array(list.length);
        for(var i=0; i<result.length; i++){
            result[i] = new Array(list[i].length);
            for(var j=0; j<result[i].length; j++){
                result[i][j] = Math.max(0, list[i][j]);
            }
        }
        return result;
    }

    this.argmax = function(list){
        var max = -10000000;
        var max_index = 0;
        for(i=0; i<list.length; i++){
            if(list[i]>max){
                max = list[i];
                max_index = i;
            }
        }
        return max_index;
    }

    this.isEmpty = function(string_array){
        var sum = 0;
        for(var i=0; i<string_array.length; i++){
            sum += string_array[i].length;
        }

        if(sum === 0){
            return true;
        }else{
            return false;
        }
    }
    this.lemmatize_error_fix = function(tokenized, lemmatized){
        /*fail_list = ['I', 'am', 'are', 'is', 'were', 'was', 'seen', 'watching', 'bearable', 'learning', 'learning', 'stole'];
        for(var i=0; i<fail_list.length; i++){
            if(isIn(fail_list[i], tokenized)){
                lemmatized.push(fail_list[i].toLowerCase());
            }
        }*/
        for(var i=0; i<tokenized.length; i++){
            if(!isIn(tokenized[i].toLowerCase(), lemmatized))
                lemmatized.push(tokenized[i].toLowerCase());
        }
    }
    this.removeFirst = function(list, toRemove){
        for(var i=0; i<list.length; i++){
            if(list[i] === toRemove){
                list[i] = list.slice(-1);
                list = list.slice(0, -1);
            }
        }
    }
}
