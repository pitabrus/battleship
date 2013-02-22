
/** Game functions for cumputer-player */

moron = {

  // Is sector available for locate there ship?
  sector_is_free: [],

  /**
  *   Matrix with ships
  *
  *   0 - no ship
  *   1 - damaged sector
  *   2 - there are ship
  */
  ships: [],


  // Some static variables, TODO: nahooy
  player_ships: [1, 2, 3, 4],
  current_ship_type: 0,
  player_ships_count: 0,

  // Count ships (each sector)
  shipsCounter: 4 * 1 + 3 * 2 + 2 * 3 + 1 * 4,


  markAsNonfree: function(around, length)
  {
    /** Mark sectors as nonfree */

    var x = around[0];  // X coordinate
    var y = around[1];  // Y coordinate

    // Workaround: mark previous sectors as nonfree
    if(x > 0)
      for(var i = -1; i < 2; ++i)
        if(y + i >= 0 && y + i < 10)
          moron.sector_is_free[x - 1][y + i] = false;

    for(var lx = x; lx <= Math.min(9, length + x); ++lx) {
      moron.sector_is_free[lx][y] = false;

      if(y > 0)
        moron.sector_is_free[lx][y - 1] = false;

      if(y < 10)
        moron.sector_is_free[lx][y + 1] = false;
    }
  },


  locateShips: function()
  {
    /** Locate computer ships */

    // Mark all moron sectors as free
    for(var i = 0; i < 10; ++i) {
      moron.sector_is_free[i] = [];
      for(var j = 0; j < 10; ++j)
        moron.sector_is_free[i][j] = true;
    }

    var ship_is_located = false,      // Workaround for breaking nested loops
        xshift = 0,
        yshift = 0;                   // Coordinate axes

    // Place ships
    for(var ship_length = 4; ship_length >= 1; --ship_length) {
      for(var i = 0; i < 5 - ship_length; ++i) {
        // Try to locate ship with length = ship_length
        ship_is_located = false;

        yshift = Math.floor(Math.random() * 10);
        for(var _y = 0; _y < 10; ++_y) {
          var y = (_y + yshift) % 10;
          xshift = Math.floor(Math.random() * 10);
          for(var _x = 0; _x < 10; ++_x) {
            var x = _x + xshift;

            // Is $ship_length sectors are free?
            var j = 0;
            while(j < ship_length && moron.sector_is_free[x + j] && moron.sector_is_free[x + j][y])
              ++j;

            // If free sectors found
            if(j == ship_length) {

              // Mark this sectors as nonfree
              moron.markAsNonfree([x, y], ship_length);

              // And Locate ship
              for(var deck = 0; deck < ship_length; ++deck)
                moron.ships[x + deck][y] = 2;

              // Break this two loops
              ship_is_located = true;
              break;
            }
          }
          if(ship_is_located)
            break;
        }

        for(sooqa = 0; sooqa < 10; ++sooqa)
          for(pidor = 0; pidor < 10; ++pidor)
            if(moron.ships[sooqa][pidor] == 2)
              view.moron.locateShip(pidor * 10 + sooqa);

      }
    }
  },

  // Game functions

  clearPlayerSectors: [],


  isPlayerShipKilled: function(x, y)
  {
    /** Is player ship killed or just damaged? */

    // Check sectors around (x,y),
    // if there are just damaged sectors, then ship is killed
    // else, do nothing

    for(var i = 0; player.ships[x + i] && player.ships[x + i][y]; --i)
      if(player.ships[x + i][y] == 2)
        return;

    for(var i = 0; player.ships[x + i] && player.ships[x + i][y]; ++i)
      if(player.ships[x + i][y] == 2)
        return;

    for(var i = 0; player.ships[x] && player.ships[x][y + i]; --i)
      if(player.ships[x][y + i] == 2)
        return;

    for(var i = 0; player.ships[x] && player.ships[x][y + i]; ++i)
      if(player.ships[x][y + i] == 2)
        return;

    // If ship is killed (not just damaged), mark sectors as killed
    var sp;

    for(var i = 0; player.ships[x + i] && player.ships[x + i][y] == 1; --i) {
      // View: mark ship as killed
      view.player.markAsKilled(y * 10 + x + i);

      for(var ty = y - 1; ty < y + 2; ++ty)
        for(var tx = x + i - 1; tx < x + i + 2; ++tx)
          if(ty >= 0 && ty < 10 && tx >= 0 && tx < 10)
            if((sp = moron.clearPlayerSectors.indexOf(ty * 10 + tx)) != -1) {
              moron.clearPlayerSectors.splice(sp, 1);
            }
    }

    for(var i = 0; player.ships[x + i] && player.ships[x + i][y] == 1; ++i) {
      // View: mark ship as killed
      view.player.markAsKilled(y * 10 + x + i);

      for(var ty = y - 1; ty < y + 2; ++ty)
        for(var tx = x + i - 1; tx < x + i + 2; ++tx)
          if(ty >= 0 && ty < 10 && tx >= 0 && tx < 10)
            if((sp = moron.clearPlayerSectors.indexOf(ty * 10 + tx)) != -1) {
              moron.clearPlayerSectors.splice(sp, 1);
            }
    }

    for(var i = 0; player.ships[x] && player.ships[x][y + i] == 1; --i) {
      // View: mark ship as killed
      view.player.markAsKilled((y + i) * 10 + x);

      for(var ty = y + i - 1; ty < y + i + 2; ++ty)
        for(var tx = x - 1; tx < x + 2; ++tx)
          if(ty >= 0 && ty < 10 && tx >= 0 && tx < 10)
            if((sp = moron.clearPlayerSectors.indexOf(ty * 10 + tx)) != -1) {
              moron.clearPlayerSectors.splice(sp, 1);
            }
    }

    for(var i = 0; player.ships[x] && player.ships[x][y + i] == 1; ++i) {
      // View: mark ship as killed
      view.player.markAsKilled((y + i) * 10 + x);

      for(var ty = y + i - 1; ty < y + i + 2; ++ty)
        for(var tx = x - 1; tx < x + 2; ++tx)
          if(ty >= 0 && ty < 10 && tx >= 0 && tx < 10)
            if((sp = moron.clearPlayerSectors.indexOf(ty * 10 + tx)) != -1) {
              moron.clearPlayerSectors.splice(sp, 1);
            }
    }

  },


  fire: function(recommendedCoordinates=undefined)
  {
    /** Fire in random (or not random :3) sector */
    var r = Math.floor(Math.random() * moron.clearPlayerSectors.length),
        coordinates = recommendedCoordinates || moron.clearPlayerSectors[r],
        x = coordinates % 10,
        y = Math.floor(y = coordinates / 10);

    // Delete coordinates, not needed
    var cpsIndex;
    if((cpsIndex = moron.clearPlayerSectors.indexOf(coordinates)) != -1) {
      moron.clearPlayerSectors.splice(cpsIndex, 1);
    }

    // Fire in the (x,y)
    if(player.ships[x][y] == 2) {
      // View: set sector color red
      view.player.markAsDamaged(coordinates);

      // Mark player sector as free
      player.ships[x][y] = 1;

      // Is ship killed?
      moron.isPlayerShipKilled(x, y);

      // Any ships?
      --player.shipsCounter;
      if(player.shipsCounter == 0)
        alert("So snooley");

      // TODO +-x or +-y
      recommendedCoordinates = y * 10 + (
                                          (x + 1 < 10) ?
                                            x + 1 :
                                            x - 1
                                        );
      if(moron.clearPlayerSectors.indexOf(recommendedCoordinates) == -1)
        recommendedCoordinates = undefined;

      moron.fire(recommendedCoordinates);
    }
    else {
      view.player.markAsEmpty(coordinates);
    }
  },
}
