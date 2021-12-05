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
    
    drawdividers();
}