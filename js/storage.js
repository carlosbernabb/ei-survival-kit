// guardar y cargar el avance solo en este navegador
// si localstorage no funciona se guarda en memoria mientras la pestana este abierta

var Store = (function () {
  var KEY = "eiSurvivalKit.v1";
  var memoryCopy = null;
  var canSave = true;
  var data = null;

  // revisa si localstorage se puede usar
  try {
    var testKey = KEY + ".test";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
  } catch (e) {
    canSave = false;
  }

  function emptyData() {
    var levels = {};
    for (var i = 1; i <= 6; i++) {
      levels[i] = { done: false, completedAt: null, answers: {} };
    }
    return {
      version: 1,
      createdAt: new Date().toISOString(),
      moodBefore: null,
      moodAfter: null,
      introSeen: false,
      levels: levels,
      streak: { lastDay: "", count: 0 }
    };
  }

  function load() {
    var text = null;
    if (canSave) {
      try {
        text = window.localStorage.getItem(KEY);
      } catch (e) {
        canSave = false;
      }
    }
    if (!canSave) {
      text = memoryCopy;
    }

    var loaded = null;
    if (text) {
      try {
        loaded = JSON.parse(text);
      } catch (e) {
        loaded = null;
      }
    }

    // si no hay datos o estan rotos se empieza de cero
    var fresh = emptyData();
    if (!loaded || typeof loaded !== "object") {
      data = fresh;
    } else {
      data = fresh;
      data.createdAt = loaded.createdAt || fresh.createdAt;
      data.moodBefore = loaded.moodBefore || null;
      data.moodAfter = loaded.moodAfter || null;
      data.introSeen = loaded.introSeen === true;
      if (loaded.streak) {
        data.streak = loaded.streak;
      }
      for (var i = 1; i <= 6; i++) {
        if (loaded.levels && loaded.levels[i]) {
          data.levels[i].done = loaded.levels[i].done === true;
          data.levels[i].completedAt = loaded.levels[i].completedAt || null;
          data.levels[i].answers = loaded.levels[i].answers || {};
        }
      }
    }
    return data;
  }

  function save() {
    var text = JSON.stringify(data);
    if (canSave) {
      try {
        window.localStorage.setItem(KEY, text);
        return;
      } catch (e) {
        canSave = false;
      }
    }
    memoryCopy = text;
  }

  function reset() {
    data = emptyData();
    if (canSave) {
      try {
        window.localStorage.removeItem(KEY);
      } catch (e) {
        canSave = false;
      }
    }
    memoryCopy = null;
    save();
  }

  // fecha local en formato año-mes-dia
  function dayString(date) {
    var m = String(date.getMonth() + 1).padStart(2, "0");
    var d = String(date.getDate()).padStart(2, "0");
    return date.getFullYear() + "-" + m + "-" + d;
  }

  // cuenta los dias seguidos que se abre el kit
  function touchStreak() {
    var today = new Date();
    var todayText = dayString(today);
    var yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    var yesterdayText = dayString(yesterday);

    if (data.streak.lastDay === todayText) {
      return;
    }
    if (data.streak.lastDay === yesterdayText) {
      data.streak.count = data.streak.count + 1;
    } else {
      data.streak.count = 1;
    }
    data.streak.lastDay = todayText;
    save();
  }

  function setMood(which, weatherId, note) {
    var mood = { id: weatherId, note: note, date: new Date().toISOString() };
    if (which === "after") {
      data.moodAfter = mood;
    } else {
      data.moodBefore = mood;
    }
    save();
  }

  function setAnswers(levelId, answers) {
    data.levels[levelId].answers = answers;
    save();
  }

  function completeLevel(levelId) {
    data.levels[levelId].done = true;
    data.levels[levelId].completedAt = new Date().toISOString();
    save();
  }

  // marca que ya se vio o se salto la intro
  function setIntroSeen() {
    data.introSeen = true;
    save();
  }

  function toolsCount() {
    var count = 0;
    for (var i = 1; i <= 6; i++) {
      if (data.levels[i].done) {
        count++;
      }
    }
    return count;
  }

  load();

  return {
    get data() {
      return data;
    },
    get canSave() {
      return canSave;
    },
    save: save,
    reset: reset,
    touchStreak: touchStreak,
    setMood: setMood,
    setAnswers: setAnswers,
    completeLevel: completeLevel,
    setIntroSeen: setIntroSeen,
    toolsCount: toolsCount
  };
})();
