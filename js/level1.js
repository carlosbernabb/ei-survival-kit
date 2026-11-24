// mision 1: who am i, autoconciencia
// pasos: rueda de emociones, palabra precisa, como me siento hoy y mis valores

var LEVELS = window.LEVELS || {};
window.LEVELS = LEVELS;

LEVELS[1] = (function () {
  // boton que se prende y apaga
  function toggle(el, label, pressed, onClick) {
    var button = el("button", { class: "word-btn", type: "button", "aria-pressed": pressed ? "true" : "false", text: label });
    button.addEventListener("click", function () {
      onClick(button);
    });
    return button;
  }

  function render(api) {
    var t = CONTENT.missions[1];
    var ui = CONTENT.missionUi;

    Mission.start(api, [
      // paso 2: tres pistas para elegir la palabra precisa
      function (ctx) {
        var holder = ctx.el("div");
        var q = 0;
        function drawClue() {
          holder.innerHTML = "";
          var item = t.quiz[q];
          var row = ctx.el("div", { class: "btn-row" });
          holder.appendChild(ctx.el("p", { class: "clue-count", text: (q + 1) + " / " + t.quiz.length }));
          holder.appendChild(ctx.el("p", { class: "clue", text: item.clue }));
          holder.appendChild(ctx.quiz(item.options, function () {
            var last = q === t.quiz.length - 1;
            row.appendChild(ctx.nextButton(ui.next, function () {
              if (last) {
                ctx.next();
              } else {
                q++;
                drawClue();
              }
            }));
            row.querySelector("button").focus();
          }));
          holder.appendChild(row);
        }
        drawClue();
        return ctx.panel(t.quizTitle, [ctx.lead(t.quizText), holder]);
      },

      // paso 3: actividad, como me siento ahorita
      function (ctx) {
        var next = ctx.nextButton(ui.save, function () {
          ctx.save();
          ctx.next();
        });
        next.disabled = !ctx.answers.feeling;
        var grid = ctx.el("div", { class: "word-grid" });
        for (var i = 0; i < t.nowWords.length; i++) {
          grid.appendChild(toggle(ctx.el, t.nowWords[i], ctx.answers.feeling === t.nowWords[i], function (button) {
            var all = grid.querySelectorAll(".word-btn");
            for (var j = 0; j < all.length; j++) {
              all[j].setAttribute("aria-pressed", "false");
            }
            button.setAttribute("aria-pressed", "true");
            ctx.answers.feeling = button.textContent;
            next.disabled = false;
          }));
        }
        return ctx.panel(t.nowTitle, [
          ctx.lead(t.nowText),
          grid,
          ctx.el("div", { class: "btn-row" }, next)
        ]);
      },

      // paso 4: actividad, mis 3 valores y a donde voy
      function (ctx) {
        var picked = (ctx.answers.values || []).slice();
        var counter = ctx.el("p", { class: "counter", role: "status" });
        var next = ctx.nextButton(ui.save, function () {
          ctx.answers.values = picked;
          ctx.save();
          ctx.next();
        });
        var goals = ctx.pickOne(t.goals, ctx.answers.goal, function (value) {
          ctx.answers.goal = value;
          refresh();
        });

        function refresh() {
          counter.textContent = UI.fill(t.valuesCount, { n: picked.length });
          next.disabled = picked.length !== 3 || !ctx.answers.goal;
        }

        var grid = ctx.el("div", { class: "word-grid" });
        for (var i = 0; i < t.values.length; i++) {
          grid.appendChild(toggle(ctx.el, t.values[i], picked.indexOf(t.values[i]) !== -1, function (button) {
            var word = button.textContent;
            var at = picked.indexOf(word);
            if (at !== -1) {
              picked.splice(at, 1);
              button.setAttribute("aria-pressed", "false");
            } else if (picked.length < 3) {
              picked.push(word);
              button.setAttribute("aria-pressed", "true");
            }
            refresh();
          }));
        }
        refresh();

        return ctx.panel(t.valuesTitle, [
          ctx.lead(t.valuesText),
          grid,
          counter,
          ctx.el("p", { class: "slot-label", text: t.goalLabel }),
          goals,
          ctx.el("div", { class: "btn-row" }, next)
        ]);
      }
    ]);
  }

  // lineas para el archivo que se descarga
  function summary(answers) {
    var t = CONTENT.missions[1];
    var lines = [];
    if (answers.feeling) {
      lines.push(t.summaryNow + " " + answers.feeling);
    }
    if (answers.values && answers.values.length) {
      lines.push(t.summaryValues + " " + answers.values.join(", "));
    }
    if (answers.goal) {
      lines.push(t.summaryGoal + " " + answers.goal);
    }
    return lines;
  }

  return { render: render, summary: summary };
})();
