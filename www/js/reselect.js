$(document).on("pageshow","#reselect",function(event, ui){
    localStorage.setItem("pulsoreserva","-");
    var sIdentificador=localStorage.getItem("codigoweb");   //aSesion["CodigoWeb"];
    //var sNombre=aSesion["nombre"];
    $("#InfoReserva").html("<span class='icon-user'></span> Reserva para "+sIdentificador);
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth()+1; //hoy es 0!
    var yyyy = hoy.getFullYear();
    $("#labDescripcion").text(" Fecha del dia, "+dd+"/"+mm+"/"+yyyy);
    $.ajax({
        data:{
            sCodigoWebPhp:sIdentificador, Mandato:'VerxRecuperar'
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
                $.each( aReserva, function( i, value ) { 
                    $("#listaRecu").append('<option value="'+value['id']+'" ">'+value['strGrado']+'</option>');
                })
            }
        },error:function(jqXHR, textStatus, errorThrown){
            ajax_error(jqXHR, textStatus, errorThrown,true);
        }
    });
    $.ajax({
        data:{
            sCodigoWebPhp:sIdentificador, Mandato:'VerDias'
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
                $.each( aReserva, function( i, value ) { 
                    $("#listaClases").append('<option value="'+value['valor']+'" ">'+value['descrip']+'</option>');
                })
            }
        },error:function(jqXHR, textStatus, errorThrown){
            ajax_error(jqXHR, textStatus, errorThrown,true);
        }
    });
    


    $("#volverInicio").click(function(){
        $.mobile.changePage("reserva.html",{ transition : "fade" });

    });

    $("#btRecuperar").click(function(){
		
        var sEvento=document.formReservas.listaClases.value;
        var sRec=document.formReservas.listaRecu.value;
        var sHora=document.formReservas.listaHoras.value;
        if(sHora!='SIN'){
            localStorage.setItem("pulsoreserva","enviando");
            $.ajax({
                data:{
                    sCodigoWebPhp:sIdentificador, sIDEventoPhp:sEvento, sHoraPhp:sHora, sRecPhp:sRec, Mandato:'Recuperar'
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
                    if(respuesta!="FULL"){
                        alert(respuesta);
                        $.mobile.changePage("panel.html",{ transition : "fade" });
                    }
                },error:function(jqXHR, textStatus, errorThrown){
                    ajax_error(jqXHR, textStatus, errorThrown,true);
                }
            });
        }
		
    });

    $("#listaClases").change(function(){
        var sEvento=document.formReservas.listaClases.value;
        $.ajax({
            data:{
                sCodigoWebPhp:sIdentificador, sIDEventoPhp:sEvento, Mandato:'TotalCupos'
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
                    $("#listaHoras").html('<option value="SIN">Selecciona la Hora</option>');
                    $.each( aReserva, function( i, value ) { 
                        $("#listaHoras").append('<option value="'+(value['id'])+'">'+value['strGrado']+' '+parseInt(5-parseInt(value['Total']))+' cupos </option>');
                    })
                }else{
                    $("#listaHoras").html('<option value="SIN">Sin Horarios Dsponibles</option>');
                }
            },error:function(jqXHR, textStatus, errorThrown){
                ajax_error(jqXHR, textStatus, errorThrown,true);
            }
        });
    });
});