var userid = "";
$.ajax({
  url: "api_chat/public/getAllUsers",
  type: "GET",
  success: function(response) {
    userid = response.result;
  }
});

//FILTRAR USUARIO EN EL INPUT DONDE ESTÁ LA LISTA DE USUARIOS
function filtrar() {
  var input, filtro, ul, li, a, i;
  input = document.getElementById("myInput");
  filtro = input.value.toUpperCase();
  ul = document.getElementById("lista");
  li = ul.getElementsByTagName("li");

  //Recorremos la lista para solo mostrar al usuario que queremos
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    if (a.innerHTML.toUpperCase().indexOf(filtro) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

//EXPORTAR UNA CONVERSA Y VER MENSAJES
function openchat(id, iduser) {
  $.ajax({
    url: "api_chat/public/getChat/" + iduser + "/" + id,
    type: "GET",
    success: function(response) {
      var username = "";
      //Recorremos los usuarios de la lista
      for (var i = 0; i < userid.length; i++) {
        var aux = userid[i];
        //Comprovaos que la id de cada usuario sea la misma que la id aux (es la id que pasamaos cuando introducimos en nombre del usuario en el input)
        if (id == aux.id) {
          username = aux.name;
        }
      }
      $("#usuariochat").html("<h2>" + username + "</h2>");
      var chat2 = "";
      $.each(response.result, function(i, item) {
        //Id del usuario que envia el mensaje
        if (id == item.sender) {
          //Mostraremos sus mensajes en la partes izquierda
          chat2 += "<p class='left'>" + item.message + "</p>" + "<br>";
        } else {
          //Si son los mensajes del otros usuario, se mostrarán en la parte derecha
          chat2 += "<p class='right'>" + item.message + "</p>" + "<br>";
        }
      });
      $("#mensajes").html(chat2);
    }
  });
}

//ENVIAR MENSAJES
function enviarmensajes() {
  var aqui = document.getElementById('usuariochat').textContent;
  var idreceiver = "";
  //Recorremos la lista de usuario y comprovamos que las id coincidan cuando en la lista de filtros damos click al usuario que queremos empezar una conversación

  for (var i = 0; i < userid.length; i++) {
    var aux = userid[i];
    if (aqui == aux.name) {
      idreceiver = aux.id;
    }
  }

  var mensajes = document.getElementById("inputmensajes").value;
  var user = document.getElementById("user").textContent;
  var iduser = "";
  document.getElementById("inputmensajes").value = "";

  //Exportamos la ud de un usuario al que hemos introducido anteriomente en el input
  $.ajax({
    url: "api_chat/public/getId/" + user,
    type: "GET",
    error: function() {
      //Si hemos introducido en el input un campo en blanco o el nombre del usuario no existe dentro de BBDD
      alert("error");
    },
    success: function(response) {
      iduser = response.result;
    }
  }).done(function(result) {
    //Para enviar el mensaje
    $.ajax({
      url: "api_chat/public/sendMessage",
      type: "POST",
      data: {
        sender: iduser,
        receiver: idreceiver,
        message: mensajes,
      },
      error: function() {
        alert("error");

      },
      success: function(response) {

      }
    });
  });
  var chat2 = "";
  //A dar click al btn de enviar, el mensaje que hemos escrito en el input se mostrará en el apartamos del chat donde se ven todos los mensajes, del sender y del receiver
  chat2 += "<p style='color:black;' class='right'>" + mensajes + "</p>";
  chat2 += "<br>";
  $("#mensajes").append(chat2);
}

//LOGIN USUARIO
function cambiaruser() {
  var iduser = "";
  var username = document.getElementById("userinput").value;
  document.getElementById("userinput").value = "";
  document.getElementById("mensajes").textContent = "";
  document.getElementById("usuariochat").textContent = "";
  $("#user").html(username);

  //Exportamos la id del usuario introducida en el input
  $.ajax({
    url: "api_chat/public/getId/" + username,
    type: "GET",
    error: function() {
      alert("error");
    },
    success: function(response) {
      iduser = response.result;
    }
  }).done(function(result) {
    //Exportamos la lista de todos los usuarios de la bbdd
    $.ajax({
      url: "api_chat/public/getAllUsers",
      type: "GET",
      error: function() {
        alert("error");
      },
      success: function(response) {
        var nom = "";
        userid = response.result;
        $.each(response.result, function(i, item) {
          //Si el nombre el igual al de la bbdd nos mostrará la lista
          if (item.name == username) {} else {
            nom += "<li>";
            nom +=
              "<a id='" +
              item.id +
              "' onclick=openchat(" +
              item.id +
              "," +
              iduser +
              ")>" +
              item.name;
          }
        });
        $("#lista").html(nom);
      }
    }).done(function(result) {
      //Exportamos la lista de los ultimos mensajes de todas las conversación que hemos tenido en ese usuario en concreto
      $.ajax({
        url: "api_chat/public/getAllResumeChats/" + iduser,
        type: "GET",
        error: function() {
          alert("error");
        },
        success: function(response) {
          var chat = "";
          $.each(response.result, function(i, item) {
            //Que coincidan el sender y receiver
            if (item.receiver == iduser) {
              chat += "<li>";
              var us = "";
              for (var i = 0; i < userid.length; i++) {
                var aux = userid[i];
                if (item.sender == aux.id) {
                  us = aux.name;
                }
              }
              //Comprovamos que tenga mas de 10 caracteres el mensaje
              if (item.message.length > 10) {
                var res = item.message.substring(0, 10);
                res += "...";
                //Mostraremos el nombre del sender
                chat +=
                  "<a id='" +
                  item.sender +
                  "' onclick=openchat(" +
                  item.sender +
                  "," +
                  iduser +
                  ")>" +
                  "<b>" +
                  us +
                  "</b><br>" +
                  res;
              } else {
                chat +=
                  "<a id='" +
                  item.sender +
                  "' onclick=openchat(" +
                  item.sender +
                  "," +
                  iduser +
                  ")>" +
                  "<b>" +
                  us +
                  "</b><br>" +
                  item.message;
              }
            } else {
              chat += "<li>";
              var us = "";
              for (var i = 0; i < userid.length; i++) {
                var aux = userid[i];

                if (item.receiver == aux.id) {
                  us = aux.name;
                }
              }
              if (item.message.length > 10) {
                var res = item.message.substring(0, 10);
                res += "...";
                console.log(res);
                //Mostraremos los mensajes del receiver
                chat +=
                  "<a id='" +
                  item.receiver +
                  "' onclick=openchat(" +
                  item.receiver +
                  "," +
                  iduser +
                  ")>" +
                  "<b>" +
                  us +
                  "</b><br>" +
                  res;
              } else {
                chat +=
                  "<a id='" +
                  item.receiver +
                  "' onclick=openchat(" +
                  item.receiver +
                  "," +
                  iduser +
                  ")>" +
                  "<b>" +
                  us +
                  "</b><br>" +
                  item.message;
              }
            }
          });
          //Todos los mensajes
          $("#listamensajes").html(chat);
        }
      });
    });
  });
}
