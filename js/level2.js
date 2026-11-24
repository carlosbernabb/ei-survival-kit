// mision 2: hold the line, autocontrol
// pasos: cerebro en alerta, dos rondas del reset de 4 pasos y mi propio detonante

var LEVELS = window.LEVELS || {};
window.LEVELS = LEVELS;

LEVELS[2] = (function () {
  function render(api) {
    var t = CONTENT.missions[2];
    var ui = CONTENT.missionUi;

    // una ronda: los 4 pasos en orden, solo se puede tocar el que esta prendido
    function roundStep(n) {
      return function (ctx) {
        var holder = ctx.el("div");
        var tickId = null;

        function build() {
          if (tickId) {
            ctx.stop(tickId);
          }
          var round = t.rounds[n];
          var level = 20;
          var stage = 0;
          var busy = false;
          var over = false;
          // cuanto sube el medidor por segundo segun el paso
          var rates = [6, 3, 0, 1, 0];

          var fill = ctx.el("div", { class: "meter-fill" });
          var track = ctx.el("div", {
            class: "meter-track",
            role: "meter",
            "aria-label": t.meterLabel,
            "aria-valuemin": "0",
            "aria-valuemax": "100",
            "aria-valuenow": "20"
          }, fill);
          var action = ctx.el("div", { class: "action-area" });
          var feedback = ctx.el("p", { class: "feedback", role: "status" });
          var grid = ctx.el("div", { class: "reset-buttons" });
          var buttons = [];

          for (var k = 0; k < t.steps.length; k++) {
            var b = ctx.el("button", { class: "reset-btn", type: "button" }, [
              ctx.el("strong", { text: (k + 1) + ". " + t.steps[k] }),
              ctx.el("span", { text: t.stepHints[k] })
            ]);
            b.addEventListener("click", makeHandler(k));
            buttons.push(b);
            grid.appendChild(b);
          }

          // prende solo el paso que sigue
          function paintButtons() {
            for (var j = 0; j < buttons.length; j++) {
              var done = j < stage;
              var next = j === stage && !busy && !over;
              buttons[j].classList.toggle("is-done", done);
              buttons[j].classList.toggle("is-next", next);
              buttons[j].disabled = !next;
            }
          }

          function paint() {
            var v = Math.max(0, Math.min(100, level));
            fill.style.width = v + "%";
            fill.className = "meter-fill" + (v > 70 ? " is-hot" : v > 45 ? " is-warm" : "");
            track.setAttribute("aria-valuenow", String(Math.round(v)));
          }

          function finishStep() {
            busy = false;
            stage++;
            paintButtons();
            if (stage < buttons.length) {
              buttons[stage].focus();
            }
          }

          function overflow() {
            over = true;
            ctx.stop(tickId);
            paintButtons();
            action.innerHTML = "";
            feedback.className = "feedback is-wrong";
            feedback.textContent = t.overflow;
            var again = ctx.nextButton(t.retry, function () {
              holder.innerHTML = "";
              holder.appendChild(build());
              holder.querySelector(".reset-btn").focus();
            });
            action.appendChild(ctx.el("div", { class: "btn-row" }, again));
            again.focus();
          }

          function makeHandler(k) {
            return function () {
              if (over || busy || k !== stage) {
                return;
              }
              feedback.textContent = "";
              action.innerHTML = "";
              if (k === 0) {
                finishStep();
              } else if (k === 1) {
                // una respiracion lenta, el medidor baja mientras tanto
                busy = true;
                paintButtons();
                var circle = ctx.el("div", { class: "breath", role: "status", text: t.breatheIn });
                action.appendChild(circle);
                ctx.later(function () { circle.textContent = t.breatheOut; }, 4000);
                ctx.later(function () {
                  action.innerHTML = "";
                  finishStep();
                }, 8000);
              } else if (k === 2) {
                busy = true;
                paintButtons();
                var options = [];
                for (var f = 0; f < round.feelings.length; f++) {
                  var ok = t.feelingOk.indexOf(round.feelings[f]) !== -1;
                  options.push({ text: round.feelings[f], ok: ok, why: ok ? ui.correct : t.nameWrong });
                }
                action.appendChild(ctx.el("p", { class: "slot-label", text: t.nameTitle }));
                action.appendChild(ctx.quiz(options, finishStep));
              } else if (k === 3) {
                busy = true;
                paintButtons();
                var choices = [];
                for (var c = 0; c < round.choices.length; c++) {
                  choices.push({ text: round.choices[c].text, ok: round.choices[c].ok, why: round.choices[c].ok ? t.roundWin : t.chooseWrong });
                }
                action.appendChild(ctx.el("p", { class: "slot-label", text: t.chooseTitle }));
                action.appendChild(ctx.quiz(choices, function () {
                  ctx.stop(tickId);
                  finishStep();
                  var go = ctx.nextButton(ui.next);
                  action.appendChild(ctx.el("div", { class: "btn-row" }, go));
                  go.focus();
                }));
              }
              paint();
            };
          }

          // el medidor sube solo cada cuarto de segundo
          tickId = ctx.every(function () {
            if (over || stage >= 4) {
              return;
            }
            if (stage === 1 && busy) {
              level = Math.max(5, level - 1.2);
            } else {
              level += rates[stage] * 0.25;
            }
            paint();
            if (level >= 100) {
              overflow();
            }
          }, 250);

          paint();
          paintButtons();
          return ctx.el("div", null, [
            ctx.el("p", { class: "clue-count", text: UI.fill(t.roundLabel, { n: n + 1, total: t.rounds.length }) }),
            ctx.el("p", { class: "trigger-card", text: round.trigger }),
            ctx.el("div", { class: "meter" }, [
              ctx.el("div", { class: "meter-label" }, [ctx.el("span", { text: t.meterLabel })]),
              track
            ]),
            grid,
            action,
            feedback
          ]);
        }

        holder.appendChild(build());
        return ctx.panel(t.howTitle, [ctx.lead(t.howText), holder]);
      };
    }

    Mission.start(api, [
      roundStep(0),
      roundStep(1),

      // paso 4: actividad, mi detonante y el paso que mas me ayuda, todo con opciones
      function (ctx) {
        var next = ctx.nextButton(ui.save, function () {
          ctx.save();
          ctx.next();
        });
        function refresh() {
          next.disabled = !(ctx.answers.trigger && ctx.answers.plan);
        }
        var triggers = ctx.pickOne(t.triggers, ctx.answers.trigger, function (value) {
          ctx.answers.trigger = value;
          refresh();
        });
        var plans = ctx.pickOne(t.steps, ctx.answers.plan, function (value) {
          ctx.answers.plan = value;
          refresh();
        });
        refresh();

        return ctx.panel(t.yourTitle, [
          ctx.activity(),
          ctx.lead(t.yourText),
          ctx.el("p", { class: "slot-label", text: t.triggerLabel }),
          triggers,
          ctx.el("p", { class: "slot-label", text: t.planLabel }),
          plans,
          ctx.el("div", { class: "btn-row" }, next)
        ]);
      }
    ]);
  }

  function summary(answers) {
    var t = CONTENT.missions[2];
    var lines = [];
    if (answers.trigger) {
      lines.push(t.summaryTrigger + " " + answers.trigger);
    }
    if (answers.plan) {
      lines.push(t.summaryPlan + " " + answers.plan);
    }
    return lines;
  }

  return { render: render, summary: summary };
})();
