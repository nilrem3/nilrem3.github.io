

function format(amount){
    if(new Decimal(amount).lessThan(new Decimal(1000))){
		return new Decimal(amount).toPrecision(4).toString();
	}
    return numberformat.format(amount, {backend: 'decimal.js', format:'scientific', Decimal: Decimal, sigfigs:4});
}

function getdividerscaling(divider){
    return new Decimal(1.1 + (0.1 * divider));
}
function getdividerbasecost(divider){
    return new Decimal(10).pow(divider + 1);
}

function getdividerbaseeffect(divider){
    var effect = new Decimal(2).pow(divider);
    if(divider == 0 && upgrades["Synergy 1"].bought){
        effect = effect.add(new Decimal(0.01).mul(player.dividersbought[1]));
    }
    if(divider == 1 && upgrades["Synergy 2"].bought){
        effect = effect.add(new Decimal(0.02).mul(player.dividersbought[2]));
    }
    if(divider == 2 && upgrades["Synergy 3"].bought){
        effect = effect.add(new Decimal(0.03).mul(player.dividersbought[3]));
    }
    if(divider == 3 && upgrades["Synergy 4"].bought){
        effect = effect.add(new Decimal(0.04).mul(player.dividersbought[4]));
    }
    return effect;
}

function getdividereffect(divider){
    var effect = getdividerbaseeffect(divider).mul(player.dividersbought[divider]);
    //console.log(effect); correct
    return effect;
}
function getdividercost(divider){
    var cost = getdividerbasecost(divider);
    var costmult = getdividerscaling(divider).pow(player.dividersbought[divider]);
    cost = cost.mul(costmult);
    cost = cost.div(gettotaldividercostdivision());
    return cost
}
function gettotalglobalcostdivision(){
    var total = new Decimal(1);
    for(var d = 0; d < player.dividersbought.length; d++){
        total = total.plus(getdividereffect(d))
    }
    //console.log(total); not correct
    return total
}
function gettotaldividercostdivision(divider){
    var division = gettotalglobalcostdivision();
    if(upgrades["Divide 1"].bought){
        division = division.mul(new Decimal(5));
    }
    return division
}

function gettotalupgradecostdivision(){
    var division = gettotalglobalcostdivision();
    return division;
}

function buydivider(divider)
{
    if(canbuy(divider)){
        player.points = player.points.sub(getdividercost(divider));
        player.dividersbought[divider] += 1;
        drawdividers();
    }
}

function canbuy(divider){
    return player.points.gte(getdividercost(divider));
}

function getshopmenucost(){
    return new Decimal(5000).div(gettotalglobalcostdivision());
}

setmenu("dividers");
updatemenubuttons();
setInterval(loop, 50);
setInterval(draw, 50);
drawdividers();