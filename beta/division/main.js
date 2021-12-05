

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
    return new Decimal(2).pow(divider);
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
    cost = cost.div(gettotalglobalcostdivision());
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
    return gettotalglobalcostdivision();
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

setmenu("dividers");

setInterval(loop, 50);
setInterval(draw, 50);
drawdividers();