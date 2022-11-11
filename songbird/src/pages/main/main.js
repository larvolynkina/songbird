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

  const greetingAudio = new Audio(
    'https://www.xeno-canto.org/sounds/uploaded/RFGQDPLDEC/XC518417-Kj%C3%B8ttmeis%20XC%20Helg%C3%B8ya%20Elias%20A.%20Ryberg20200108133922_079.mp3'
  );
  greetingAudio.volume = 0.5;
  greetingAudio.addEventListener('canplay', () => {
    const promoPlay = document.querySelector('.promo__play');
    promoPlay.addEventListener('click', () => {
      if (promoPlay.classList.contains('promo__play_active')) {
        greetingAudio.pause();
      } else {
        greetingAudio.play();
      }
      promoPlay.classList.toggle('promo__play_active');
    });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      greetingAudio.pause();
      const promoPlay = document.querySelector('.promo__play');
      promoPlay.classList.remove('promo__play_active');
    }
  });

  window.addEventListener('unload', () => {
    greetingAudio.pause();
  });

  const startBtn = document.querySelector('.btn');
  startBtn.addEventListener('click', () => {
    document.location.href = './quiz.html';
    greetingAudio.pause();
  });
});
