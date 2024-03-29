

(function ($) {


    $(document).ready(function () {

        var selectedId;

        $("#btnProjetos").click(function () {

            $("#treeProjetos").tree({
                url: '/dashboard/workspaces',
                onClick: function (node) {
                    loadSelectedItem();
                },
                onContextMenu: function (e, node) {
                    e.preventDefault();
                    $("#treeProjetos").tree("select", node.target);
                    loadSelectedItem();
                    switch (node.iconCls) {
                        case 'icon-database':
                            $("#menuDatabases").menu("show", {
                                left: e.pageX,
                                top: e.pageY
                            });
                            break;

                        case 'icon-project':
                            $("#menuWorkspaces").menu("show", {
                                left: e.pageX,
                                top: e.pageY
                            });
                            break;

                        case 'icon-visualization':
                            $("#menuVisualizations").menu("show", {
                                left: e.pageX,
                                top: e.pageY
                            });
                            break;

                        default:
                            if (node.attributes.type === "myworkspaces") {
                                $("#menuWorkFolder").menu("show", {
                                    left: e.pageX,
                                    top: e.pageY
                                });
                            }
                    }

                },
                onLoadSuccess: function () {
                    var selected = $("#treeProjetos").tree("find", selectedId);
                    if (selected) {
                        $("#treeProjetos").tree("select", selected.target);
                        if (selected.id !== "0" || selected.id !== "1") {
                            $.post('dashboard/getitemdata', selected.attributes, function (data) {
                                //Atuliza o breadcrumb
                                var bread = $("#breadcrumbItens").empty();
                                for (var i = 0; i < data.breadcrumb.length; i++) {
                                    bread
                                            .append($("<li></li>")
                                                    .append($("<a></a>", {
                                                        text: data.breadcrumb[i],
                                                        href: "javascript: void(0)"

                                                    })));
                                }
                                bread.append($("<li></li>", {
                                    text: data.name
                                }));
                                //atualiza os itens
                                var container = $("#divItensContainer").empty();
                                for (var i = 0; i < data.itens.length; i++) {
                                    container
                                            .append($("<div></div>", {
                                                "data-id": data.itens[i].id
                                            })
                                                    .append($("<img></img>", {
                                                        alt: "itemImage",
                                                        "data-id": data.itens[i].id,
                                                        src: "image/database.png"
                                                    }))
                                                    .append($("<br>"))
                                                    .append($("<span></span>", {
                                                        text: data.itens[i].name,
                                                        class: "itemName",
                                                        "data-id": data.itens[i].id
                                                    })));
                                }
                            }, 'json');
                        }
                    }
                }
            });
            $('#windowFiles').window('open');

        });

        $("#btnNovoProjeto").click(function () {
            $.post('dashboard/newworkspace', {name: "Novo Projeto"}, function (data) {
                if (data.status === "ok") {
                    loadSelectedItem();
                }
            }, 'json');
        });

        $("#btnExluirProjeto").click(function () {
            var selected = $("#treeProjetos").tree("getSelected");
            if (selected.attributes.type === "workspace") {
                console.log("entrou");
                $.post('dashboard/deleteworkspace', {
                    id: selected.attributes.id
                }, function (data) {
                    console.log(data);
                    if (data.status === "ok") {
                        $("#treeProjetos")
                                .tree("reload");
                        //Abrir projeto
                    } else if (data.status === "error") {
                        console.log("erro");
                    }
                }, 'json');
            }
        });

        $("#btnNovaBase").click(function () {
            $("#windowUploadDatabase").window("open");
        });

        $("#uploadForm").submit(function (e) {
            e.preventDefault();
            var selected = $("#treeProjetos").tree("getSelected");
            $("#hiddenItemId").val(selected.attributes.id);
            $("#hiddenItemType").val(selected.attributes.type);
            var formData = new FormData(this);
            if (selected.attributes.id) {

                $("#windowUploadDatabase").window("close");
                $.ajax({
                    url: '/uploadfile', //Server script to process data
                    type: 'POST',
                    dataType: 'json',
                    xhr: function () {  // Custom XMLHttpRequest
                        var myXhr = $.ajaxSettings.xhr();
                        if (myXhr.upload) { // Check if upload property exists
                            myXhr.upload.addEventListener('progress',
                                    progressHandlingFunction, false);
                        }
                        return myXhr;
                    },
                    //Ajax events
                    success: function (data) {
                        console.log("upload completo.");
                        console.log("data");
                        loadSelectedItem();
                    },
                    error: function (e) {
                        console.log("erro ao fazer upload");
                    },
                    // Form data
                    data: formData,
                    //Options to tell jQuery not to process data or worry about content-type.
                    cache: false,
                    contentType: false,
                    processData: false

                });
            }
        });


        $("#btnNovaVisaoScatterPlot").click(function () {
            var selected = $("#treeProjetos").tree("getSelected");
            var params = selected.attributes;
            params.technique = "scatterplot";
            $.post('dashboard/addvisao', params, function (data) {
                loadSelectedItem();
            });
        });

        $("#btnAbrirVisao").click(function () {
            var selected = $("#treeProjetos").tree("getSelected");
            $("#windowFiles").window("close");
//            //codigo temporário
            $("#d3MainVisCanvasTeste").empty();

            $.post('dashboard/openvisao', selected.attributes, function (data) {
                ActiveVisManager.openVisualization(data.id, data);
            }, 'json');

        });

        $(".btnAlterarNome").click(function () {
            var selected = $("#treeProjetos").tree("getSelected");
            var tipo = '';
            //trocar para internacionalização.
            switch (selected.attributes.type) {
                case "workspace":
                    tipo = "o projeto";
                    break;
                case "database":
                    tipo = "a base de dados";
                    break;
                case "visualization":
                    tipo = "a visualização";
                    break;
            }
            CustomDialog.showSimpleInputDialog({
                title: "Alterar Nome",
                text: "Digite um novo nome para " + tipo + " e clique em salvar."
            }, function (confirmed, text) {
                if (confirmed) {
                    $.post('dashboard/changename', {id: selected.attributes.id, type: selected.attributes.type, newname: text}, function (data) {
                        if(data.status === "ok"){
                            loadSelectedItem();
                        }
                    }, 'json');
                }
            });
        });
        
        $("#btnCompartilharProjeto").click(function(){
            var selected = $("#treeProjetos").tree("getSelected");
            CustomDialog.showSimpleInputDialog({
                title: "Compartilhar "+selected.text,
                text: "Digite os emails dos usuários que você deseja compartilhar o projeto "+
                        selected.text+" separados por vírgula e clique em salvar.",
                height: 150,
                width: 350
            }, function (confirmed, text) {
                if (confirmed) {
                    var emails = text.split(",");
                    //Validar emails antes de enviar solicitação.
                    $.post('dashboard/shareworkspace', {id: selected.attributes.id, emails: emails}, function (data) {
                        console.log("mudou");
                        if(data.status === "ok"){
                            loadSelectedItem();
                            console.log("mudou");
                        }
                    }, 'json');
                }
                console.log(confirmed, text);
            });
        });

        function loadSelectedItem() {
            selectedId = $("#treeProjetos").tree("getSelected").id;
            if (selectedId)
                $("#treeProjetos").tree("reload");
        }

        function progressHandlingFunction(e) {
            if (e.lengthComputable) {
                console.log('carregando ' + e.loaded + ' de ' + e.total);
            }
        }


    });



})(jQuery);
