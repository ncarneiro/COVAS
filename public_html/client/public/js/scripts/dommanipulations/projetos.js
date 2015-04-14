

(function ($) {


    $(document).ready(function () {

        $("#btnProjetos").click(function () {

            $("#treeProjetos").tree({
                url: '/dashboard/workspaces',
                onContextMenu: function (e, node) {
                    e.preventDefault();
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
            $.post('dashboard/newworkspace', {}, function(data){
                console.log(data);
            }, 'json').done(function(){
                console.log("algo");
            });
        });

    });



})(jQuery);
