var usersid = "";
$.ajax({
  url:"api_chat/public/getAllUsers",
  type:"GET",
  success: function(response){
       usersid = response.result;
  }
});
