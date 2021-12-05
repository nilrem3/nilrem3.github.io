var lasttime = Date.now();
var frames = 0;
function loop(){
    let now = Date.now();
    var dt = new Decimal(now - lasttime).div(1000); //divide so it's in seconds not ms
    lasttime = now;

    checkupgradeunlocks();

    player.points = player.points.plus(dt);
}

function draw(){
    frames += 1;
    document.getElementById("topdisplaybar").innerHTML = `<div>Points: ` + format(player.points) + `</div><div>Total Cost Division: ` + format(gettotalglobalcostdivision()) + `</div>`;

    if(frames % 20 == 0){
        drawdividers();
        updatemenubuttons();
        drawupgrades();
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
}

function drawupgrades(){
    if(currentmenu != "shop"){
        return;
    }
    upgradehtml = `<div>`
    for(const upgrade in upgrades){
        if(upgrades[upgrade].unlocked && (upgrades[upgrade].bought == false)){
            upgradehtml += `<div class="upgrade"><h3>`+ upgrades[upgrade].name + `</h3>` + upgrades[upgrade].description + `<button onclick="buyupgrade('` + upgrade + `')">Cost: ` + format(upgrades[upgrade].cost) + `</button></div>`;
        }
    }
    upgradehtml += `</div>`
    document.getElementById("shop").innerHTML = upgradehtml;
}