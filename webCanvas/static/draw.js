'use strict';

(function() {

    var canvas = document.getElementsByClassName('whiteboard')[0];
    var colors = document.getElementsByClassName('color');
    var context = canvas.getContext('2d');
  
    var current = {
      color: 'black'
    };
    var drawing = false;
  
    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mouseout', onMouseUp, false);
    canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);
    
    //Touch support for mobile devices
    canvas.addEventListener('touchstart', onMouseDown, false);
    canvas.addEventListener('touchend', onMouseUp, false);
    canvas.addEventListener('touchcancel', onMouseUp, false);
    canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);
  
    for (var i = 0; i < colors.length; i++){
      colors[i].addEventListener('click', onColorUpdate, false);
    }

    var url_string = window.location.href;
    var url = new URL(url_string);
    var r = url.searchParams.get("roomName");
  
    socket.on('drawing', onDrawingEvent);
    var startX,startY,x,y;
  

  
  
    function drawLine(x0, y0, x1, y1, color, emit){
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = color;
      context.lineWidth = 2;
      context.stroke();
      context.closePath();
  
      if (!emit) { return; }
  
      socket.emit('drawing', {
        x0: x0,
        y0: y0,
        x1: x1,
        y1: y1,
        color: color
      });
    }
  
    function onMouseDown(e){
      drawing = true;
      startX = e.pageX - $('canvas').offset().left;
      startY = e.pageY - $('canvas').offset().top;
      current.x = e.clientX||e.touches[0].clientX;
      current.y = e.clientY||e.touches[0].clientY;
    }
  
    function onMouseUp(e){
      if (!drawing) { return; }
      drawing = false;
      drawLine(startX, startY, e.pageX - $('canvas').offset().left , e.pageY - $('canvas').offset().top , current.color, true);
      //drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true);
    }
  
    function onMouseMove(e){
      if (!drawing) { return; }
      drawLine(startX, startY, e.pageX - $('canvas').offset().left , e.pageY - $('canvas').offset().top , current.color, true);
      //drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true);
      current.x = e.clientX||e.touches[0].clientX;
      current.y = e.clientY||e.touches[0].clientY;
      startX = e.pageX - $('canvas').offset().left;
      startY = e.pageY - $('canvas').offset().top;

    }
  
    function onColorUpdate(e){
      current.color = e.target.className.split(' ')[1];
    }
  
    // limit the number of events per second
    function throttle(callback, delay) {
      var previousCall = new Date().getTime();
      return function() {
        var time = new Date().getTime();
  
        if ((time - previousCall) >= delay) {
          previousCall = time;
          callback.apply(null, arguments);
        }
      };
    }
  
    function onDrawingEvent(data){
      drawLine(data.x0, data.y0, data.x1, data.y1, data.color);
    }
  

  
  })();