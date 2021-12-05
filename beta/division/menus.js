function setmenu(menu){
    //menu is a string which is the id of the div containing the elements belonging in that menu
    currentmenu = menu;
    var menus = document.getElementsByClassName("menu");
    for(let m = 0; m < menus.length; m++){
        if(menus[m].id == menu){
            menus[m].style["display"] = 'initial';
        }else{
            menus[m].style["display"] = "hidden";
        }
    }
}

var currentmenu = null;