

(function ($) {


    $(document).ready(function () {

        $("#btnProjetos").click(function () {

            $("#treeProjetos").tree({
                url: '/dashboard/workspaces',
//                onDblClick: function(node){
//                    console.log(node.attributes);
//                },
                onSelected: function (node) {
                    selectedTreeItem = node;
                    console.log(node);
                },
                onContextMenu: function (e, node) {
                    e.preventDefault();
                    $("#treeProjetos").tree("select", node.target);
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

                }
            });
            $('#windowFiles').window('open');

        });

        $("#btnNovoProjeto").click(function () {
            $.post('dashboard/newworkspace', {name: "Novo Projeto"}, function (data) {
                console.log(data);
                if (data.status === "ok") {
                    $("#treeProjetos")
                            .tree("reload");
                    //Abrir projeto
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
                    } else if (data.status === "error"){
                        console.log("erro");
                    }
                }, 'json');
            }
        });

    });



})(jQuery);
