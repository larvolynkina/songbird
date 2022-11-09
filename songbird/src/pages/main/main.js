import './main.html';
import '@babel/polyfill';
import '../../sass/style.scss';
import content from '../../js/content';
import {
  getLanguageSettings,
  createHtmlMain,
  createNavLinks,
} from '../../js/functions';

let lang = getLanguageSettings();
const data = content[lang];

createNavLinks(data);
createHtmlMain(data);

function changeLocale(locale) {
  const languageSelect = document.querySelector('#language');
  languageSelect.addEventListener('change', () => {
    localStorage.setItem('lang', languageSelect.value);
    console.log(languageSelect.value);
  });
}

changeLocale();
