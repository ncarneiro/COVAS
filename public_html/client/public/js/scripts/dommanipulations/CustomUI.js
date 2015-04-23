


var CustomMenu = {

    showSimpleMenu: function(menuItens, callback, options){
        var sMenu = $("#menuCustom").append($("<div></div>", {
            class: "easyui-menu"
        })).children();
        options = options || {};
        callback = callback || function(){};
        for(var i=0; i<menuItens.length; i++){
            sMenu.append($("<div></div>", {
                text: options.propText ? menuItens[i][options.propText] : menuItens[i],
                "data-id": options.id ? menuItens[i][options.id] : i
            }));
        }
        sMenu.menu({
            onClick:function(item){
                callback($(item.target).attr("data-id"));
            },
            onHide: function(){
                setTimeout(function(){
                    sMenu.menu("destroy");
                }, 200);
            }
        });
        sMenu.menu("show", {
           top:  options.event ? options.event.pageX : 50,
           left: options.event ? options.event.pageY : 50
        });
    }
};

