var timer = 0;

//  1 hour = 5000
// 30 mins = 2500
// 15 mins = 1250
//  5 mins = 415
//  1 min  = 80

var setup = {
  gameTime: 1000,
  updateHunger: 2500,
  updateTired: 2500,
  updateUncomfortable: 2500,
  gameOver: function() {
    if (timer > this.gameTime) {
      document.getElementsByClassName('container__game-over')[0].style.display = "block";
    }
  },
  restart: function() {
    baby.fussy.calcFussiness("restart");
    timer = 0;
    baby.hungry = 0;
    baby.tired = 5;
    baby.uncomfortable = 5;
    baby.fed.lastFedTimestamp = 0;
    baby.rocked.lastRockedTimestamp = 0;
    baby.slept.lastSleptTimeStamp = 0;
    baby.pooped.dirtyDiaper = false;
    baby.pooped.poopTimerTimestamp = 0;
    score.resetScore();
    document.getElementsByClassName('container__game-over')[0].style.display = "none";
  }
}

var baby = {
  name: "",
  fussy: {
    fussiness: 0,
    fussinessMultiplier: 0,
    calcFussiness: function(source) {
      f = Math.floor(Math.random() * 5) + 6;
      if (this.fussiness == 0) {
        this.fussiness = f;
        this.fussinessMultiplier = this.fussiness / 10;
      } else if (source == "restart") {
        this.fussiness = f;
        this.fussinessMultiplier = this.fussiness / 10;
      }
    },
    updateFusiness: function(state) {
      switch (state) {
        case "smile":
          if (this.fussinessMultiplier >= 0.5 && this.fussinessMultiplier < 1) {
            this.fussinessMultiplier += 0.1;
            score.fussy.incrementScore("smile");
          }
          break;
        case "content":
          if (this.fussinessMultiplier >= 0.5 && this.fussinessMultiplier < 1) {
            this.fussinessMultiplier += 0.05;
            score.fussy.incrementScore("content");
          }
          break;
        case "cry":
          if (this.fussinessMultiplier >= 0.6) {
            this.fussinessMultiplier -= 0.05;
            score.fussy.incrementScore("cry");
          }
          break;
        case "wail":
          if (this.fussinessMultiplier >= 0.6) {
            this.fussinessMultiplier -= 0.1;
            score.fussy.incrementScore("wail");
          }
          break;
        case "sleep":
          if (this.fussinessMultiplier >= 0.5 && this.fussinessMultiplier < 0.95) {
            this.fussinessMultiplier += 0.05;
            score.fussy.incrementScore("sleep");
          }
          break;
        default:

      }
    },
  },
  state: "wail",
  hungry: 5,
  tired: 5,
  uncomfortable: 5,
  fed: {
    lastFedTimestamp: 0,
    lastFed: function() {
      return timer - this.lastFedTimestamp
    },
  },
  rocked: {
    lastRockedTimestamp: 0,
    lastRocked: function() {
      return timer - this.lastRockedTimestamp
    }
  },
  slept: {
    lastSleptTimeStamp: 0,
    lastSlept: function() {
      return timer - this.lastSleptTimeStamp
    }
  },
  pooped: {
    dirtyDiaper: false,
    poopTimerTimestamp: 0,
    poopTimer: function() {
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
  sleep: function() {
    if (baby.uncomfortable < 2 && baby.hungry < 2 && baby.rocked.lastRocked() < 2000 && baby.slept.lastSlept() > 10000 && baby.pooped.dirtyDiaper == false && baby.state != "sleep") {
      babyState.sleep();
      baby.state = "sleep";
      baby.slept.lastSleptTimeStamp = timer;
      baby.fussy.updateFusiness("sleep");
      score.sleep.incrementScore();
    }
  },
  poop: function(increment) {
    if (increment == 'feed') {
      if (baby.pooped.poopTimerTimestamp == 0) {
        baby.pooped.poopTimerTimestamp = timer
      } else {
        if (baby.pooped.poopTimer() > 10000) {
          baby.pooped.dirtyDiaper = true;
          baby.pooped.poopTimerTimestamp = timer;
        }
      }
    } else {
      if (baby.pooped.poopTimer() > 10000) {
        baby.pooped.dirtyDiaper = true
      }
    }
  }
}

var parentActions = {
  feed: function() {
    if (baby.hungry <= 6 && baby.hungry > 0) {
      baby.hungry = baby.hungry - (1 * baby.fussy.fussinessMultiplier);
      baby.fed.lastFedTimestamp = timer;
      babyActions.sleep();
      babyActions.poop('feed');
    }
  },
  rock: function() {
    if (baby.uncomfortable <= 6 && baby.uncomfortable > 0) {
      baby.uncomfortable = baby.uncomfortable - (1 * baby.fussy.fussinessMultiplier);
      baby.rocked.lastRockedTimestamp = timer;
      babyActions.sleep();
    }
  },
  change: function() {
    if (baby.pooped.dirtyDiaper == true) {
      baby.pooped.dirtyDiaper = false;
      babyActions.sleep();
    }
  }
}

var babyState = {
  smile: function() {
    document.getElementById('baby-img').setAttribute("src", "img/baby/smile.png");
    baby.state = "smile";
  },
  content: function() {
    document.getElementById('baby-img').setAttribute("src", "img/baby/content.png");
    baby.state = "content";
    baby.fussy.updateFusiness("content");
  },
  cry: function() {
    document.getElementById('baby-img').setAttribute("src", "img/baby/cry.gif");
    baby.state = "cry";
    baby.fussy.updateFusiness("cry");
  },
  wail: function() {
    document.getElementById('baby-img').setAttribute("src", "img/baby/wail.gif");
    baby.state = "wail";
    baby.fussy.updateFusiness("wail");
  },
  sleep: function() {
    document.getElementById('baby-img').setAttribute("src", "img/baby/sleep.gif");
    baby.state = "sleep";

  }
}

setInterval(updateStates, 100);

function updateStates() {
  if ((baby.hungry >= 4 || baby.uncomfortable >= 4) && baby.state != "wail") {
    babyState.wail();
  } else if (((baby.hungry >= 3 && baby.hungry < 4) || (baby.uncomfortable >= 3 && baby.uncomfortable < 4)) && baby.pooped.dirtyDiaper == false && baby.state != "cry") {
    babyState.cry();
  } else if (((baby.hungry >= 2 && baby.hungry < 3) || (baby.uncomfortable >= 2 && baby.uncomfortable < 3)) && baby.pooped.dirtyDiaper == false && baby.state != "content") {
    babyState.content();
  } else if (((baby.hungry >= 1 && baby.hungry < 2) || (baby.uncomfortable >= 1 && baby.uncomfortable < 2)) && baby.pooped.dirtyDiaper == false && baby.state != "smile") {
    babyState.smile();
  }
}


setInterval(automatic, 100)

function automatic() {
  babyActions.poop();

  timer += 100;
  document.getElementById('game-time').innerHTML = timer / 1000;

  baby.fussy.calcFussiness();
  document.getElementById('fussiness').innerHTML = Math.round(Math.abs((baby.fussy.fussinessMultiplier - 1) * 10) * 100) / 100;

  setup.gameOver();
}

var score = {
  sleep: {
    score: 0,
    incrementScore: function() {
      this.score++;
      score.displayScore();
    }
  },
  fussy: {
    score: 0,
    incrementScore: function(state) {
      switch (state) {
        case "smile":
          this.score += 0.1;
          score.displayScore();
          break;
        case "content":
          this.score += 0.05;
          score.displayScore();
          break;
        case "cry":
          this.score -= 0.05;
          score.displayScore();
          break;
        case "wail":
          this.score -= 0.1;
          score.displayScore();
          break;
        case "sleep":
          this.score += 0.1;
          score.displayScore();
          break;
        default:
      }
    }
  },
  resetScore: function() {
    this.sleep.score = 0;
    this.fussy.score = 0;
    score.displayScore();
  },
  displayScore: function() {
    document.getElementsByClassName('sleep-score')[0].innerHTML = this.fussy.score + this.sleep.score;
    document.getElementsByClassName('sleep-score')[1].innerHTML = this.fussy.score + this.sleep.score;
  }
}