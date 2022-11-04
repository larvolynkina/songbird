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
} from '../../js/functions';
import errorSound from '../../assets/sounds/error.mp3';
import successSound from '../../assets/sounds/success.mp3';

let lang = getLanguageSettings();
const data = content[lang];
const birds = birdsData[lang];

createNavLinks(data);
createHtmlQuiz(data);

function fillVariantsContent() {
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

const secretNumber = fillVariantsContent();

function changeCurrentQuestion() {
  const progressItems = document.querySelectorAll('.progress__item');
  progressItems[currentQuestionIndex].classList.remove('progress__item_active');
  progressItems[+currentQuestionIndex + 1].classList.add(
    'progress__item_active'
  );
}

const next = document.querySelector('.next');
next.addEventListener('click', fillVariantsContent);

const variantsList = document.querySelector('.variants__list');

function showCurrentBirdDescription(event) {
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

  if (+event.target.id === secretNumber) {
    indicators[currentIndex].classList.add('variants__indicator_success');
    const success = new Audio(successSound);
    success.play();
    showSecretBirdInfo(event);
    variantsList.removeEventListener('click', changeIndicatorsColor);
  } else {
    indicators[currentIndex].classList.add('variants__indicator_error');
    const error = new Audio(errorSound);
    error.play();
  }
}

variantsList.addEventListener('click', changeIndicatorsColor);
variantsList.addEventListener('click', showCurrentBirdDescription);
