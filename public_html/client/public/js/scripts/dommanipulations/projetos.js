

(function($){
    
    
    $(document).ready(function(){
        
        $("#btnProjetos").click(function(){
            /*
            $.ajax("/projetos", {
                dataType: "html"
            }).done(function(data){
                
                $(data).appendTo("#dialogsContent").window({
                    width: 500,
                    height: 200,
                    title: "Projetos",
                    modal: true,
                    maximizable: false,
                    minimizable: false,
                    collapsible: false
                });
//                $(data).window({
//                    width: 500,
//                    height: 200,
//                    modal: true
//                }).appendTo($("#dialogsContent"));
                
                
//                $("#dialogsContent").html(data);
//                $("#windowFiles").window({
//                    width: 500,
//                    height: 200,
//                    modal: true,
//                    closed: true
//                });
            });*/
            
            
            
            $("#treeProjetos").tree({
                url:'/projetos'
            });
            
        });
        
        
    });
    
    
    
})(jQuery);
