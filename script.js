var usersid = "";
$.ajax({
  url:"api_chat/public/getAllUsers",
  type:"GET",
  success: function(response){
       usersid = response.result;
  }
});
function filtrar() {
    var input, filter, ul, li, a, i;
    input = $("#myInput");
    filter = input.val().toUpperCase();
    $("#myUl").each(function(){
      li = $(this).find("li");
    });
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";

        }
    }
}
