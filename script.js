// Global Constants
var clueHoldTime; // how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

// Global Variables

// [2, 2, 4, 5, 3, 2, 1, 2, 4, 5]
var pattern = [];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5 // must be between 0.0 and 1.0
var guessCounter = 0;
var mistakes;



function generatePattern() {
  
  // We want numbers in the range 1-5
  let num = Math.random()*(6-1) + 1;
  
  
  for (let i = 0; i < 10; i++) {
    num = Math.random()*(6-1) + 1;
    pattern.push(Math.floor(num));
  }
}

// Start and stop functions
function startGame() {
  // initialize game variables
  progress = 0;
  gamePlaying = true;
  mistakes = 3;
  
  // generate random secret pattern
  generatePattern();
  
  
  // swap stop and start buttons so stop appears
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  
  
  // remove welcome message
  document.getElementById("welcomeMessage").classList.add("hidden");
  
  
  // show directions
  document.getElementById("directions").classList.remove("hidden");
  
  
  // show tries left
  document.getElementById("triesLeft").classList.remove("hidden");
  document.getElementById("triesLeft").innerHTML = "Tries Left: " + mistakes;
  
  playClueSequence();
}



function stopGame() {
  
  // set game variables
  gamePlaying = false;
  
  // swap stop and start buttons so start appears
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
  
  // Hide tries left and directions
  document.getElementById("triesLeft").classList.add("hidden");
  document.getElementById("directions").classList.add("hidden");
}


// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 369.994
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)


// Lighting and clearing buttons
function lightButton(btn) {
  document.getElementById("button"+btn).classList.add("lit");
}

function clearButton(btn) {
  document.getElementById("button"+btn).classList.remove("lit");
}


function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}


function playClueSequence() {
  guessCounter = 0;
  let delay = nextClueWaitTime; // Set delay to initial wait time
  
  clueHoldTime = 1000;
  for (let i = 0; i <= progress; i++) {
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
    
    // Decrease clue hold time for each turn
    clueHoldTime -= 10;
  }
  
}

function loseGame() {
  stopGame();
  alert("Game Over. You lost.");
}

function winGame() {
  stopGame();
  alert("Game Over. You won!");
}

function guess(btn) {
  console.log("user guessed: " + btn);
  if (!gamePlaying) {
    return;
  }
  
  // guess is correct
  if (pattern[guessCounter] == btn) {
    
    // turn is over
    if (guessCounter == progress) {
      
      // this is last turn so you win
      if (progress == pattern.length-1) {
        winGame();
      } else {
        progress++;
        playClueSequence();
      }
      
      
    } else {
      guessCounter++;
    }
    
  } else {
    
    // user loses when they make 3 mistakes
    if (mistakes > 1) {
      mistakes--;
      console.log("You have " + mistakes + " tries left.");
      document.getElementById("triesLeft").innerHTML = "Tries Left: " + mistakes;
      
      
      playClueSequence();
    } else {
      loseGame();
    }
    
  }
  
}

