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

export { moveAudioCircle, setVolume };
