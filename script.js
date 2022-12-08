const player = document.querySelector('.player');
const timer = document.querySelector('.timer');

const rowsWrapper = document.querySelector('.rows-wrapper');
const rows = document.querySelectorAll('.row');

const audio = document.querySelector('audio');
const video = document.querySelector('video');

const rowHeight = 150;
const playerHeight = 70;
const chunkAmount = 18;

const PX_REGEX = /px/ig;

window.addEventListener('DOMContentLoaded', (event) => {
  // --- Initialization ---

  const playerViewCenter = window.innerHeight / 2 - playerHeight;

  rows.forEach((item, idx) => {
    item.style.top = addPx(playerViewCenter + rowHeight * idx);
  });


  // --- Event listeners ---

  audio.addEventListener('timeupdate', (event) => {
    const time = formatMMSS(Math.floor(event.target.currentTime));
    const currentRow = [...rows].find(item => isIntersectedTime(item, time));

    changeTxt(currentRow);
  });

  player.addEventListener('click', (event) => {
    const startTime = event.target?.dataset?.start;
    if (startTime) {
      setCurrentTime(startTime);
    }
  });


  // --- Functions ---

  function changeTxt(currentRow) {
    if (!currentRow) {
      return clearActiveClass();
    }

    if (currentRow.classList.contains('active')) {
      return;
    }

    clearActiveClass();
    currentRow.classList.add('active');

    let currPos = rowsWrapper.scrollTop;
    const endPos = +currentRow.style.top.replace(PX_REGEX, '') - playerViewCenter;
    const isEndBigger = endPos > currPos;
    const step = Math.abs(endPos - currPos) / chunkAmount;

    increaseHeight();

    function increaseHeight() {
      const isStop = isEndBigger ? Math.round(currPos) >= Math.round(endPos) : Math.round(endPos) >= Math.round(currPos);
      if (isStop) return;

      if (isEndBigger) {
        currPos = currPos + step;
      } else {
        currPos = currPos - step;
      }

      rowsWrapper.scroll(0, currPos);
      requestAnimationFrame(increaseHeight);
    };
  }

  function setCurrentTime(time) {
    const timeArr = time.split(':');
    const minutes = +timeArr[0] > 0 ? +timeArr[0] * 60 : 0;
    const seconds = +timeArr[1];

    audio.currentTime = minutes + seconds;
    audio.play();
  }

  function formatMMSS(time) {
    return (time - (time %= 60)) / 60 + (9 < time ? ':' : ':0') + time;
  }

  function clearActiveClass() {
    rows.forEach((item) => {
      item.classList.remove('active');
    });
  }

  function addPx(value) {
    return value + 'px';
  }

  function isIntersectedTime(element, time) {
    return element.dataset.start <= time && element.dataset.end > time;
  }
});
