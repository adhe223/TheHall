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
	
	//Generate data arrays and store in localStorage
	var wArr = [];
	var lArr = [];
	var dArr = [];
	arrayToLocal(wArr, "wins");
	arrayToLocal(wArr, "losses");
	arrayToLocal(wArr, "draws");
	
	var numYears;
	
	back.html("");
	
	//First load the number of years, then wait and execute the rest
	var standingsURL = STANDINGS.replace(" ", localStorage["leagueID"]);
	standingsURL = standingsURL.replace(",", CURRYEAR);

	var yqlStand = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + standingsURL + '"') + " #maincontainertblcell";
	var request = back.load(yqlStand);
	
	back.load(yqlStand, function() {
		//Parse the number of years the league has been active
		numYears = $("select > option").length;		//Counts the years available to select

		//Initialize the array/queue we will use to store the URLS
		var urlQ = [];
		var count;
		var year;
		
		for (count = 0; count < numYears; count++) {
			//Calculate year to load
			year = CURRYEAR - count;
		
			//Generate URL for the year
			var standingsURL = STANDINGS.replace(" ", localStorage["leagueID"]);
			standingsURL = standingsURL.replace(",", year);
			var yqlStand = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + standingsURL + '"') + " #maincontainertblcell";
			
			//Store the year in our queue implementation
			urlQ.push(yqlStand);
		}
		
		loadParseStandings(urlQ);
	});
}

function loadParseStandings(urlQueue) {
	var url = urlQueue.pop();

	//Base case to stop recurse
	if (url === 'undefined') {
		return;
	}
	
	//Load into the hidden pane
	var id;
	var name;
	var back = $("#back-results");
	
	back.html("");
	back.load(url, function() {			
		//Narrow to only the elements we need
		$(this).html($("#back-results tr .tableBody"));
		
		$("#back-results > .tableBody a").closest("tr").each(function(index) {	//This iterates over the the tr elements that are container for the team standings info
			id = urlToID($(this).find("a").attr('href'));										//Gives us the teamID of the currently inspected tr. This decides the array location to store at.
			
			//Also parse out the name of the owner
			name = titleToName($(this).find("a").attr('title'));
			
			//Get the true id by matching name and id
			id = matchIDOwner(id,name);
			
			//Retrieve the data arrays
			var wArr = localToArray("wins");
			var lArr = localToArray("losses");
			var dArr = localToArray("draws");
			
			//If the array value is undefined we have to initialize it. If undefined in one, will be in all
			if (typeof wArr[id] == 'undefined') {
				wArr[id] = 0;
				lArr[id] = 0;
				dArr[id] = 0;
			}
			
			wArr[id] = wArr[id] + parseInt($(':nth-child(2)', this).text().trim(),10);									//This is the number of wins
			lArr[id] = lArr[id] + parseInt($(':nth-child(3)', this).text().trim(), 10);									//This is the number of losses
			dArr[id] = dArr[id] + parseInt($(':nth-child(4)', this).text().trim(), 10);									//This is the number of draws
			
			//Save the arrays
			arrayToLocal(wArr, "wins");
			arrayToLocal(lArr, "losses");
			arrayToLocal(dArr, "draws");
			
			//If last year and last iter, then display results
			if (urlToYear(url) == CURRYEAR && index == $("#back-results > .tableBody a").closest("tr").length - 1) {
				displayWins();
			}
		});
		
		//Recursively call on the next element
		loadParseStandings(urlQueue);
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

function titleToName (title) {
	var name;
	var i;
	var j;
	i = title.indexOf("(");
	j = title.indexOf(")");
	name = title.substring(i+1, j);
	return name;
}

//Converts a team url to the season year
function urlToYear (url) {
	var i;
	var year;
	i = url.indexOf("seasonId%3D");
	year = url.substr(i+11, 4);
	return year;
}

function matchIDOwner (id, name) {
	var lookupArr;

	//If the ID lookup exists, load it
	if (localStorage.getItem("lookupArr") !== null) {
		lookupArr = localToArray("lookupArr");
	} else {
		lookupArr = [];
	}
	
	//If this differs what is currently in the array, assign a new ID for that player
	if (typeof lookupArr[id] != 'undefined' && lookupArr[id] != null) {
		if (lookupArr[id] !== name) {
			//Need to assign a new ID to this person and save the mapping
			id = lookupArr.length;
			lookupArr[id] = name;
		}
	} else {
		//Place the person into the lookup array
		lookupArr[id] = name;
	}
	
	//Save the lookupArr back
	arrayToLocal(lookupArr, "lookupArr");
	
	return id;
}