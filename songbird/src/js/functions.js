import content from './content';
import birdsData from './birds';

function getLanguageSettings() {
  let lang = localStorage.getItem('lang-larvolynkina');
  if (lang) {
    const languageSelect = document.querySelector('#language');
    languageSelect.value = lang;
    return lang;
  }
  lang = 'ru';
  return lang;
}

function changeActiveNavLink() {
  const navItems = document.querySelectorAll('.nav__item');
  const main = document.querySelector('main');
  navItems.forEach((item) => {
    item.classList.remove('nav__item_active');
  });

  if (main.classList.contains('home')) {
    navItems[0].classList.add('nav__item_active');
  } else if (main.classList.contains('quiz')) {
    navItems[1].classList.add('nav__item_active');
  } else {
    navItems[2].classList.add('nav__item_active');
  }
}

function createNavLinks() {
  const lang = getLanguageSettings();
  const data = content[lang];
  // nav links
  const navList = document.querySelector('.nav__list');
  navList.innerHTML = '';
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

  changeActiveNavLink();
}

function createHtmlMain(data) {
  // h1
  document.querySelector('.main-title').innerText = data.main.h1;
  // promo text
  document.querySelector('.promo__text').innerText = data.main.promoText;
  // btn
  document.querySelector('.btn').innerText = data.main.buttonText;
}

function createHtmlQuiz() {
  const lang = getLanguageSettings();
  const data = content[lang];
  // progress list
  const progressList = document.querySelector('.progress__list');
  progressList.innerHTML = '';
  data.quiz.questions.forEach((value) => {
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
  score.childNodes[0].textContent = data.quiz.score;
  // manual
  const manual = document.querySelector('.variants__manual');
  manual.innerHTML = '';
  data.quiz.manual.forEach((value) => {
    const paragraph = document.createElement('p');
    paragraph.innerText = value;
    manual.append(paragraph);
  });
  // button next
  const bar = document.querySelector('#bar');
  if (bar.value === 60) {
    document.querySelector('.next').innerText = data.quiz.buttonResults;
  } else {
    document.querySelector('.next').innerText = data.quiz.buttonNext;
  }
  // results
  document.querySelector('.results__title').innerText = data.quiz.results.h1;
  document.querySelector('.play-again').innerText =
    data.quiz.results.buttonTryAgain;
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

function checkCurrentQuestion() {
  const progressItems = document.querySelectorAll('.progress__item');
  let currentQuestionIndex;
  progressItems.forEach((value, index) => {
    if (value.classList.contains('progress__item_active')) {
      currentQuestionIndex = index;
    }
  });
  return currentQuestionIndex;
}

function checkIfDigitLessThanTen(n) {
  let result = n;
  if (result < 10) {
    result = `0${result}`;
  }
  return result;
}

function createGalleryList() {
  const lang = getLanguageSettings();
  const birds = birdsData[lang];
  let count = 1;
  const galleryList = document.querySelector('.gallery__list');
  galleryList.innerHTML = '';
  birds.forEach((value) => {
    value.forEach((bird) => {
      const li = document.createElement('li');
      li.classList.add('gallery__item');
      li.id = count;
      count += 1;
      const div = document.createElement('div');
      div.classList.add('gallery__image');
      const img = new Image();
      img.classList.add('gallery__img');
      img.src = bird.image;
      img.alt = bird.name;
      div.append(img);
      li.append(div);
      const title = document.createElement('h3');
      title.classList.add('gallery__title');
      title.innerText = bird.name;
      li.append(title);
      const latin = document.createElement('p');
      latin.classList.add('gallery__latin');
      latin.innerText = bird.species;
      li.append(latin);
      galleryList.append(li);
    });
  });
}

function showResults(score) {
  const lang = getLanguageSettings();
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

function rebuildPageAfterLocaleChange() {
  const lang = getLanguageSettings();
  const data = content[lang];
  const main = document.querySelector('main');
  if (main.classList.contains('home')) {
    createNavLinks();
    createHtmlMain(data);
  } else if (main.classList.contains('gallery')) {
    createNavLinks();
    createGalleryList();
  } else if (main.classList.contains('quiz')) {
    createNavLinks();
    const currentQuestion = checkCurrentQuestion();
    createHtmlQuiz();
    const progressItems = document.querySelectorAll('.progress__item');
    progressItems.forEach((item) => {
      item.classList.remove('progress__item_active');
    });

    const variantsItems = document.querySelectorAll('.variants__item');
    if (progressItems[currentQuestion]) {
      progressItems[currentQuestion].classList.add('progress__item_active');
      // bird description
      const variantsInfo = document.querySelector('.variants__info');
      const variantsTitle = document.querySelector('.variants__title');
      if (window.getComputedStyle(variantsInfo).display !== 'none') {
        variantsItems.forEach((value) => {
          if (value.childNodes[1].textContent === variantsTitle.innerText) {
            variantsTitle.innerText =
              birdsData[lang][currentQuestion][value.id - 1].name;
            document.querySelector('.variants__paragraph').innerText =
              birdsData[lang][currentQuestion][value.id - 1].description;
          }
        });
      }

      variantsItems.forEach((item) => {
        item.childNodes[1].textContent =
          birdsData[lang][currentQuestion][item.id - 1].name;
      });
      const questionTitle = document.querySelector('.question__title');
      if (questionTitle.innerText !== '******') {
        const variantsIndicators = document.querySelectorAll(
          '.variants__indicator'
        );
        let indexOfSecretBird;
        variantsIndicators.forEach((value, index) => {
          if (value.classList.contains('variants__indicator_success')) {
            indexOfSecretBird = index;
          }
        });
        questionTitle.innerText =
          birdsData[lang][currentQuestion][
            variantsItems[indexOfSecretBird].id - 1
          ].name;
      }
    }

    // results
    const resultsSection = document.querySelector('.results');
    if (window.getComputedStyle(resultsSection).display === 'block') {
      const score = +document.querySelector('.score__count').textContent;
      showResults(score);
    }
  }
}

function changeLocale() {
  const languageSelect = document.querySelector('#language');
  languageSelect.addEventListener('change', () => {
    localStorage.setItem('lang-larvolynkina', languageSelect.value);
    rebuildPageAfterLocaleChange();
  });

  const languageChangeBtn = document.querySelector('.language__img');
  languageChangeBtn.addEventListener('click', () => {
    const currentLang = getLanguageSettings();
    if (currentLang === 'ru') {
      localStorage.setItem('lang-larvolynkina', 'en');
      languageSelect.value = 'en';
      rebuildPageAfterLocaleChange();
    } else {
      localStorage.setItem('lang-larvolynkina', 'ru');
      languageSelect.value = 'ru';
      rebuildPageAfterLocaleChange();
    }
  });
}

export {
  getLanguageSettings,
  createHtmlMain,
  createNavLinks,
  createHtmlQuiz,
  createMixNumbersArr,
  pickSecretNumber,
  checkCurrentQuestion,
  checkIfDigitLessThanTen,
  changeLocale,
  createGalleryList,
  showResults,
  changeActiveNavLink,
};
