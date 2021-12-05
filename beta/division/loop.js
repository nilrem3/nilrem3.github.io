var lasttime = Date.now();
var frames = 0;
function loop(){
    let now = Date.now();
    var dt = new Decimal(now - lasttime).div(1000); //divide so it's in seconds not ms
    lasttime = now;

    player.points = player.points.plus(dt);
}

function draw(){
    frames += 1;
    document.getElementById("topdisplaybar").innerHTML = `<div>Points: ` + format(player.points) + `</div><div>Total Cost Division: ` + format(gettotalglobalcostdivision()) + `</div>`;

    if(frames % 20 == 0){
        drawdividers();
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