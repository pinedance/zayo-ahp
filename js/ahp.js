angular.module('underscore', [])
.factory('_', ['$window', function($window) {
  return $window._; // assumes underscore has already been loaded on the page
}])

var app = angular.module('ahp', ['underscore', 'ui.bootstrap', 'googlechart']);

app.config(['$compileProvider', function ($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}]);

app.controller('ahpCtrl', ["$scope", "_", "$uibModal", "$log", "$location", "$anchorScroll", function($scope, _, $uibModal, $log, $location, $anchorScroll) {

  var myCris, myAlts //myCriterias, myAlternatives
  var pairsCris, pairsAlts // pairs
  var createJugementSpace = function(x){
    return {'pair': x, 'moreImpFact': "", 'lessImpFact': "", 'intensity': 0, 'rationale': "", 'judgementMessage': "  ", 'decided': false}
  }  // more inportant factor
  var randomConsistencyIndex = [0,0,0,0.58,0.9,1.12,1.24,1.32,1.41,1.45,1.49,1.51,1.48,1.56,1.57,1.59]
  $scope.intensitys = [1,3,5,7,9]
  $scope.myGoal = "점심에 뭘 먹을까?"        //"Choose the best car for the family"
  $scope.myCris = "맛,값,거리"              //"Cost, Safety, Style" // "Cost, Safety, Style, Capacity"
  $scope.myAlts = "짜장면,국밥,돈까스"  //"Accord Sedan, Pilot SUV, CR-V SUV, Odyssey Minivan" // "Accord Sedan, Accord Hybrid Sedan, Pilot SUV, CR-V SUV, Element SUV, Odyssey Minivan"

  $scope.creatWorkSheet = function(){
    console.log( $scope.myGoal )
    myCris = _.uniq( _.compact( $scope.myCris.split(/\s*,\s*/) ) )
    myAlts = _.uniq( _.compact( $scope.myAlts.split(/\s*,\s*/) ) )

    // criterias
    pairsCris = _.selectPair( myCris )  // create pairs for Pairwise comparing, Array
    $scope.jgmCris = _.map(pairsCris, createJugementSpace ) // create judgement space, Array

    // alternatives
    pairsAlts = _.selectPair( myAlts )  // create pairs for Pairwise comparing
    $scope.jgmAlts = _.map(myCris, function(c){
      return {'cri': c, 'alts': _.map(pairsAlts, createJugementSpace ) }
    })

    $scope.cris = myCris
    $scope.showCriWorkSheet = true
    $scope.currentPage = 1
  }

  $scope.judgeFactor = function( factor, myMoreImpFact, myLessImpFact ){
    factor.moreImpFact = myMoreImpFact
    factor.lessImpFact = myLessImpFact
    createJudgementMessage( factor )
    factor.decided = (factor.intensity)? true : false
  } //( cri, cri.pair[1] )

  $scope.judgeIntens = function( factor, myIntensity ){
    factor.intensity = myIntensity
    createJudgementMessage( factor )
    factor.decided = (factor.moreImpFact)? true : false
  }

  function createJudgementMessage( cri ){
    if( cri.moreImpFact === "" || cri.intensity === 0 ){ return }
    cri.judgementMessage = "'" + cri.moreImpFact + "' is more important criterias than '" + cri.lessImpFact + "' " + cri.intensity + " times"
  }

  $scope.setCurrentPage = function(direction) {
    if(direction==="prev"){
      $scope.currentPage = ($scope.currentPage > 1)? $scope.currentPage - 1 : myCris.length
    } else if(direction==="next"){
      $scope.currentPage = ($scope.currentPage < myCris.length)? $scope.currentPage + 1 : 1
    } else {
      $scope.currentPage = direction
    }
  }

  function getJudgementMx(factor, judgementData){
    var tmpMx = _.createMatix(factor.length, factor.length, 1)

    _.each(judgementData, function(e, i, arr) {
      var outterIx = factor.indexOf( e.pair[0] )
      var innerIx = factor.indexOf( e.pair[1] )
      if( e.pair.indexOf( e.moreImpFact ) === 0){
	    tmpMx[outterIx][innerIx] = e.intensity
        tmpMx[innerIx][outterIx] = 1 / e.intensity
      } else {
		tmpMx[outterIx][innerIx] = 1 / e.intensity
		tmpMx[innerIx][outterIx] = e.intensity
      }
    })
    return tmpMx
  }

  function calculatePV(factor, judgementData){ // priority vector
    var tmpMx = getJudgementMx(factor, judgementData)
    var productedMx = _.multiplyMatrix(tmpMx, tmpMx)
    var rst = _.rate( _.sumRow(productedMx) )
    return _.zip(factor, rst)
  }

  function calculateLambdaMax(factor, judgementData){
    var tmpMx = getJudgementMx(factor, judgementData)
	console.log( tmpMx )
	var colsumArr = _.sumCol( tmpMx )
	console.log( colsumArr )
	var inverseColSumArr = _.map( colsumArr, function(e){ return 1/e } )

	var normMx = _.map(tmpMx, function(eArr){
		return _.eachCalculate(eArr, inverseColSumArr, function(a,b){return a * b} )
	})
    var priorityVector = _.rate( _.sumRow( normMx ) )
	console.log(priorityVector)
    return _.productArrays(colsumArr, priorityVector)
  } // http://people.revoledu.com/kardi/tutorial/AHP/Priority%20Vector.htm

  function calculateIdn(factor, judgementData){  // Consistency Index
    var n = factor.length
    var lambdaMax = calculateLambdaMax(factor, judgementData)
    var ci = ( lambdaMax - n ) / (n - 1)
    var cr = (n > 2)? ( ci / randomConsistencyIndex[n] ) * 100 : 0
	console.log ({ "lambdaMax": lambdaMax, "ci": ci, "cr": cr } )
    return { "lambdaMax": lambdaMax, "ci": ci, "cr": cr }
} // http://people.revoledu.com/kardi/tutorial/AHP/Consistency.htm

  function allDecided( arr ){
    var decided = _.map( arr, function(e){ return ( (e.decided)? 1 : 0 ) } )
    var multiply = _.reduce(decided, function(memo, num){ return memo * num; }, 1)
    return ( (multiply===0)? false : true )
  }

  $scope.reportCris = function(){

      if( !allDecided($scope.jgmCris) ){
        alert (" 선택하지 않은 문항이 있습니다. ");
        return
      }

      var globalCris = calculatePV(myCris, $scope.jgmCris)
      var globalCrisIdx = calculateIdn(myCris, $scope.jgmCris)

      // report message
      var tmpmsg = ( globalCrisIdx.cr <= 10)? "신뢰할 수 있는 결과입니다." : "신뢰할 수 없는 결과입니다."
      tmpmsg = tmpmsg + " (CR: " + globalCrisIdx.cr.toFixed(2) + " %)"
      $scope.crisMsg = globalCrisIdx.message = createMsg(globalCrisIdx.cr)

      // report pie chart
      // var pieData = _.zip(myCris, globalCris.map(function(e,i,arr){return (e * 100).toFixed(2) } ) )
      var tmpCrisPieChart = createPieChart(['Component', '중요도'], globalCris, "기준의 중요도 가중치");
      tmpCrisPieChart.options.pieHole = 0.3
      $scope.crisPieChart = tmpCrisPieChart

      $scope.globalCris = globalCris
      $scope.globalCrisIdx = globalCrisIdx
      $scope.showAlts = true

      setTimeout(function(){
        $location.hash("crisPieChart");
        $anchorScroll();
      }, 300);
    }

  $scope.reportAlts = function(){
      // alternatives
      var localAlts = []
      for(var i=0;i<$scope.jgmAlts.length;i++){

        if( !allDecided( $scope.jgmAlts[i].alts ) ){
          alert (" 선택하지 않은 문항이 있습니다. ");
          return
        }

        localAlts[i] = {
          pv: calculatePV(myAlts, $scope.jgmAlts[i].alts),
          idx: calculateIdn(myAlts, $scope.jgmAlts[i].alts)
        }
        localAlts[i].cri = $scope.jgmAlts[i].cri
        localAlts[i].msg = createMsg( localAlts[i].idx.cr )
        var title = $scope.jgmAlts[i].cri + "가 기준일 때 선택은?"
        localAlts[i].pieChart = createPieChart(['Component', '중요도'], localAlts[i].pv, title)

      }
      // console.log (localAlts)

      var tmplocalAlts = _.map( localAlts, function(e){ return _.unzip( e.pv)[1] })
      var tmpglobalAlts = _.unzip(tmplocalAlts )
      var tmpglobalCris = _.unzip($scope.globalCris)[1]
      var globalAlts = _.map( tmpglobalAlts, function(e){
          return _.productArrays( tmpglobalCris, e)
      })
      var globalAlts = _.zip(myAlts, globalAlts)
      $scope.showRst = true
      $scope.localAlts = localAlts
      var tmpGlobalAltsPieChart = createPieChart(['Component', '중요도'], globalAlts, "당신의 최종 속마음은?" )
      tmpGlobalAltsPieChart.options.is3D = true
      $scope.globalAltsPieChart = tmpGlobalAltsPieChart

      setTimeout(function(){
        $location.hash("finalRst");
        $anchorScroll();
      }, 300);

  }

  function createMsg(cr){
    var tmpmsg = ( cr <= 10)? "신뢰할 수 있는 결과입니다." : "신뢰할 수 없는 결과입니다."
    tmpmsg += " (CR: " + cr.toFixed(2) + " %)"
    return tmpmsg
  }

  function createPieChart(label, data, title1){ // http://plnkr.co/edit/E4iPtQ?p=preview
      var chart1 = {};
      chart1.type = "PieChart";
      chart1.data = [label].concat(data);

      chart1.options = {
          // title: title1,
          displayExactValues: true,
          height: 300,
          position: 'relative',
          is3D: false,
          // chartArea: {left:10,top:10,width:"100%", height: 600},
          chartArea: {left:'25%',top:0,width:'100%',height:'100%'}
      };

      chart1.formatters = {
        number : [{
          columnNum: 1,
          pattern: "#,##0.00 %"
        }]
      };
      return chart1;
  }

////// modal
    $scope.modalExplainIntensity = function (size) {

      var modalInstance = $uibModal.open({
        animation: false,
        templateUrl: 'parts/modalExplainIntensity.html',
        controller: 'modalExplainIntensity',
        size: size,
        resolve: {
          modalData: function () {
            return $scope.modalData;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.modalSelected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

//////

}]);

app.controller('modalExplainIntensity', ["$scope", "$uibModalInstance", "modalData", function($scope, $uibModalInstance, modalData) {

  $scope.ok = function () {
    $uibModalInstance.close();
  };

  // $scope.cancel = function () {
  //   $uibModalInstance.dismiss('cancel');
  // };

}]);
