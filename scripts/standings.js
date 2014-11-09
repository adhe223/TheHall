function displayStandings(id) {
	var wArr = localToArray("wins");

	//Generate string to display
	var htmlString;
	htmlString = "<p> Team " + id + " Wins: " + wArr[id] + "<br>";

	//Set the html
	$("#standings-box").append(htmlString);
}