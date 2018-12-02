var timer = 0;

//  1 hour = 5000
// 30 mins = 2500
// 15 mins = 1250
//  5 mins = 415
//  1 min  = 80

var setup = {
  gameState: "pause",
  gameTime: 60000,
  updateHunger: 2500,
  updateTired: 2500,
  updateUncomfortable: 2500,
  score: {
    stateChange: {
	  smile: 1000,
	  content: 300,
	  cry: -100,
	  wail: -500,
	  sleep: 2000		
	},
	state: {
	  smile: 10,
	  content: 5,
	  cry: 0,
	  wail: 0,
	  sleep: 100
	}
  },
  fussiness: {
    smile: -2,
	content: -1,
	cry: 1,
	wail: 1,
	sleep: -2	
  },	  
   
  startGame: function () {
    this.gameState = "play"
    document.getElementsByClassName('container__start')[0].style.display = "none";
    baby.parentName = document.getElementById("username").value;
    xAPIlaunched(baby.parentName);
  },
  gameOver: function () {
    if (timer > this.gameTime) {
      document.getElementsByClassName('container__start-finish')[0].style.display = "block";
	  xAPIcompleted(baby.parentName, score.calcScore());
	  showLeaderBoard(baby.parentName, score.calcScore());
      this.gameState = "stop"
    }
  },
  restart: function () {
    this.gameState = "play"
    baby.fussy.calcFussiness("restart");
    timer = 0;
    baby.hungry = 5;
    baby.tired = 5;
    baby.uncomfortable = 5;
    parentActions.lastFedTimestamp = 0;
    parentActions.clearCounters();
    parentActions.lastRockedTimestamp = 0;
    baby.slept.lastSleptTimeStamp = 0;
    baby.pooped.dirtyDiaper = false;
    baby.pooped.poopTimerTimestamp = 0;
    score.resetScore();	
	xAPIlaunched(baby.parentName);
    document.getElementsByClassName('container__start-finish')[0].style.display = "none";
	table = document.getElementsByClassName('container__table-high-score')[0];	
	var rows = table.rows;
    var i = rows.length;
    while (--i) {
      rows[i].parentNode.removeChild(rows[i]);     
    }
    }
}

var baby = {
  parentName: "",
  fussy: {
    fussiness: 0,
    calcFussiness: function (source) {
      f = Math.floor(Math.random() * (8 - 1 + 1)) + 1;
      if (this.fussiness == 0) {
        this.fussiness = f;
      } else if (source == "restart") {
        this.fussiness = f;
      }
    },
    updateFussiness: function (state, currentState) {
      if (currentState != state) {
	    if(currentState == "wail" && state == "cry"){
			this.fussiness -=2
		}
        switch (state) {
          case "smile":
            if (this.fussiness <= 10 && this.fussiness >= 2 && currentState != "smile") {
              this.fussiness += setup.fussiness.smile;
              score.fussy.incrementScore("smile");
			  scoreAnimation.animate("smile");
            }
            break;
          case "content":
            if (this.fussiness <= 10 && this.fussiness >= 1 && currentState != "content") {
              this.fussiness += setup.fussiness.content;
              score.fussy.incrementScore("content");
			  scoreAnimation.animate("content");
            }
            break;
          case "cry":
            if (this.fussiness < 10 && currentState != "cry") {
              this.fussiness += setup.fussiness.cry;
              score.fussy.incrementScore("cry");
			  scoreAnimation.animate("cry");
            }
            break;
          case "wail":
            if (this.fussiness < 10 && currentState != "wail") {
              this.fussiness += setup.fussiness.wail;
              score.fussy.incrementScore("wail");
			  scoreAnimation.animate("wail");
            }
            break;
          case "sleep":
            if (this.fussiness <= 10 && this.fussiness >= 2 && currentState != "sleep") {
              this.fussiness += setup.fussiness.sleep;
              score.fussy.incrementScore("sleep");
			  scoreAnimation.animate("sleep");
            }
            break;
          default:

        }
      }
    },
  },
  state: "",
  hungry: 5,
  tired: 5,
  uncomfortable: 5,
  slept: {
    lastSleptTimeStamp: 0,
    lastSlept: function () {
      return timer - this.lastSleptTimeStamp
    }
  },
  pooped: {
    dirtyDiaper: false,
    poopTimerTimestamp: 0,
    poopTimer: function () {
      return timer - this.poopTimerTimestamp
    }
  }

}

setInterval(updateHunger, setup.updateHunger);
setInterval(updateTired, setup.updateTired);
setInterval(updateUncomfortable, setup.updateUncomfortable);

function updateHunger() {
  if (baby.hungry < 5) {
    baby.hungry++
  }
}

function updateTired() {
  if (baby.tired < 5) {
    baby.tired++
  }
}

function updateUncomfortable() {
  if (baby.uncomfortable < 5) {
    baby.uncomfortable++
  }
}


var babyActions = {  
  sleep: function () {
    if (baby.uncomfortable < 2 && baby.hungry < 2 && parentActions.lastRocked() < 2000 && baby.slept.lastSlept() > 10000 && baby.pooped.dirtyDiaper == false && baby.state != "sleep") {
      babyState.sleep();
      baby.state = "sleep";
      baby.slept.lastSleptTimeStamp = timer;      
    } else if (baby.state == "sleep") {
	  if (baby.uncomfortable < 2 && baby.hungry < 2 && parentActions.lastRocked() < 2000 && baby.slept.lastSlept() < 10000 && baby.pooped.dirtyDiaper == false){
	    return true;
	  } else {
	    whichState();
	  }
	}
  },
  poop: function (increment) {    
      if (baby.pooped.poopTimerTimestamp == 0) {
        baby.pooped.poopTimerTimestamp = timer;
      }
      if (baby.pooped.poopTimer() > 10000) {
        baby.pooped.dirtyDiaper = true;
        baby.pooped.poopTimerTimestamp = timer;
      }     
  }
}

var parentActions = {
  clearCounters: function(){
	this.feedCounter = 0;
	this.rockCounter = 0;
  },
  feed: function () {
    if (baby.hungry <= 6 && baby.hungry > 0) {      
      this.feedActions();      
    }

  },
  feedActions: function () {
    baby.hungry -= 1
    this.lastFedTimestamp = timer;
    this.feedCounter = 0;
    babyActions.sleep();
    babyActions.poop('feed');
  },
  feedCounter: 0,
  toFeed: function () {
    if (this.feedCounter == baby.fussy.fussiness) {
      this.feed();
    } else if (this.feedCounter != baby.fussy.fussiness && this.feedCounter != 10){
      this.feedCounter++;
    } else {
	  this.feed();
	}
  },
  lastFedTimestamp: 0,
  lastFed: function () {
    return timer - this.lastFedTimestamp
  },


  rock: function (counter) {
    if (baby.uncomfortable <= 6 && baby.uncomfortable > 0) {      
      this.rockActions();      
    }
  },
  rockActions: function () {
    baby.uncomfortable -= 1
    this.rockCounter = 0;
    this.lastRockedTimestamp = timer;
    babyActions.sleep();
  },
  rockCounter: 0,
  toRock: function () {
    if (this.rockCounter == baby.fussy.fussiness) {
      this.rock();
    } else if (this.rockCounter != baby.fussy.fussiness && this.rockCounter != 10){
      this.rockCounter++;
    } else {
	  this.rock();
	}
  },
  lastRockedTimestamp: 0,
  lastRocked: function () {
    return timer - this.lastRockedTimestamp
  },

  change: function () {
    if (baby.pooped.dirtyDiaper == true) {
      baby.pooped.dirtyDiaper = false;	  
      babyActions.sleep();
    }
  }
}


var babyState = {
  
	  smile: function () {
		document.getElementById('baby-img').setAttribute("src", "img/baby/smile.png");
		baby.fussy.updateFussiness("smile", baby.state);
		baby.state = "smile";
	  },
	  content: function () {
		document.getElementById('baby-img').setAttribute("src", "img/baby/content.png");
		baby.fussy.updateFussiness("content", baby.state);
		baby.state = "content";
	  },
	  cry: function () {
		document.getElementById('baby-img').setAttribute("src", "img/baby/cry.gif");
		baby.fussy.updateFussiness("cry", baby.state);
		baby.state = "cry";
	  },
	  wail: function () {
		document.getElementById('baby-img').setAttribute("src", "img/baby/wail.gif");
		baby.fussy.updateFussiness("wail", baby.state);
		baby.state = "wail";
	  },
	  wailPooped: function () {
		document.getElementById('baby-img').setAttribute("src", "img/baby/wail-pooped.gif");
		baby.state = "wail-pooped";
	  },
	  sleep: function () {
		document.getElementById('baby-img').setAttribute("src", "img/baby/sleep.gif");
		parentActions.clearCounters();
		baby.fussy.updateFussiness("sleep", baby.state);		
		baby.state = "sleep";
	  }
  
}



function whichState(){
   
   if (baby.hungry == 5 || baby.uncomfortable == 5 || baby.pooped.dirtyDiaper == true) {
      babyState.wail();
    } else if (baby.hungry == 4 || baby.uncomfortable == 4) {
      babyState.cry();
    } else if (baby.hungry == 3 || baby.uncomfortable == 3) {
      babyState.content();
    } else if (baby.hungry <= 2 || baby.uncomfortable <= 2) {    
	  babyState.smile();	
    } else {
       //
    }
}

setInterval(updateStates, 100);

function updateStates(state) {
  
  if(setup.gameState == "play"){    
	
	if(baby.state != "sleep"){
	  if (baby.hungry == 5 || baby.uncomfortable == 5 || baby.pooped.dirtyDiaper == true) {
        if(baby.pooped.dirtyDiaper && baby.state != "wail-pooped"){
		  babyState.wailPooped();
	    } else if (baby.state != "wail" && baby.state != "wail-pooped") {		
		  babyState.wail();	
	    }	  
    } else if (baby.hungry == 4 || baby.uncomfortable == 4 && baby.state != "cry") {
      babyState.cry();
    } else if (baby.hungry == 3 || baby.uncomfortable == 3 ) {
      babyState.content();
    } else if (baby.hungry <= 2 || baby.uncomfortable <= 2 ) {    
	  babyState.smile();	
    } else {
       baby.state = baby.state;
    }
	
  }    	
  
   babyActions.sleep();
   timer += 100;
   score.stateScore.incrementScore(baby.state);
   setup.gameOver();
   babyActions.poop();
   baby.fussy.calcFussiness();
   document.getElementsByClassName('hungry')[0].innerHTML = baby.hungry;
   document.getElementsByClassName('uncomfortable')[0].innerHTML = baby.uncomfortable;
   document.getElementsByClassName('rawFussiness')[0].innerHTML = baby.fussy.fussiness;
   document.getElementsByClassName('dirtydiaper')[0].innerHTML = baby.pooped.dirtyDiaper;
   document.getElementsByClassName('state')[0].innerHTML = baby.state;
   document.getElementsByClassName('feed-counter')[0].innerHTML = parentActions.feedCounter;
   document.getElementsByClassName('rock-counter')[0].innerHTML = parentActions.rockCounter;
  
  }
}

var scoreAnimation = {
    animateAllStates: function() {
	  document.getElementById("scoreAnimation").classList.toggle("container__score-animation-hidden");
      setTimeout(function(){ 
        document.getElementById("scoreAnimation").classList.toggle("container__score-animation-hidden");
      }, 500);	
	},
	animate: function(state){
	
	switch (state){
	    case "smile":
		  document.getElementById("scoreAnimation").innerHTML = "<span style=\"color:green; font-size:1.5em;\">+" + setup.score.stateChange.smile + "</span>";
		  this.animateAllStates();
		  break;
	    case "content":
		  document.getElementById("scoreAnimation").innerHTML = "<span style=\"color:green; font-size:1.5em;\">+" + setup.score.stateChange.content + "</span>";
		  this.animateAllStates();
		  break;
		case "cry":	
		  document.getElementById("scoreAnimation").innerHTML = "<span style=\"color:red; font-size:1.5em;\">" + setup.score.stateChange.cry + "</span>";
		  this.animateAllStates();
		  break;
		case "wail":
		  document.getElementById("scoreAnimation").innerHTML = "<span style=\"color:red; font-size:1.5em;\">" + setup.score.stateChange.wail +  "</span>";
		  this.animateAllStates();
		  break;
		case "sleep":
		  document.getElementById("scoreAnimation").innerHTML = "<span style=\"color:green; font-size:1.5em;\">+" + setup.score.stateChange.sleep + "</span>";
		  this.animateAllStates();
		  break;
		default:		
	}
	
	  
	}
}

var score = {
  calcScore: function () {
    return this.fussy.score + this.stateScore.score;
  },
  stateScore: {
	score: 0,
	incrementScore: function(state){
	  switch (state){
	    case "smile":
		  this.score += setup.score.state.smile;
          score.displayScore();
		  break;
	    case "content":
		  this.score += setup.score.state.content;
          score.displayScore();
		  break;
		case "cry":		
		  break;
		case "wail":		 
		  break;
		case "sleep":		  
		    this.score += setup.score.state.sleep;
            score.displayScore();		 
		  break;
		default:		
	  }	  
	}
  },  
  fussy: {
    score: 0,
    incrementScore: function (state) {
      switch (state) {
        case "smile":
          this.score += setup.score.stateChange.smile;
          score.displayScore();
          break;
        case "content":
          this.score += setup.score.stateChange.content;
          score.displayScore();
          break;
        case "cry":
          if(score.calcScore() >= Math.abs(setup.score.stateChange.cry)){
		    this.score += setup.score.stateChange.cry;
            score.displayScore();
		   }
          break;
        case "wail":
          if(score.calcScore() >= Math.abs(setup.score.stateChange.wail)){
		    this.score += setup.score.stateChange.wail;
            score.displayScore();
		   }
          break;
        case "sleep":
          this.score += setup.score.stateChange.sleep;
          score.displayScore();
          break;
        default:
      }
    }
  },
  resetScore: function () {
    this.fussy.score = 0;
	this.stateScore.score = 0;
    score.displayScore();
  },
  displayScore: function () {
    document.getElementsByClassName('sleep-score')[0].innerHTML = this.fussy.score + this.stateScore.score;
    document.getElementsByClassName('sleep-score')[1].innerHTML = this.fussy.score + this.stateScore.score;
  }
}