//Loop over wins array and use match ID to print each
function displayWins() {
	var wins = [];
	var name;
	var wArr = localToArray("wins");
	var lookupArr = localToArray("lookupArr");
	var i;
	
	for (i = 0; i < wArr.length; i++) {
		if (wArr[i] != null && wArr[i] != 'undefined') {
			ownerName = lookupArr[i];
			
			var nameIndex = isInArr(ownerName, wins);
			if (nameIndex == -1) {
				wins.push({ name: ownerName, val: 0});
				nameIndex = wins.length - 1;
			}
			wins[nameIndex].val = wins[nameIndex].val + wArr[i]; 
		}
	}
	
	//Sort the results
	wins.sort(function(a,b) {
		if (a.val > b.val) { return -1; }
		if (a.val < b.val) { return 1; }
		return 0;
	});
	
	//Generate chart to display
	var winsChart = new CanvasJS.Chart("wins-section", {
		title:{
			text: "Wins"              
		},
		axisY:{
			labelFontSize: 20,
			labelAngle: 60
		},
		axisX:{
			labelFontSize: 20,
			labelAngle: 60
		},
		height: 600
	});
	
	//Dynamically set the chart dataseries
	winsChart.options.data = [];
	var winsDataPoints = [];
	for (var index=0; index < wins.length; index++) {
		winsDataPoints.push({label: wins[index].name, y: wins[index].val});
	}
	
	winsChart.options.data = [{
		type: "column",
		dataPoints: winsDataPoints
	}
	]

	//Display the chart
    winsChart.render();
}

function isInArr(name, arr) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].name == name) {return i;}
	}
	
	return -1;
}