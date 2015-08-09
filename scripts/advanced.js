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

function displayPointsFor() {
	var points = [];
	var ownerName;
	var pfArr = localToArray("points_for");
	var lookupArr = localToArray("lookupArr");
	var i;
	
	for (i = 0; i < pfArr.length; i++) {
		if (pfArr[i] != null && typeof(pfArr[i]) !== 'undefined') {
			ownerName = lookupArr[i];
			
			var nameIndex = isInArr(ownerName, points);
			if (nameIndex == -1) {
				points.push({ key: ownerName, pf: 0});
				nameIndex = points.length - 1;
			}
			points[nameIndex].pf = points[nameIndex].pf + pfArr[i];
		}
	}
	
	//Sort the results
	points.sort(function(a,b) {
		if (a.pf > b.pf) { return -1; }
		if (a.pf < b.pf) { return 1; }
		return 0;
	});
	
	//Generate chart to display.
	var pfChart = new CanvasJS.Chart("pf-section", darkChart);
	pfChart.options.title.text = "Points For";
	
	//Dynamically set the chart dataseries
	pfChart.options.data = [];
	var pfDataPoints = [];
	for (var index=0; index < points.length; index++) {
		pfDataPoints.push({label: points[index].key, y: points[index].pf});
	}
	
	pfChart.options.data = [{
		type: "column",
		dataPoints: pfDataPoints
	}
	]

	//Display the chart
    pfChart.render();
}