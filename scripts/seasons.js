function displayChamps() {
	for (var name in owners) {
		if (owners.hasOwnProperty(name)) {
			if (owners[name].championships > 0) {
				$('#ChampionsTable').append('<tr><td>' + name + '</td><td>' + owners[name].championships + '</td></tr>');
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