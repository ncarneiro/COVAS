


var CustomMenu = {
    showSimpleMenu: function (menuItens, callback, options) {
        var sMenu = $("#menuCustom").append($("<div></div>", {
            class: "easyui-menu"
        })).children();
        options = options || {};
        options.disabled = typeof options.disabled === "number" ? [options.disabled] :
                (Array.isArray(options.disabled) ? options.disabled : []);
        callback = callback || function () {
        };
        var id;
        for (var i = 0; i < menuItens.length; i++) {
            id = options.id ? menuItens[i][options.id] : i;
            sMenu.append($("<div></div>", {
                text: options.propText ? menuItens[i][options.propText] : menuItens[i],
                "data-id": id,
                "data-options": options.disabled.indexOf(id) >= 0 ? "disabled:'true'" : ""
            }));
        }
        sMenu.menu({
            onClick: function (item) {
                var idaux = $(item.target).attr("data-id");
                var intId = parseFloat(idaux);
                callback(intId !== NaN ? intId : idaux);
            },
            onHide: function () {
                setTimeout(function () {
                    sMenu.menu("destroy");
                }, 200);
            }
        });
        var h = sMenu.height(), w = sMenu.width(), top, left;
        if (options.event) {
            top = options.event.pageY + h >= window.screen.height - 20 ? options.event.pageY - h : options.event.pageY;
            left = options.event.pageX + w >= window.screen.width - 20 ? options.event.pageX - w : options.event.pageX;
        } else {
            top = left = 50;
        }


        sMenu.menu("show", {
            top: top,
            left: left
        });

    }


};

var CustomDialog = {
    showSimpleInputDialog: function (options, callback) {
        var confirmed = false;
        var dialogOpts = {
            title: options.title || "Custom Dialog",
            modal: typeof options.modal === "boolean" ? options.modal : true,
            height: options.height || 150,
            width: options.width || 240,
            onClose: function () {
                if (!confirmed)
                    callback(false);
                dialog.dialog("destroy");
            },
            buttons: [{
                    text: "Salvar",
                    handler: function () {
                        confirmed = true;
                        callback(true, txtInput.val());
                        dialog.dialog("close");
                    }
                }]
        };

        var txtInput = $("<input>", {
            type: "text",
            id: "txtValue",
            class: "easyui-textbox",
            style: "width: 100%"
        });
        var dialog = $("#menuCustom").append($("<div></div>")).children().dialog(dialogOpts);
        dialog
                .append($("<div></div>", {
                    style: "padding: 6px 10px"
                })
                        .append($("<div></div>", {
                            text: options.text || "mensagem",
                            style: "margin: 3px 0px;"
                        }))
                        .append(txtInput));
        txtInput.textbox({});
        dialog.dialog("open");
        txtInput.trigger("focus");
    }
};

var CustomVisContainer = {
    addContainer: function (jqElement, id) {
        jqElement
                .append($("<div></div>", {
                    id: "menuZoom_" + id
                })
                        .append($("<div></div>", {
                            text: "Zoom na Visão"
                        }).click(function () {
                            $("#vis_" + id)
                                    .append($("<div></div>", {
                                        style: "position:absolute; left: 70px; top:70px; width:100px;" +
                                                "height:100px; border: 1px solid; overflow: hidden;background-color:white;"
                                    })
                                            .append($("#vis_" + id).clone())
                                            .append($("<div></div>", {
                                                id: "zoomDragHander_" + id,
                                                style: "position:absolute;left:2px;right:2px;top:2px;bottom:2px;background-color:transparent;"
                                            }))
                                            .draggable({
                                                handler: "#zoomDragHander_" + id,
                                                onDrag: function (e) {
                                                    var d = e.data;
                                                    if (d.left < 0) {
                                                        d.left = 0;
                                                    }
                                                    if (d.top < 1) {
                                                        d.top = 1;
                                                    }
                                                    if (d.left + $(d.target).outerWidth() > $(d.parent).width()) {
                                                        d.left = $(d.parent).width() - $(d.target).outerWidth();
                                                    }
                                                    if (d.top + $(d.target).outerHeight() > $(d.parent).height()) {
                                                        d.top = $(d.parent).height() - $(d.target).outerHeight();
                                                    }
                                                }
                                            })
                                            .resizable({}));
                        })));

        jqElement
                .append($("<div></div>", {
                    class: "toolbarVis",
                    style: "position: absolute;width:100%;height:30px;top:0px;" +
                            "border:1px solid lightslategrey;background-color: #f4f4f4;" +
                            "border-left-width: 0px;border-right-width: 0px;"
                })
                        .append($("<a></a>", {
                            href: "javascript:void(0)",
                            style: "margin:2px 0px 0px 2px"
                        }).menubutton({plain: false, hasDownArrow: false, iconCls: 'icon-edit2'}))
                        .append($("<a></a>", {
                            href: "javascript:void(0)",
                            style: "margin:2px 0px 0px 2px"
                        }).menubutton({plain: false, hasDownArrow: false, iconCls: 'icon-filter2'}))
                        .append($("<a></a>", {
                            href: "javascript:void(0)",
                            style: "margin:2px 0px 0px 2px"
                        }).menubutton({plain: false, menu: "#menuZoom_" + id, hasDownArrow: false, iconCls: 'icon-zoom'}))
                        .append($("<a></a>", {
                            href: "javascript:void(0)",
                            style: "margin:2px 0px 0px 2px"
                        }).menubutton({plain: false, hasDownArrow: false, iconCls: 'icon-tooltip-baloon'}))
                        .append($("<a></a>", {
                            href: "javascript:void(0)",
                            style: "margin:2px 0px 0px 2px;",
                            text: "3"
                        }).menubutton({plain: false, hasDownArrow: false, iconCls: 'icon-eye'}))
                        .append($("<a></a>", {
                            href: "javascript:void(0)",
                            style: "margin:2px 0px 0px 2px;float:right;"
                        }).linkbutton({plain: true, iconCls: 'icon-close'})))
                .append($("<div></div>", {
                    class: "visCanvas",
                    id: "vis_" + id,
                    style: "position: absolute;width:100%;bottom:20px;top:30px;"
                }))
                .append($("<div></div>", {
                    class: "historyVis",
                    style: "position: absolute;width:100%;height:20px;bottom:0px;"
                }));
    }
};

