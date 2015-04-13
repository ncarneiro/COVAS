

(function ($) {


    $(document).ready(function () {

        $("#btnProjetos").click(function () {

            $("#treeProjetos").tree({
                url: '/projetos',
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
            var btn = $(this);
            var position = btn.offset();
            var h = $(this).height();

        });

    });



})(jQuery);
