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

let lang = getLanguageSettings();
const data = content[lang];

createNavLinks();
createHtmlMain(data);
changeLocale();
