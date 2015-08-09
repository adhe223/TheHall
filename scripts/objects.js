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
	this.totalPF = 0.0;
	this.champion = "";
}