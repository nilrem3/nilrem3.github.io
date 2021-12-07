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