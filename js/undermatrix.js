(function(_){

// calcurate array
_.productArrays = function(arr1, arr2){
  var sum = 0;
  for(var i=0; i<arr1.length; i++) { sum += arr1[i] * arr2[i];  }
  return sum
}

_.selectPair = function(arr){           // ['a', 'b', 'c']  ==> [['a','b'], ['a','c'], ['b','c']]
  if(arr.length < 3 ){ return [arr] }
  var first = _.first(arr)
  var rest = _.rest(arr)
  var newElem = _.map(rest, function(x){
    return [first].concat(x)
  })
  var rst = newElem.concat( _.selectPair( rest ) )
  return rst
}

// calcurate matrix
_.createMatix = function(xLength, yLength, defaultValue){
  var outterArr = new Array( xLength );
  for (var i=0; i<xLength; i++) {
    var innerArr = new Array(yLength);
    for (var j=0; j<yLength; j++) { innerArr[j] = defaultValue }
    outterArr[i] = innerArr
  }
  return outterArr
}

_.multiplyMatrix = function( matrix1, matrix2 ){
  var zipMatrix2 = _.unzip(matrix2)
  var x = matrix1.length
  var y = zipMatrix2.length
  var rst = _.createMatix(x,y,0)
  for(var i=0;i<x;i++){
    for(var j=0;j<y;j++){
      rst[i][j] = _.productArrays( matrix1[i], zipMatrix2[j] )
    }
  }
  return rst
}

_.sumRow = function(matrix){
  return _.map(matrix, function(innerArr, ix, outterArr){
    return _.reduce(innerArr, function(sum, num){ return sum + num; }, 0);
  })
}

_.sumCol = function(matrix){
  var tMx = _.unzip(matrix)
  return _.sumRow(tMx)
}

_.rate = function(arr){  // 합계가 1이 되게 비율을 낮춤
  var sum = _.reduce(arr, function(sum, num){ return sum + num; }, 0);
  return _.map(arr, function(e,i,arr){ return e / sum})
}

return _

})(window._)  // include underscore.js
