$(document).ready(function () {
    darkChart = {
        backgroundColor: "#282824",
        colorSet: "darkYellow",
        title: {
            fontColor: "#E6E272"
        },
        axisY: {
            interlacedColor: "#1C1C19",
            labelFontSize: 18,
            labelAngle: 60,
            tickColor: "#4A4A43",
            gridColor: "#4A4A43"
        },
        axisX: {
            labelFontSize: 18,
            labelAngle: 70,
            tickColor: "#4A4A43"
        },
        toolTip: {
            borderColor: "#1C1C19",
            backgroundColor: "#282824",
            fontColor: "white"
        },
        height: 500,
        width: $(document).width() * 0.86   //It is bad that this is hardcoded, but in there now to fix bug of charts being too wide when displaying from localStorage
    };

    //Set chart colorsets
    CanvasJS.addColorSet("darkYellow",
		[
		"#F3EB00",
		"#858226"
		]);

	//Set the active tab
	localStorage.setItem("activetab", "#home-nav");

	//Set up click event handlers
	//In future refactor these into one function inside click event	
	$("#home-nav").click(function() {
		if (leagueURL.length > 0) {
			changeActiveTab(localStorage.getItem("activetab"), "#home-nav");
		}
	});
	
	$("#standingsAnchor").click(function() {
		if (leagueURL.length > 0) {
			changeActiveTab(localStorage.getItem("activetab"), "#standings-nav");
			scrollTo("#standings-box");
		}
	});
	
	$("#seasonsAnchor").click(function() {
		if (leagueURL.length > 0) {
			changeActiveTab(localStorage.getItem("activetab"), "#seasons-nav");
			scrollTo("#seasons-box");
		}
	});
	
	$("#advancedAnchor").click(function() {
		if (leagueURL.length > 0) {
			changeActiveTab(localStorage.getItem("activetab"), "#advanced-nav");
			scrollTo("#advanced-box");
		}
	});
	
    //Check if we have data to load from localStorage
	if (localStorage.getItem("loadedHOF")) {
	    loadLocalData();
	    
	    //Prepare page
	    clearTables();
	    enablePills();
	    showResults();

	    //Display it
	    displayData();
	    return;
	} else {
	    clearSite();
	    showURL(900);
	}
});

function changeActiveTab(oldTabID, newTabID) {
	$(oldTabID).removeClass("active");
	$(newTabID).addClass("active");
	
	localStorage.setItem("activetab", newTabID);
	localStorage.setItem("activetab", newTabID);
}

//If no site is selected, do this
function disablePills() {
	$("#standings-nav").addClass("disabled");
	$("#seasons-nav").addClass("disabled");
	$("#advanced-nav").addClass("disabled");
	
	//Change functionality of links
	document.getElementById("standingsAnchor").href="javascript:";
	document.getElementById("seasonsAnchor").href="javascript:";
	document.getElementById("advancedAnchor").href="javascript:";
}

//If site is selected, do this
function enablePills() {
	$("#standings-nav").removeClass("disabled");
	$("#seasons-nav").removeClass("disabled");
	$("#advanced-nav").removeClass("disabled");
	
	//Change functionality of links
	document.getElementById("standingsAnchor").href="#";
	document.getElementById("seasonsAnchor").href="#";
	document.getElementById("advancedAnchor").href="#";
}

function hideResults() {
	$("#standings-box").hide();
	$("#seasons-box").hide();
	$("#advanced-box").hide();
}

function showResults() {
	$("#standings-box").show(700);
	$("#seasons-box").show(700);
	$("#advanced-box").show(700);
}

function hideURL(time) {
	$("#center-box").hide(time);
}

function showURL(time) {
	$("#center-box").show(time);
}

function scrollTo(elementScroll) {
	$('html, body').animate({
		scrollTop: $(elementScroll).offset().top
	}, 1000);
}

function clearTables() {
    $('table td').remove();
}

function clearSite() {
	changeActiveTab(localStorage.getItem("activetab"), "#home-nav");
	hideResults();
	hideCharts();
	disablePills();
	clearTables();

	localStorage.clear();
	owners = {};
	leagueSeasons = {};
	leagueURL = "";
	leagueID = "";
	showURL(900);
}

function hideCharts() {
    $('.canvasjs-chart-container').hide(0);
}

function showCharts() {
    $('.canvasjs-chart-container').show(0);
}

function loadLocalData() {
    owners = JSON.parse(localStorage.getItem("owners"));
    leagueSeasons = JSON.parse(localStorage.getItem("leagueSeasons"));
    leagueURL = localStorage.getItem("leagueURL");
    leagueID = localStorage.getItem("leagueID");
}