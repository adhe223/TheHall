//ESPN URLs, replace the space character with leagueID and the comma with the year
var CURRYEAR="2014";
var STANDINGS="http://games.espn.go.com/ffl/standings?leagueId= &seasonId=,";
var FINAL_STANDINGS="http://games.espn.go.com/ffl/tools/finalstandings?leagueId= &seasonId=,";
var owners = {};
var leagueSeasons = {};
var leagueURL = "";
var leagueID = "";

function load() {
	var addr = document.getElementById("inputURL").value;

	//Check if address was entered
	if (!addr) {
		alert('No site passed!');
		return false;
	}
	
	leagueURL = addr;
	
	//Set the leagueID in local storage
	var n = addr.indexOf("leagueId=") + 9;
	var amp = addr.indexOf("&",n);
	leagueID = addr.substring(n, amp);

	localStorage.setItem("leagueURL", leagueURL);
	localStorage.setItem("leagueID", leagueID);
	
	requestCrossDomain();
	loadWL();
}

function requestCrossDomain() {		
	//Add '#games-tabs1' so that only the section with the teams is returned from yql query
	var yqlLeague = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + leagueURL + '"') + " #games-tabs1";
	
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
	var numYears;
	
	back.html("");
	
	//First load the number of years, then wait and execute the rest
	var standingsURL = STANDINGS.replace(" ", leagueID);
	standingsURL = standingsURL.replace(",", CURRYEAR);
	
	//Prepare the URL to retrieve all the data from
	var finalStandingsURL = FINAL_STANDINGS.replace(" ", leagueID);
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
			var finalStandingsURL = FINAL_STANDINGS.replace(" ", leagueID);
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
		//We have gone through every year, now save and show the results!
		localStorage.setItem("owners", JSON.stringify(owners));
		localStorage.setItem("leagueSeasons", JSON.stringify(leagueSeasons));
		
		displayData();
		return;
	}
	
	//Load into the hidden pane
	var id;
	var name;
	var teamName;
	var back = $("#back-results");
	
	back.html("");
	back.load(url, function() {
		
		$(".sortableRow").each(function(index) {
			//Also parse out the name of the owner
			var title = $(this).find("a").attr('title');
			name = titleToName(title);
			teamName = titleToTeamName(title);
			
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
			
			//Save if champion (first row in table)
			if (index == 0) {
				owners[name].championships = owners[name].championships + 1;
				leagueSeasons[year].champion = name;
			}

		    //Save if runnerup (second row in table)
			if (index == 1) {
			    owners[name].runnerups = owners[name].runnerups + 1;
			    leagueSeasons[year].runnerup = name;
			}
			
			var wlString = $(this).find(".sortableREC").text().trim();
			var dashLoc = wlString.indexOf("-");
			
			//Wins
			var yearWins = parseInt(wlString.slice(0, dashLoc), 10);
			owners[name].wins = owners[name].wins + yearWins;
			owners[name].seasons[year].wins = yearWins;
			trackOwnerRecord(true, "mostWinsInSeason", yearWins, year, name, teamName);
			
			//Losses
			var yearLosses = parseInt(wlString.slice(dashLoc + 1), 10);
			owners[name].losses = owners[name].losses + yearLosses;
			owners[name].seasons[year].losses = yearLosses;
			trackOwnerRecord(true, "mostLossesInSeason", yearLosses, year, name, teamName);
			
			//Draws
			if (wlString.indexOf("-", dashLoc+1) != -1) {
				dashLoc = wlString.indexOf("-", dashLoc+1);
				var yearDraws = parseInt(wlString.slice(dashLoc + 1), 10);
				owners[name].draws = owners[name].draws + yearDraws;
				owners[name].seasons[year].draws = yearDraws;
			}
			
			//Points for
			var yearPF = parseFloat($(this).find(".sortablePF").text().trim())
			owners[name].pointsFor = owners[name].pointsFor + yearPF;
			owners[name].seasons[year].pointsFor = yearPF;
			leagueSeasons[year].totalPF = leagueSeasons[year].totalPF + yearPF;
			trackSeasonSuper(year, "mostPointsFor", yearPF, true, name, teamName);
			trackSeasonSuper(year, "leastPointsFor", yearPF, false, name, teamName);
			
			//Points against
			var yearPA = parseFloat($(this).find(".sortablePA").text().trim());
			owners[name].pointsAgainst = owners[name].pointsAgainst + yearPA;
			owners[name].seasons[year].pointsAgainst = yearPA;
			trackSeasonSuper(year, "mostPointsAgainst", yearPA, true, name, teamName);
			trackSeasonSuper(year, "leastPointsAgainst", yearPA, false, name, teamName);
			
			//Point Differential
			var yearPD = yearPF - yearPA;
			owners[name].pointDiff = owners[name].pointDiff + yearPD;
			owners[name].seasons[year].pointDiff = yearPD;
			trackSeasonSuper(year, "mostPointDiff", yearPD, true, name, teamName);
			trackSeasonSuper(year, "leastPointDiff", yearPD, false, name, teamName);
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

//Track superlatives for leagueSeason objects
function trackSeasonSuper(year, field, currVal, max, ownerName, teamName) {
	if (max) {
		if (typeof leagueSeasons[year][field] != 'undefined') {
			if (leagueSeasons[year][field].val < currVal) {
				leagueSeasons[year][field] = new Record(year, ownerName, teamName, currVal);
			}
		} else {
			leagueSeasons[year][field] = new Record(year, ownerName, teamName, currVal);
		}
	} else {
		if (typeof leagueSeasons[year][field] != 'undefined') {
			if (leagueSeasons[year][field].val > currVal) {
				leagueSeasons[year][field] = new Record(year, ownerName, teamName, currVal);
			}
		} else {
			leagueSeasons[year][field] = new Record(year, ownerName, teamName, currVal);
		}
	}
}

function trackOwnerRecord(max, field, currVal, year, ownerName, teamName) {
    if (owners[ownerName][field].length == 0) {
        owners[ownerName][field].push(new Record(year, ownerName, teamName, currVal));
    } else if (owners[ownerName][field][0].val == currVal) {
        //May need to store multiple years with the same number of wins
        owners[ownerName][field].push(new Record(year, ownerName, teamName, currVal));
    } else if ((max && owners[ownerName][field][0].val < currVal) || (!max && owners[ownerName][field][0].val > currVal)) {
        //Reset to empty array
        owners[ownerName][field] = [];
        owners[ownerName][field].push(new Record(year, ownerName, teamName, currVal));
    }
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

function titleToTeamName (title) {
	var teamName;
	var i;
	i = title.indexOf(" (");
	teamName = title.substring(0,i);
	return teamName;
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