//ESPN URLs, replace the space character with leagueID and the comma with the year
var CURRYEAR="2014";
var STANDINGS="http://games.espn.go.com/ffl/standings?leagueId= &seasonId=,";
var FINAL_STANDINGS="http://games.espn.go.com/ffl/tools/finalstandings?leagueId= &seasonId=,";
var owners = {};
var leagueSeasons = {};

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
	var pfArr = [];
	var paArr = [];
	
	//Clear any data that exists there -- Future, cache results and load those
	arrayToLocal(wArr, "wins");
	arrayToLocal(wArr, "losses");
	arrayToLocal(wArr, "draws");
	arrayToLocal(wArr, "points_for");
	arrayToLocal(wArr, "points_against");
	
	var numYears;
	
	back.html("");
	
	//First load the number of years, then wait and execute the rest
	var standingsURL = STANDINGS.replace(" ", localStorage["leagueID"]);
	standingsURL = standingsURL.replace(",", CURRYEAR);
	
	//Prepare the URL to retrieve all the data from
	var finalStandingsURL = FINAL_STANDINGS.replace(" ", localStorage["leagueID"]);
	finalStandingsURL = finalStandingsURL.replace(",", CURRYEAR);
	
	var yqlStand = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + standingsURL + '"') + " #seasonHistoryMenu";
	
	back.load(yqlStand, function() {
		//Parse the number of years the league has been active
		numYears = $("option").length;		//Counts the years available to select
		localStorage.setItem("numYears", numYears);

		//Initialize the array/queue we will use to store the URLS
		var urlQ = [];
		var count;
		var year;
		
		for (count = 0; count < numYears; count++) {
			//Calculate year to load
			year = CURRYEAR - count;
		
			//Generate URL for the year
			var finalStandingsURL = FINAL_STANDINGS.replace(" ", localStorage["leagueID"]);
			finalStandingsURL = finalStandingsURL.replace(",", year);
			var yqlStand = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + finalStandingsURL + '"') + " #finalRankingsTable";
			
			//Store the year in our queue implementation
			urlQ.push(yqlStand);
		}
		
		loadParseStandings(urlQ);
	});
}

function loadParseStandings(urlQueue) {
	var url = urlQueue.pop();

	//Base case to stop recurse
	if (typeof(url) === 'undefined') {
		//We have gone through every year, now show the results!
		var wlArr = [];
		localStorage.setItem("owners", JSON.stringify(owners));
		localStorage.setItem("leagueSeasons", JSON.stringify(leagueSeasons));
		
		displayStandings(wlArr);
		return;
	}
	
	//Load into the hidden pane
	var id;
	var name;
	var back = $("#back-results");
	
	back.html("");
	back.load(url, function() {
		//Load the point info for the advanced tab
		//Retrieve the arrays from local
		var wArr = localToArray("wins");
		var lArr = localToArray("losses");
		var dArr = localToArray("draws");
		var pfArr = localToArray("points_for");
		var paArr = localToArray("points_against");
		
		$(".sortableRow").each(function(index) {
			//Gives us the teamID of the currently inspected tr. This decides the array location to store at.
			id = urlToID($(this).find("a").attr('href'));
			
			//Also parse out the name of the owner
			name = titleToName($(this).find("a").attr('title'));
			
			var year = urlToYear(url);
			
			//Save the season info in an owner object
			if (typeof(owners[name]) === 'undefined') {
					owners[name] = new Owner(name);
			}
			owners[name].seasons[year] = new OwnerSeason(year);
			
			//Save the season info in a season object as well
			if (typeof(leagueSeasons[year]) === 'undefined') {
					leagueSeasons[year] = new LeagueSeason(year);
			}
			
			//Get the true id by matching name and id
			id = matchIDOwner(id,name);
			
			//If the array value is undefined we have to initialize it. If undefined in one, will be in all
			if (typeof wArr[id] == 'undefined') {
				wArr[id] = 0;
				lArr[id] = 0;
				dArr[id] = 0;
				pfArr[id] = 0;
				paArr[id] = 0;
			}
			
			//Save if champion (first row in table)
			if (index == 0) {
				owners[name].championships = owners[name].championships + 1;
				leagueSeasons[year].champion = name;
			}
			
			var wlString = $(this).find(".sortableREC").text().trim();
			var dashLoc = wlString.indexOf("-");
			
			//Wins
			var yearWins = parseInt(wlString.slice(0, dashLoc), 10);
			wArr[id] = wArr[id] + yearWins;
			owners[name].wins = owners[name].wins + yearWins;
			owners[name].seasons[year].wins = yearWins;
			
			//Losses
			var yearLosses = parseInt(wlString.slice(dashLoc + 1), 10);
			lArr[id] = lArr[id] + yearLosses;
			owners[name].losses = owners[name].losses + yearLosses;
			owners[name].seasons[year].losses = yearLosses;
			
			//Draws
			if (wlString.indexOf("-", dashLoc+1) != -1) {
				dashLoc = wlString.indexOf("-", dashLoc+1);
				var yearDraws = parseInt(wlString.slice(dashLoc + 1), 10);
				dArr[id] = dArr[id] + yearDraws;
				owners[name].draws = owners[name].draws + yearDraws;
				owners[name].seasons[year].draws = yearDraws;
			}
			
			//Points for
			var yearPF = parseFloat($(this).find(".sortablePF").text().trim())
			pfArr[id] = pfArr[id] + yearPF;
			owners[name].pointsFor = owners[name].pointsFor + yearPF;
			owners[name].seasons[year].pointsFor = yearPF;
			leagueSeasons[year].totalPF = leagueSeasons[year].totalPF + yearPF;
			
			//Points against
			var yearPA = parseFloat($(this).find(".sortablePA").text().trim());
			paArr[id] = paArr[id] + yearPA;
			owners[name].pointsAgainst = owners[name].pointsAgainst + yearPA;
			owners[name].seasons[year].pointsAgainst = yearPA;
			
			//Point Differential
			var yearPD = yearPF - yearPA;
			owners[name].pointDiff = owners[name].pointDiff + yearPD;
			owners[name].seasons[year].pointDiff = yearPD;
		});
		
		//Save the arrays - In future, refactor this so we can make all the AJAX calls at once, and then use setTimeout and check if they have all been returned in intervals
		arrayToLocal(wArr, "wins");
		arrayToLocal(lArr, "losses");
		arrayToLocal(dArr, "draws");
		arrayToLocal(pfArr, "points_for");
		arrayToLocal(paArr, "points_against");
		
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