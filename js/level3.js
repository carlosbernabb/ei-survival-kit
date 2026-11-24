// mision 3: climb down the ladder, empatia
// pasos: la escalera de inferencias, bajar la escalera con sam y observar o juzgar

var LEVELS = window.LEVELS || {};
window.LEVELS = LEVELS;

LEVELS[3] = (function () {
  function render(api) {
    var t = CONTENT.missions[3];
    var ui = CONTENT.missionUi;

    Mission.start(api, [
      // paso 2: bajar la escalera tocando cada escalon
      function (ctx) {
        var list = ctx.el("ol", { class: "ladder" });
        var after = ctx.el("div");
        var rungs = [];
        var current = 0;

        for (var i = 0; i < t.climb.length; i++) {
          var item = t.climb[i];
          var button = ctx.el("button", { class: "rung", type: "button" }, [
            ctx.el("span", null, [
              ctx.el("span", { class: "rung-text", text: item.text }),
              ctx.el("span", { class: "rung-note" })
            ]),
            ctx.el("small", { text: item.rung })
          ]);
          button.addEventListener("click", makeHandler(i));
          rungs.push(button);
          list.appendChild(ctx.el("li", null, button));
        }

        function refresh() {
          for (var j = 0; j < rungs.length; j++) {
            rungs[j].disabled = j !== current;
            rungs[j].classList.toggle("is-locked", j > current);
          }
        }

        function makeHandler(i) {
          return function () {
            if (i !== current) {
              return;
            }
            var last = i === t.climb.length - 1;
            rungs[i].querySelector(".rung-note").textContent = t.climb[i].check;
            rungs[i].classList.add(last ? "is-fact" : "is-checked");
            current++;
            refresh();
            if (last) {
              showReply();
            } else {
              rungs[current].focus();
            }
          };
        }

        function showReply() {
          var row = ctx.el("div", { class: "btn-row" });
          after.appendChild(ctx.el("p", { class: "clue", text: t.bottomText }));
          after.appendChild(ctx.el("p", { class: "slot-label", text: t.replyTitle }));
          after.appendChild(ctx.quiz(t.replies, function () {
            var go = ctx.nextButton(ui.next);
            row.appendChild(go);
            go.focus();
          }));
          after.appendChild(row);
        }

        refresh();
        return ctx.panel(t.storyTitle, [
          ctx.el("p", { class: "trigger-card", text: t.story }),
          ctx.lead(t.storyText),
          list,
          after
        ]);
      },

      // paso 3: observar o juzgar
      function (ctx) {
        var feedback = ctx.el("p", { class: "feedback", role: "status" });
        var row = ctx.el("div", { class: "btn-row" });
        var left = t.sort.length;
        var items = ctx.el("div");

        for (var i = 0; i < t.sort.length; i++) {
          items.appendChild(sortItem(t.sort[i]));
        }

        function sortItem(item) {
          var box = ctx.el("div", { class: "sort-item" });
          var factBtn = ctx.el("button", { class: "btn btn-small btn-soft", type: "button", text: t.fact });
          var judgeBtn = ctx.el("button", { class: "btn btn-small btn-soft", type: "button", text: t.judge });
          function pick(saysFact) {
            if (saysFact === item.fact) {
              box.classList.add("is-right");
              factBtn.disabled = true;
              judgeBtn.disabled = true;
              (saysFact ? factBtn : judgeBtn).classList.remove("btn-soft");
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
          factBtn.addEventListener("click", function () { pick(true); });
          judgeBtn.addEventListener("click", function () { pick(false); });
          box.appendChild(ctx.el("p", { text: item.text }));
          box.appendChild(factBtn);
          box.appendChild(judgeBtn);
          return box;
        }

        return ctx.panel(t.sortTitle, [ctx.lead(t.sortText), items, feedback, row]);
      }
    ]);
  }

  return { render: render };
})();
