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
    console.log(upgrade);
    if(upgrades[upgrade].unlocked && (upgrades[upgrade].bought == false)){
        if(player.points.gte(upgrades[upgrade].cost)){
            player.points = player.points.sub(upgrades[upgrade].cost);
            player.upgrades.bought[upgrade] = true;
        }
    }
    drawupgrades();
}

function checkupgradeunlocks(){
    if(upgrades["Synergy 1"].bought){
        player.upgrades.unlocked["Synergy 2"] = true;
    }
    if(upgrades["Synergy 2"].bought){
        player.upgrades.unlocked["Synergy 3"] = true;
    }
    if(upgrades["Synergy 3"].bought){
        player.upgrades.unlocked["Synergy 4"] = true;
    }
}

//usually i think the player will have a divider of like 100 when they unlock upgrades
new upgrade("Divide 1", new Decimal(3000), "Divide divider costs by 5", unlocked=true);
new upgrade("Synergy 1", new Decimal(15000), "Divider 1 effect +0.01 per Divider 2 purchased", unlocked=true);
new upgrade("Synergy 2", new Decimal(25000), "Divider 2 effect +0.02 per Divider 3 purchased", unlocked=false);
new upgrade("Synergy 3", new Decimal(100000), "Divider 3 effect +0.03 per Divider 4 purchased", unlocked=false);
new upgrade("Synergy 4", new Decimal(500000), "Divider 4 effect +0.04 per Divider 5 purchased", unlocked=false);