// Refs
const timerRef = document.querySelector("#timer");
const workoutRef = document.querySelector("#workout");
const resetRef = document.querySelector("#reset");
const restRef = document.querySelector("#rest");

const exerciseSecondsInputRef = document.querySelector("#exercise-seconds");
const exerciseCountInputRef = document.querySelector("#exercise-count");
const restSecondsInputRef = document.querySelector("#rest-seconds");

const exerciseSecondsSpanRefs = document.querySelectorAll(".exercise-seconds");
const exerciseCountSpanRefs = document.querySelectorAll(".exercise-count");
const restSecondsSpanRefs = document.querySelectorAll(".rest-seconds");

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
let countdownInterval;
let countdown = 3;

const padNum = (num) => `0${parseInt(num)}`.slice(-2);

const processCountdown = (resolve) => {
  if (countdown === 0) {
    resolve();
    clearInterval(countdownInterval);
    countdownInterval = null;
  } else {
    workoutRef.innerHTML = countdown;
    countdown -= 1;
  }
};

const startCountdown = async () => {
  await new Promise((resolve) => {
    countdown = 3;

    countdownInterval = setInterval(() => {
      processCountdown(resolve);
    }, 1000);
    processCountdown(resolve);
  });
};

const startTimer = async () => {
  rest = false;
  exerciseSecondsInputRef.disabled = true;
  exerciseCountInputRef.disabled = true;
  restSecondsInputRef.disabled = true;
  await startCountdown();
  interval = createInterval();
  workoutRef.innerHTML = "Stop";
};

const stopTimer = () => {
  clearInterval(interval);
  clearInterval(countdownInterval);
  interval = null;
  countdownInterval = null;
  workoutRef.innerHTML = "Start";
};

const resetTimer = () => {
  timer = 0;
  exerciseSecondsInputRef.disabled = false;
  exerciseCountInputRef.disabled = false;
  restSecondsInputRef.disabled = false;
  timerRef.innerHTML = "00:00";
};

const setTimerText = () => {
  const minutes = padNum(timer / 60);
  const seconds = padNum(timer % 60);
  timerRef.innerHTML = `${minutes}:${seconds}`;
};

const setRest = (resting) => {
  rest = resting;
  restRef.innerHTML = resting ? "Resting." : "Not resting.";
};

const createInterval = () => {
  beep.play();
  return setInterval(() => {
    timer += 1;
    setTimerText();

    const setSeconds = exerciseSeconds * exerciseCount;
    const setAndRestSeconds = setSeconds + restSeconds;
    const set = Math.floor(timer / setAndRestSeconds);

    if (timer % setAndRestSeconds === 0) {
      setRest(false);
      beep.play();
    } else if (timer % (set * setAndRestSeconds + setSeconds) === 0) {
      setRest(true);
      boop.play();
    } else if (!rest && timer % (set * restSeconds + exerciseSeconds) === 0) {
      beep.play();
    }
  }, 1000);
};

const handleWorkoutButtonPress = () => {
  if (interval || countdownInterval) {
    stopTimer();
  } else {
    startTimer();
  }
};

const handleResetButtonPress = () => {
  stopTimer();
  resetTimer();
};

const setSpanValue = (node, value, suffix) => {
  node.innerHTML = `${value} ${suffix}`;
};

const initTexts = () => {
  setTimerText();
  exerciseSecondsInputRef.value = exerciseSeconds.toString();
  exerciseCountInputRef.value = exerciseCount.toString();
  restSecondsInputRef.value = restSeconds.toString();
  exerciseSecondsSpanRefs.forEach((node) => {
    setSpanValue(node, exerciseSeconds.toString(), "seconds");
  });
  exerciseCountSpanRefs.forEach((node) => {
    setSpanValue(node, exerciseCount.toString(), "exercises");
  });
  restSecondsSpanRefs.forEach((node) => {
    setSpanValue(node, restSeconds.toString(), "seconds");
  });
};

const initEventListeners = () => {
  exerciseSecondsInputRef.addEventListener("input", (e) => {
    const { value } = e.target;
    exerciseSeconds = Number(value);
    exerciseSecondsSpanRefs.forEach((node) =>
      setSpanValue(node, value, "seconds")
    );
  });
  exerciseCountInputRef.addEventListener("input", (e) => {
    const { value } = e.target;
    exerciseCount = Number(value);
    exerciseCountSpanRefs.forEach((node) =>
      setSpanValue(node, value, "exercises")
    );
  });
  restSecondsInputRef.addEventListener("input", (e) => {
    const { value } = e.target;
    restSeconds = Number(value);
    restSecondsSpanRefs.forEach((node) => setSpanValue(node, value, "seconds"));
  });
};

const setup = () => {
  initTexts();
  initEventListeners();
};

setup();
