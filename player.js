
/** Game functions for human-player */

player = {

  // Player ships coordinates
  ships: [],

  // Count ships (each sector)
  shipsCounter: 4 * 1 + 3 * 2 + 2 * 3 + 1 * 4,


  onplayercreateship: function(coordinates)
  {
    /** Action: call when user locate ship in a sector */

    --moron.player_ships[moron.current_ship_type];
    ++moron.player_ships_count;

    if(moron.player_ships[moron.current_ship_type] == 0)
      ++moron.current_ship_type;

    player.ships[coordinates % 10][Math.floor(coordinates / 10)] = 2;

    // View: Change sector color
    view.player.locateShip(coordinates);

    // Player locate all ships
    if(moron.player_ships_count >= (4 * 1 + 3 * 2 + 2 * 3 + 1 * 4))
      player.validatePlayerPositions();

  },


  validatePlayerPositions: function()
  {
    /** Validate player field */

    var counted = [];

    for(var i = 0; i < 10; ++i) {
      counted[i] = []
      for(j = 0; j < 10; ++j)
        counted[i][j] = false;
    }

    var PLAYER_SHIPS = [0, 0, 0, 0]; // Counts player ships

    for(var y = 0; y < 10; ++y) {
      for(var x = 0; x < 10; ++x) {
        // Pease of ship
        if(player.ships[x][y] == 2) {
          // Corners must not be ships
          if(x - 1 >= 0 && y - 1 >= 0 && player.ships[x - 1][y - 1] == 2 ||
             x - 1 >= 0 && y + 1 < 10 && player.ships[x - 1][y + 1] == 2 ||
             x + 1 < 10 && y + 1 < 10 && player.ships[x + 1][y + 1] == 2 ||
             x + 1 < 10 && y - 1 >= 0 && player.ships[x + 1][y - 1] == 2) {
            alert("Too close");
            return;
          }

          // Count ships
          if(!counted[x][y]) {
            counted[x][y] = true;

            // count horizontal length of ship
            var i = 0;
            while(player.ships[x + i] && player.ships[x + i][y] == 2/* && !counted[x + i][y]*/) {
              counted[x + i][y] = true;
              ++i;
            }

            // else, count vertical length
            if(i == 1) {
              while(player.ships[x] && player.ships[x][y + i] == 2 && !counted[x][y + i]) {
                counted[x][y + i] = true;
                ++i;
              }
            }

            if(i > 0 && i <= PLAYER_SHIPS.length)
              ++PLAYER_SHIPS[i - 1];    // Ship is located
          }
        }
      }
    }

    // If 'aight, start game
    if(PLAYER_SHIPS.toString() == [4, 3, 2, 1].toString()) // if arrays are equal
      startGame();
    else
      alert("Ships placed incorrectly");
  },


  // Game functions

  fire: function(coordinates)
  {
    /** Player makes a move */

    var x = coordinates % 10,
        y = Math.floor(coordinates / 10);

    if(moron.ships[x][y] == 2) {      // Hit the target
      // View: make button red
      view.moron.markAsDamaged(coordinates);

      // Mark sector as free
      moron.ships[x][y] = 1;

      player.isMoronShipKilled(x, y);

      // Any ships?
      --moron.shipsCounter;
      if(moron.shipsCounter <= 0) {
        alert("You win");
        return;
      }
    }
    else {
      view.moron.markAsEmpty(coordinates);
      moron.fire();
    }
  },


  isMoronShipKilled: function(x, y)
  {
    /** Is moron ship killed or just damaged? */

    // Check sectors around (x,y),
    // if there are just damaged sectors, then ship is killed
    // else, do nothing

    for(var i = 0; moron.ships[x + i] && moron.ships[x + i][y]; --i)
      if(moron.ships[x + i][y] == 2)
        return;

    for(var i = 0; moron.ships[x + i] && moron.ships[x + i][y]; ++i)
      if(moron.ships[x + i][y] == 2)
        return;

    for(var i = 0; moron.ships[x] && moron.ships[x][y + i]; --i)
      if(moron.ships[x][y + i] == 2)
        return;

    for(var i = 0; moron.ships[x] && moron.ships[x][y + i]; ++i)
      if(moron.ships[x][y + i] == 2)
        return;

    // If ship is killed (not just damaged), mark sectors as killed
    for(var i = 0; moron.ships[x + i] && moron.ships[x + i][y]; --i) {
      // View: mark ship as killed
      view.moron.markAsKilled(y * 10 + x + i);
    }

    for(var i = 0; moron.ships[x + i] && moron.ships[x + i][y]; ++i) {
      // View: mark ship as killed
      view.moron.markAsKilled(y * 10 + x + i);
    }

    for(var i = 0; moron.ships[x] && moron.ships[x][y + i]; --i) {
      // View: mark ship as killed
      view.moron.markAsKilled(y * 10 + x + i);
    }

    for(var i = 0; moron.ships[x] && moron.ships[x][y + i]; ++i) {
      // View: mark ship as killed
      view.moron.markAsKilled(y * 10 + x + i);
    }
  },
}
