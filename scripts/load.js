//ESPN URLs, replace the space character with leagueID and the comma with the year
var CURRYEAR="2014";
var STANDINGS="http://games.espn.go.com/ffl/standings?leagueId= &seasonId=,";

function load() {
	requestCrossDomain();
	loadWL();
}

function requestCrossDomain() {
	var addr = document.getElementById("inputURL").value;

	//Check if address was entered
	if (!addr) {
		alert('No site passed!');
		return false;
	}
	
	//Set leagueurl in local storage
	localStorage.setItem("leagueURL", addr);
	
	//Set the leagueID in local storage
	var n = addr.indexOf("leagueId=") + 9;
	var amp = addr.indexOf("&",n);
	localStorage.setItem("leagueID", addr.substring(n, amp));
	
	//Add '#games-tabs1' so that only the section with the teams is returned from yql query
	var yqlLeague = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + addr + '"') + " #games-tabs1";
	
	//New way to load and manipulate
	$("#back-results").load(yqlLeague, function() {
		var names = [];
		var temp;
		var charIndex;
		
		//Get the team names
		$("#back-results a").each(function(index) {
			temp = $(this).html();
			
			//Parse out the extra span element
			charIndex = temp.indexOf("<");
			temp = temp.substring(0,charIndex);
			names[index] = temp.trim();
		});
		
		//Store the data into local storage
		arrayToLocal(names, "teamNames");
	});
	
	//Hide the URL entry box
	hideURL(900);
	
	//Enable the pills if successful
	enablePills();
	
	//Enable the results boxes
	showResults();
}

function localToArray(key) {
	return JSON.parse(localStorage[key]);
}

function arrayToLocal(arr, key) {
	localStorage.setItem(key, JSON.stringify(arr));
}

function loadWL() {
	var back = $("#back-results");
	
	//Will need to do the rest for each year of the league history
	var standingsURL = STANDINGS.replace(" ", localStorage["leagueID"]);
	standingsURL = standingsURL.replace(",", CURRYEAR);

	var yqlStand = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + standingsURL + '"') + " #maincontainertblcell";
	
	//Load into the hidden pane
	var wArr = [];
	var lArr = [];
	var dArr = [];
	var id;
	back.html("");
	back.load(yqlStand, function() {
		$(this).html($("#back-results tr .tableBody"));
		
		//HEADS UP: IN THESE ARRAYS, 0 AND 7 WILL BE NULL BECAUSE NO TEAMS HAVE THESE IDS
		
		//Now traverse the back pane and store info
		$("#back-results > .tableBody a").closest("tr").each(function(index) {	//This iterates over the the tr elements that are container for the team standings info
			id = urlToID($(this).find("a").attr('href'));										//Gives us the teamID of the currently inspected tr. This decides the array location to store at.
			wArr[id] = $(':nth-child(2)', this).text().trim();									//This is the number of wins
			lArr[id] = $(':nth-child(3)', this).text().trim();									//This is the number of losses
			dArr[id] = $(':nth-child(4)', this).text().trim();									//This is the number of draws
		});
		
		//Store the info into localStorage
		arrayToLocal(wArr, "wins");
		arrayToLocal(lArr, "losses");
		arrayToLocal(dArr, "draws");
	});
}

//Converts a team url to the team id
function urlToID (url) {
	var i;
	var j;
	var id;
	i = url.indexOf("teamId=");
	j = url.indexOf("&",i);
	id = url.substring(i+7, j);
	return id;
}