$(document).on("pageshow","#resespecial",function(event, ui){
    localStorage.setItem("pulsoreserva","-");
    var sIdentificador=localStorage.getItem("codigoweb");   //aSesion["CodigoWeb"];
    //var sNombre=aSesion["nombre"];
    $("#InfoReserva").html("<span class='icon-user'></span> Reserva para "+sIdentificador);
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth()+1; //hoy es 0!
    var yyyy = hoy.getFullYear();
    if(mm < 10){
      fechahoy=dd+'-0'+mm+'-'+yyyy;
    }else{
      fechahoy=dd+'-'+mm+'-'+yyyy;
    }
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
            if(respuesta!="SIN"){
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
                    $("#listaHoras").append('<option value="'+(value['hora'])+'">'+value['strGrado']+' ('+value['Dia']+') </option>');
                })
            }else{
                $("#listaHoras").html('<option value="SIN">Sin Horarios Dsponibles</option>');
            }
        },error:function(jqXHR, textStatus, errorThrown){
            ajax_error(jqXHR, textStatus, errorThrown,true);
        }
    });

    $.ajax({
        data:{
            sCodigoWebPhp:sIdentificador, Mandato:'MisReservasEsp'
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
            var html = '';
            if (respuesta!="SIN"){
                var aTletas=JSON.parse(respuesta);
                var ij=0;
                var fecha = new Date();
                var fechaphp = new Date();
                var tiempo=new Date();
                var hora=tiempo.getHours();
                var horatope=(hora*100)+400;
                var finhoratope=0;
                $.each( aTletas, function( i, value ) {
                    fecha=value['hora'];
                    fecha=fecha.split("-");
                    fechaphp=fecha[2]+'-'+fecha[1]+'-'+fecha[0];
                    if(fechaphp!=fechahoy){
                        html += '<tr id="fila'+ij+'"style="display: block !important;"><td style="width:20% !important;">'+fecha[2]+' / '+fecha[1]+'</td><td style="width:10% !important;">  </td><td style="width:50% !important;">    '+value['strGrado']+'</td><td style="width:20% !important;"></td></tr>';
                    }else{
                        if (value['Horario']>horatope){
                            html += '<tr id="fila'+ij+'"style="display: block !important;"><td style="width:20% !important;">'+fecha[2]+' / '+fecha[1]+'</td><td style="width:10% !important;">  </td><td style="width:50% !important;">    '+value['strGrado']+'</td><td style="width:20% !important;"></td></tr>';
                        }else{
                            finhoratope++;
                        }
                    }
                    ij+=1;
                });
                html += '';
            }else{
                html += '<tr style="display: block !important;"><td style="width:50px !important;"></td><td style="width:150px !important;">Sin Registros</td><td style="width:100px !important;"></td></tr>';
            }
            $('#tablafiliados').removeClass('ui-table ui-table-reflow');
            $('#afiliados').html(html);
            $('#afiliados').trigger('create');
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
        if(sReserva!="SIN" && sEvento!="SIN"){
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
                    $.mobile.changePage("panel.html",{ transition : "fade" });
                },error:function(jqXHR, textStatus, errorThrown){
                    ajax_error(jqXHR, textStatus, errorThrown,true);
                }
            });
        }else{
            alert("No es posible hacer la reserva");
        }
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