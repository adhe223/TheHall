function displayPoints() {
	var points = [];
	
	for (var name in owners) {
		if (owners.hasOwnProperty(name)) {
			points.push({ key: name, pf: owners[name].pointsFor, pa: owners[name].pointsAgainst, pd: owners[name].pointDiff, pdp: (owners[name].pointDiff / owners[name].seasons.length)});
		}
	}
	
	//Sort the results
	points.sort(function(a,b) {
		if (a.pf > b.pf) { return -1; }
		if (a.pf < b.pf) { return 1; }
		return 0;
	});
	
	//Generate points for chart to display.
	var pfChart = new CanvasJS.Chart("pf-section", darkChart);
	pfChart.options.title.text = "Total Points For";
	
	//Dynamically set the chart dataseries
	pfChart.options.data = [];
	var pfDataPoints = [];
	var paDataPoints = [];
	for (var index=0; index < points.length; index++) {
		pfDataPoints.push({label: points[index].key, y: points[index].pf});
	}
	
	pfChart.options.data = [{
		type: "column",
		dataPoints: pfDataPoints
	}
	]

	//Display the pf chart
    pfChart.render();
	
	//Now create the pa chart
	//Sort the results
	points.sort(function(a,b) {
		if (a.pa > b.pa) { return -1; }
		if (a.pa < b.pa) { return 1; }
		return 0;
	});
	
	//Generate points for chart to display.
	var paChart = new CanvasJS.Chart("pa-section", darkChart);
	paChart.options.title.text = "Total Points Against";
	
	//Dynamically set the chart dataseries
	paChart.options.data = [];
	var paDataPoints = [];
	for (var index=0; index < points.length; index++) {
		paDataPoints.push({label: points[index].key, y: points[index].pa});
	}
	
	paChart.options.data = [{
		type: "column",
		dataPoints: paDataPoints
	}
	]

	//Display the pa chart
    paChart.render();
	
	return points;
}

function displayPointDiff(points) {
	//Sort the results
	points.sort(function(a,b) {
		if (a.pd > b.pd) { return -1; }
		if (a.pd < b.pd) { return 1; }
		return 0;
	});
	
	//Generate points for chart to display.
	var pdChart = new CanvasJS.Chart("pd-section", darkChart);
	pdChart.options.title.text = "Total Point Differential";
	
	//Dynamically set the chart dataseries
	pdChart.options.data = [];
	var pdDataPoints = [];
	for (var index=0; index < points.length; index++) {
		pdDataPoints.push({label: points[index].key, y: points[index].pd});
	}
	
	pdChart.options.data = [{
		type: "column",
		dataPoints: pdDataPoints
	}
	]

	//Display the pa chart
    pdChart.render();
}