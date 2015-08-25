//ESPN URLs, replace the space character with leagueID and the comma with the year
var CURRYEAR="2014";
var STANDINGS="http://games.espn.go.com/ffl/standings?leagueId= &seasonId=,";
var FINAL_STANDINGS="http://games.espn.go.com/ffl/tools/finalstandings?leagueId= &seasonId=,";
var owners = {};
var leagueSeasons = {};
var leagueURL = "";
var leagueID = "";

var darkChart; /*= {
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
    width: pageWidth*0.86
};*/