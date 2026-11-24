// mision 5: unlearn to learn, humildad y perdon
// pasos: la mochila, humilde o defensivo, aligerar la mochila y la nota de perdon

var LEVELS = window.LEVELS || {};
window.LEVELS = LEVELS;

LEVELS[5] = (function () {
  function render(api) {
    var t = CONTENT.missions[5];
    var ui = CONTENT.missionUi;

    Mission.start(api, [
      // paso 2: elegir la respuesta humilde
      function (ctx) {
        var holder = ctx.el("div");
        var s = 0;
        function drawSituation() {
          holder.innerHTML = "";
          var item = t.humble[s];
          var row = ctx.el("div", { class: "btn-row" });
          holder.appendChild(ctx.el("p", { class: "clue-count", text: (s + 1) + " / " + t.humble.length }));
          holder.appendChild(ctx.el("p", { class: "clue", text: item.situation }));
          holder.appendChild(ctx.quiz(item.options, function () {
            var last = s === t.humble.length - 1;
            var go = ctx.nextButton(ui.next, function () {
              if (last) {
                ctx.next();
              } else {
                s++;
                drawSituation();
              }
            });
            row.appendChild(go);
            go.focus();
          }));
          holder.appendChild(row);
        }
        drawSituation();
        return ctx.panel(t.humbleTitle, [ctx.lead(t.humbleText), holder]);
      },

      // paso 3: tirar las ideas pesadas y quedarse con las que ayudan
      function (ctx) {
        var heavy = 0;
        for (var h = 0; h < t.items.length; h++) {
          if (t.items[h].drop) {
            heavy++;
          }
        }
        var left = heavy;
        var feedback = ctx.el("p", { class: "feedback", role: "status" });
        var row = ctx.el("div", { class: "btn-row" });
        var fill = ctx.el("div", { class: "meter-fill is-hot", style: "width: 100%" });
        var track = ctx.el("div", {
          class: "meter-track",
          role: "meter",
          "aria-label": t.weightLabel,
          "aria-valuemin": "0",
          "aria-valuemax": "100",
          "aria-valuenow": "100"
        }, fill);
        var cards = ctx.el("div", { class: "pack-items" });

        function paint() {
          var weight = Math.round(25 + 75 * left / heavy);
          fill.style.width = weight + "%";
          fill.className = "meter-fill" + (weight > 70 ? " is-hot" : weight > 45 ? " is-warm" : "");
          track.setAttribute("aria-valuenow", String(weight));
        }

        for (var i = 0; i < t.items.length; i++) {
          cards.appendChild(itemButton(t.items[i]));
        }

        function itemButton(item) {
          var b = ctx.el("button", { class: "belief-card pack-item", type: "button", text: item.text });
          b.addEventListener("click", function () {
            if (b.classList.contains("is-leaving")) {
              return;
            }
            if (item.drop) {
              b.classList.add("is-leaving");
              b.disabled = true;
              left--;
              paint();
              feedback.className = "feedback is-right";
              feedback.textContent = left === 0 ? t.allDropped : t.dropped;
              ctx.later(function () { b.style.visibility = "hidden"; }, 800);
              if (left === 0) {
                var go = ctx.nextButton(ui.next);
                row.appendChild(go);
                go.focus();
              }
            } else {
              b.classList.remove("is-wrong");
              void b.offsetWidth;
              b.classList.add("is-wrong");
              feedback.className = "feedback is-wrong";
              feedback.textContent = t.keepIt;
            }
          });
          return b;
        }

        paint();
        return ctx.panel(t.packTitle, [
          ctx.lead(t.packText),
          ctx.el("div", { class: "meter" }, [
            ctx.el("div", { class: "meter-label" }, ctx.el("span", { text: t.weightLabel })),
            track
          ]),
          cards,
          ctx.el("div", { class: "backpack-scene backpack-small" }, ctx.el("div", { class: "backpack-icon", svg: UI.icon("backpack") })),
          feedback,
          row
        ]);
      },

      // paso 4: actividad, elegir a quien perdonar y soltar, la eleccion no se guarda
      function (ctx) {
        var who = "";
        var choices = ctx.pickOne(t.forgiveWho, "", function (value) {
          who = value;
          release.disabled = false;
        });
        var holder = ctx.el("div", null, [ctx.el("p", { class: "slot-label", text: t.forgiveLabel }), choices]);
        var message = ctx.el("p", { class: "feedback is-right", role: "status" });
        var row = ctx.el("div", { class: "btn-row" });
        var release = ctx.nextButton(t.release, function () {
          release.disabled = true;
          var note = ctx.el("p", { class: "release-note", text: who + ": " + t.forgiveNote });
          holder.replaceWith(note);
          ctx.later(function () { note.classList.add("is-released"); }, 1200);
          ctx.later(function () {
            note.remove();
            release.remove();
            message.textContent = t.released;
            var go = ctx.nextButton(ui.next);
            row.appendChild(go);
            go.focus();
          }, 3700);
        });
        release.disabled = true;
        row.appendChild(release);
        return ctx.panel(t.forgiveTitle, [ctx.lead(t.forgiveText), holder, message, row]);
      }
    ]);
  }

  return { render: render };
})();
