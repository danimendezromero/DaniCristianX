var usersid = "";
$.ajax({
  url: "api_chat/public/getAllUsers",
  type: "GET",
  success: function(response) {
    usersid = response.result;
  }
});

function filtrar() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  ul = document.getElementById("myUL");
  li = ul.getElementsByTagName("li");

  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
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
      for (var i = 0; i < usersid.length; i++) {
        var aux = usersid[i];
        if (id == aux.id) {
          username = aux.name;
        }
      }
      $("#receivername").html("<h2 id='h'>" + username + "</h2>");
      var chat2 = "";
      $.each(response.result, function(i, item) {
        if (id == item.sender) {
          chat2 += "<p class='text-left'>" + item.message + "</p>";
        } else {
          chat2 += "<p class='text-right'>" + item.message + "</p>";
        }
      });
      $("#msg").html(chat2);
    }
  });
}
function enviarmsg() {
  var reveivername = $("#h").text();
  console.log(receivername);
  var idreceiver = "";
  for (var i = 0; i < usersid.length; i++) {
    var aux = usersid[i];
    console.log(aux.name);
    console.log(receivername);
    if (receivername == aux.name) {
      idreceiver = aux.id;
    }
  }
  var msg = document.getElementById("inputmsg").value;
  var user = document.getElementById("user").textContent;
  var iduser = "";
  document.getElementById("inputmsg").value = "";
  $.ajax({
    url: "api_chat/public/getId/" + user,
    type: "GET",
    error: function() {
      alert("Hi ha agut un Error");
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
        message: msg
      },
      error: function() {
        alert("funciona");
        console.log(iduser);
        console.log(idreceiver);
        console.log(msg);
      },
      success: function(response) {
        console.log(response);
        console.log(iduser);
        console.log(idreceiver);
        console.log(msg);
      }
    });
  });
  var chat2 = "";
  chat2 += "<p style='color:black;' class='right'>" + msg + "</p>";
  chat2 += "<br>";
  $("#msg").append(chat2);
}

function cambiaruser() {
  var iduser = "";
  var username = document.getElementById("userinput").value;
  document.getElementById("userinput").value = "";
  document.getElementById("msg").textContent = "";
  document.getElementById("receivername").textContent = "";
  $("#user").html(username);

  $.ajax({
    url: "api_chat/public/getId/" + username,
    type: "GET",
    error: function() {
      alert("Hi ha agut un Error");
    },
    success: function(response) {
      iduser = response.result;
    }
  }).done(function(result) {
    $.ajax({
      url: "api_chat/public/getAllUsers",
      type: "GET",
      error: function() {
        alert("Hi ha agut un Error");
      },
      success: function(response) {
        var nom = "";
        usersid = response.result;
        $.each(response.result, function(i, item) {
          if (item.name == username) {
          } else {
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
        $("#myUL").html(nom);
      }
    }).done(function(result) {
      $.ajax({
        url: "api_chat/public/getAllResumeChats/" + iduser,
        type: "GET",
        error: function() {
          alert("Hi ha agut un Error");
        },
        success: function(response) {
          var chat = "";
          $.each(response.result, function(i, item) {
            if (item.receiver == iduser) {
              chat += "<li>";
              var temuser = "";
              for (var i = 0; i < usersid.length; i++) {
                var aux = usersid[i];
                if (item.sender == aux.id) {
                  temuser = aux.name;
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
                  temuser +
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
                  temuser +
                  "</b><br>" +
                  item.message;
              }
            } else {
              chat += "<li>";
              var temuser = "";
              for (var i = 0; i < usersid.length; i++) {
                var aux = usersid[i];

                if (item.receiver == aux.id) {
                  temuser = aux.name;
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
                  temuser +
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
                  temuser +
                  "</b><br>" +
                  item.message;
              }
            }
          });
          $("#myUL2").html(chat);
        }
      });
    });
  });
}
