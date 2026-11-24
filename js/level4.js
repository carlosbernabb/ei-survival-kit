// mision 4: say it right, comunicacion asertiva
// pasos: tres estilos, elegir la respuesta asertiva, hecho emocion o juicio y palabras contra cuerpo

var LEVELS = window.LEVELS || {};
window.LEVELS = LEVELS;

LEVELS[4] = (function () {
  function render(api) {
    var t = CONTENT.missions[4];
    var ui = CONTENT.missionUi;

    Mission.start(api, [
      // paso 2: dos situaciones, elegir la respuesta asertiva
      function (ctx) {
        var holder = ctx.el("div");
        var s = 0;
        function drawSituation() {
          holder.innerHTML = "";
          var item = t.situations[s];
          var options = [];
          for (var i = 0; i < item.options.length; i++) {
            options.push({
              text: item.options[i].text,
              ok: item.options[i].ok,
              why: UI.fill(t.styleWas, { style: item.options[i].style })
            });
          }
          var row = ctx.el("div", { class: "btn-row" });
          holder.appendChild(ctx.el("p", { class: "clue-count", text: (s + 1) + " / " + t.situations.length }));
          holder.appendChild(ctx.el("p", { class: "clue", text: item.text }));
          holder.appendChild(ctx.quiz(options, function () {
            var last = s === t.situations.length - 1;
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
        return ctx.panel(t.replyTitle, [holder]);
      },

      // paso 3: separar hechos, emociones y juicios
      function (ctx) {
        var feedback = ctx.el("p", { class: "feedback", role: "status" });
        var row = ctx.el("div", { class: "btn-row" });
        var left = t.pieces.length;
        var items = ctx.el("div");

        for (var i = 0; i < t.pieces.length; i++) {
          items.appendChild(sortItem(t.pieces[i]));
        }

        function sortItem(piece) {
          var box = ctx.el("div", { class: "sort-item sort-three" }, ctx.el("p", { text: piece.text }));
          var buttons = [];
          for (var k = 0; k < t.kinds.length; k++) {
            var b = ctx.el("button", { class: "btn btn-small btn-soft", type: "button", text: t.kinds[k] });
            b.addEventListener("click", pick);
            buttons.push(b);
            box.appendChild(b);
          }
          function pick(event) {
            var chosen = event.currentTarget;
            if (chosen.textContent === piece.kind) {
              box.classList.add("is-right");
              for (var j = 0; j < buttons.length; j++) {
                buttons[j].disabled = true;
              }
              chosen.classList.remove("btn-soft");
              feedback.className = "feedback is-right";
              feedback.textContent = t.sortRight;
              left--;
              if (left === 0) {
                var go = ctx.nextButton(ui.next);
                row.appendChild(go);
                go.focus();
              }
            } else {
              feedback.className = "feedback is-wrong";
              feedback.textContent = t.sortWrong;
            }
          }
          return box;
        }

        return ctx.panel(t.sortTitle, [ctx.lead(t.sortText), items, feedback, row]);
      },

      // paso 4: lenguaje verbal y no verbal
      function (ctx) {
        var row = ctx.el("div", { class: "btn-row" });
        return ctx.panel(t.bodyTitle, [
          ctx.el("p", { class: "clue", text: t.bodyText }),
          ctx.quiz(t.bodyOptions, function () {
            var go = ctx.nextButton(ui.next);
            row.appendChild(go);
            go.focus();
          }),
          row
        ]);
      }
    ]);
  }

  return { render: render };
})();
