function setmenu(menu){
    //menu is a string which is the id of the div containing the elements belonging in that menu
    if(player.menusunlocked[menu] == false){
        //handle purchasing menus
        if(menu == "shop" && player.points.gte(getshopmenucost())){
            player.points = player.points.sub(getshopmenucost());
            player.menusunlocked["shop"] = true;
        }else if(menu == "prestige" && player.points.gte(getprestigemenucost())){
            player.points = player.points.sub(getprestigemenucost());
            player.menusunlocked["prestige"] = true;
        }
        updatemenubuttons();
        return;
    }
    currentmenu = menu;
    var menus = document.getElementsByClassName("menu");
    for(let m = 0; m < menus.length; m++){
        if(menus[m].id == menu){
            menus[m].style["display"] = 'initial';
        }else{
            menus[m].style["display"] = "none";
        }
    }
}

var currentmenu = null;