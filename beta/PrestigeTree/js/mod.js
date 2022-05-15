let modInfo = {
	name: "The Point Tree",
	id: "nilrem_mod_2",
	author: "nilrem",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "Literally nothing",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.<br>
		-I LOVE YOU MAKI <3333`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
    
    if(hasUpgrade("p", 11)) gain = gain.mul(upgradeEffect("p", 11));
    if(hasUpgrade("p", 12)) gain = gain.mul(upgradeEffect("p", 12));
    if(hasUpgrade("p", 13)) gain = gain.mul(upgradeEffect("p", 13));
    if(hasUpgrade("p", 14)) gain = gain.mul(upgradeEffect("p", 14));
    if(hasUpgrade("p", 15)) gain = gain.mul(upgradeEffect("p", 15));
    
	if(hasUpgrade("p", 31)) gain = gain.mul(upgradeEffect("p", 31));

    gain = gain.mul(layers["p2"].effect());
    
    if(hasUpgrade("p2", 11)) gain = gain.mul(upgradeEffect("p2", 11));
    if(hasUpgrade("p2", 12)) gain = gain.mul(upgradeEffect("p2", 12));
    if(hasUpgrade("p2", 21)) gain = gain.mul(upgradeEffect("p2", 21));
    if(hasUpgrade("p2", 23)) gain = gain.mul(upgradeEffect("p2", 23));
    
    gain = gain.mul(layers["m"].effect());
    
    gain = gain.mul(challengeEffect("p2", 11));
    
    if(hasUpgrade("p3", 11)) gain = gain.mul(upgradeEffect("p3", 11));
    
	gain = gain.mul(layers["b"].effect())

    let pow = new Decimal(1);
    
    if(hasUpgrade("p2", 25)) pow = pow.mul(upgradeEffect("p2", 25));
    
    if(hasUpgrade("p3", 15)) pow = pow.mul(upgradeEffect("p3", 15));
	if(hasUpgrade("p3", 22)) pow = pow.mul(upgradeEffect("p3", 22));
    
	let total = gain.pow(pow)
    
    if(inChallenge("p2", 11)) total = total.pow(0.1);
    if(inChallenge("p2", 12)) total = total.pow(0.25);
    
    return total
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return false// player.points.gte(new Decimal("eee1000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}