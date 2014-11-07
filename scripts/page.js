$(document).ready(function() {	
	//Set the active tab
	localStorage.setItem("activetab", "#home-nav");

	//Set up click event handlers
	//In future refactor these into one function inside click event	
	$("#home-nav").click(function() {
		if (localStorage.getItem("leagueurl").length > 0) {
			changeActiveTab(localStorage.getItem("activetab"), "#home-nav");
		}
	});
	
	$("#standingsAnchor").click(function() {
		if (localStorage.getItem("leagueurl").length > 0) {
			changeActiveTab(localStorage.getItem("activetab"), "#standings-nav");
			scrollTo("#standings-box");
		}
	});
	
	$("#seasonsAnchor").click(function() {
		if (localStorage.getItem("leagueurl").length > 0) {
			changeActiveTab(localStorage.getItem("activetab"), "#seasons-nav");
			scrollTo("#seasons-box");
		}
	});
	
	$("#advancedAnchor").click(function() {
		if (localStorage.getItem("leagueurl").length > 0) {
			changeActiveTab(localStorage.getItem("activetab"), "#advanced-nav");
			scrollTo("#advanced-box");
		}
	});
	
	//Disable UI tabs if address is not set
	if (localStorage.getItem("leagueurl").length == 0) {
		clearSite();
	} else {
		hideURL(0);
	}
});

function changeActiveTab(oldTabID, newTabID) {
	$(oldTabID).removeClass("active");
	$(newTabID).addClass("active");
	
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

function clearSite() {
	localStorage.setItem("leagueurl", "");
	changeActiveTab(localStorage.getItem("activetab"), "#home-nav");
	hideResults();
	disablePills();
	showURL(900);
}