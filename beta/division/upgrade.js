upgrades = {};
class upgrade{
    constructor(name, cost, description, unlocked=false){
        this.name = name;
        this._cost = cost;
        this.description = description;
        upgrades[this.name] = this;
        player.upgrades.bought[this.name] = false;
        player.upgrades.unlocked[this.name] = unlocked;
    }
    canafford(){
        return player.points.gte(this.cost);
    }
    get bought(){
        return player.upgrades.bought[this.name];
    }
    get unlocked(){
        return player.upgrades.unlocked[this.name];
    }
    get cost(){
        return this._cost.div(gettotalupgradecostdivision());
    }
}

function buyupgrade(upgrade){
    //console.log(upgrade);
    if(upgrades[upgrade].unlocked && (upgrades[upgrade].bought == false)){
        if(player.points.gte(upgrades[upgrade].cost)){
            player.points = player.points.sub(upgrades[upgrade].cost);
            player.upgrades.bought[upgrade] = true;
        }
    }
    drawupgrades();
}

function checkupgradeunlocks(){
    player.upgrades.unlocked["Divide 1"] = true;
    player.upgrades.unlocked["Synergy 1"] = true;
    player.upgrades.unlocked["Synergy 2"] = upgrades["Synergy 1"].bought;
    player.upgrades.unlocked["Synergy 3"] = upgrades["Synergy 2"].bought;
    player.upgrades.unlocked["Synergy 4"] = upgrades["Synergy 3"].bought;
    player.upgrades.unlocked["Divide 2"] = upgrades["Divide 1"].bought && upgrades["Synergy 1"].bought;
    player.upgrades.unlocked["Total Point Divider"] = player.stats["total points"].gte(3600);
    player.upgrades.unlocked["Most Point Divider"] = player.stats["most points"].gte(600);
}

//usually i think the player will have a divider of like 100 when they unlock upgrades
new upgrade("Divide 1", new Decimal(3000), "Divide divider costs by 5", unlocked=true);
new upgrade("Synergy 1", new Decimal(15000), "Divider 1 effect +0.01 per Divider 2 purchased", unlocked=true);
new upgrade("Synergy 2", new Decimal(25000), "Divider 2 effect +0.02 per Divider 3 purchased", unlocked=false);
new upgrade("Synergy 3", new Decimal(200000), "Divider 3 effect +0.03 per Divider 4 purchased", unlocked=false);
new upgrade("Synergy 4", new Decimal(1000000), "Divider 4 effect +0.04 per Divider 5 purchased", unlocked=false);
new upgrade("Divide 2", new Decimal(50000), "Divide cost of dividers and upgrades by 2", unlocked=false);
new upgrade("Total Point Divider", new Decimal(10000000), "Divide cost of dividers by log of total points produced", unlocked=false);
new upgrade("Most Point Divider", new Decimal(10000000), "Divide cost of dividers by log of most points produced", unlocked=false);