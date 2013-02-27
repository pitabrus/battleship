
/** Some game functions */

/** Модуль с функциями, которые я не захотел засунуть в другие модули */


function init()
{
  /** Init */

  /**
  *   Создает и заполняет нулями массивы player.ships и moron.ships
  *   А в С, кстати, это делается автоматически, для глобальных массивов, люблю его <3
  */

  // Initialize player.ships[][], moron.ships[][] with 0 and moron.clearPlayerSectors[]
  for(var i = 0; i < 10; ++i) {
    player.ships[i] = [];
    moron.ships[i] = [];

    for(var j = 0; j < 10; ++j) {
      player.ships[i][j] = 0;
      moron.ships[i][j] = 0;

      // Сует сектор (клетку) в clearPlayerSectors - массив со свободными (еще не атакованными) секорами
      // Координаты записываются в виде 10y + x
      moron.clearPlayerSectors.push(i * 10 + j);
    }
  }

  // Render fields
  view.renderFields();

}



function startGame()
{
  /** Start game */

  /**
  *   Вызывается после того, как пользователь валидно расставил свои корабли
  *   Расставляет корабли компьютера и делает поле компьютера видимым
  */

  moron.locateShips();

  // Show moron field
  view.moron.displayField();

}
