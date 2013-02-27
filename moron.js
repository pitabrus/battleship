
/** Game functions for cumputer-player */


/**
*   Модуль с функциями игрока-компьютера
*/

moron = {


  /**
  *   Matrix with ships
  *
  *   0 - no ship
  *   1 - damaged sector
  *   2 - there are ship
  */

  /**
  *   Матрица с кораблями
  *   0 - сектор пуст
  *   1 - сектор занят кораблем (игрок БОМБАНУЛ по этому сектору)
  *   2 - сектор занят кораблем (игрок об этом не знает)
  */
  ships: [],

  /**
  *   Это говно не нужно, своего рода, статические переменные,
  *   которые были глобальными, я не смог от них полностью избавиться. Быдлокод.
  */
  // Some static variables, TODO: nahooy

  // Is sector available for locate there ship?
  sector_is_free: [],
  player_ships: [1, 2, 3, 4],
  current_ship_type: 0,
  player_ships_count: 0,

  // Count ships (each sector)
  // Счетчик свободных кораблей
  shipsCounter: 4 * 1 + 3 * 2 + 2 * 3 + 1 * 4,


  markAsNonfree: function(around, length)
  {
    /** Mark sectors as nonfree */

    /** Помечает сектор как занятый кораблем */

    var x = around[0];  // X coordinate
    var y = around[1];  // Y coordinate

    // Workaround: mark previous sectors as nonfree

    /* Отмечает сектора вокруг корабля как недоступные [для расстановки других кораблей] */

    // TODO: in one loop
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

    /**
    *   Размещает корабли на поле компьютера
    */

    // Mark all moron sectors as free
    /* Заполняет массив со свободными секторами */
    for(var i = 0; i < 10; ++i) {
      moron.sector_is_free[i] = [];
      for(var j = 0; j < 10; ++j)
        moron.sector_is_free[i][j] = true;
    }

    /*
    *   Далее, в цикле пробгаемся по ряду и ищем свободные сектора, для того,
    *   чтобы разместить корабль. shift используется для того, чтобы корабли
    *   не всегда размещались в начале ряда. Это сдвиг.
    */

    // TODO: without shift
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
            // Проверяем, пусты ли сектора. Размещаем корабль, если пусты.
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

        /* DEBUG:
        for(sooqa = 0; sooqa < 10; ++sooqa)
          for(pidor = 0; pidor < 10; ++pidor)
            if(moron.ships[sooqa][pidor] == 2)
              view.moron.locateShip(pidor * 10 + sooqa);
        */

      }
    }
  },

  // Game functions

  /** Сектора игрока-человека, в которых может находиться корабль (в формате 10y + x) */
  clearPlayerSectors: [],


  isPlayerShipKilled: function(x, y)
  {
    /** Is player ship killed or just damaged? */

    // Check sectors around (x,y),
    // if there are just damaged sectors, then ship is killed
    // else, do nothing

    /**
    *   Проверяет, убит или поврежден корабль. Если убит - помечает его как убитый
    *   а сектора вокруг, как ненужные
    */


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

    /*
    *   Если корабль убит полностью (не поврежден):
    *   Перекрашиваем сектора в другой цвет,
    *   удаляем координату сектора (и секторов вокруг) из
    *   массива clearPlayerSectors[], (больше по нему не стреляем)
    */

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

    /**
    *   Огонь по сектору. Если есть recommendedCoordinates,
    *   то по нему, если нет - по рандомному свободному.
    *   Формат recommendedCoordinates: 10y + x
    */

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

    // Стреляем в сектор. Если его значение - 2, мы попали по кораблю

    if(player.ships[x][y] == 2) {
      // View: set sector color red

      // Помечаем сектора корабля желтым, корабль поврежден
      view.player.markAsDamaged(coordinates);

      // Записываем в сектор единицу, он поврежден
      player.ships[x][y] = 1;

      // Проверяем, не убит (потоплен) ли корабль
      moron.isPlayerShipKilled(x, y);

      // Еще остались корабли на поле?
      --player.shipsCounter;
      if(player.shipsCounter == 0)
        alert("So snooley");

      // TODO +-x or +-y
      /* если мы попали, стреляем в соседнюю справа (или слева, как получится) клетку */
      // TODO: refactor this govnocode

      // Ходим в клетку слева или справа

      // 1 или -1, 50/50
      var direction = Math.floor(Math.random(2)) || -1;
      var rx;
      // Если имеет смысл пробовать вести огонь по сектору справа (или слева)?
      if( rx = x + direction,
          rx < 10 && rx >= 0 &&
          moron.clearPlayerSectors.indexOf(y * 10 + rx) != -1)
        moron.fire(y * 10 + rx);
      // ... Слева (или справа)?
      else if(rx = x - direction,
              rx < 10 && rx >= 0 &&
              moron.clearPlayerSectors.indexOf(y * 10 + rx) != -1)
        moron.fire(y * 10 + rx);
      else
        // Тогда в случайный.
        moron.fire();

    }
    else {
      view.player.markAsEmpty(coordinates);
    }
  },
}
