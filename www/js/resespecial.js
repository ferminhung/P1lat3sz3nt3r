$(document).on("pageshow","#resespecial",function(event, ui){
    localStorage.setItem("pulsoreserva","-");
    var sIdentificador=localStorage.getItem("codigoweb");   //aSesion["CodigoWeb"];
    //var sNombre=aSesion["nombre"];
    $("#InfoReserva").html("<span class='icon-user'></span> Reserva para "+sIdentificador);
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth()+1; //hoy es 0!
    var yyyy = hoy.getFullYear();
    $("#labDescripcion").text(" Disponibles para "+dd+"/"+mm+"/"+yyyy);
    $.ajax({
        data:{
            sCodigoWebPhp:sIdentificador, Mandato:'VerReservaEspecial'
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
                var aAreas = JSON.parse(respuesta);
                $.each( aAreas, function( i, value ) { 
                    $("#listaClases").append('<option value="'+value['id']+'" ">HOT #'+value['id']+'</option>');
                })
            }
        },error:function(jqXHR, textStatus, errorThrown){
            ajax_error(jqXHR, textStatus, errorThrown,true);
        }
    });

    $.ajax({
        data:{
            sCodigoWebPhp:sIdentificador, Mandato:'ListaEspecial'
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
            if(respuesta!="SIN"){
                var aReserva = JSON.parse(respuesta);
                var sReserva="SIN";
                var sClase="0";
                var idReserva="0";
                $("#listaHoras").html('<option value="SIN">Selecciona el dia</option>');
                $.each( aReserva, function( i, value ) { 
                    $("#listaHoras").append('<option value="'+(value['hora'])+'">'+value['strGrado']+' ('+value['hora']+') </option>');
                })
            }else{
                $("#listaHoras").html('<option value="SIN">Sin Horarios Dsponibles</option>');
            }
        },error:function(jqXHR, textStatus, errorThrown){
            ajax_error(jqXHR, textStatus, errorThrown,true);
        }
    });

    $("#volverInicio").click(function(){
        $.mobile.changePage("panel.html",{ transition : "fade" });
    });

    $("#btReservar").click(function(){
        var sReserva=document.formReservas.listaClases.value;
        var sEvento=document.formReservas.listaHoras.value;
        $.ajax({
            data:{
                sCodigoWebPhp:sIdentificador, sReservaPhp:sReserva, sIDEventoPhp:sEvento, Mandato:'ReservaEspecial'
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
            },error:function(jqXHR, textStatus, errorThrown){
                ajax_error(jqXHR, textStatus, errorThrown,true);
            }
        });
    });

    $("#listaHoras").change(function(){
        var sEvento=document.formReservas.listaHoras.value;
        $.ajax({
            data:{
                sCodigoWebPhp:sIdentificador, sIDEventoPhp:sEvento, Mandato:'CupoEspecial'
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
                $("#cupos").text(respuesta);
            },error:function(jqXHR, textStatus, errorThrown){
                ajax_error(jqXHR, textStatus, errorThrown,true);
            }
        });
    });
});