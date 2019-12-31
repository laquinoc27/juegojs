var MAXIMO_IMAGENES = 4;
var id_drag;
var id_drop;
var i = 0;
//$(function(){
$(document).ready(function() {
  var tituloJuego = 'h1';
  amarillo(tituloJuego);

  $('button').click(function(){
    var btnIniciar = $('button').text()
    if(btnIniciar == 'Iniciar'){
      var rutaImagen;
      temporizador();
      $('button').text('Reiniciar');
      cargarCaramelos ('.col-1');
      cargarCaramelos ('.col-2');
      cargarCaramelos ('.col-3');
      cargarCaramelos ('.col-4');
      cargarCaramelos ('.col-5');
      cargarCaramelos ('.col-6');
      cargarCaramelos ('.col-7');

      //Evento click y drag sobre las imágenes
      $(".elemento")
        .draggable({
          start: function(){
            $(this).off("click").css("z-index","2");
          },
          drag: function (event, ui) {
            posXinicial= ui.position.left * -1;
            posYinicial= ui.position.top * -1;
          }

        })

      $(".elemento")
        .droppable({
          drop: function( evento, ui ) {
            $(this).css("left",posXinicial);
            $(this).css("top",posYinicial);
            $(this).attr("id",id_drag);
            id_drag = ui.draggable.attr("id");
            id_drop = $(this).attr('id');
            $(this).attr('id',id_drag)
            ui.draggable.attr("id",id_drop);
            console.log('Drag: ' + id_drag);
            console.log('Drop: ' + id_drop);
            i = i + 1;
            $('#movimientos-text').text(i)
          }
        });

    } else {
      location.reload();
    }
  })


});

function asignarId(nuevoId){

}

function cargarCaramelos (elemento) {
  for (var c = 1; c < 8; c++) {
     //var j = Math.random() * 4 + 1
     //var x = Math.trunc(j);
     x = azar() + 1;
     var idImagen = 'c'+elemento.substring(5,6) + '-f' + c.toString() + '-i' + x.toString()
     rutaImagen = '<img src="image/' + x + '.png" class="elemento" id="' + idImagen + '"/>'
     $(elemento).append(rutaImagen);
  }
}

// funciones varias para el juego
function azar(){
  return Math.floor(Math.random()*MAXIMO_IMAGENES);
}

function blanco(elemento){
  $(elemento).animate(
    {
      'color': "white"
    }, 500, function(){
      amarillo(elemento)
    }
  )
}

function amarillo(elemento){
  $(elemento).animate(
    {
      'color': "yellow"
    }, 500, function(){
      blanco(elemento)
    }
  )
}

function temporizador() {
  var timer = new Timer({
      tick : 1,
      ontick : function (sec) {
          //console.log('interval', sec);
          var seg = Math.trunc(sec/1000)
          var i
          if(seg >= 60) {
              i = seg - 59
              $('#timer').text('1:'+i);
          } else {
            $('#timer').text('0:'+seg);
          }

      },
      onstart : function() {
          console.log('timer started');
      }
  });

  // defining options using on
  timer.on('end', function () {
      //console.log('timer ended');
      //this.start(4).off('end');
      alert('Finalizó el juego');
      $('#timer').text('02:00');
      $('button').text('Iniciar');
      removerTablero ();
  });

  //start timer for 2 minutos
  timer.start(120);
}

//Evento para remover tablero (-)
function removerTablero () {
  $(".panel-tablero").remove();
}
