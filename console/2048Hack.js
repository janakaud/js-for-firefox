setInterval(function() {
	var event = document.createEvent("KeyboardEvent");
	var move = 0;
	
	var grid=JSON.parse(localStorage.getItem('gameState')).grid.cells;
	var cell;
	var horMax=0, verMax=0;
	for(i=0; i<4; i++){
		for(j=0; j<4;){
			while(j<4 && grid[i][j] == null)
				j++;
			if(j==4)
				break;
			cell=grid[i][j];
			j++;
			while(j<4 && grid[i][j] == null)
				j++;
			if(j==4)
				break;
			if(cell.value == grid[i][j].value)
				verMax+=cell.value;
		}
	}
	for(j=0; j<4; j++){
		for(i=0; i<4;){
			while(i<4 && grid[i][j] == null)
				i++;
			if(i==4)
				break;
			cell=grid[i][j];
			i++;
			while(i<4 && grid[i][j] == null)
				i++;
			if(i==4)
				break;
			if(cell.value == grid[i][j].value)
				horMax+=cell.value;
		}
	}
	
	if(verMax > horMax)
		move = Math.floor(Math.random()*2)*2+38;
	else if(verMax < horMax)
		move = Math.floor(Math.random()*2)*2+37;
	else
		move = Math.random()*4+37;
	
	event.initKeyEvent("keydown", true, true, null, false, false, false, false, move, 0);
	document.body.dispatchEvent(event);
}, 0);
window.onerror = function(evt) {
	if(!document.querySelector(".game-message").classList.contains('game-won'))
		document.getElementsByClassName('retry-button')[0].click();
};