// motor comun de las misiones: pasos, puntos de avance, preguntas y pantalla final con la tarjeta

var Mission = (function () {
  var el = UI.el;

  function start(api, steps) {
    var level = api.level;
    var ui = CONTENT.missionUi;
    var answers = JSON.parse(JSON.stringify(api.answers || {}));

    // pantalla de inicio sencilla para todas las misiones
    steps = [function (ctx) {
      return ctx.panel(level.tool.name, [
        ctx.lead(ctx.text.short),
        el("div", { class: "btn-row" }, ctx.nextButton(ui.start))
      ]);
    }].concat(steps);
    var index = 0;
    var timers = [];

    var dots = el("div", { class: "mission-dots", "aria-hidden": "true" });
    var stepLabel = el("p", { class: "mission-step-label" });
    var body = el("div", { class: "mission-body" });

    api.show([
      el("div", { class: "mission c-" + level.color }, [
        el("div", { class: "mission-head" }, [
          el("a", { href: "#hub", class: "mission-back", text: "← " + ui.back }),
          el("p", { class: "mission-kicker", text: CONTENT.hub.levelWord + " " + level.id + " · " + level.unit + ": " + level.topic }),
          el("h1", { text: level.title }),
          UI.levelBadges(level)
        ]),
        el("div", { class: "mission-progress" }, [dots, stepLabel]),
        body
      ])
    ]);

    // relojes de la mision, se borran al cambiar de paso o de pantalla
    function clearTimers() {
      for (var i = 0; i < timers.length; i++) {
        clearTimeout(timers[i]);
        clearInterval(timers[i]);
      }
      timers = [];
    }
    window.addEventListener("hashchange", clearTimers, { once: true });

    var ctx = {
      el: el,
      level: level,
      text: CONTENT.missions[level.id],
      answers: answers,
      save: function () {
        api.saveAnswers(answers);
      },
      next: function () {
        index++;
        draw();
      },
      later: function (fn, ms) {
        var id = setTimeout(fn, ms);
        timers.push(id);
        return id;
      },
      every: function (fn, ms) {
        var id = setInterval(fn, ms);
        timers.push(id);
        return id;
      },
      stop: function (id) {
        clearTimeout(id);
        clearInterval(id);
      },
      // panel de un paso con titulo enfocable
      panel: function (title, children) {
        return el("section", { class: "panel mission-panel" }, [
          el("h2", { class: "mission-title", tabindex: "-1", text: title }),
          children
        ]);
      },
      // etiqueta de actividad para los pasos donde la persona usa sus propias respuestas
      activity: function () {
        return el("div", { class: "mission-activity" }, UI.badge("activity", level.activity));
      },
      lead: function (text) {
        return el("p", { class: "lead", text: text });
      },
      nextButton: function (label, onClick) {
        return el("button", {
          class: "btn",
          type: "button",
          text: label || ui.next,
          onclick: onClick || ctx.next
        });
      },
      // fila de botones donde solo se elige uno
      pickOne: function (list, selected, onPick) {
        var grid = el("div", { class: "word-grid" });
        for (var i = 0; i < list.length; i++) {
          var b = el("button", { class: "word-btn", type: "button", "aria-pressed": list[i] === selected ? "true" : "false", text: list[i] });
          b.addEventListener("click", function (event) {
            var all = grid.querySelectorAll(".word-btn");
            for (var j = 0; j < all.length; j++) {
              all[j].setAttribute("aria-pressed", "false");
            }
            event.currentTarget.setAttribute("aria-pressed", "true");
            onPick(event.currentTarget.textContent);
          });
          grid.appendChild(b);
        }
        return grid;
      },
      // pregunta de opcion multiple, si fallas te explica y puedes volver a intentar
      quiz: function (options, onRight) {
        var feedback = el("p", { class: "feedback", role: "status" });
        var list = el("div", { class: "choice-list" });
        var done = false;
        for (var i = 0; i < options.length; i++) {
          list.appendChild(choiceButton(options[i]));
        }
        function choiceButton(option) {
          var button = el("button", { class: "choice", type: "button", text: option.text });
          button.addEventListener("click", function () {
            if (done) {
              return;
            }
            if (option.ok) {
              done = true;
              button.classList.add("is-right");
              var all = list.querySelectorAll(".choice");
              for (var j = 0; j < all.length; j++) {
                all[j].disabled = true;
              }
              feedback.className = "feedback is-right";
              feedback.textContent = option.why || ui.correct;
              onRight(option, feedback);
            } else {
              button.classList.remove("is-wrong");
              void button.offsetWidth;
              button.classList.add("is-wrong");
              feedback.className = "feedback is-wrong";
              feedback.textContent = option.why || "";
            }
          });
          return button;
        }
        return el("div", null, [list, feedback]);
      }
    };

    function draw() {
      clearTimers();
      var total = steps.length;
      dots.innerHTML = "";
      for (var i = 0; i < total; i++) {
        var cls = "dot";
        if (i < index) {
          cls += " is-done";
        } else if (i === index) {
          cls += " is-current";
        }
        dots.appendChild(el("span", { class: cls }));
      }

      body.innerHTML = "";
      if (index >= total) {
        stepLabel.textContent = "";
        finish();
        return;
      }
      stepLabel.textContent = UI.fill(ui.step, { n: index + 1, total: total });
      body.appendChild(steps[index](ctx));
      var title = body.querySelector(".mission-title");
      if (title && index > 0) {
        title.focus();
      }
    }

    // al terminar se guarda y se regresa al maletin con la animacion de desbloqueo
    function finish() {
      ctx.save();
      api.complete();
      api.go("hub");
    }

    draw();
  }

  return {
    start: start
  };
})();
