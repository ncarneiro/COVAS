


var CustomMenu = {

    showSimpleMenu: function(menuItens, callback, options){
        var sMenu = $("#menuCustom").append($("<div></div>", {
            class: "easyui-menu"
        })).children();
        options = options || {};
        options.disabled = typeof options.disabled === "number" ? [options.disabled] : 
                (Array.isArray(options.disabled)? options.disabled : []);
        callback = callback || function(){};
        var id;
        for(var i=0; i<menuItens.length; i++){
            id = options.id ? menuItens[i][options.id] : i;
            sMenu.append($("<div></div>", {
                text: options.propText ? menuItens[i][options.propText] : menuItens[i],
                "data-id": id,
                "data-options": options.disabled.indexOf(id)>=0? "disabled:'true'":""
            }));
        }
        sMenu.menu({
            onClick:function(item){
                var idaux = $(item.target).attr("data-id");
                var intId = parseFloat(idaux);
                callback(intId !== NaN ? intId : idaux);
            },
            onHide: function(){
                setTimeout(function(){
                    sMenu.menu("destroy");
                }, 200);
            }
        });
        var h = sMenu.height(), w = sMenu.width(), top, left;
        if(options.event){
            top = options.event.pageY + h >= window.screen.height-20 ? options.event.pageY - h: options.event.pageY;
            left = options.event.pageX + w >= window.screen.width-20 ? options.event.pageX - w: options.event.pageX;
        }else{
            top = left = 50;
        }
        
        
        sMenu.menu("show", {
           top:  top,
           left: left
        });
    }
};

