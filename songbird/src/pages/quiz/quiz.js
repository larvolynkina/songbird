import './quiz.html';
import '@babel/polyfill';
import '../../sass/style.scss';
import birdsData from '../../js/birds';
import content from '../../js/content';
import {
  getLanguageSettings,
  createNavLinks,
  createHtmlQuiz,
  createMixNumbersArr,
  pickSecretNumber,
  checkCurrentQuestion,
  checkIfDigitLessThanTen,
} from '../../js/functions';

import { moveAudioCircle, setVolume } from '../../js/audioplayer';

import errorSound from '../../assets/sounds/error.mp3';
import successSound from '../../assets/sounds/success.mp3';
import playIco from '../../assets/icons/play.svg';
import pauseIco from '../../assets/icons/pause.svg';
import unknownBird from '../../assets/images/unknown-bird.png';

let lang = getLanguageSettings();
const data = content[lang];
const birds = birdsData[lang];

let score = 0;
let progressValue = 0;

createNavLinks(data);
createHtmlQuiz(data);

function fillVariantsContent() {
  score += 5;
  const secretNumber = pickSecretNumber();
  console.log(secretNumber);
  const generatedArr = createMixNumbersArr();
  console.log(generatedArr);
  const currentQuestionIndex = checkCurrentQuestion();
  const variantsList = document.querySelector('.variants__list');
  generatedArr.forEach((value) => {
    const item = document.createElement('li');
    item.classList.add('variants__item');
    item.innerText = birds[currentQuestionIndex][value - 1].name;
    const span = document.createElement('span');
    span.classList.add('variants__indicator');
    item.prepend(span);
    item.id = birds[currentQuestionIndex][value - 1].id;
    variantsList.append(item);
  });
  return secretNumber;
}

let secretNumber = fillVariantsContent();

function createAudioForSecretBird() {
  const currentQuestionIndex = checkCurrentQuestion();
  const currentBird = birds[currentQuestionIndex].filter(
    (value) => value.id === secretNumber
  );
  secretAudio.src = currentBird[0].audio;
  secretAudio.addEventListener('canplay', () => {
    const durationOnPage = document.querySelector('#duration');
    const duration = Math.round(secretAudio.duration);
    const minutes = checkIfDigitLessThanTen(Math.floor(duration / 60));
    const seconds = checkIfDigitLessThanTen(duration - minutes * 60);
    durationOnPage.innerText = `${minutes}:${seconds}`;
  });
}

const secretAudio = new Audio();
createAudioForSecretBird();
secretAudio.volume = 0.5;
const currentAudio = new Audio();
currentAudio.volume = 0.5;

const variantsList = document.querySelector('.variants__list');

function toggleAudioPlayPause(audio, selector) {
  const buttonDiv = document.querySelector(selector);
  const button = buttonDiv.querySelector('img');
  if (button.src.match('play')) {
    audio.play();
    button.src = pauseIco;
  } else {
    audio.pause();
    button.src = playIco;
  }
}

const playButton = document.querySelector('.audio-player__button');
playButton.addEventListener('click', () => {
  toggleAudioPlayPause(secretAudio, '.audio-player__button');
});

function updateAudioProgressAndTimer(audio, bar, circle, progress, timer) {
  const { duration, currentTime } = audio;
  const correlation = currentTime / duration;
  const audioProgressBar = document.querySelector(bar);
  const audioProgressCircle = document.querySelector(circle);
  const audioProgressLine = document.querySelector(progress);
  const fullWidth = parseInt(
    window.getComputedStyle(audioProgressBar).width,
    10
  );
  audioProgressLine.style.width = `${fullWidth * correlation}px`;
  audioProgressCircle.style.left = `${fullWidth * correlation}px`;

  const timerOnPage = document.querySelector(timer);
  const minutes = checkIfDigitLessThanTen(Math.floor(currentTime / 60));
  const seconds = checkIfDigitLessThanTen(
    Math.round(currentTime - minutes * 60)
  );
  timerOnPage.innerText = `${minutes}:${seconds}`;
}

secretAudio.addEventListener('timeupdate', () => {
  updateAudioProgressAndTimer(
    secretAudio,
    '.audio-player__progress-bar',
    '#audio-circle',
    '#audio-progress',
    '#timer'
  );
});

function showCurrentBirdDescription(event) {
  const playButtonMini = document.querySelector('.audio-player__button_mini');
  playButtonMini.innerHTML = '';
  const button = document.createElement('img');
  button.src = playIco;
  playButtonMini.append(button);
  document.querySelector('#audio-progress-variants').style.width = '0%';
  document.querySelector('#audio-circle-variants').style.left = '0';

  const variantsManual = document.querySelector('.variants__manual');
  variantsManual.style.display = 'none';
  const variantsInfo = document.querySelector('.variants__info');
  variantsInfo.style.display = 'flex';
  const variantsDescr = document.querySelector('.variants__descr');
  variantsDescr.style.display = 'block';

  const { id } = event.target;
  const currentQuestionIndex = checkCurrentQuestion();
  const variantsImg = document.querySelector('.variants__img');
  const currentBird = birds[currentQuestionIndex].filter(
    (value) => value.id === +id
  );
  // add img
  variantsImg.src = `${currentBird[0].image}`;
  // add title
  document.querySelector(
    '.variants__title'
  ).innerText = `${currentBird[0].name}`;
  // add species
  document.querySelector(
    '.variants__latin'
  ).innerText = `${currentBird[0].species}`;
  // add text
  document.querySelector(
    '.variants__paragraph'
  ).innerText = `${currentBird[0].description}`;
  // audio

  currentAudio.src = currentBird[0].audio;

  currentAudio.addEventListener('canplaythrough', () => {
    const durationOnPage = document.querySelector('#duration-variants');
    const duration = Math.round(currentAudio.duration);
    const minutes = checkIfDigitLessThanTen(Math.floor(duration / 60));
    const seconds = checkIfDigitLessThanTen(duration - minutes * 60);
    durationOnPage.innerText = `${minutes}:${seconds}`;
  });

  function activatePlayButton() {
    toggleAudioPlayPause(currentAudio, '.audio-player__button_mini');
  }

  function updateAudioInfo() {
    updateAudioProgressAndTimer(
      currentAudio,
      '.audio-player__progress-bar_variants',
      '#audio-circle-variants',
      '#audio-progress-variants',
      '#timer-variants'
    );
  }

  currentAudio.addEventListener('timeupdate', updateAudioInfo);
  button.addEventListener('click', activatePlayButton);
}

function showSecretBirdInfo(event) {
  const { id } = event.target;
  const currentQuestionIndex = checkCurrentQuestion();
  const currentBird = birds[currentQuestionIndex].filter(
    (value) => value.id === +id
  );
  // add img
  document.querySelector('.question__img').src = `${currentBird[0].image}`;
  // add title
  document.querySelector(
    '.question__title'
  ).innerText = `${currentBird[0].name}`;
}

function changeIndicatorsColor(event) {
  const indicators = document.querySelectorAll('.variants__indicator');
  const variantsItems = document.querySelectorAll('.variants__item');
  let currentIndex;
  variantsItems.forEach((item, index) => {
    if (item === event.target) {
      currentIndex = index;
    }
  });

  // success
  if (+event.target.id === secretNumber) {
    indicators[currentIndex].classList.add('variants__indicator_success');
    secretAudio.pause();
    secretAudio.currentTime = 0;
    const success = new Audio(successSound);
    success.play();
    showSecretBirdInfo(event);
    variantsList.removeEventListener('click', changeIndicatorsColor);
    const scoreText = document.querySelector('.score__count');
    scoreText.innerText = score;

    const buttonDiv = document.querySelector('.audio-player__button');
    const button = buttonDiv.querySelector('img');
    button.src = playIco;
    const gameProgress = document.querySelector('#bar');
    progressValue += 10;
    gameProgress.value = progressValue;
    const next = document.querySelector('.next');
    next.classList.remove('next_disabled');
    if (progressValue === 60) {
      next.innerText = data.quiz.buttonResults;
    }
  } else {
    if (
      !event.target
        .querySelector('span')
        .classList.contains('variants__indicator_error')
    ) {
      indicators[currentIndex].classList.add('variants__indicator_error');
      score -= 1;
    }
    const error = new Audio(errorSound);
    error.play();
  }
}

variantsList.addEventListener('click', changeIndicatorsColor);
variantsList.addEventListener('click', showCurrentBirdDescription);

moveAudioCircle(
  secretAudio,
  '.audio-player__progress-bar',
  '#audio-circle',
  '#audio-progress'
);

moveAudioCircle(
  currentAudio,
  '.audio-player__progress-bar_variants',
  '#audio-circle-variants',
  '#audio-progress-variants'
);

setVolume(secretAudio, 0);
setVolume(currentAudio, 1);

function changeCurrentQuestion() {
  const currentQuestionIndex = checkCurrentQuestion();
  const progressItems = document.querySelectorAll('.progress__item');
  progressItems[currentQuestionIndex].classList.remove('progress__item_active');
  progressItems[+currentQuestionIndex + 1].classList.add(
    'progress__item_active'
  );
}

function deleteVariants() {
  variantsList.innerHTML = '';
}

function resetProgress() {
  const progressBar = document.querySelector('#bar');
  progressBar.value = 0;
  const progressItems = document.querySelectorAll('.progress__item');
  progressItems.forEach((item) => {
    item.classList.remove('progress__item_active');
  });
}

function showResults() {
  const scoreTable = document.querySelector('.score');
  scoreTable.style.display = 'none';
  const questionSection = document.querySelector('.question');
  questionSection.style.display = 'none';
  const variantsSection = document.querySelector('.variants');
  variantsSection.style.display = 'none';
  const resultsSection = document.querySelector('.results');
  resultsSection.style.display = 'block';
  const resultsText = document.querySelector('.results__text');

  if (score < 30) {
    if (lang === 'ru') {
      resultsText.innerText = `Вы прошли викторину и набрали ${score} из 30 возможных баллов!`;
    } else {
      resultsText.innerText = `You have passed the quiz and scored ${score} out of 30 possible points!`;
    }

    const playAgainBtn = document.querySelector('.play-again');
    playAgainBtn.addEventListener('click', () => {
      document.location.href = './quiz.html';
    });
  } else if (score === 30) {
    if (lang === 'ru') {
      resultsText.innerText = `Игра окончена.\nВы победили в викторине и набрали 30 из 30 возможных баллов!`;
    } else {
      resultsText.innerText = `Game is over. \nYou have win the quiz and scored 30 out of 30 possible points!`;
    }
    const playAgainBtn = document.querySelector('.play-again');
    playAgainBtn.style.display = 'none';
  }
}

function crossToNextQuestion() {
  const next = document.querySelector('.next');
  if (
    !next.classList.contains('next_disabled') &&
    next.innerText === data.quiz.buttonNext
  ) {
    secretAudio.pause();
    currentAudio.pause();
    changeCurrentQuestion();
    deleteVariants();
    secretNumber = fillVariantsContent();
    createAudioForSecretBird();
    const questionTitle = document.querySelector('.question__title');
    questionTitle.innerText = '******';
    const questionImg = document.querySelector('.question__img');
    questionImg.src = unknownBird;

    // manual
    const variantsManual = document.querySelector('.variants__manual');
    variantsManual.style.display = 'block';
    const variantsInfo = document.querySelector('.variants__info');
    variantsInfo.style.display = 'none';
    const variantsDescr = document.querySelector('.variants__descr');
    variantsDescr.style.display = 'none';

    // next
    next.classList.add('next_disabled');

    variantsList.addEventListener('click', changeIndicatorsColor);
    variantsList.addEventListener('click', showCurrentBirdDescription);

    // show results
  } else if (
    !next.classList.contains('next_disabled') &&
    next.innerText === data.quiz.buttonResults
  ) {
    showResults();
    resetProgress();
  }
}

const next = document.querySelector('.next');
next.addEventListener('click', crossToNextQuestion);
