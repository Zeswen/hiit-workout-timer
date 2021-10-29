const timerRef = document.querySelector("#timer");
const workoutRef = document.querySelector("#workout");
const resetRef = document.querySelector("#reset");
const restRef = document.querySelector("#rest");
const exerciseSecondsInputRef = document.querySelector("#exercise-seconds");
const exerciseCountInputRef = document.querySelector("#exercise-count");
const restSecondsInputRef = document.querySelector("#rest-seconds");

const beep = new Audio("assets/beep.mp3");
const boop = new Audio("assets/boop.mp3");

// Modifiable
let exerciseSeconds = 20;
let exerciseCount = 9;
let restSeconds = 120;

// Internal
let timer = 0;
let rest = false;
let interval;

const startTimer = () => {
  interval = createInterval();
  exerciseSecondsInputRef.disabled = true;
  exerciseCountInputRef.disabled = true;
  restSecondsInputRef.disabled = true;
  workoutRef.innerHTML = "Stop";
};

const stopTimer = () => {
  clearInterval(interval);
  interval = null;
  workoutRef.innerHTML = "Start";
};

const resetTimer = () => {
  timer = 0;
  exerciseSecondsInputRef.disabled = false;
  exerciseCountInputRef.disabled = false;
  restSecondsInputRef.disabled = false;
  timerRef.innerHTML = "00:00";
};

const padNum = (num) => `0${parseInt(num)}`.slice(-2);

const setTimerText = () => {
  const minutes = padNum(timer / 60);
  const seconds = padNum(timer % 60);
  timerRef.innerHTML = `${minutes}:${seconds}`;
};

const createInterval = () =>
  setInterval(() => {
    timer += 1;
    setTimerText();

    const setSeconds = exerciseSeconds * exerciseCount;
    const setAndRestSeconds = setSeconds + restSeconds;
    const set = Math.floor(timer / setAndRestSeconds);

    if (timer % setAndRestSeconds === 0) {
      rest = false;
      restRef.innerHTML = "Not resting.";
      boop.play();
    } else if (timer % (set * setAndRestSeconds + setSeconds) === 0) {
      rest = true;
      restRef.innerHTML = "Resting.";
      boop.play();
    } else if (!rest && timer % exerciseSeconds === 0) {
      beep.play();
    }
  }, 1000);

const handleWorkoutButtonPress = () => {
  if (interval) {
    stopTimer();
  } else {
    startTimer();
  }
};

const handleResetButtonPress = () => {
  stopTimer();
  resetTimer();
};

const setTexts = () => {
  setTimerText();
  console.log(exerciseSecondsInputRef.innerHTML);
  exerciseSecondsInputRef.value = exerciseSeconds.toString();
  exerciseCountInputRef.value = exerciseCount.toString();
  restSecondsInputRef.value = restSeconds.toString();
};

const setEventListeners = () => {
  exerciseSecondsInputRef.addEventListener("input", (e) => {
    exerciseSeconds = Number(e.target.value);
  });
  exerciseCountInputRef.addEventListener("input", (e) => {
    exerciseCount = Number(e.target.value);
  });
  restSecondsInputRef.addEventListener("input", (e) => {
    restSeconds = Number(e.target.value);
  });
};

const setup = () => {
  setTexts();
  setEventListeners();
};

setup();
