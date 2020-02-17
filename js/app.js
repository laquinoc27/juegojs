/* 
 * Autor: Luis Enrique Aquino Castillo.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// Declaración de variables
    var MAXIMO_IMAGENES = 4;
    var id_drag;
    var id_drop;
    var i = 0;
    // arreglo con imagenes para cada tipo de dulce
    var tipoDulce=[];
        tipoDulce[0]="image/1.png";
        tipoDulce[1]="image/2.png";
        tipoDulce[2]="image/3.png";
        tipoDulce[3]="image/4.png";  
    var rows = 7; 
    var cols = 7; 
    var grid = []; 
    var validFigures=0;
    var score = 0;
    var moves = 0;

    var prevCell = null;
    var figureLen = 0;
    var figureStart = null;
    var figureStop = null;

//$(function(){
$(document).ready(function() {
  var tituloJuego = 'h1';
  amarillo(tituloJuego);

  $('button').click(function(){
    var btnIniciar = $('button').text();
    if(btnIniciar == 'Iniciar'){
      //var rutaImagen;
      temporizador();
      $('button').text('Reiniciar');
      score= 0 ;
      moves= 0 ;
      $("#score-text").html("0");
      $("#movimientos-text").html("0");
      cargarDulces();
      reponerDulces();

    } else {
      location.reload();
    }
  });


});

//Evento click y drag sobre las imágenes
  // cuando se hace click sobre un dulce
  function _ondragstart(a)
  {
    a.dataTransfer.setData("text/plain", a.target.id);
  }

   // cuando se mueve una dulce por encima de otra sin soltarla 
  function _onDragOverEnabled(e)
  {
    e.preventDefault();
    console.log("pasando sobre caramelo " + e.target.id);
  }

    // cuando soltas una dulce sobre otra
  function _onDrop(e)
  {
    // solo para firefox
    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      if (isFirefox) {
        console.log("firefox compatibility");
        e.preventDefault();
      }

     // obtener origen del dulce
     var src = e.dataTransfer.getData("text");
     var sr = src.split("_")[1];
     var sc = src.split("_")[2];

     // obtener destino del dulce
     var dst = e.target.id;
     var dr = dst.split("_")[1];
     var dc = dst.split("_")[2];

     // si la distancia es mayor a 1, no permitir el movimiento y alertar
     var ddx = Math.abs(parseInt(sr)-parseInt(dr));
     var ddy = Math.abs(parseInt(sc)-parseInt(dc));
     /*
     if(figureLen<3){
       alert("No genera combinación válida");
       return;
     }
     */
     if (ddx > 1 || ddy > 1)
     {
       alert("Los movimientos no pueden tener una distancia mayor a 1");
       return;
     }
     else{
        console.log("intercambio " + sr + "," + sc+ " to " + dr + "," + dc);
        // intercambio de dulces
        var tmp = grid[sr][sc].src;
        grid[sr][sc].src = grid[dr][dc].src;
        grid[sr][sc].o.attr("src",grid[sr][sc].src);
        grid[dr][dc].src = tmp;
        grid[dr][dc].o.attr("src",grid[dr][dc].src);

        // sumar un movimiento
        moves+=1;
        $("#movimientos-text").html(moves);

        //buscar coincidencias
        buscarCoincidencias(); 

     }
  }

// Evento para cargar los caramelos al tablero de dulces
function cargarDulces() {
    // inicio carga de caramelo en tablero
    function dulce(r,c,obj,src) {
      return {
      r: r, 
      c: c, 
      src:src, 
      locked:false, 
      isInCombo:false, 
      o:obj 
      };
    }

    // preparando el tablero
    for (var r = 0; r < rows; r++) {
     grid[r]=[];
     for (var c =0; c< cols; c++) {
        grid[r][c]= new dulce(r,c,null,azarDulce());
     }
    }

    // Coordenadas iniciales:
    //var width = $('.panel-tablero').width();
    var height = $('.panel-tablero').height(); 
    //var cellWidth = width / 7;
    var cellHeight = height / 7;
    //var marginWidth = cellWidth/7;
    //var marginHeight = cellHeight/7;

    // creando imagenes en el tablero
    for (var r = 0; r < rows; r++) {
      for (var c =0; c< cols; c++) {
        var cell = $("<img class='dulce' id='dulce_"+r+"_"+c+"' r='"+r+"' c='"+c+
          "'ondrop='_onDrop(event)' ondragover='_onDragOverEnabled(event)'src='"+
          grid[r][c].src+"' style='height:"+cellHeight+"px'/>");
        cell.attr("ondragstart","_ondragstart(event)");
        $(".col-"+(c+1)).append(cell);
        grid[r][c].o = cell;
      }
    }

    //reponerDulces();

}

// funciones generales para el juego
function azarDulce(){
  var NroDulce = Math.floor(Math.random()*MAXIMO_IMAGENES);
  return tipoDulce[NroDulce];
}

function blanco(elemento){
  $(elemento).animate(
    {
      'color': "white"
    }, 500, function(){
      amarillo(elemento);
    }
  );
}

function amarillo(elemento){
  $(elemento).animate(
    {
      'color': "yellow"
    }, 500, function(){
      blanco(elemento);
    }
  );
}

function temporizador() {
  var timer = new Timer({
      tick : 1,
      ontick : function (sec) {
          //console.log('interval', sec);
          var seg = Math.trunc(sec/1000);
          var i;
          if(seg >= 60) {
              i = seg - 59;
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
      //alert('Finalizó el juego');
      $('#timer').text('02:00');
      //$('#timer').text('00:10');
      $('button').text('Reiniciar');
      $('.panel-score').css("width","100%");
      removerTablero ();
  });

  //start timer for 2 minutos
  timer.start(120);
  //timer.start(10);
}

//Evento para remover tablero (-)
function removerTablero () {
  $(".panel-tablero").remove();
}

//Evento para reponer dulces
function reponerDulces() {
    // mover celdas vacias hacia arriba
   for (var r=0;r<rows;r++)
   {           
    for (var c=0;c<cols;c++)
    {  
      if (grid[r][c].isInCombo)  // celda vacia
      {
        grid[r][c].o.attr("src","");
          // deshabilitar celda de la combinacion               
        grid[r][c].isInCombo=false;

        for (var sr=r;sr>=0;sr--)
        {
          if (sr==0) break; 
          if (grid[sr-1][c].locked) break;       
          var tmp = grid[sr][c].src;
          grid[sr][c].src=grid[sr-1][c].src;
          grid[sr-1][c].src=tmp;
        }
      } 
    }  
  }   

    // reordenando y reponiendo celdas
    for (var r=0;r<rows;r++)
    { for (var c = 0;c<cols;c++)
      {
        grid[r][c].o.attr("src",grid[r][c].src);
        grid[r][c].o.css("opacity","1"); // ojo animación
        grid[r][c].isInCombo=false;
        if (grid[r][c].src==null) 
          grid[r][c].respawn=true;
        if (grid[r][c].respawn==true)
        {  
          grid[r][c].o.off("ondragover");
          grid[r][c].o.off("ondrop");
          grid[r][c].o.off("ondragstart"); 
          grid[r][c].respawn=false; // repuesto!
          console.log("Reponiendo fila " + r+ " , columna " + c);
          grid[r][c].src=azarDulce();
          grid[r][c].locked=false;
          grid[r][c].o.attr("src",grid[r][c].src);
          grid[r][c].o.attr("ondragstart","_ondragstart(event)");
          grid[r][c].o.attr("ondrop","_onDrop(event)");
          grid[r][c].o.attr("ondragover","_onDragOverEnabled(event)");
        }
      }
    }
    console.log("dulces repuestos");
    // revisar si hay combinaciones pendientes despues de reordenar
    buscarCoincidencias();
} 

// Buscar coincidencias horizontales y verticales para eliminarlas
function buscarCoincidencias()
{    
 // busqueda horizontal
  for (var r = 0; r < rows; r++)
  {
    /*
    var prevCell = null;
    var figureLen = 0;
    var figureStart = null;
    var figureStop = null;
    */
    prevCell = null;
    figureLen = 0;
    figureStart = null;
    figureStop = null;
   
    for (var c=0; c< cols; c++)
    {

      // saltear dulces que estan en combinacion.    
      if (grid[r][c].locked || grid[r][c].isInCombo)
      {
        figureStart = null;
        figureStop = null;
        prevCell = null;  
        figureLen = 1;
        continue;
      }

      // primer objeto de la combinacion
      if (prevCell==null) 
      {
        prevCell = grid[r][c].src;
        figureStart = c;
        figureLen = 1;
        figureStop = null;
        continue;
      }
      else
      {
        // segundo o posterior objeto de la combinacion
        var curCell = grid[r][c].src;
        if (!(prevCell==curCell))
        {
          prevCell = grid[r][c].src;
          figureStart = c;
          figureStop=null;
          figureLen = 1;
          continue;
        }
        else
        {
          // incrementar combinacion
          figureLen+=1;
          if (figureLen==3)
          {
            validFigures+=1;
            score+=1;
            $("#score-text").html(score);
            figureStop = c;
            console.log("Combo de columna " + figureStart + " a columna " + figureStop);
            for (var ci=figureStart;ci<=figureStop;ci++)
            {
              grid[r][ci].isInCombo=true;
              grid[r][ci].src=null;                     
            }
            prevCell=null;
            figureStart = null;
            figureStop = null;
            figureLen = 1;
            continue;
          }
        }
      }

    }
  }

 // busqueda vertical

  for (var c=0; c< cols; c++)
  { 
      /*
    var prevCell = null;
    var figureLen = 0;
    var figureStart = null;
    var figureStop = null;
    */
   prevCell = null;
   figureLen = 0;
   figureStart = null;
   figureStop = null;
   
    for (var r = 0; r < rows; r++)
    {

      if (grid[r][c].locked || grid[r][c].isInCombo)
      {
        figureStart = null;
        figureStop = null;
        prevCell = null;  
        figureLen = 1;
        continue;
      }

      if (prevCell==null) 
      {
        prevCell = grid[r][c].src;
        figureStart = r;
        figureLen = 1;
        figureStop = null;
        continue;
      }
      else
      {
        var curCell = grid[r][c].src;
        if (!(prevCell==curCell))
        {
          prevCell = grid[r][c].src;
          figureStart = r;
          figureStop=null;
          figureLen = 1;
          continue;
        }
        else
        {
          figureLen+=1;
          if (figureLen==3)
          {
            validFigures+=1;
            score+=1;
            $("#score-text").html(score);
            figureStop = r;
            console.log("Combo de fila " + figureStart + " a fila " + figureStop );
            for (var ci=figureStart;ci<=figureStop;ci++)
            {

              grid[ci][c].isInCombo=true;
              grid[ci][c].src=null;         
            }
            prevCell=null;
            figureStart = null;
            figureStop = null;
            figureLen = 1;
            continue;
          }
        }
      }

    }
  }

  // destruir combinaciones

   var isCombo=false;
   for (var r = 0;r<rows;r++)
    for (var c=0;c<cols;c++)
      if (grid[r][c].isInCombo)
      { 
        console.log("Combinación disponible");
        isCombo=true; 
        // ANIMACIÓN PARA DESAPARECER
        reponerDulces()
      }

  if (isCombo)  // Acá no entra nunca, el metodo lo termina llamando al final del reponer
    desaparecerCombos();
  else 
    console.log("No más combinaciones automáticas");

}
    
//desaparecer dulces borrados
function desaparecerCombos()
{
   for (var r=0;r<rows;r++)  { 
    for (var c=0;c<cols;c++){
      if (grid[r][c].isInCombo)  // celda vacia
      {
        grid[r][c].o.animate({
          opacity:0
        },slow);
      } 
    }   
  } 
}
