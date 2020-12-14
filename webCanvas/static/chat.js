$(function () {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var r = url.searchParams.get("roomName");
    var u = url.searchParams.get("userName");

    socket.emit("client_to_server_join", r, u);

    $('form').submit(function(e){
      e.preventDefault(); // prevents page reloading
      socket.emit("client_to_server", u, $('#m').val());
      $('#m').val('');
      return false;
    });
    
    socket.on('server_to_client', function(user,msg){
      $('#messages').prepend($('<li>').text(user+':'+msg));
    });

    socket.on('player update',function(members){
      $('#players').empty();
      members.forEach(m => {
        $('#players').prepend($('<li>').text(m));
      });

    });
});