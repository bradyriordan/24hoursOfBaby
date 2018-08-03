var timer = 0;

//  1 hour = 5000
// 30 mins = 2500
// 15 mins = 1250
//  5 mins = 415
//  1 min  = 80

var setup = {
	gameTime: 24000,
	updateHunger : 2500,
	updateTired : 1250,
	updateUncomfortable : 1250,
	gameOver : function() {if (timer > this.gameTime){document.getElementById('game-over').style.display = "block";}}
}

var baby = {
  name : "",
  hungry : 5,
  tired : 5,
  uncomfortable : 5,
  fed : {
	lastFedTimestamp : 0,	
	lastFed : function (){return timer - this.lastFedTimestamp},	
  },
  rocked : {
	  lastRockedTimestamp : 0,
	  lastRocked : function (){return timer - this.lastRockedTimestamp}
    },
  slept : {
	  lastSleptTimeStamp : 0,
	  lastSlept : function (){return timer - this.lastSleptTimeStamp}
    },
  pooped : {
	  dirtyDiaper : false,
	  poopTimerTimestamp : 0,
	  poopTimer : function (){return timer - this.poopTimerTimestamp}	  
  } 
  
}

setInterval(updateHunger, setup.updateHunger);
setInterval(updateTired, setup.updateTired);
setInterval(updateUncomfortable, setup.updateUncomfortable);

function updateHunger() {if (baby.hungry < 5){baby.hungry++}}
function updateTired() {if (baby.tired < 5){baby.tired++}}
function updateUncomfortable(){if (baby.uncomfortable < 5){baby.uncomfortable++}}


var babyActions = {
  sleep : function (){
	if (baby.uncomfortable < 2 && baby.hungry < 2 && baby.rocked.lastRocked() < 2000 && baby.slept.lastSlept() > 10000 && baby.dirtyDiaper == false) {			
	  babyState.sleep();
	  baby.slept.lastSleptTimeStamp = timer;
	  score.sleep.incrementScore();
	}
  },
  poop : function (increment){	
    if (increment == 'feed'){	  
	  if (baby.pooped.poopTimerTimestamp == 0){
		  baby.pooped.poopTimerTimestamp = timer		  
	  } else {
		  if (baby.pooped.poopTimer() > 10000){
			  baby.dirtyDiaper = true
			  baby.pooped.poopTimerTimestamp = timer
		  }
	  }
	} else {
	  if (baby.pooped.poopTimer() > 10000){
	    baby.dirtyDiaper = true		
	  } 
	}
  }
}

var parentActions = {
	feed : function (){
		if (baby.hungry <= 5 && baby.hungry > 0) {
			baby.hungry--			
			baby.fed.lastFedTimestamp = timer;			
			babyActions.sleep();
			babyActions.poop('feed');
		}
	},	
	rock : function (){
		if (baby.uncomfortable <= 5 && baby.uncomfortable > 0) {
			baby.uncomfortable--
			baby.rocked.lastRockedTimestamp = timer;
			babyActions.sleep();
		}
	},	
	change : function (){
		if (baby.dirtyDiaper == true ) {
			baby.dirtyDiaper = false			
		}
	}
}

var babyState = {
  smile : function (){document.getElementById('baby-img').setAttribute("src", "img/baby/smile.jpg");},
  content : function (){document.getElementById('baby-img').setAttribute("src", "img/baby/content.jpg");},
  cry : function (){document.getElementById('baby-img').setAttribute("src", "img/baby/cry.jpg");},
  wail : function (){document.getElementById('baby-img').setAttribute("src", "img/baby/wail.jpg");},
  sleep : function (){document.getElementById('baby-img').setAttribute("src", "img/baby/sleep.jpg") ;}
}

setInterval(updateStates, 100);

function updateStates(){
  if (baby.hungry == 5 || baby.uncomfortable == 5 ){
    babyState.wail();
  } else if (baby.hungry == 4 || baby.uncomfortable == 4 && baby.dirtyDiaper == false ){
    babyState.cry();
  } else if (baby.hungry == 3 || baby.uncomfortable == 3 && baby.dirtyDiaper == false ){
    babyState.content();
  } else if (baby.hungry == 2 || baby.uncomfortable == 2 && baby.dirtyDiaper == false ){
    babyState.smile();
  }
  babyActions.poop('auto');
  setup.gameOver();  
  timer += 100;
}

var score = {
	sleep : {
		score : 0,
		incrementScore : function () {
		  this.score++; 
		  document.getElementsByClassName('sleep-score')[0].innerHTML = this.score
		  document.getElementsByClassName('sleep-score')[1].innerHTML = this.score		  
		}
	}
}