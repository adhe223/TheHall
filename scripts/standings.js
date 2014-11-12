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
	
	//Generate string to display
	var winString;
	
	for (var index in wins) {
		winString = winString + "<p>" + index + " wins: " + wins[index] + "<br>";
	}

	//Set the html
	$("#standings-box").append(winString);
}