import playIco from '../assets/icons/play.svg';
import pauseIco from '../assets/icons/pause.svg';
import { checkIfDigitLessThanTen } from './functions';

function moveAudioCircle(audio, bar, circle, progress) {
  let duration;
  let currentTime;
  audio.addEventListener('canplay', () => {
    duration = audio.duration;
    currentTime = audio.currentTime;
  });
  let proportion;

  const progressBar = document.querySelector(bar);
  const audioCircle = document.querySelector(circle);
  const audioProgress = document.querySelector(progress);
  const audioProgressWidth = parseInt(
    window.getComputedStyle(progressBar).width,
    10
  );

  audioCircle.addEventListener('mousedown', (event) => {
    event.preventDefault();
    const currentXposition = event.clientX;
    const currentCirclePosition = parseInt(audioCircle.style.left, 10) || 0;

    function moveCircle(event) {
      let currentWidth =
        event.clientX - currentXposition + currentCirclePosition;
      if (currentWidth > audioProgressWidth) {
        currentWidth = audioProgressWidth;
      }
      if (currentWidth < 0) {
        currentWidth = 0;
      }

      audioCircle.style.left = `${currentWidth}px`;
      audioProgress.style.width = `${currentWidth}px`;
      proportion = audioProgressWidth / currentWidth;
    }

    document.addEventListener('mousemove', moveCircle);

    document.addEventListener(
      'mouseup',
      () => {
        document.removeEventListener('mousemove', moveCircle);
        currentTime = duration / proportion;
        audio.currentTime = currentTime;
      },
      { once: true }
    );
  });
}

function setVolume(audio, index) {
  const volumeInput = document.querySelectorAll('.volume')[index];
  const muteBtn = document.querySelectorAll('.audio-player__mute')[index];
  let currentVolume = audio.volume;
  volumeInput.addEventListener('input', () => {
    if (volumeInput.value === '0') {
      muteBtn.classList.add('audio-player__mute_active');
      currentVolume = 0.5;
    } else {
      muteBtn.classList.remove('audio-player__mute_active');
    }
    audio.volume = volumeInput.value;
  });

  muteBtn.addEventListener('click', () => {
    muteBtn.classList.toggle('audio-player__mute_active');
    if (muteBtn.classList.contains('audio-player__mute_active')) {
      currentVolume = audio.volume;
      audio.volume = 0;
      volumeInput.value = 0;
    } else {
      audio.volume = currentVolume;
      volumeInput.value = currentVolume;
    }
  });
}

function toggleAudioPlayPause(audio, selector) {
  const buttonDiv = document.querySelector(selector);
  const button = buttonDiv.querySelector('img');
  if (button.src.match('play')) {
    audio.play();
    button.src = pauseIco;
  } else {
    audio.pause();
    button.src = playIco;
  }
}

function updateAudioProgressAndTimer(audio, bar, circle, progress, timer) {
  const { duration, currentTime } = audio;
  const correlation = currentTime / duration;
  const audioProgressBar = document.querySelector(bar);
  const audioProgressCircle = document.querySelector(circle);
  const audioProgressLine = document.querySelector(progress);
  const fullWidth = parseInt(
    window.getComputedStyle(audioProgressBar).width,
    10
  );
  audioProgressLine.style.width = `${fullWidth * correlation}px`;
  audioProgressCircle.style.left = `${fullWidth * correlation}px`;

  const timerOnPage = document.querySelector(timer);
  const minutes = checkIfDigitLessThanTen(Math.floor(currentTime / 60));
  const seconds = checkIfDigitLessThanTen(
    Math.round(currentTime - minutes * 60)
  );
  timerOnPage.innerText = `${minutes}:${seconds}`;
}

export {
  moveAudioCircle,
  setVolume,
  toggleAudioPlayPause,
  updateAudioProgressAndTimer,
};
