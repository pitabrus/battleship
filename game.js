
/** Some game functions */


// Render field
function init()
{
  /** Init */
  var player_sea = "";
  var moron_sea = "";
  var i, j;


  // Initialize player.ships[][], moron.ships[][] with 0 and moron.clearPlayerSectors[]
  for(var i = 0; i < 10; ++i) {
    player.ships[i] = [];
    moron.ships[i] = [];

    for(var j = 0; j < 10; ++j) {
      player.ships[i][j] = 0;
      moron.ships[i][j] = 0;
      moron.clearPlayerSectors.push(i * 10 + j);
    }
  }

  view.renderFields();

  // DEBUG:
  // startGame();

}



function startGame()
{
  /** Start game */
  moron.locateShips();

  // View: show moron field
  view.moron.displayField();

}
