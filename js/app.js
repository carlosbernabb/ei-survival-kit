// arranque del juego, rutas y pantallas principales

// cada nivel se registra aqui desde su propio archivo, por ejemplo LEVELS[1] = {...}
var LEVELS = window.LEVELS || {};

var App = (function () {
  var el = UI.el;
  var main = null;
  var lastNewTool = null;
  var unlockedNow = null;
  // cuando la intro termina en the box, el 3d se monta hasta que acaba el video
  var deferHub3d = false;
  var pendingHub = null;
  var cleanup3d = null;

  // pinta una pantalla nueva y pone el foco en su titulo
  function show(nodes) {
    // apaga la escena 3d anterior antes de cambiar de pantalla
    if (cleanup3d) {
      cleanup3d();
      cleanup3d = null;
    }
    main.innerHTML = "";
    var screen = el("section", { class: "screen" }, nodes);
    main.appendChild(screen);
    var title = main.querySelector("h1");
    if (title) {
      title.setAttribute("tabindex", "-1");
      title.focus();
    }
    window.scrollTo(0, 0);
  }

  // monta el escenario 3d, si falla se quita y se queda la version normal
  function mountStage(stageNode, options) {
    try {
      cleanup3d = Scene3D.mount(stageNode, options);
    } catch (e) {
      if (stageNode.parentNode) {
        stageNode.parentNode.removeChild(stageNode);
      }
    }
  }

  function go(route) {
    if (location.hash === "#" + route) {
      render();
    } else {
      location.hash = route;
    }
  }

  function markNav(route) {
    var links = document.querySelectorAll(".main-nav a");
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute("href") === "#" + route) {
        links[i].setAttribute("aria-current", "page");
      } else {
        links[i].removeAttribute("aria-current");
      }
    }
  }

  // lee la ruta del hash y decide que pantalla mostrar
  function render() {
    var route = location.hash.replace("#", "");
    if (!route) {
      route = Store.data.moodBefore ? "hub" : "welcome";
    }
    markNav(route);

    if (route === "welcome") {
      document.title = CONTENT.appTitle;
      showWelcome();
    } else if (route === "checkin") {
      document.title = CONTENT.checkin.title + " | " + CONTENT.appTitle;
      showCheckin();
    } else if (route === "kit") {
      document.title = CONTENT.kit.title + " | " + CONTENT.appTitle;
      showKit();
    } else if (route === "references") {
      document.title = CONTENT.references.title + " | " + CONTENT.appTitle;
      showReferences();
    } else if (route.indexOf("level-") === 0) {
      showLevel(route.replace("level-", ""));
    } else {
      document.title = CONTENT.hub.title + " | " + CONTENT.appTitle;
      showHub();
    }
  }

  // pantalla de bienvenida
  function showWelcome() {
    var w = CONTENT.welcome;
    var paragraphs = [];
    for (var i = 0; i < w.paragraphs.length; i++) {
      paragraphs.push(el("p", { text: w.paragraphs[i] }));
    }
    var has3d = Scene3D.supported();
    var hero = has3d
      ? el("div", { class: "stage stage-hero" }, [el("span", { class: "stage-tag", text: w.stageTag })])
      : el("div", { class: "welcome-art", svg: UI.icon("box") });

    show([
      el("div", { class: "panel panel-narrow" }, [
        hero,
        el("h1", { text: w.title }),
        paragraphs,
        el("p", { class: "notice", text: CONTENT.disclaimer }),
        el("div", { class: "btn-row" }, [
          el("button", { class: "btn", type: "button", text: w.start, onclick: function () { go("checkin"); } })
        ])
      ])
    ]);

    if (has3d) {
      mountStage(hero, { mode: "hero" });
    }
  }

  // selector del clima de animo, se usa al inicio y en el nivel 6
  function weatherPicker(groupName, selectedId) {
    var options = [];
    for (var i = 0; i < CONTENT.weather.length; i++) {
      var w = CONTENT.weather[i];
      var inputId = groupName + "-" + w.id;
      options.push(
        el("div", { class: "weather-option" }, [
          el("input", { type: "radio", name: groupName, id: inputId, value: w.id, checked: w.id === selectedId }),
          el("label", { class: "weather-card", for: inputId }, [
            el("span", { svg: UI.weatherIcon(w.id) }),
            el("strong", { text: w.label }),
            el("span", { text: w.hint })
          ])
        ])
      );
    }
    return el("fieldset", { class: "weather-group" }, [
      el("legend", { text: CONTENT.checkin.question }),
      el("div", { class: "weather-options" }, options)
    ]);
  }

  // check in del inicio
  function showCheckin() {
    var c = CONTENT.checkin;
    var current = Store.data.moodBefore;
    var isUpdate = current !== null;
    var error = el("p", { class: "error-text", role: "alert" });
    function save(event) {
      event.preventDefault();
      var picked = form.querySelector('input[name="mood-before"]:checked');
      if (!picked) {
        error.textContent = c.error;
        return;
      }
      Store.setMood("before", picked.value, "");
      go("hub");
    }

    var form = el("form", { onsubmit: save, onchange: function () { error.textContent = ""; } }, [
      weatherPicker("mood-before", current ? current.id : ""),
      error,
      el("p", { class: "small-text", text: CONTENT.privacy }),
      el("div", { class: "btn-row" }, [
        el("button", { class: "btn", type: "submit", text: isUpdate ? c.update : c.save })
      ])
    ]);

    show([
      el("div", { class: "panel panel-narrow" }, [
        el("h1", { text: c.title }),
        form
      ])
    ]);
  }

  // hub con la caja de 6 compartimentos
  function showHub() {
    var h = CONTENT.hub;
    var count = Store.toolsCount();
    var percent = Math.round((count / 6) * 100);
    // si se acaba de ganar una herramienta la barra empieza un paso atras
    var unlock = unlockedNow;
    unlockedNow = null;
    var startPercent = unlock ? Math.round(((count - 1) / 6) * 100) : percent;
    var progressFill = el("div", { class: "progress-fill", style: "width: " + startPercent + "%" });
    var mood = Store.data.moodBefore ? UI.findWeather(Store.data.moodBefore.id) : null;

    var moodChip = el("div", { class: "chip" }, [
      mood ? el("span", { svg: UI.weatherIcon(mood.id) }) : null,
      el("span", { text: h.mood + " " + (mood ? mood.label : h.moodEmpty) }),
      el("a", { href: "#checkin", class: "btn btn-soft btn-small", text: h.moodButton })
    ]);

    var compartments = [];
    var doneMap = {};
    for (var i = 0; i < CONTENT.levels.length; i++) {
      compartments.push(compartment(CONTENT.levels[i]));
      doneMap[CONTENT.levels[i].id] = Store.data.levels[CONTENT.levels[i].id].done;
    }

    // maletin 3d arriba de la lista de misiones
    var has3d = Scene3D.supported();
    var stage = null;
    var tip = null;
    if (has3d) {
      tip = el("div", { class: "stage-tip" });
      stage = el("div", { class: "stage" }, [
        el("span", { class: "stage-tag", text: h.stageTag }),
        el("p", { class: "stage-hint", text: h.stageHint }),
        tip
      ]);
    }

    show([
      el("div", { class: "hub-top" }, [
        el("div", null, [
          el("h1", { text: h.title }),
          el("p", { class: "lead", text: h.intro })
        ]),
        el("div", { class: "hub-status" }, [moodChip])
      ]),
      el("div", { class: "panel" }, [
        el("span", { class: "progress-label", id: "progress-label", text: UI.fill(h.progress, { n: count }) }),
        el("div", {
          class: "progress",
          role: "progressbar",
          "aria-labelledby": "progress-label",
          "aria-valuemin": "0",
          "aria-valuemax": "6",
          "aria-valuenow": String(count)
        }, progressFill)
      ]),
      stage,
      el("div", { class: "box-wrap" }, [
        el("h2", { text: h.listTitle }),
        el("div", { class: "box" }, compartments)
      ])
    ]);

    function mountHub(unlockId, lidOpenNow) {
      if (has3d) {
        mountStage(stage, {
          mode: "hub",
          levels: CONTENT.levels,
          doneMap: doneMap,
          tip: tip,
          unlockId: unlockId,
          lidOpenNow: lidOpenNow,
          onPick: function (id) { go("level-" + id); }
        });
      }
    }

    if (deferHub3d) {
      deferHub3d = false;
      pendingHub = function () { mountHub(null, true); };
      return;
    }

    if (!unlock) {
      mountHub(null);
      return;
    }

    // primero sale la carta, al cerrarla se ve el modulo bajar en el maletin
    var won = UI.findLevel(unlock);
    var nextHref = won.id < 6 && !Store.data.levels[won.id + 1].done ? "#level-" + (won.id + 1) : null;
    Reveal.show(won, nextHref, function () {
      mountHub(unlock);
      setTimeout(function () { progressFill.style.width = percent + "%"; }, 600);
      (stage || main.querySelector(".box-wrap")).scrollIntoView({ block: "center" });
      var card = main.querySelectorAll(".compartment")[unlock - 1];
      if (card) {
        card.classList.add("is-unlocked");
      }
    });
  }

  function compartment(level) {
    var done = Store.data.levels[level.id].done;
    var h = CONTENT.hub;
    var label = h.levelWord + " " + level.id + ", " + level.title + ", " + level.topic + ", " + (done ? h.statusDone : h.statusReady);

    return el("button", {
      type: "button",
      class: "compartment c-" + level.color + (done ? " is-done" : ""),
      "aria-label": label,
      onclick: function () { go("level-" + level.id); }
    }, [
      done ? el("span", { class: "compartment-check", svg: UI.icon("check") }) : null,
      el("span", { class: "compartment-icon", svg: UI.icon(level.icon) }),
      el("span", { class: "compartment-level", text: h.levelWord + " " + level.id }),
      el("span", { class: "compartment-title", text: level.title }),
      el("span", { class: "badge-list" }, [
        level.application ? UI.badge("application") : null
      ]),
      el("span", { class: "compartment-status", text: done ? h.statusDone : h.statusReady })
    ]);
  }

  // pantalla de mi kit con las tarjetas
  function showKit() {
    var k = CONTENT.kit;
    var cards = [];
    for (var i = 0; i < CONTENT.levels.length; i++) {
      var level = CONTENT.levels[i];
      var unlocked = Store.data.levels[level.id].done;
      cards.push(UI.toolCard(level, unlocked, lastNewTool === level.id));
    }
    lastNewTool = null;

    var message = el("p", { class: "small-text", role: "status" });

    show([
      el("h1", { text: k.title }),
      el("p", { class: "lead", text: k.intro }),
      Store.toolsCount() === 0 ? el("p", { class: "notice", text: k.empty }) : null,
      el("div", { class: "card-grid" }, cards),
      el("div", { class: "panel", style: "margin-top: 26px" }, [
        el("div", { class: "btn-row", style: "margin-top: 0" }, [
          el("button", { class: "btn", type: "button", text: k.download, onclick: downloadKit }),
          el("button", {
            class: "btn btn-danger",
            type: "button",
            text: k.reset,
            onclick: function () {
              if (window.confirm(k.resetConfirm)) {
                Store.reset();
                Store.touchStreak();
                showKit();
                main.querySelector('[role="status"]').textContent = k.resetDone;
              }
            }
          })
        ]),
        el("p", { class: "small-text", style: "margin-top: 12px", text: k.downloadHelp }),
        message
      ])
    ]);
  }

  // arma el texto del archivo que se descarga
  function buildExport() {
    var t = CONTENT.exportFile;
    var lines = [];
    var data = Store.data;

    lines.push(t.title);
    lines.push(t.exportedOn + " " + new Date().toLocaleString());
    lines.push(t.note);
    lines.push("");

    lines.push(t.moodTitle);
    lines.push(t.before + " " + moodText(data.moodBefore));
    lines.push(t.after + " " + moodText(data.moodAfter));
    lines.push("");

    lines.push(t.toolsTitle + " " + Store.toolsCount() + "/6");
    for (var i = 0; i < CONTENT.levels.length; i++) {
      var level = CONTENT.levels[i];
      if (data.levels[level.id].done) {
        lines.push("- " + level.tool.name + ": " + level.tool.takeaway);
      }
    }
    lines.push("");

    lines.push(t.answersTitle);
    var any = false;
    for (var j = 0; j < CONTENT.levels.length; j++) {
      var lv = CONTENT.levels[j];
      var module = LEVELS[lv.id];
      var answers = data.levels[lv.id].answers;
      if (module && module.summary && answers && Object.keys(answers).length > 0) {
        var summary = module.summary(answers);
        if (summary.length > 0) {
          any = true;
          lines.push("");
          lines.push(CONTENT.hub.levelWord + " " + lv.id + ": " + lv.title);
          for (var k = 0; k < summary.length; k++) {
            lines.push(summary[k]);
          }
        }
      }
    }
    if (!any) {
      lines.push(t.noAnswers);
    }
    lines.push("");
    lines.push(CONTENT.disclaimer);

    return lines.join("\r\n");
  }

  function moodText(mood) {
    if (!mood) {
      return CONTENT.exportFile.notYet;
    }
    var w = UI.findWeather(mood.id);
    var text = w ? w.label : mood.id;
    if (mood.note) {
      text += ", " + mood.note;
    }
    text += " (" + new Date(mood.date).toLocaleDateString() + ")";
    return text;
  }

  // descarga el archivo de texto creado en el navegador
  function downloadKit() {
    var blob = new Blob([buildExport()], { type: "text/plain;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var link = el("a", { href: url, download: CONTENT.exportFile.fileName });
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  // abre un nivel, si todavia no existe muestra el aviso de en construccion
  function showLevel(id) {
    var level = UI.findLevel(id);
    if (!level) {
      go("hub");
      return;
    }
    document.title = level.title + " | " + CONTENT.appTitle;

    var module = LEVELS[level.id];
    if (module && module.render) {
      var api = {
        el: el,
        show: show,
        go: go,
        level: level,
        answers: Store.data.levels[level.id].answers,
        saveAnswers: function (answers) { Store.setAnswers(level.id, answers); },
        complete: function () {
          Store.completeLevel(level.id);
          lastNewTool = level.id;
          unlockedNow = level.id;
        }
      };
      module.render(api);
      return;
    }

    var p = CONTENT.placeholder;
    show([
      el("div", { class: "panel panel-narrow c-" + level.color }, [
        el("div", { class: "compartment-icon", style: "background: var(--c); margin-bottom: 12px", svg: UI.icon(level.icon) }),
        el("p", { class: "compartment-level", text: CONTENT.hub.levelWord + " " + level.id }),
        el("h1", { text: level.title }),
        UI.levelBadges(level),
        el("h2", { style: "margin-top: 18px", text: p.title }),
        el("p", { text: p.text }),
        el("div", { class: "btn-row" }, [
          el("a", { class: "btn", href: "#hub", text: p.back })
        ])
      ])
    ]);
  }

  // referencias en apa 7 con titulos en cursiva y doi como link
  function showReferences() {
    var r = CONTENT.references;
    var list = el("ul", { class: "ref-list" });
    for (var i = 0; i < r.list.length; i++) {
      var item = el("li");
      var parts = r.list[i];
      for (var j = 0; j < parts.length; j++) {
        if (parts[j].i) {
          item.appendChild(el("em", { text: parts[j].i }));
        } else if (parts[j].url) {
          item.appendChild(el("a", { href: parts[j].url, target: "_blank", rel: "noopener noreferrer", text: parts[j].url }));
        } else {
          item.appendChild(document.createTextNode(parts[j].t));
        }
      }
      list.appendChild(item);
    }
    show([
      el("div", { class: "panel panel-narrow" }, [
        el("h1", { text: r.title }),
        el("p", { class: "lead", text: r.text }),
        list,
        el("h2", { text: r.aboutTitle }),
        el("p", { text: r.about }),
        el("p", { class: "notice", text: CONTENT.disclaimer })
      ])
    ]);
  }

  // textos fijos del encabezado y pie
  function fillShell() {
    // el salto al contenido no cambia el hash para no confundir las rutas
    var skip = document.querySelector(".skip-link");
    skip.textContent = CONTENT.nav.skip;
    skip.addEventListener("click", function (event) {
      event.preventDefault();
      main.setAttribute("tabindex", "-1");
      main.focus();
    });
    document.querySelector(".brand-icon").innerHTML = UI.icon("box");
    document.querySelector(".brand-name").textContent = CONTENT.appTitle;
    document.querySelector('[data-nav="hub"]').textContent = CONTENT.nav.hub;
    document.querySelector('[data-nav="kit"]').textContent = CONTENT.nav.kit;
    document.querySelector('[data-nav="references"]').textContent = CONTENT.nav.references;
    var introButton = document.querySelector(".footer-intro");
    introButton.textContent = CONTENT.intro.replay;
    introButton.addEventListener("click", openIntro);
  }

  // abre la intro, apaga el 3d de atras mientras se ve y luego vuelve a pintar la pantalla
  function openIntro() {
    if (cleanup3d) {
      cleanup3d();
      cleanup3d = null;
    }
    pendingHub = null;
    Intro.open(function () {
      Store.setIntroSeen();
      // el maletin de the box sigue justo donde quedo el video
      if (pendingHub) {
        var mount = pendingHub;
        pendingHub = null;
        mount();
      } else {
        render();
      }
    }, function () {
      // antes del final se arma the box detras del video y se regresa su recuadro 3d
      deferHub3d = true;
      history.replaceState(null, "", "#hub");
      render();
      var stage = main.querySelector(".stage");
      if (stage) {
        stage.scrollIntoView({ block: "center" });
      }
      return stage;
    });
  }

  function start() {
    main = document.getElementById("main");
    fillShell();
    Store.touchStreak();
    window.addEventListener("hashchange", render);
    render();
    // la primera vez se ofrece la intro, no suena nada hasta que la persona elige
    if (!Store.data.introSeen) {
      openIntro();
    }
  }

  return {
    start: start,
    go: go,
    weatherPicker: weatherPicker
  };
})();

document.addEventListener("DOMContentLoaded", App.start);
