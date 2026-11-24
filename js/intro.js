// intro tipo cinematica: presentacion, titulo que deslumbra y se enfoca, y creditos
// dura 29.3 segundos y al final el video se encoge hasta caer en el maletin de the box

var Intro = (function () {
  var el = UI.el;
  var LENGTH = IntroMusic.length;

  // momentos de cada escena de creditos, en segundos
  var SCENES = [8.4, 12.9, 17.4, 21.9];
  var POSITIONS = ["pos-right", "pos-left", "pos-right", "pos-center"];

  // tomas de camara del maletin, cada una con inicio, fin, posicion y a donde mira
  var SHOTS = [
    { from: 0, to: 12.35, a: [-6.5, 1.3, 5.5], b: [-3.2, 1.7, 6.2], ta: [0.5, 1.0, 0], tb: [0.3, 1.2, 0] },
    { from: 12.35, to: 16.85, a: [-1.5, 8.5, 2.2], b: [1.5, 8.0, 1.6], ta: [0, 1.5, 0.1], tb: [0, 1.5, 0.1] },
    { from: 16.85, to: 21.35, orbit: [1.15, 0.6], radius: 8, height: 2.8, ta: [0, 1.6, 0], tb: [0, 1.6, 0] },
    { from: 21.35, to: 26.3, a: [0, 3.6, 6.5], b: [0, 5.2, 11.5], ta: [0, 2.1, -0.4], tb: [0, 2.1, -0.4] },
    // ultima toma: la misma vista del maletin que tiene the box, se ajusta al tamano del recuadro
    { from: 26.3, to: 28.3, a: [0, 5.2, 11.5], b: [0, 6.85, 9.5], ta: [0, 2.1, -0.4], tb: [0, 2.25, -0.4] }
  ];

  var overlay = null;
  var music = null;
  var frame = 0;
  var cleanup3d = null;
  var onDone = null;
  var startTime = 0;
  var cues = [];
  var calm = false;
  var prepareTarget = null;
  var targetStage = null;

  function lerp(a, b, p) {
    return a + (b - a) * p;
  }

  function smooth(p) {
    return p * p * (3 - 2 * p);
  }

  // tiempo de la intro, sigue al audio y si el audio no arranca usa el reloj normal
  function elapsed() {
    var real = (performance.now() - startTime) / 1000;
    if (music && typeof music.getTime === "function") {
      var t = music.getTime();
      if (t > 0 || real < 1.5) {
        return t;
      }
    }
    return real;
  }

  // calcula la camara segun el segundo de la intro
  function cameraAt() {
    var t = elapsed();
    var shot = SHOTS[SHOTS.length - 1];
    for (var i = 0; i < SHOTS.length; i++) {
      if (t < SHOTS[i].to) {
        shot = SHOTS[i];
        break;
      }
    }
    var p = (t - Math.max(shot.from, 8)) / (shot.to - Math.max(shot.from, 8));
    p = calm ? 0 : smooth(Math.max(0, Math.min(1, p)));

    var pos;
    if (shot.orbit) {
      var angle = lerp(shot.orbit[0], shot.orbit[1], p);
      pos = [Math.sin(angle) * shot.radius, shot.height, Math.cos(angle) * shot.radius];
    } else {
      pos = [lerp(shot.a[0], shot.b[0], p), lerp(shot.a[1], shot.b[1], p), lerp(shot.a[2], shot.b[2], p)];
    }
    var target = [lerp(shot.ta[0], shot.tb[0], p), lerp(shot.ta[1], shot.tb[1], p), lerp(shot.ta[2], shot.tb[2], p)];
    return { pos: pos, target: target };
  }

  // la tapa se abre en la primera escena de creditos
  function lidAt() {
    var t = elapsed();
    if (t < 9) {
      return 0;
    }
    if (calm) {
      return -1.95;
    }
    return -1.95 * smooth(Math.min((t - 9) / 2.5, 1));
  }

  function on(node) {
    node.classList.add("is-on");
  }

  function off(node) {
    node.classList.remove("is-on");
  }

  // arma la pantalla de inicio de la intro
  function open(done, prepare) {
    if (overlay) {
      return;
    }
    onDone = done;
    prepareTarget = prepare || null;
    targetStage = null;
    calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var t = CONTENT.intro;

    // portada hecha por carlos y el boton para empezar
    var startPanel = el("div", { class: "intro-start" }, [
      el("img", { class: "intro-cover", src: "img/start-cover.webp", alt: t.coverAlt }),
      el("div", { class: "intro-cover-shade", "aria-hidden": "true" }),
      el("div", { class: "btn-row intro-start-buttons" }, [
        el("button", { class: "btn", type: "button", text: t.startGame, onclick: function () { play(true); } })
      ])
    ]);

    overlay = el("div", { class: "intro", role: "dialog", "aria-modal": "true", "aria-label": t.label }, startPanel);
    document.body.appendChild(overlay);
    document.body.classList.add("intro-open");
    document.addEventListener("keydown", onKey);
    overlay.querySelector("button").focus();
  }

  function onKey(event) {
    if (event.key === "Escape") {
      finish();
    }
  }

  // arranca la cinematica
  function play(withSound) {
    var t = CONTENT.intro;
    overlay.innerHTML = "";

    var stage = el("div", { class: "intro-3d" });
    var shutter = el("div", { class: "intro-shutter" });
    var flash = el("div", { class: "intro-flash" });
    var pre = el("p", { class: "intro-pre", text: t.pre });
    // logo hecho por carlos, aparece con destello y brillo alrededor
    var title = el("div", { class: "intro-title" }, [
      el("img", { class: "intro-logo", src: "img/intro-logo.png", alt: t.title + ", " + t.subtitle })
    ]);

    var scenes = [];
    for (var i = 0; i < t.credits.length; i++) {
      var lines = [];
      for (var j = 0; j < t.credits[i].length; j++) {
        lines.push(el("div", { class: "intro-credit" }, [
          el("span", { class: "credit-role", text: t.credits[i][j].role }),
          el("span", { class: "credit-name", text: t.credits[i][j].name })
        ]));
      }
      if (i === t.credits.length - 1) {
        lines.push(el("div", { class: "intro-credit intro-note" }, el("span", { text: t.claudeNote })));
      }
      scenes.push(el("div", { class: "intro-scene " + POSITIONS[i] }, lines));
    }

    overlay.appendChild(stage);
    overlay.appendChild(shutter);
    overlay.appendChild(el("div", { class: "intro-bars" }));
    overlay.appendChild(flash);
    overlay.appendChild(pre);
    overlay.appendChild(title);
    for (var k = 0; k < scenes.length; k++) {
      overlay.appendChild(scenes[k]);
    }
    overlay.setAttribute("tabindex", "-1");
    overlay.focus();

    startTime = performance.now();

    if (withSound) {
      music = IntroMusic.play();
    }

    // lista de momentos: segundo y lo que pasa
    // el 3d se monta justo antes de los creditos para que el logo vaya fluido
    cues = [
      [7.4, function () { mount3d(stage); }],
      [0.6, function () { on(pre); }],
      [2.6, function () { off(pre); }],
      [3.2, function () { on(flash); title.className = "intro-title is-flash"; }],
      [3.4, function () { off(flash); }],
      [3.95, function () { title.className = "intro-title is-sharp"; }],
      [7.0, function () { title.className = "intro-title is-dim"; }],
      [7.8, function () { title.className = "intro-title is-out"; }],
      [8.0, function () { on(shutter); }],
      [26.3, function () { overlay.classList.add("is-merging"); aimAtTarget(); }],
      [27.2, function () { shrinkInto(stage); }]
    ];

    // cada escena de creditos entra, se queda y sale, con corte a negro entre tomas
    for (var s = 0; s < SCENES.length; s++) {
      addSceneCues(scenes[s], SCENES[s], shutter, s === SCENES.length - 1);
    }
    cues.push([LENGTH, finish]);
    cues.sort(function (a, b) { return a[0] - b[0]; });

    tick();
  }

  function currentDone() {
    var map = {};
    for (var i = 1; i <= 6; i++) {
      map[i] = Store.data.levels[i].done;
    }
    return map;
  }

  // fondo 3d con las tomas del maletin
  function mount3d(stage) {
    if (!Scene3D.supported()) {
      return;
    }
    try {
      cleanup3d = Scene3D.mount(stage, {
        mode: "cinema",
        levels: CONTENT.levels,
        doneMap: currentDone(),
        cameraAt: cameraAt,
        lidAt: lidAt
      });
    } catch (e) {
      cleanup3d = null;
    }
  }

  // arma the box detras y ajusta la ultima toma al tamano de su recuadro, igual que hace the box
  function aimAtTarget() {
    targetStage = prepareTarget ? prepareTarget() : null;
    if (!targetStage) {
      return;
    }
    var r = targetStage.getBoundingClientRect();
    var aspect = r.width / r.height;
    var factor = aspect < 1.35 ? Math.min(1.35 / aspect, 2.3) : 1;
    var last = SHOTS[SHOTS.length - 1];
    last.b = [0, 2.25 + 4.6 * factor, -0.4 + 9.9 * factor];
  }

  // el video se encoge hasta el recuadro 3d de the box
  function shrinkInto(stage) {
    if (!targetStage) {
      overlay.classList.add("is-fading");
      return;
    }
    var r = targetStage.getBoundingClientRect();
    stage.classList.add("is-shrinking");
    stage.style.left = r.left + "px";
    stage.style.top = r.top + "px";
    stage.style.width = r.width + "px";
    stage.style.height = r.height + "px";
  }

  function addSceneCues(scene, at, shutter, last) {
    var lines = scene.querySelectorAll(".intro-credit");
    cues.push([at, function () { on(scene); on(lines[0]); }]);
    for (var i = 1; i < lines.length; i++) {
      addLine(lines[i], at + 0.5 * i);
    }
    var outAt = last ? at + 4.0 : at + 3.6;
    cues.push([outAt, function () {
      off(scene);
      for (var j = 0; j < lines.length; j++) {
        off(lines[j]);
      }
    }]);
    if (!last) {
      cues.push([at + 3.7, function () { off(shutter); }]);
      cues.push([at + 4.2, function () { on(shutter); }]);
    }
  }

  function addLine(line, at) {
    cues.push([at, function () { on(line); }]);
  }

  // revisa el reloj y dispara los momentos que ya tocan
  function tick() {
    frame = requestAnimationFrame(tick);
    var t = elapsed();
    while (cues.length > 0 && cues[0][0] <= t) {
      var cue = cues.shift();
      cue[1]();
      if (!overlay) {
        return;
      }
    }
  }

  // cierra la intro, ya sea al terminar o al saltarla
  function finish() {
    if (!overlay) {
      return;
    }
    cancelAnimationFrame(frame);
    cues = [];
    if (music) {
      music.stop();
      music = null;
    }
    if (cleanup3d) {
      cleanup3d();
      cleanup3d = null;
    }
    document.removeEventListener("keydown", onKey);
    document.body.classList.remove("intro-open");
    overlay.parentNode.removeChild(overlay);
    overlay = null;
    if (onDone) {
      var callback = onDone;
      onDone = null;
      callback();
    }
  }

  return {
    open: open
  };
})();
