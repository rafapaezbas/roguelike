var state = {
	game: {},
	map: null,
	mapNpcs: [],
	width: 80,
	height: 20,
	tiles: [],
	npcs : [],
	text : "",
	player: {
		character: "@",
		at: 5,
		df: 3,
		hp: 5,
		x: 2,
		y: 2,
		alive: true,
		inventory: [],
		choosenCommand: null,
	},
	playerController: {
		display: function () {
			displayEntity(state.player);
		},
		take: function (targetTile,npc) {
			if (targetTile.object != null) {
				take(this, targetTile.object);
				state.player.choosenCommand = null;
			}
		},
		look: function (targetTile,npc){
			text = state.tiles[targetTile].description;
			foreground = ROT.Color.toRGB([255, 255, 255]);
			background = ROT.Color.toRGB([0, 0, 0]);
			colors = "%c{" + foreground + "}%b{" + background + "}";
			state.drawMap();
			state.drawNpcs();
			state.playerController.display();
			display.drawText(0, 19, colors + text);
			//Reset player command
			templPlayer = state.player;
			templPlayer.choosenCommand = null;
			state.set(['player'],[templPlayer],true);
		},
		attack: function (targetTile,npc){
			npc.hp--; //TODO change this, insert combat system
			if(npc.hp <= 0){
				//Make the npc dissapear
				state.mapNpcs = state.mapNpcs.filter(n => n != npc);
			}
			templPlayer = state.player;
			templPlayer.choosenCommand = null;
			state.set(['text'],["You attacked the " + npc.description + ". "]);
			winnerChecker.checkLastAction("attack",npc);
			state.set(['player'],[templPlayer],true);
		}
	},
	npcController : {
		control: function (npc) {
			if(npcUtils.isPlayerAround(npc)){
				npcUtils.attack(npc,state.player);
			}else{
				npcUtils.moveNpc(npc);
			}
		}
	},
	set: function (props, values, computerTurn = false) {
		for (var i = 0; i < props.length; i++) {
			if (!typeof values[i] === 'object') { //If the value is an object, copy by value
				this[props[i]] = values[i];
			} else {
				this[props[i]] = JSON.parse(JSON.stringify(values[i])); //Copy by value, this makes a copy of an object not a reference
			}
		}
		this.notify();
		//If computer turn is true, every npcs is going to act and the text is going to "flush"
		if(computerTurn){
			for(var i = 0; i < state.mapNpcs.length; i++){
				state.npcController.control(state.mapNpcs[i]);
			}
			state.drawNpcs();
			state.drawText();
			state.resetText();
		}
	},
	//Observer pattern, this is the observer, for every change in the state, it will call the callback of subcribers
	notify: function () {
		for (var i = 0; i < this.subscribers.length; i++) {
			this.subscribers[i].callback(this);
		}
	},
	subscribe: function (subscriber) {
		this.subscribers.push(subscriber);
	},
	subscribers: [],
	drawMap: function () {
		for (var i = 0; i < this.map['map'].length; i++) {
			for (var j = 0; j < this.map['map'][i].length; j++) {
				foreground = ROT.Color.toRGB([255, 255, 255]);
				background = ROT.Color.toRGB([0, 0, 0]);
				colors = "%c{" + foreground + "}%b{" + background + "}";
				display.drawText(i, j, colors + state.map['map'][i][j]);
			}
		}
	},
	drawNpcs: function () {
		for(var i = 0; i < state.mapNpcs.length; i++){
			foreground = ROT.Color.toRGB([255, 255, 255]);
			background = ROT.Color.toRGB([0, 0, 0]);
			colors = "%c{" + foreground + "}%b{" + background + "}";
			display.drawText(state.mapNpcs[i].posX,state.mapNpcs[i].posY,colors + state.mapNpcs[i].character);
		}
	},
	// Calculates the most common tile next to the npc to change the initial tile for it. Make it look only no-solid tiles!
	calculateNpcTile: function (x, y) {
		var nearestTiles = [];
		for (var i = -1; i < 2; i++) {
			for (var j = -1; j < 2; j++) {
				if (i == 0 && j == 0) {
					// This is the tile that we want to replace
				} else {
					//Check that the tile is in the map and solid
					if(x + i >= 0 && x + i <= state.width && y + j >= 0 && y + j <= state.height && state.tiles[state.map.map[x + i][y + j]].solid == false)
					nearestTiles.push(state.map.map[x + i][y + j]);
				}
			}
		}
		// Array with most common elements in descent order
		modeArray = mode(nearestTiles);
		return modeArray[0]
	},
	drawText : function(){
		display.drawText(0,19,colors + state.text);
	},
	resetText : function(){
		state.text = "";
	}
}

function openFile(event) {
	var input = event.target;
	var reader = new FileReader();
	reader.onload = function(){
		//callback, called after file readed
		var text = reader.result;
		state.set(['game'],[JSON.parse(text)]);
		state.set(['map'], [state.game.maps[0]]);
		//Initialize tiles
		state.game.tiles.map(tile => {
			state.tiles[tile.character] = { solid: tile.solid, description: tile.description };
		})
		//Initialize npcs
		state.game.npcs.map(npc => {
			state.npcs[npc.character] = { character: npc.character, attack: npc.attack, description: npc.description, defense: npc.defense, hp: npc.hp };
		})
		//Initialize mapNpcs and replace tiles of initial npcs position
		for (var i = 0; i < state.map.map.length; i++) {
			for (var j = 0; j < state.map.map[i].length; j++) {
				if (state.npcs[state.map.map[i][j]] != undefined) { //If this tile is defined as an npc push it to the npcs
					var npc = Object.assign({}, state.npcs[state.map.map[i][j]]);
					npc.posX = i;
					npc.posY = j;
					state.mapNpcs.push(npc);
					state.map.map[i][j] = state.calculateNpcTile(i, j);
				}
			}
		}
		state.drawMap();
		state.drawNpcs();
		state.playerController.display();
	}
	document.body.appendChild(container);
	reader.readAsText(input.files[0]);
};

var playerRenderer = {
	callback: function () {
		if (state.map != null) { //Check because of the first call
			state.drawMap();
			state.playerController.display();
		}
	}
}

var winnerChecker = {
	callback: function () {
		if(state.game.winningCondition.length == 0){
			console.log("game done!");
		}
	},
	checkLastAction: function(action,target){
		if(action == "attack"){
			var updatedGame = state.game;
			updatedGame.winningCondition = updatedGame.winningCondition.filter(c => c != action + " " + target.character);
			state.set(['game'],[updatedGame]);
		}
	}
}

state.subscribe(playerRenderer);
state.subscribe(winnerChecker);

