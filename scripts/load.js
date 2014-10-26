function requestCrossDomain() {
	var addr = document.getElementById("inputURL").value;

	//Check if address was entered
	if (!addr) {
		alert('No site passed!');
		return false;
	}
	
	//Set the address in local storage
	localStorage.setItem("leagueurl", addr);
	
	//Add '#games-tabs1' so that only the section with the teams is returned from yql query
	var yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + addr + '"') + " #games-tabs1";
	
	//New way to load and manipulate
	
	
	//Old way
	//$("#results").load(yql);
	//$("#results").hide()		//Should find better way to do this. Just loading to manipulate later
	//Parse out items
	//var html = $("#games-tabs1").html()
	
	//Hide the URL entry box
	hideURL(900);
	
	//Enable the pills if successful
	enablePills();
	
	//Enable the results boxes
	showResults();
}