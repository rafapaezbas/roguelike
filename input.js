document.onkeyup = function(key){

	text = ""; //Reset text at the begining of the turn

	if(key.key == "ArrowRight"){
		if(state.player.choosenCommand != null){
			var npc = state.mapNpcs.filter(n => n.posX == state.player.x + 1 && n.posY == state.player.y);
			npc = npc.length == 1 ? npc[0] : null; //If the filtering is succesfull (because there is an npc) get it, otherwise set it to null 
			state.player.choosenCommand(state.map.map[state.player.x + 1][state.player.y],npc);
			//updateMap();
		}else{
			if(state.player.x == state.width -1){
				var mapX = state.map.x;
				var nextMap = state.game.maps.filter(m => m.x == Number(mapX) + 1);
				if(nextMap[0] != undefined){
					var updatedPlayer = state.player;
					updatedPlayer.x = 0;
					state.set(['map'],[nextMap[0]]);
					state.drawMap();
					state.set(['player'],[updatedPlayer]);
				}
			}else{
				var npcsInTargetPosition = state.mapNpcs.filter(n => n.posX == state.player.x + 1 && n.posY == state.player.y).length > 0 ? true : false;
				if(state.tiles[state.map.map[state.player.x + 1][state.player.y]].solid == false && !npcsInTargetPosition){
					updatedPlayer = state.player;
					updatedPlayer.x++;
					state.set(['player'],[updatedPlayer],true);
					//text += "You moved to the East.";
				}
			}
		}
	}

	if(key.key == "ArrowLeft"){
		if(state.player.choosenCommand != null){
			var npc = state.mapNpcs.filter(n => n.posX == state.player.x - 1 && n.posY == state.player.y);
			npc = npc.length == 1 ? npc[0] : null; //If the filtering is succesfull (because there is an npc) get it, otherwise set it to null 
			state.player.choosenCommand(state.map.map[state.player.x - 1][state.player.y],npc);
			//updateMap();
		}else{
			if(state.player.x == 0){
				var mapX = state.map.x;
				var nextMap = state.game.maps.filter(m => m.x == Number(mapX) - 1);
				if(nextMap[0] != undefined){
					var updatedPlayer = state.player;
					updatedPlayer.x = state.width - 1;
					state.set(['map'],[nextMap[0]]);
					state.drawMap();
					state.set(['player'],[updatedPlayer]);
				}
			}else{
				var npcsInTargetPosition = state.mapNpcs.filter(n => n.posX == state.player.x - 1 && n.posY == state.player.y).length > 0 ? true : false;
				if(state.tiles[state.map.map[state.player.x - 1][state.player.y]].solid == false && !npcsInTargetPosition){
					updatedPlayer = state.player;
					updatedPlayer.x--;
					state.set(['player'],[updatedPlayer],true);
					//text += "You moved to the West.";
				}
			}
		}
	}

	if(key.key == "ArrowDown"){
		if(state.player.choosenCommand != null){
			var npc = state.mapNpcs.filter(n => n.posX == state.player.x && n.posY == state.player.y + 1);
			npc = npc.length == 1 ? npc[0] : null; //If the filtering is succesfull (because there is an npc) get it, otherwise set it to null 
			state.player.choosenCommand(state.map.map[state.player.x][state.player.y + 1],npc);
			//updateMap();
		}else{
			if(state.player.y == state.height - 1){
				var mapY = state.map.y;
				var nextMap = state.game.maps.filter(m => m.y == Number(mapY) + 1);
				if(nextMap[0] != undefined){
					var updatedPlayer = state.player;
					updatedPlayer.y = 0;
					state.set(['map'],[nextMap[0]]);
					state.drawMap();
					state.set(['player'],[updatedPlayer]);
				}
			}else{
				var npcsInTargetPosition = state.mapNpcs.filter(n => n.posY == state.player.y + 1 && n.posX == state.player.x).length > 0 ? true : false;
				if(state.tiles[state.map.map[state.player.x][state.player.y + 1]].solid == false && !npcsInTargetPosition){
					updatedPlayer = state.player;
					updatedPlayer.y++;
					state.set(['player'],[updatedPlayer],true);
					//text += "You moved to the South.";
				}
			}
		}
	}

	if(key.key == "ArrowUp"){
		if(state.player.choosenCommand != null){
			var npc = state.mapNpcs.filter(n => n.posX == state.player.x && n.posY == state.player.y - 1);
			npc = npc.length == 1 ? npc[0] : null; //If the filtering is succesfull (because there is an npc) get it, otherwise set it to null 
			state.player.choosenCommand(state.map.map[state.player.x][state.player.y - 1],npc);
			//updateMap();
		}else{
			if(state.player.y == 0){
				var mapY = state.map.y;
				var nextMap = state.game.maps.filter(m => m.y == Number(mapY) - 1);
				if(nextMap[0] != undefined){
					var updatedPlayer = state.player;
					updatedPlayer.y = state.height - 1;
					state.set(['map'],[nextMap[0]]);
					state.drawMap();
					state.set(['player'],[updatedPlayer]);
				}
			}else{
				var npcsInTargetPosition = state.mapNpcs.filter(n => n.posY == state.player.y - 1 && n.posX == state.player.x).length > 0 ? true : false;
				if(state.tiles[state.map.map[state.player.x][state.player.y - 1]].solid == false && !npcsInTargetPosition){
					updatedPlayer = state.player;
					updatedPlayer.y--;
					state.set(['player'],[updatedPlayer],true);
					//text += "You moved to the North.";
				}
			}
		}
	}


	if(key.key == "a"){
		state.player.choosenCommand = state.playerController.attack;
		text += "In wich direction do you want to attack?";
	}

	if(key.key == "t"){
		state.player.choosenCommand = state.playerController.take;
		text += "What do you want to take?";
	}

	if(key.key == "l"){
		state.player.choosenCommand = state.playerController.look;
		text += "In which direction are you looking?";
	}

	drawText(text); //Display resulting text
}
