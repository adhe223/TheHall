function Owner(inName) {
	this.name = inName;
	this.seasons = {};
	this.wins = 0;
	this.losses = 0;
	this.draws = 0;
	this.pointsFor = 0.0;
	this.pointsAgainst = 0.0;
	this.pointDiff = 0.0;
	this.championships = 0;
	this.runnerups = 0;
	this.mostWinsInSeason = [];
	this.mostLossesInSeason = [];
	this.mostPFInSeason = [];
}

function OwnerSeason(inYear) {
	this.year = inYear;
	this.wins = 0;
	this.losses = 0;
	this.draws = 0;
	this.pointsFor = 0.0;
	this.pointsAgainst = 0.0;
	this.pointDiff = 0.0;
}

function LeagueSeason(inYear) {
    this.year = inYear;
    this.numberTeams = 0;
	this.totalPF = 0.0;
	this.champion = "";
	this.runnerup = "";
	this.mostWins = [];
	this.mostLosses = [];
	this.mostPointsFor;
	this.mostPointsAgainst;
	this.mostPointDiff;
	this.leastPointsFor;
	this.leastPointsAgainst;
	this.leastPointDiff;
}

function Record(inYear, inOwnerName, inTeamName, inVal) {
	this.year = inYear;
	this.ownerName = inOwnerName;
	this.teamName = inTeamName;
	this.val = inVal;
}