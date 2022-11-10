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
  changeLocale,
  showResults,
} from '../../js/functions';

import {
  moveAudioCircle,
  setVolume,
  toggleAudioPlayPause,
  updateAudioProgressAndTimer,
} from '../../js/audioplayer';

import errorSound from '../../assets/sounds/error.mp3';
import successSound from '../../assets/sounds/success.mp3';
import playIco from '../../assets/icons/play.svg';
import unknownBird from '../../assets/images/unknown-bird.png';

// const lang = getLanguageSettings();
// const data = content[lang];
// const birds = birdsData[lang];

let score = 0;
let progressValue = 0;

createNavLinks();
createHtmlQuiz();
changeLocale();

function fillVariantsContent() {
  const lang = getLanguageSettings();
  const birds = birdsData[lang];
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
  const lang = getLanguageSettings();
  const birds = birdsData[lang];
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

const playButton = document.querySelector('.audio-player__button');
playButton.addEventListener('click', () => {
  toggleAudioPlayPause(secretAudio, '.audio-player__button');
});

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
  const lang = getLanguageSettings();
  const birds = birdsData[lang];
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

  console.log(event.target.closest('li'));

  const { id } = event.target;
  const currentQuestionIndex = checkCurrentQuestion();
  const variantsImg = document.querySelector('.variants__img');
  const currentBird = birds[currentQuestionIndex].filter(
    (value) => value.id === +id
  );
  // add img
  console.log(currentBird[0]);
  console.log(currentBird[0].image);
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
  const lang = getLanguageSettings();
  const birds = birdsData[lang];
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
  const lang = getLanguageSettings();
  const data = content[lang];
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

function crossToNextQuestion() {
  const lang = getLanguageSettings();
  const data = content[lang];
  const next = document.querySelector('.next');
  if (
    !next.classList.contains('next_disabled') &&
    next.innerText === data.quiz.buttonNext
  ) {
    secretAudio.pause();
    currentAudio.pause();

    const button = document
      .querySelector('.audio-player__button')
      .querySelector('img');
    button.src = playIco;
    document.querySelector('#audio-progress').style.width = '0%';
    document.querySelector('#audio-circle').style.left = '0';

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
    showResults(score);
    resetProgress();
  }
}

const next = document.querySelector('.next');
next.addEventListener('click', crossToNextQuestion);
