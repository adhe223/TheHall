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
	var yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + addr + '"') + " #games-tabs1";
	
	//New way to load and manipulate
	$("#back-results").load(yql, function() {
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
	var standingsURL = STANDINGS.replace(" ", localStorage["leagueID"]);
	standingsURL = standingsURL.replace(",", CURRYEAR);

	var yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + standingsURL + '"') + " #maincontainertblcell";
	
	//Load into the hidden pane
	back.empty();
	back.load(yql, function() {
		$(this).html($("#back-results tr .tableBody"));
		alert("parsed!");
	});
	
	//Now traverse the back pane and load in the info
	
	
}