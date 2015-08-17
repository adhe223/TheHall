//Define style options object of chart
var darkChart = {
		backgroundColor: "#282824",
		colorSet: "darkYellow",
		title:{
			fontColor: "#E6E272"			
		},
		axisY:{
			interlacedColor: "#1C1C19",
			labelFontSize: 18,
			labelAngle: 60,
			tickColor: "#4A4A43",
			gridColor: "#4A4A43"
		},
		axisX:{
			labelFontSize: 18,
			labelAngle: 70,
			tickColor: "#4A4A43"
		},
		toolTip: {
			borderColor: "#1C1C19",
			backgroundColor: "#282824"
		},
		height: 500
};

function displayData() {	
	//Standings
	displayWins();
	displayLosses();
	displayWLP();
	
	//Seasons
	displayChamps();
	displaySuperlatives();
	
	//Advanced
	var points = [];
	points = displayPoints();
	displayPointDiff(points);
}

//Loop over wins array and gather data to display
function displayWins() {
	var wins = [];
	
	//Use the owner object instead
	for (var name in owners) {
		if (owners.hasOwnProperty(name)) {
			wins.push({key: name, val: owners[name].wins});
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
}

function displayLosses() {
	var losses = [];
	
	for (var name in owners) {
		if (owners.hasOwnProperty(name)) {
			losses.push({key: name, val: owners[name].losses});
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
}

function displayWLP() {
	var winPercent = [];

	//Generate chart to display.
	var wpChart = new CanvasJS.Chart("wl-section", darkChart);
	wpChart.options.title.text = "Win Percentage";
	
	//Dynamically set the chart dataseries
	wpChart.options.data = [];
	var wpDataPoints = [];
	
	//First need to calculate wp
	for (var name in owners) {
		if (owners.hasOwnProperty(name)) {
			var wp = (owners[name].wins / (owners[name].wins + owners[name].losses + owners[name].draws));
			wp = +wp.toFixed(3);
			winPercent.push({key: name, val: wp});
		}
	}
	
	//Sort by wp
	winPercent.sort(function(a,b) {
		if (a.val > b.val) {return -1; }
		if (a.val < b.val) {return 1; }
		return 0;
	});
	
	//Dynamically set the chart dataseries
	wpChart.options.data = [];
	var wpDataPoints = [];
	for (var index=0; index < winPercent.length; index++) {
		wpDataPoints.push({label: winPercent[index].key, y: winPercent[index].val});
	}
	
	wpChart.options.data = [{
		type: "column",
		dataPoints: wpDataPoints
	}
	]

	//Display the chart
    wpChart.render();
}