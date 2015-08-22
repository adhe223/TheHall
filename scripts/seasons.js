function displayChamps() {
	for (var name in owners) {
	    if (owners.hasOwnProperty(name)) {
	        if (owners[name].championships > 0 || owners[name].runnerups > 0) {
	            $('#ChampionsTable').append('<tr><td>' + name + '</td><td>' + owners[name].championships + '</td><td>' + owners[name].runnerups + '</td></tr>');
	        }
		}
	}
}

function displaySuperlatives() {
	var mostFor;
	var mostAgainst;
	var mostDiff;
	var leastFor;
	var leastAgainst;
	var leastDiff;

	//First do the calculations
	mostFor = calcRecord("mostPointsFor", true);
	mostAgainst = calcRecord("mostPointsAgainst", true);
	mostDiff = calcRecord("mostPointDiff", true);
	leastFor = calcRecord("leastPointsFor", false);
	leastAgainst = calcRecord("leastPointsAgainst", false);
	leastDiff = calcRecord("leastPointDiff", false);
	
	//Display the results in a table
	$('#SuperlativesTable').append('<tr><td>Most Points For</td><td>' + mostFor.year + '</td><td>' + mostFor.ownerName + ' - ' + mostFor.teamName + '</td><td>' + mostFor.val + '</td></tr>');
	$('#SuperlativesTable').append('<tr><td>Most Points Against</td><td>' + mostAgainst.year + '</td><td>' + mostAgainst.ownerName + ' - ' + mostAgainst.teamName + '</td><td>' + mostAgainst.val + '</td></tr>');
	$('#SuperlativesTable').append('<tr><td>Best Point Differential</td><td>' + mostDiff.year + '</td><td>' + mostDiff.ownerName + ' - ' + mostDiff.teamName + '</td><td>' + mostDiff.val + '</td></tr>');
	$('#SuperlativesTable').append('<tr><td>Least Points For</td><td>' + leastFor.year + '</td><td>' + leastFor.ownerName + ' - ' + leastFor.teamName + '</td><td>' + leastFor.val + '</td></tr>');
	$('#SuperlativesTable').append('<tr><td>Least Points Against</td><td>' + leastAgainst.year + '</td><td>' + leastAgainst.ownerName + ' - ' + leastAgainst.teamName + '</td><td>' + leastAgainst.val + '</td></tr>');
	$('#SuperlativesTable').append('<tr><td>Worst Point Differential</td><td>' + leastDiff.year + '</td><td>' + leastDiff.ownerName + ' - ' + leastDiff.teamName + '</td><td>' + leastDiff.val + '</td></tr>');
}

function displayMostWinsGraph() {
    var mostWins = [];

    for (var name in owners) {
        if (owners.hasOwnProperty(name)) {
            mostWins.push({ label: name, y: owners[name].mostWinsInSeason[0].val});
        }
    }

    //Sort the results
    mostWins.sort(function (a, b) {
        if (a.y > b.y) { return -1; }
        if (a.y < b.y) { return 1; }
        return 0;
    });

    //Generate chart to display.
    var mostWinsChart = new CanvasJS.Chart("mostWins-section", darkChart);
    mostWinsChart.options.title.text = "Most Wins In A Season For Owner";

    mostWinsChart.options.data = [{
        type: "column",
        dataPoints: mostWins
    }
    ]

    //Display the chart
    mostWinsChart.render();
}

function displayMostLossesGraph() {
    var mostLosses = [];

    for (var name in owners) {
        if (owners.hasOwnProperty(name)) {
            mostLosses.push({ label: name, y: owners[name].mostLossesInSeason[0].val });
        }
    }

    //Sort the results
    mostLosses.sort(function (a, b) {
        if (a.y > b.y) { return -1; }
        if (a.y < b.y) { return 1; }
        return 0;
    });

    //Generate chart to display.
    var mostLossesChart = new CanvasJS.Chart("mostLosses-section", darkChart);
    mostLossesChart.options.title.text = "Most Losses In A Season For Owner";

    mostLossesChart.options.data = [{
        type: "column",
        dataPoints: mostLosses
    }
    ]

    //Display the chart
    mostLossesChart.render();
}

function displayMostPFGraph() {
    var mostPF = [];

    for (var name in owners) {
        if (owners.hasOwnProperty(name)) {
            mostPF.push({ label: name, y: owners[name].mostPFInSeason[0].val });
        }
    }

    //Sort the results
    mostPF.sort(function (a, b) {
        if (a.y > b.y) { return -1; }
        if (a.y < b.y) { return 1; }
        return 0;
    });

    //Generate chart to display.
    var mostPFChart = new CanvasJS.Chart("mostPF-section", darkChart);
    mostPFChart.options.title.text = "Most Points Scored In A Season For Owner";

    mostPFChart.options.data = [{
        type: "column",
        dataPoints: mostPF
    }
    ]

    //Display the chart
    mostPFChart.render();
}

function displaySeasonPFGraph() {
    var seasonPF = [];

    for (var season in leagueSeasons) {
        if (leagueSeasons.hasOwnProperty(season)) {
            seasonPF.push({ label: season, y: (leagueSeasons[season].totalPF / leagueSeasons[season].numberTeams) });
        }
    }

    //Sort the results
    seasonPF.sort(function (a, b) {
        if (a.y > b.y) { return -1; }
        if (a.y < b.y) { return 1; }
        return 0;
    });

    //Generate chart to display.
    var seasonPFChart = new CanvasJS.Chart("seasonPF-section", darkChart);
    seasonPFChart.options.title.text = "Average Points Per Team by Season";

    seasonPFChart.options.data = [{
        type: "column",
        dataPoints: seasonPF
    }
    ]

    //Display the chart
    seasonPFChart.render();
}

//Return a record object to the corresponding field
function calcRecord(field, max) {
	var temp;

	for (var season in leagueSeasons) {
		if (leagueSeasons.hasOwnProperty(season)) {
			if (typeof(temp) === 'undefined') {
				temp = leagueSeasons[season][field];
			}
		
			if (max) {
				if (leagueSeasons[season][field].val > temp.val) {
					temp = leagueSeasons[season][field];
				}
			} else {
				if (leagueSeasons[season][field].val < temp.val) {
					temp = leagueSeasons[season][field];
				}
			}
		}
	}
	
	return temp;
}