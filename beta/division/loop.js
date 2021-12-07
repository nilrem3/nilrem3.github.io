var lasttime = Date.now();
var frames = 0;
function loop(){
    let now = Date.now();
    var dt = new Decimal(now - lasttime).div(1000); //divide so it's in seconds not ms
    lasttime = now;

    checkupgradeunlocks();

    player.points = player.points.plus(dt);
    player.stats["total points"] = player.stats["total points"].plus(dt);
    if(player.points.gte(player.stats["most points"])){
        player.stats["most points"] = player.points;
    }
}

function draw(){
    frames += 1;
    document.getElementById("topdisplaybar").innerHTML = `<div>Points: ` + format(player.points) + `</div><div>Total Cost Division: ` + format(gettotalglobalcostdivision()) + `</div>`;

    if(frames % 20 == 0){
        drawdividers();
        updatemenubuttons();
        drawupgrades();
        drawstats();
        drawprestigemenu();
    }

}

function drawdividers(){
    var dividerhtml = ``;
    for(let d = 0; d < player.dividersbought.length; d++){
        var thisdividerhtml = `<div class="divider">
        Divider ` + (d + 1) + `: +/` + format(getdividereffect(d)) + `<button class="dividerpurchasebutton ` + (canbuy(d) ? "affordabledividerbutton" : "notaffordabledividerbutton") +  `" onclick="buydivider(` + d + `)">+` + format(getdividerbaseeffect(d)) +`: ` + format(getdividercost(d)) + ` points</button>
        </div>`;
        dividerhtml += thisdividerhtml;
    }
    document.getElementById('dividers').innerHTML = dividerhtml;
}

function updatemenubuttons(){   
    if(player.menusunlocked["shop"]){
        document.getElementById("shopbutton").innerHTML = "Shop";
    }else{
        document.getElementById("shopbutton").innerHTML = "Cost: " + format(getshopmenucost());
    }

    if(player.menusunlocked["prestige"]){
        document.getElementById("prestigebutton").innerHTML = "Prestige";
    }else{
        document.getElementById("prestigebutton").innerHTML = "Cost: " + format(getprestigemenucost());
    }
}

function drawupgrades(){
    if(currentmenu != "shop"){
        return;
    }
    upgradehtml = `<div>`
    for(const upgrade in upgrades){
        if(upgrades[upgrade].unlocked){
            if(upgrades[upgrade].bought == false){
                upgradehtml += `<div class="upgrade"><h3>`+ upgrades[upgrade].name + `</h3>` + upgrades[upgrade].description + `<button onclick="buyupgrade('` + upgrade + `')">Cost: ` + format(upgrades[upgrade].cost) + `</button></div>`;
            }else{
                upgradehtml += `<div class="upgrade purchasedupgrade"><h3>`+ upgrades[upgrade].name + `</h3>` + upgrades[upgrade].description + `</div>`;
            }
        }
    }
    upgradehtml += `</div>`
    document.getElementById("shopupgrades").innerHTML = upgradehtml;
}

function drawstats(){
    document.getElementById("totalpointsdiv").innerHTML = "Total Points: " + format(player.stats["total points"]);
    document.getElementById("dividersboughtdiv").innerHTML = "Dividers Bought: " + player.stats["dividers purchased"];
    document.getElementById("mostpointsdiv").innerHTML = "Most Points: " + format(player.stats["most points"]);
}