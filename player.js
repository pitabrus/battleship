
/** Game functions for human-player */

player = {

  /**
  *   Модуль с функциями игрока-человека
  */

  // Player ships coordinates
  /**
  *   Матрица с кораблями
  *   0 - сектор пуст
  *   1 - сектор занят кораблем (игрок БОМБАНУЛ по этому сектору)
  *   2 - сектор занят кораблем (игрок об этом не знает)
  */
  ships: [],

  // Count ships (each sector)
  // Счетчик свободных кораблей
  shipsCounter: 4 * 1 + 3 * 2 + 2 * 3 + 1 * 4,


  onplayercreateship: function(coordinates)
  {
    /** Action: call when user locate ship in a sector */

    /** Вызывается, когда пользователь размещает корабль в секоре (нажал на клетку) */

    // Блджад, я так и не понял, что за код ниже, сори. Видно, глубоко ночью его писал. Игнорируй.

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

    /* Проверяет, валидно ли игрок расставил корабли */

    var counted = [];

    // Заполняет массив false.
    for(var i = 0; i < 10; ++i) {
      counted[i] = []
      for(j = 0; j < 10; ++j)
        counted[i][j] = false;
    }

    // Счетчик кораблей, каждого типа
    var PLAYER_SHIPS = [0, 0, 0, 0]; // Counts player ships

    // Проверяет, не располагаются ли корабли слишком близко друг к другу
    for(var y = 0; y < 10; ++y) {
      for(var x = 0; x < 10; ++x) {
        // Pease of ship
        if(player.ships[x][y] == 2) {
          // Нет ли кораблей по углам
          if(x - 1 >= 0 && y - 1 >= 0 && player.ships[x - 1][y - 1] == 2 ||
             x - 1 >= 0 && y + 1 < 10 && player.ships[x - 1][y + 1] == 2 ||
             x + 1 < 10 && y + 1 < 10 && player.ships[x + 1][y + 1] == 2 ||
             x + 1 < 10 && y - 1 >= 0 && player.ships[x + 1][y - 1] == 2) {
            alert("Too close");
            return;
          }

          // Нет ли кораблей по бокам.

          // Count ships
          if(!counted[x][y]) {
            counted[x][y] = true;

            // count horizontal length of ship
            var i = 0;
            while(player.ships[x + i] && player.ships[x + i][y] == 2) {
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

    // Если все нормально, начинаем игру
    if(PLAYER_SHIPS.toString() == [4, 3, 2, 1].toString()) // if arrays are equal
      startGame();
    else
      alert("Ships placed incorrectly");
  },


  // Game functions

  fire: function(coordinates)
  {
    /** Игрок стреляет по сектору coordinates (10y + x) */

    var x = coordinates % 10,
        y = Math.floor(coordinates / 10);

    // Если в секторе был корабль
    if(moron.ships[x][y] == 2) {
      // Делаем сектор желтым, корабль поврежден
      view.moron.markAsDamaged(coordinates);

      // Помечаем сектор как поврежденный
      moron.ships[x][y] = 1;

      // Проверяем, корабль убит или только поврежден
      player.isMoronShipKilled(x, y);

      // Еще остались корабли?
      --moron.shipsCounter;
      if(moron.shipsCounter <= 0) {
        alert("You win");
        return;
      }
    }
    else {
      // Если не попали по кораблю
      // Помечаем сектор как пустой
      view.moron.markAsEmpty(coordinates);
      // Ход за игроком-компьютером
      moron.fire();
    }
  },


  isMoronShipKilled: function(x, y)
  {
    /**
    *   Проверяет, убит корабль, или только поврежден
    *   Если убит, помечает сектора красным.
    */

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
