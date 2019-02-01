function desactivar(id, sIdentificador, i){
    var desactivarYa=confirm("Estas segura que quieres desactivar la clase ");
    if(desactivarYa){
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
    if(dd < 10){
        dd='0'+dd;
    }
    if(mm < 10){
      fechahoy=dd+'-0'+mm+'-'+yyyy;
    }else{
      fechahoy=dd+'-'+mm+'-'+yyyy;
    }
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
                    var aStalk = JSON.parse(respuesta);
                    var aTletas=JSON.parse(aStalk[0].listaReservas);
                    var totales=JSON.parse(aStalk[0].totales);  
                    var finalizadas=JSON.parse(aStalk[0].finalizadas);
                    var programadas=JSON.parse(aStalk[0].programadas);
                    var porreservar=0;
                    porreservar=parseInt(JSON.parse(aStalk[0].porreservar));
                    var plan=aStalk[0].plan;
                    $('#plan').text("Plan: "+plan);
                    $('#clasesTot').text("Cantidad Total de Clases: "+parseInt(totales+porreservar));
                    $('#clasesFin').text("Cantidad de Clases vistas: "+finalizadas);
                    $('#clasesPro').text("Cantidad de Clases programadas: "+programadas);
                    if (porreservar>0){
                        $('#clasesRec').text("");
                        $('#butonrecuperar').html('<button  id="recuperar" class="btn-burbit"><span class="icon-checkmark"></span></span> Clases por Recuperar: '+porreservar+'</button>');
                    }else{
                        $('#clasesRec').text("No hay Clases por Recuperar");
                    }
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
                            html += '<tr id="fila'+ij+'"style="display: block !important;"><td style="width:20% !important;">'+fecha[2]+' / '+fecha[1]+'</td><td style="width:10% !important;">  </td><td style="width:50% !important;">    '+value['strGrado']+'</td><td style="width:20% !important;"><button  onclick="desactivar('+value['id']+','+sIdentificador+','+ij+')" class="btn-burbit"><span class="icon-undo"></span></button></td></tr>';
                        }else{
                            if (value['Horario']>horatope){
                                html += '<tr id="fila'+ij+'"style="display: block !important;"><td style="width:20% !important;">'+fecha[2]+' / '+fecha[1]+'</td><td style="width:10% !important;">  </td><td style="width:50% !important;">    '+value['strGrado']+'</td><td style="width:20% !important;"><button  onclick="desactivar('+value['id']+','+sIdentificador+','+ij+')" class="btn-burbit"><span class="icon-undo"></span></button></td></tr>';
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
                $("#labDescripcion").text(ij+" Activos");
                if(finhoratope>0){
                    $('#clasesFin').text("Cantidad de Clases vistas: "+(parseInt(finalizadas)+parseInt(finhoratope)));
                    $('#clasesPro').text("Cantidad de Clases programadas: "+(parseInt(programadas)-parseInt(finhoratope)));
                }
            }
        },error:function(jqXHR, textStatus, errorThrown){
            ajax_error(jqXHR, textStatus, errorThrown,true);
        }
    });

    $("#volverInicio").click(function(){
        $.mobile.changePage("panel.html",{ transition : "fade" });

    });

    $("#butonrecuperar").click(function(){
        $.mobile.changePage("reselect.html",{ transition : "fade" });

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



