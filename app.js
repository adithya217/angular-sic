
function initValues($scope)
{
	$scope.reportReady = false;
	$scope.summaryReady = false;
	
	$scope.principleAmt = 1; // in multiples of rupees
	$scope.interestRate = 1; // in multiples of percent
	$scope.timePeriod = 1; // in multiples of years
}

function buildYearOptions($scope)
{
	$scope.yearOptions = [];
	
	for(var index=0; index<$scope.timePeriod; index++){
		$scope.yearOptions.push({
			name : 'Year ' + index,
			value : index
		});
	}
	
	$scope.selectedYear = $scope.yearOptions[0];
}

function buildQuarterOptions($scope)
{
	$scope.quarterOptions = [];
	
	for(var index=0; index<4; index++){
		$scope.quarterOptions.push({
			name : 'Q' + index,
			value : index
		});
	}
	
	$scope.selectedQuarter = $scope.quarterOptions[0];
}

function computeAmounts($scope)
{
	$scope.amounts = [];
	
	var qiRate = $scope.interestRate * 0.25, // quarterly interest rate
		startingAmount = $scope.principleAmt;
	
	for(var index1=0; index1<$scope.timePeriod; index1++){
		var quarters = [],
			finalAmount = 0;
		
		for(var index2=0; index2<4; index2++){
			var interestAmount = startingAmount * qiRate * 0.01; // to account for percentage
			
			finalAmount = (startingAmount + interestAmount);	
			
			quarters.push({
				startingAmount : startingAmount,
				interestAmount : interestAmount,
				finalAmount : finalAmount
			});
			
			startingAmount = finalAmount;
		}
		
		$scope.amounts.push(quarters);
	}
	
	updateReport($scope);
}

function updateReport($scope)
{
	var index1 = $scope.selectedYear.value,
		index2 = $scope.selectedQuarter.value,
		item = $scope.amounts[index1][index2],
		lastItem = $scope.amounts[$scope.amounts.length-1][3];
	
	$scope.reportStartAmount = item.startingAmount;
	$scope.reportInterestAmount = item.interestAmount;
	$scope.reportFinalAmount = item.finalAmount;
	
	$scope.summaryInitialAmount = $scope.principleAmt;
	$scope.summaryInterestAmount = (lastItem.finalAmount - $scope.principleAmt);
	$scope.summaryFinalAmount = lastItem.finalAmount;
}

function generateReport($scope)
{
	buildYearOptions($scope);
	buildQuarterOptions($scope);
	
	computeAmounts($scope);
	
	$scope.reportReady = true;
	$scope.summaryReady = true;
}


var app = angular.module('myApp', []);

app.controller('reportGenerator', function($scope){
	initValues($scope);
	
	$scope.generateReport = function(){
		generateReport($scope);
	};
	
	$scope.updateReport = function(){
		updateReport($scope);
	};
});