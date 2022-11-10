import './main.html';
import '@babel/polyfill';
import '../../sass/style.scss';
import content from '../../js/content';
import {
  getLanguageSettings,
  createHtmlMain,
  createNavLinks,
  changeLocale,
} from '../../js/functions';

document.addEventListener('DOMContentLoaded', () => {
  const lang = getLanguageSettings();
  const data = content[lang];

  createNavLinks();
  createHtmlMain(data);
  changeLocale();

  const startBtn = document.querySelector('.btn');
  startBtn.addEventListener('click', () => {
    document.location.href = './quiz.html';
  });
});
