function desactivar(id, sIdentificador, i){
     $.ajax({
        data:{
            sCodigoWebPhp:sIdentificador, sIdPhp:id, Mandato:'DesActivarClase'
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
            $('#fila'+i).remove();
            alert(respuesta);
        },error:function(jqXHR, textStatus, errorThrown){
            ajax_error(jqXHR, textStatus, errorThrown,true);
        }
    });
}

$(document).on("pageshow","#reserva",function(event, ui){
    localStorage.setItem("pulsoreserva","-");
    var sIdentificador=localStorage.getItem("codigoweb");   //aSesion["CodigoWeb"];
    //var sNombre=aSesion["nombre"];
    $("#InfoReserva").html("<span class='icon-user'></span> Reserva para "+sIdentificador);
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth()+1; //hoy es 0!
    var yyyy = hoy.getFullYear();
    $("#labDescripcion").text(" Fecha: "+dd+"/"+mm+"/"+yyyy);
     $.ajax({
        data:{
            sCodigoWebPhp:sIdentificador, Mandato:'MisReservas'
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
                var html = '';
                if (respuesta!="SIN"){
                    var aTletas = JSON.parse(respuesta);
                    var ij=0;
                    $.each( aTletas, function( i, value ) {
                        html += '<tr id="fila'+ij+'"style="display: block !important;"><td style="width:20% !important;">'+value['hora']+'</td><td style="width:10% !important;">  </td><td style="width:50% !important;">    '+value['strGrado']+'</td><td style="width:20% !important;"><button  onclick="desactivar('+value['id']+','+sIdentificador+','+ij+')" class="btn-burbit"><span class="icon-undo"></span></button></td></tr>';
                        ij+=1;
                    });
                    html += '';
                }else{
                    html += '<tr style="display: block !important;"><td style="width:50px !important;"></td><td style="width:150px !important;">Sin Registros</td><td style="width:100px !important;"></td></tr>';
                }
                $('#tablafiliados').removeClass('ui-table ui-table-reflow');
                $('#afiliados').html(html);
                $('#afiliados').trigger('create');
                $("#labDescripcion").text(ij+" Activos");
            }
        },error:function(jqXHR, textStatus, errorThrown){
            ajax_error(jqXHR, textStatus, errorThrown,true);
        }
    });

    $("#volverInicio").click(function(){
        $.mobile.changePage("panel.html",{ transition : "fade" });

    });

    $("#btReservar").click(function(){
		
        var sIdReserva=document.formReservas.listaClases.value;
        //var sIdReserva=localStorage.getItem("idReserva");
		//$("#btReservar").disabled();			
        $.ajax({
            data:{
                sCodigoWebPhp:sIdentificador, sIdPhp:sIdReserva, Mandato:'QuitarReserva'
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
                alert(respuesta);
                $.mobile.changePage("panel.html",{ transition : "fade" });
            },error:function(jqXHR, textStatus, errorThrown){
                ajax_error(jqXHR, textStatus, errorThrown,true);
            }
        });
		
    });

    
});



