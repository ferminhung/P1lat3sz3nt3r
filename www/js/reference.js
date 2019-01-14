$(document).on("pageshow","#reference",function(event,ui){

    $('#irdiccionario').click(function(){
        $.mobile.changePage("panel.html",{ transition : "flip" });
    });
    $('#footerdiccionario').click(function(){
        $.mobile.changePage("panel.html",{ transition : "flip" });
    });

    var sGuia=localStorage.getItem("guia"); 
    Referenceguide(sGuia);
   
});

function Referenceguide(valor){
    var imagen = new Image();
    imagen.width=320;
    imagen.style="width: 98%;";
    imagen.src = "img/dicpilates.jpg";
    $('#Referenceguide').html(imagen);
}