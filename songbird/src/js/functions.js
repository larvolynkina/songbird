function getLanguageSettings() {
  let lang = localStorage.getItem('lang');
  if (lang) {
    return lang;
  }
  lang = 'ru';
  return lang;
}

function createNavLinks(data) {
  // nav links
  const navList = document.querySelector('.nav__list');
  data.main.links.forEach((item, index) => {
    const li = document.createElement('li');
    li.classList.add('nav__item');
    const link = document.createElement('a');
    link.classList.add('nav__link');
    link.innerText = item;
    link.href = data.main.urls[index];
    li.append(link);
    navList.append(li);
  });
}

function createHtmlMain(data) {
  // h1
  document.querySelector('.main-title').innerText = data.main.h1;
  // promo text
  document.querySelector('.promo__text').innerText = data.main.promoText;
  // btn
  document.querySelector('.btn').innerText = data.main.buttonText;
}

function createHtmlQuiz(data) {
  // progress list
  const progressList = document.querySelector('.progress__list');
  data.quiz.questions.forEach((value, index) => {
    const li = document.createElement('li');
    li.classList.add('progress__item');
    li.innerText = value;
    progressList.append(li);
  });
  document
    .querySelector('.progress__item')
    .classList.add('progress__item_active');
  // score
  const score = document.querySelector('.score__text');
  score.innerText = data.quiz.score;
  const span = document.createElement('span');
  span.classList.add('score__count');
  span.innerText = 0;
  score.append(span);
  // manual
  const manual = document.querySelector('.variants__manual');
  data.quiz.manual.forEach((value) => {
    const paragraph = document.createElement('p');
    paragraph.innerText = value;
    manual.append(paragraph);
  });
  // button next
  document.querySelector('.next').innerText = data.quiz.buttonNext;
}

function createMixNumbersArr() {
  const arr = [];
  for (let i = 0; arr.length < 6; i += 1) {
    const number = Math.floor(Math.random() * 6) + 1;
    if (!arr.includes(number)) {
      arr.push(number);
    }
  }
  return arr;
}

function pickSecretNumber() {
  const number = Math.floor(Math.random() * 6) + 1;
  return number;
}

export {
  getLanguageSettings,
  createHtmlMain,
  createNavLinks,
  createHtmlQuiz,
  createMixNumbersArr,
  pickSecretNumber,
};
