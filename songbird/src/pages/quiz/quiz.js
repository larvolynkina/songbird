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
} from '../../js/functions';

let lang = getLanguageSettings();
const data = content[lang];

createNavLinks(data);
createHtmlQuiz(data);

const generatedArr = createMixNumbersArr();
const secretNumber = pickSecretNumber();
