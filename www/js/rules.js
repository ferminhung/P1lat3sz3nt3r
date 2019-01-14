$(document).on("pageshow","#rules",function(event,ui){

    $('#volver').click(function(){
        $.mobile.changePage("panel.html",{ transition : "flip" });
    });


});

