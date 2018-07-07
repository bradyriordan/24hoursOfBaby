var timer = 0;

var baby = {
  name : "",
  hungry : 0,
  tired : 0,
  uncomfortable : 0,
  lastFed : 0,
  lastRocked : 0,
  lastSlept: 0,
  dirtyDiaper : true
}

var babyState = {
  smile : function (){document.getElementById('state').innerHTML = "Smile!";},
  content : function (){document.getElementById('state').innerHTML = "Content!";},
  cry : function (){document.getElementById('state').innerHTML = "Cry!";},
  wail : function (){document.getElementById('state').innerHTML = "Wail!";},
  sleep : function (){document.getElementById('state').innerHTML = "Sleep!" ;}
}


setInterval(updateFeelings, 5000);

function updateFeelings(){
  var isHungryMax = (baby.hungry < 5) ? baby.hungry++ : baby.hungry;
  var isTiredMax = (baby.tired < 5) ? baby.tired++ : baby.tired;
  var isUncorforableMax = (baby.uncomfortable < 5) ? baby.uncomfortable++ : baby.uncomfortable;  
}


setInterval(updateStates, 100);

function updateStates(){
  if (baby.hungry == 5 || baby.uncomfortable == 5 ){
    babyState.wail();
  } else if (baby.hungry == 4 || baby.uncomfortable == 4 ){
    babyState.cry();
  } else if (baby.hungry == 3 || baby.uncomfortable == 3 ){
    babyState.content();
  } else if (baby.hungry == 2 || baby.uncomfortable == 2 ){
    babyState.smile();
  } 
  timer += 100;
}

var actions = {
	feed : function (){
		if (baby.hungry <= 5 && baby.hungry > 0) {
			baby.hungry--
			baby.lastFed = timer;
			this.sleep();
		}
	},	
	rock : function (){
		if (baby.uncomfortable <= 5 && baby.uncomfortable > 0) {
			baby.uncomfortable--
			baby.lastRocked = timer;
			this.sleep();
		}
	},
	sleep : function (){
		if (baby.uncomfortable < 2 && baby.hungry < 2 && baby.lastRocked < 100 && baby.lastSlept < 5000) {			
			babyState.sleep();
			baby.lastSlept = timer;
		}
	},
	change : function (){
		if (baby.dirtyDiaper == true ) {
			baby.dirtyDiaper = false			
		}
	}
}