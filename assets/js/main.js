var userid = "";
$.ajax({
  url: "api_chat/public/getAllUsers",
  type: "GET",
  success: function(response) {
    userid = response.result;
  }
});

function filtrar() {
  var input, filtro, ul, li, a, i;
  input = document.getElementById("myInput");
  filtro = input.value.toUpperCase();
  ul = document.getElementById("lista");
  li = ul.getElementsByTagName("li");

  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    if (a.innerHTML.toUpperCase().indexOf(filtro) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

function openchat(id, iduser) {
  $.ajax({
    url: "api_chat/public/getChat/" + iduser + "/" + id,
    type: "GET",
    success: function(response) {
      var username = "";
      for (var i = 0; i < userid.length; i++) {
        var aux = userid[i];
        if (id == aux.id) {
          username = aux.name;
        }
      }
      $("#usuariochat").html("<h2>" + username + "</h2>");
      var chat2 = "";
      $.each(response.result, function(i, item) {
        if (id == item.sender) {
          chat2 += "<p class='left'>" + item.message + "</p>" + "<br>";
        } else {
          chat2 += "<p class='right'>" + item.message + "</p>" + "<br>";
        }
      });
      $("#mensajes").html(chat2);
    }
  });
}

function enviarmensajes() {
  var aqui = document.getElementById('usuariochat').textContent;

  var idreceiver = "";
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

  $.ajax({
    url: "api_chat/public/getId/" + user,
    type: "GET",
    error: function() {
      alert("error");
    },
    success: function(response) {
      iduser = response.result;
    }
  }).done(function(result) {
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
  chat2 += "<p style='color:black;' class='right'>" + mensajes + "</p>";
  chat2 += "<br>";
  $("#mensajes").append(chat2);
}

function cambiaruser() {
  var iduser = "";
  var username = document.getElementById("userinput").value;
  document.getElementById("userinput").value = "";
  document.getElementById("mensajes").textContent = "";
  document.getElementById("usuariochat").textContent = "";
  $("#user").html(username);

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
      $.ajax({
        url: "api_chat/public/getAllResumeChats/" + iduser,
        type: "GET",
        error: function() {
          alert("error");
        },
        success: function(response) {
          var chat = "";
          $.each(response.result, function(i, item) {
            if (item.receiver == iduser) {
              chat += "<li>";
              var us = "";
              for (var i = 0; i < userid.length; i++) {
                var aux = userid[i];
                if (item.sender == aux.id) {
                  us = aux.name;
                }
              }

              if (item.message.length > 10) {
                var res = item.message.substring(0, 10);
                res += "...";

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
          $("#listamensajes").html(chat);
        }
      });
    });
  });
}
