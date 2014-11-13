//Define style options object of chart
var darkChart = {
		backgroundColor: "#282824",
		colorSet: "darkYellow",
		title:{
			fontColor: "#E6E272"			
		},
		axisY:{
			interlacedColor: "#1C1C19",
			labelFontSize: 20,
			labelAngle: 60,
			tickColor: "#4A4A43",
			gridColor: "#4A4A43"
		},
		axisX:{
			labelFontSize: 20,
			labelAngle: 60,
			tickColor: "#4A4A43"
		},
		toolTip: {
			borderColor: "#1C1C19"
		},
		height: 500
};

//wlArr used to hold data for WLs so we can do WL% easily
function displayStandings(wlArr) {
	displayWins(wlArr);
	displayLosses(wlArr);
}

//Loop over wins array and use match ID to print each
function displayWins(wlArr) {
	var wins = [];
	var ownerName;
	var wArr = localToArray("wins");
	var lookupArr = localToArray("lookupArr");
	var i;
	
	for (i = 0; i < wArr.length; i++) {
		if (wArr[i] != null && wArr[i] != 'undefined') {
			ownerName = lookupArr[i];
			
			var nameIndex = isInArr(ownerName, wins);
			if (nameIndex == -1) {
				wins.push({ key: ownerName, val: 0});
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
	
	//Generate chart to display.
	var winsChart = new CanvasJS.Chart("wins-section", darkChart);
	winsChart.options.title.text = "Wins";
	
	//Dynamically set the chart dataseries
	winsChart.options.data = [];
	var winsDataPoints = [];
	for (var index=0; index < wins.length; index++) {
		winsDataPoints.push({label: wins[index].key, y: wins[index].val});
	}
	
	winsChart.options.data = [{
		type: "column",
		dataPoints: winsDataPoints
	}
	]

	//Display the chart
    winsChart.render();
	
	//Set wlArr
	wlArr = wins;
}

function displayLosses(wlArr) {
	var losses = [];
	var ownerName;
	var lArr = localToArray("losses");
	var lookupArr = localToArray("lookupArr");
	var i;
	
	for (i = 0; i < lArr.length; i++) {
		if (lArr[i] != null && lArr[i] != 'undefined') {
			ownerName = lookupArr[i];
			
			var nameIndex = isInArr(ownerName, losses);
			if (nameIndex == -1) {
				losses.push({ key: ownerName, val: 0});
				nameIndex = losses.length - 1;
			}
			losses[nameIndex].val = losses[nameIndex].val + lArr[i]; 
		}
	}
	
	//Sort the results
	losses.sort(function(a,b) {
		if (a.val > b.val) { return -1; }
		if (a.val < b.val) { return 1; }
		return 0;
	});
	
	//Generate chart to display.
	var lossesChart = new CanvasJS.Chart("losses-section", darkChart);
	lossesChart.options.title.text = "Losses";
	
	//Dynamically set the chart dataseries
	lossesChart.options.data = [];
	var lossesDataPoints = [];
	for (var index=0; index < losses.length; index++) {
		lossesDataPoints.push({label: losses[index].key, y: losses[index].val});
	}
	
	lossesChart.options.data = [{
		type: "column",
		dataPoints: lossesDataPoints
	}
	]

	//Display the chart
    lossesChart.render();
	
	//Add to wlArr
	var nameIndex;
	for (var index = 0; i < losses.length; i++) {
		nameIndex = isInArr(losses[index].key, wlArr);
		
		//Matched the person, add them
		if (nameIndex != -1) {
			wlArr[nameIndex].losses = losses[index].val;
		}
	}
}

function isInArr(key, arr) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].key == key) {return i;}
	}
	
	return -1;
}