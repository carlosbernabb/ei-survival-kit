// Reproductor del MP3 usado por la intro.
// La animacion visual se sincroniza con el tiempo real del archivo.

var IntroMusic = (function () {
  var LENGTH = 29.300862;
  var FADE_DURATION = 3;
  var FADE_STEP = 0.2;
  var FADE_STEPS = FADE_DURATION / FADE_STEP;

  function play() {
    var audio = new Audio("audio/Intro_style.mp3");
    audio.preload = "auto";
    audio.currentTime = 0;
    audio.volume = 1;

    var fadeTimer = window.setInterval(function () {
      var duration = isFinite(audio.duration) ? audio.duration : LENGTH;
      var fadeStart = duration - FADE_DURATION;
      var fadeElapsed = audio.currentTime - fadeStart;
      if (fadeElapsed >= 0) {
        var steps = Math.min(FADE_STEPS, Math.floor(fadeElapsed / FADE_STEP));
        audio.volume = 1 - steps / FADE_STEPS;
      }
    }, FADE_STEP * 1000);

    function stopFade() {
      window.clearInterval(fadeTimer);
      fadeTimer = null;
    }

    audio.addEventListener("ended", stopFade);

    var promise = audio.play();
    if (promise && promise.catch) {
      promise.catch(function () {});
    }

    return {
      getTime: function () {
        return audio.currentTime || 0;
      },
      stop: function () {
        stopFade();
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }

  return {
    length: LENGTH,
    play: play
  };
})();
