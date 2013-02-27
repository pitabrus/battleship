
/**
*   Функции отрисовки полей, замены цвета, тому подобного.
*   Взаимодействуют с интерфейсом, не трогая логику, не изменяя переменные, etc
*/

view = {

  player: {

    // Get player sector by coordinates
    getSector: function(coordinates)
    {
      return document.getElementsByName("player_sector[" + coordinates + "]")[0];
    },


    // Locate ship into sector, mark as black
    locateShip: function(coordinates)
    {
      this.getSector(coordinates).style.backgroundColor = "black";
    },


    // Mark ship (sector) as damaged, not killed
    markAsDamaged: function(coordinates)
    {
      this.getSector(coordinates).style.backgroundColor = "yellow";
    },


    // Mark ship as killed, not just damaged
    markAsKilled: function(coordinates)
    {
      this.getSector(coordinates).style.backgroundColor = "red";
    },


    // Mark as empty
    markAsEmpty: function(coordinates)
    {
      this.getSector(coordinates).style.backgroundColor = "silver";
    },

  },


  moron: {

    // Get moron sector by coordinates
    getSector: function(coordinates)
    {
      return document.getElementsByName("moron_sector[" + coordinates + "]")[0];
    },


    // Show ships, only for debug
    locateShip: function(coordinates)
    {
      //this.getSector(coordinates).style.border = "2px solid black";
    },


    // Mark ship (sector) as damaged, not killed
    markAsDamaged: function(coordinates)
    {
      this.getSector(coordinates).style.backgroundColor = "yellow";
    },


    // Mark ship as killed, not just damaged
    markAsKilled: function(coordinates)
    {
      this.getSector(coordinates).style.backgroundColor = "red";
    },


    // Mark as empty
    markAsEmpty: function(coordinates)
    {
      this.getSector(coordinates).style.backgroundColor = "silver";
    },


    // Display field
    displayField: function()
    {
      document.getElementById("moron_sea").style.display = "block";
    },

  },


  // Render battle fields
  renderFields: function()
  {
    var player_sea = "",
        moron_sea = "";

    for(var y = 0; y < 10; ++y) {
      for(var x = 0; x < 10; ++x) {
        var c = y * 10 + x;
        player_sea += "<button class=\"sector\" name=\"player_sector[" + c + "]\" onclick=\"player.onplayercreateship(" + c + ")\"></button>";
        moron_sea += "<button class=\"sector\" name=\"moron_sector[" + c + "]\" onclick=\"player.fire(" + c + ")\"></button>";
      }
      player_sea += "<br />";
      moron_sea += "<br />";
    }
    document.getElementById("player_sea").innerHTML = player_sea;
    document.getElementById("moron_sea").innerHTML = moron_sea;
  },

}
