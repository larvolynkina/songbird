import './gallery.html';
import '@babel/polyfill';
import '../../sass/style.scss';
import content from '../../js/content';
import birdsData from '../../js/birds';
import playIco from '../../assets/icons/play.svg';
import {
  getLanguageSettings,
  createNavLinks,
  checkIfDigitLessThanTen,
  changeLocale,
  createGalleryList,
} from '../../js/functions';

import {
  moveAudioCircle,
  setVolume,
  toggleAudioPlayPause,
  updateAudioProgressAndTimer,
} from '../../js/audioplayer';

const birdAudio = new Audio();
birdAudio.volume = 0.5;
const galleryList = document.querySelector('.gallery__list');

createNavLinks();
changeLocale();
createGalleryList();

function findCurrentBird(event) {
  const lang = getLanguageSettings();
  const birds = birdsData[lang];
  const { id } = event.target.closest('li');
  const index = Math.ceil(+id / 6) - 1;
  const currentBird = birds[index][id - index * 6 - 1];
  return currentBird;
}

function createBird(event) {
  if (event.target.closest('li')) {
    const button = document
      .querySelector('.audio-player__button')
      .querySelector('img');
    const currentBird = findCurrentBird(event);
    const img = document.querySelector('.bird__img');
    img.src = currentBird.image;
    img.alt = currentBird.name;
    document.querySelector('.bird__title').innerText = currentBird.name;
    document.querySelector('.bird__latin').innerText = currentBird.species;
    document.querySelector('.bird__text').innerText = currentBird.description;
    // audio
    birdAudio.src = currentBird.audio;
    birdAudio.addEventListener('canplay', () => {
      const durationOnPage = document.querySelector('#duration');
      const duration = Math.round(birdAudio.duration);
      const minutes = checkIfDigitLessThanTen(Math.floor(duration / 60));
      const seconds = checkIfDigitLessThanTen(duration - minutes * 60);
      durationOnPage.innerText = `${minutes}:${seconds}`;
    });

    button.addEventListener('click', () => {
      toggleAudioPlayPause(birdAudio, '.audio-player__button');
    });

    const birdDiv = document.querySelector('.bird');
    const overlay = document.querySelector('.overlay');

    birdDiv.classList.add('bird_active');
    overlay.classList.add('overlay_active');
    const timerBird = setTimeout(() => {
      birdDiv.classList.add('bird_show');
      overlay.classList.add('overlay_show');
    }, 0);

    const closeModal = () => {
      birdAudio.pause();
      birdAudio.currentTime = 0;
      const playButton = document.querySelector('.audio-player__button');
      playButton.innerHTML = '';
      const newButton = document.createElement('img');
      newButton.src = playIco;
      playButton.append(newButton);
      document.querySelector('#audio-progress').style.width = '0%';
      document.querySelector('#audio-circle').style.left = '0';
      birdDiv.classList.remove('bird_show');
      overlay.classList.remove('overlay_show');
      const timerOverlay = setTimeout(() => {
        birdDiv.classList.remove('bird_active');
        overlay.classList.remove('overlay_active');
      }, 300);
    };

    const birdClose = document.querySelector('.bird__close');
    birdClose.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
  }
}

galleryList.addEventListener('click', createBird);

setVolume(birdAudio, 0);

moveAudioCircle(
  birdAudio,
  '.audio-player__progress-bar',
  '#audio-circle',
  '#audio-progress'
);

birdAudio.addEventListener('timeupdate', () => {
  updateAudioProgressAndTimer(
    birdAudio,
    '.audio-player__progress-bar',
    '#audio-circle',
    '#audio-progress',
    '#timer'
  );
});
