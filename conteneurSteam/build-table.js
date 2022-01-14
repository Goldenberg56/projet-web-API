
function getId(pseudo){

  $.ajax({
       type: "GET", //rest Type
       dataType: "json", //mispelled
       url: "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=E6D5FC96D3120B016CA30AB04137D487&vanityurl="+pseudo,
       contentType: "application/json; charset=utf-8",
       async: false,
       success: function (dataJson) {

         id = dataJson.response.steamid

        }
     });

     return id
 }

$('#button_validate').on('click',function() {

  ajaxTrig()

});

document.getElementById('login_form').addEventListener('submit', function(e) {
    search(document.getElementById('searchText'));
    e.preventDefault();
}, false);

$('#input_username').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        event.preventDefault();
        ajaxTrig()
    }
});

var visibility = 1

function ajaxTrig(){

  var tboby = document.getElementById("tbody");
  var img = document.getElementById("avatar");
  tbody.innerHTML = "";
  img.innerHTML = "";

  id = getId(document.getElementById('input_username').value)

  if (id == null){

    var html="pseudo inconnue";
    $('#tbody').append(html);
    return 0
  }

  $.ajax({
   type: "GET", //rest Type
   dataType: "json", //mispelled
   url: "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=E6D5FC96D3120B016CA30AB04137D487&steamids="+getId(document.getElementById('input_username').value),
   contentType: "application/json; charset=utf-8",
   async: false,
   success: function(dataJson) {

     visibility = dataJson.response.players[0].communityvisibilitystate

     var result = 'inconnue'
     if (visibility == 1 || visibility == 2) {
       result = 'privée';
     } else if(visibility == 3){
       result = 'publique';
     }

     var html="<tr><td>visibilité du compte:</td><td>"+result+"</td></tr>";
     $('#tbody').append(html);

     if(dataJson.response.players[0].personaname == undefined){
      var html="<tr><td>pseudo:</td><td>inconnue</td></tr>";
     }else{
       var html="<tr><td>pseudo:</td><td>"+dataJson.response.players[0].personaname+"</td></tr>";
     }
    $('#tbody').append(html);

    if (visibility == 3) {

      if(dataJson.response.players[0].realname == undefined){
       var html="<tr><td>nom d'utilisateur:</td><td>inconnue</td></tr>";
      }else{
        var html="<tr><td>nom d'utilisateur:</td><td>"+dataJson.response.players[0].realname+"</td></tr>";
      }
      $('#tbody').append(html);


      if(dataJson.response.players[0].timecreated == undefined){
        var html="<tr><td>date de création:</td><td>inconnue</td></tr>";
      }else{
        var myDate = new Date(dataJson.response.players[0].timecreated*1000);
        var html="<tr><td>date de création:</td><td>"+myDate.toLocaleString()+"</td></tr>";
      }
      $('#tbody').append(html);

      if(dataJson.response.players[0].loccountrycode == undefined){
       var html="<tr><td>pays: </td><td>inconnue</td></tr>";
      }else{
        let regionNames = new Intl.DisplayNames(['fr'], {type: 'region'});
        var html="<tr><td>pays: </td><td>"+regionNames.of(dataJson.response.players[0].loccountrycode) +"</td></tr>";
      }
      $('#tbody').append(html);

      var profilState = dataJson.response.players[0].personastate

      var result = 'inconnue'
      if (profilState == 0) {
        result = 'hors ligne';
      } else if(profilState == 1){
        result = 'en ligne';
      } else if(profilState == 2){
        result = 'occupé';
      } else if(profilState == 3){
        result = 'absent';
      } else if(profilState == 4){
        result = 'sommeil';
      } else if(profilState == 5){
        result = 'cherche à échanger';
      } else if(profilState == 6){
        result = 'cherche à jouer';
      }

      var html="<tr><td>état : </td><td>"+result+"</td></tr>";
      $('#tbody').append(html);

      var img = document.createElement("img");
      img.src =dataJson.response.players[0].avatarfull;
      var src = document.getElementById("avatar");
      src.appendChild(img);

     }
   }

  });

if (visibility == 3) {

  $.ajax({
   type: "GET", //rest Type
   dataType: "json", //mispelled
   url: "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=E6D5FC96D3120B016CA30AB04137D487&steamid="+getId(document.getElementById('input_username').value)+"&format=json",
   contentType: "application/json; charset=utf-8",
   async: false,
   success: function(dataJson) {


     if(dataJson.response.game_count == undefined){

      var html="<tr><td>nombre de jeu:</td><td>inconnue</td></tr>";

     }else{

       var html="<tr><td>nombre de jeu:</td><td>"+dataJson.response.game_count+"</td></tr>";
     }

      $('#tbody').append(html);

      var min = dataJson.response.games[0].playtime_forever;
      var objMin = dataJson.response.games[0];

      for (var i = 0; i < dataJson.response.games.length; i++){
        if (dataJson.response.games[i].playtime_forever < min){
            min = dataJson.response.games[i].playtime_forever;
            objMin = dataJson.response.games[i];
          }
      }

      getStringGameMin(objMin)

      var max = dataJson.response.games[0].playtime_forever;
      var objMax = dataJson.response.games[0];

      for (var i = 0; i < dataJson.response.games.length; i++){

        if (dataJson.response.games[i].playtime_forever > max){

            max = dataJson.response.games[i].playtime_forever;
            objMax = dataJson.response.games[i];

          }
      }

      getStringGameMax(objMax)
    }

   });

   $.ajax({
        type: "GET", //rest Type
        dataType: "json", //mispelled
        url: "http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=E6D5FC96D3120B016CA30AB04137D487&steamid="+getId(document.getElementById('input_username').value)+"&relationship=friend",
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (dataJson) {

          if(dataJson.friendslist.friends == undefined){
            var html="<tr><td>nombre d'amis:</td><td>inconnue</td></tr>";
          }else{
            var html="<tr><td>nombre d'amis:</td><td>"+dataJson.friendslist.friends.length+"</td></tr>";
          }
          $('#tbody').append(html);

         }
      });

  $.ajax({
     type: "GET", //rest Type
     dataType: "json", //mispelled
     url: "https://steamcommunity.com/comment/Profile/render/"+getId(document.getElementById('input_username').value)+"/-1/",
     contentType: "application/json; charset=utf-8",
     async: false,
     success: function (dataJson) {

       if(dataJson.total_count == undefined){
         var html="<tr><td>nombre d'évaluation:</td><td>inconnue</td></tr>";
       }else{
         var html="<tr><td>nombre d'évaluation:</td><td>"+dataJson.total_count+"</td></tr>";
       }
       $('#tbody').append(html);

      }
   });
 }
}

function getStringGameMax(objGame){

  $.ajax({
   type: "GET", //rest Type
   dataType: "json", //mispelled
   url: "https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=E6D5FC96D3120B016CA30AB04137D487&appid="+objGame.appid,
   contentType: "application/json; charset=utf-8",
   async: false,
   success: function(dataJson) {

     if(dataJson.game.gameName == undefined){
      var html="<tr><td>jeu le plus joué:</td><td>inconnue</td></tr>";
     }else{
       var html="<tr><td>jeu le plus joué:</td><td>"+dataJson.game.gameName+" avec "+objGame.playtime_forever/60+"h</td></tr>";
     }
     $('#tbody').append(html);
   }
  });
}

function getStringGameMin(objGame){

  $.ajax({
   type: "GET", //rest Type
   dataType: "json", //mispelled
   url: "https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=E6D5FC96D3120B016CA30AB04137D487&appid="+objGame.appid,
   contentType: "application/json; charset=utf-8",
   async: false,
   success: function(dataJson) {

     if(dataJson.game.gameName == undefined){
      var html="<tr><td>jeu le moins joué:</td><td>inconnue</td></tr>";
     }else{
       var html="<tr><td>jeu le moins joué:</td><td>"+dataJson.game.gameName+" avec "+objGame.playtime_forever/60+"h</td></tr>";
     }
     $('#tbody').append(html);
   }
  });
}
