var state = JSON.parse(localStorage.gameState);
var grid = state.grid.cells;
grid[0][3] = {position: {x:0, y:3}, value:2048};
grid[1][3] = {position: {x:1, y:3}, value:2048};
localStorage.gameState = JSON.stringify(state);