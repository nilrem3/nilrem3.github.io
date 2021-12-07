function save(){
    window.localStorage.setItem("save", JSON.stringify(player));
}

function load(){
    loadedsave = JSON.parse(window.localStorage.getItem("save"));
    if(loadedsave.saveversion >= 0.1){
        player.points = new Decimal(loadedsave.points);
        player.dividersbought = loadedsave.dividersbought;
    }
    if(loadedsave.saveversion >= 0.11){
        player.menusunlocked = loadedsave.menusunlocked;
    }
    if(loadedsave.saveversion >= 0.12){
        for(const u in loadedsave.upgrades.unlocked){
            player.upgrades.unlocked[u] = loadedsave.upgrades.unlocked[u];
            player.upgrades.bought[u] = loadedsave.upgrades.bought[u];
        }
        player.stats["total points"] = new Decimal(loadedsave.stats["total points"]);
        //console.log(player.stats["total points"] == loadedsave.stats["total points"]);
        player.stats["dividers purchased"] = loadedsave.stats["dividers purchased"]
        player.stats["most points"] = new Decimal(loadedsave.stats["most points"]);
    }
    if(loadedsave.saveversion >= 0.2){
        player.stats["times prestiged"] = loadedsave.stats["times prestiged"]
        player.prestige.prestigepoints = new Decimal(loadedsave.prestige.prestigepoints);
        player.prestige.unspentprestigepoints = new Decimal(loadedsave.prestige.unspentprestigepoints);
    }
    drawdividers();
}