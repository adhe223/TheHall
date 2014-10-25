function requestCrossDomain() {
	var addr = document.getElementById("inputURL").value;

	if (!addr) {
		alert('No site passed!');
		return false;
	}
	
	//Enable the pills
	enablePills();
	
	//Set the address in local storage
	localStorage.setItem("leagueurl", addr);
	
	//Add '#games-tabs1' so that only the section with the teams is returned
	var yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + addr + '"') + " #games-tabs1";
	document.getElementById("call").innerHTML = yql;
	
	$("#results").load(yql);
	//$("#results").hide()		//Should find better way to do this. Just loading to manipulate later
	
	//Parse out items
	var html = $("#games-tabs1").html()
}