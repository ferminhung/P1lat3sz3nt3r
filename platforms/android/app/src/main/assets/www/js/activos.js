$(document).on("pageshow","#activos",function(event, ui){
    

    var sIdentificador=localStorage.getItem("codigoweb");   //aSesion["CodigoWeb"];
    //var sNombre=aSesion["nombre"];
    $("#InfoActivos").html("<span class='icon-user'></span> Trainer: "+sIdentificador);
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth()+1; //hoy es 0!
    var yyyy = hoy.getFullYear();
    $("#labDescripcion").text(" Activos: "+dd+"/"+mm+"/"+yyyy);
    $.ajax({
        data:{
            sCodigoWebPhp:sIdentificador, Mandato:'NominaAtletas'
        },
        url:globalURL,
        method:'POST',
        beforeSend:function(){
            $.mobile.loading( "show", {
              text: "cargando",
              textVisible: true,
              theme: "a",
              html: ""
            });
            
        },success:function(respuesta){  
            $.mobile.loading( "hide" );
            if(respuesta!="SIN REGISTROS"){
                var aCtivos = JSON.parse(respuesta);
                $.each( aCtivos, function( i, value ) { 
                    var html = '<ol data-role="listview" ><li data-role="list-divider">Activos</li>';
                    if (respuesta!="SIN"){
                        var aTletas = JSON.parse(respuesta);
                        var ij=0;
                        $.each( aTletas, function( i, value ) {
                            html += '<li><a'+value['id']+'">'+value['nombres']+' <span class="ui-li-count">'+value['telefCel']+' <--  </span></a></li>';
                            ij+=1;
                        });
                        html += '</ol>';
                    }else{
                        html += '<li><a "SIN"> SIN RESERVAS</a></li>';
                    }
                    $('#listaActivos').html(html);
                    $('#listaActivos').trigger('create');
                })
            }
        },error:function(jqXHR, textStatus, errorThrown){
            ajax_error(jqXHR, textStatus, errorThrown,true);
        }
    });

    $("#volverInicio").click(function(){
        $.mobile.changePage("paneladmin.html",{ transition : "fade" });

    });
    $('#btHome').click(function(){
        $.mobile.changePage("paneladmin.html",{ transition : "flip" });
    });
});

