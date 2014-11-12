//Loop over wins array and use match ID to print each
function displayWins() {
	var wins = [];
	var name;
	var wArr = localToArray("wins");
	var lookupArr = localToArray("lookupArr");
	var i;
	
	for (i = 0; i < wArr.length; i++) {
		if (wArr[i] != null && wArr[i] != 'undefined') {
			name = lookupArr[i];
			
			if (!(name in wins)) {
				wins[name] = 0;
			}
			wins[name] = wins[name] + wArr[i]; 
		}
	}
	
	//Sort the results
	wins.sort(function(a,b) {
		if (wins[a] < wins[b]) { return -1; }
		if (wins[a] < wins[b]) { return 1; }
		return 0;
	});
	
	//Generate chart to display
	var winsChart = new CanvasJS.Chart("wins-section", {
		title:{
			text: "Wins"              
		},
		axisY:{
			labelFontSize: 20,
			labelAngle: 50
		},
		axisX:{
			labelFontSize: 20,
			labelAngle: 50
		},
		height: 600
	});
	
	//Dynamically set the chart dataseries
	winsChart.options.data = [];
	var winsDataPoints = [];
	for (var index in wins) {
		winsDataPoints.push({label: index, y: wins[index]});
		//winString = winString + "<p>" + index + " wins: " + wins[index] + "<br>";
	}
	
	winsChart.options.data = [{
		type: "column",
		dataPoints: winsDataPoints
	}
	]

	//Set the html
	//$("#standings-box").append(winString);

	//Display the chart
    winsChart.render();
}