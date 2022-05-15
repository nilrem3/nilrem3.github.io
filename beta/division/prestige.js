function nextprestigepointcost(){
    var cost = new Decimal(500000);
    cost = cost.mul(new Decimal(3).pow(player.prestige.prestigepoints));
    cost = cost.div(gettotalglobalcostdivision());
    return cost;
}

function drawprestigemenu(){
    document.getElementById("buyprestigebutton").innerHTML = "+1 Prestige Point for " + format(nextprestigepointcost()) + " points";
    document.getElementById("prestigecounter").innerHTML = "You Have " + format(player.prestige.prestigepoints) + " Prestige Points (" + format(player.prestige.unspentprestigepoints) + " unspent)";
    document.getElementById("prestigefactorinfo").innerHTML = "Each Prestige Point divides costs by " + format(getprestigepointfactor());

    var rows = document.getElementById("prestigeupgrades").childElementCount;
    if(rows < numrows){
        var html = ``;
        for(let i = 0; i <= numrows; i++){
            html += `<div id="prestigeupgraderow` + i + `"></div>`
        }
        document.getElementById("prestigeupgrades").innerHTML = html;
    }

    var upgraderowhtmls = {};
}

function clickprestigebutton(){
    if(canprestige()){
        player.prestige.prestigepoints = player.prestige.prestigepoints.add(1);
        player.prestige.unspentprestigepoints = player.prestige.unspentprestigepoints.add(1);
        reseteverythingprestigedoes();
    }
}

function getprestigepointfactor(){
    return new Decimal(1.5);
}

function canprestige(){
    return player.points.gte(nextprestigepointcost());
}

function reseteverythingprestigedoes(){
    player.stats["times prestiged"] += 1;
    player.points = new Decimal(0);
    for(const upgrade in upgrades){
        player.upgrades.unlocked[upgrade] = false;
        player.upgrades.bought[upgrade] = false;
    }
    for(var i = 0; i < player.dividersbought.length; i++){
        player.dividersbought[i] = 0;
    }
    player.menusunlocked["shop"] = false;
}

upgraderows = {}
upgrades = {}
numrows = 0
class prestigeupgrade{
    constructor(name, row, cost, description){
        this.name = name;
        if(upgraderows[row] == undefined){
            upgraderows[row] = {}
        }
        this.row = row;
        if(this.row > numrows){
            numrows = this.row;
        }
        upgraderows[this.row][this.name] = this;
        upgrades[this.name] = this;
        this.cost = cost;
        this.description = description;
        this.bought = false;
    }
    canbuy(){
        for(const u in upgraderows[this.row]){
            if(upgraderows[this.row][u].bought){
                return false; //can only buy one upgrade per row.
            }
        }
        if(player.prestige.unspentprestigepoints.lt(this.cost)){
            return false;
        }
        if(this.row == 0){
            return true;
        }
        for(const u in upgraderows[this.row - 1]){
            if(upgraderows[this.row - 1][u].bought){
                return true; //must have purchased at least one upgrade in the previous row
            }
        }
        return false;
    }
}

new prestigeupgrade("Slower Scaling", 0, new Decimal(1), "Divides scaling of dividers by 1.2");
new prestigeupgrade("Basic Divider", 1, new Decimal(1), "Divide Costs by 2");
new prestigeupgrade("Divider Divider", 1, new Decimal(2), "Divide Divider Costs by 5");
new prestigeupgrade("Upgrade Divider", 1, new Decimal(2), "Divide Upgrade Costs by 4");
new prestigeupgrade("Prestige Divider", 1, new Decimal(10), "Divide Prestige Point Requirements by 5");