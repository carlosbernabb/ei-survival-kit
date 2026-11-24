// revelacion de carta a pantalla completa cuando se gana una herramienta
// la carta cae boca abajo, tiembla, se toca para voltearla y sale con destello y chispas

var Reveal = (function () {
  var el = UI.el;

  function show(level, nextHref, onBack) {
    var h = CONTENT.hub;
    var ui = CONTENT.missionUi;
    var opened = false;
    var closed = false;
    var timers = [];

    function later(fn, ms) {
      timers.push(setTimeout(fn, ms));
    }

    // chispas que salen en circulo
    var sparks = el("div", { class: "reveal-sparks", "aria-hidden": "true" });
    for (var i = 0; i < 18; i++) {
      var spark = el("span");
      spark.style.setProperty("--a", (i * 20) + "deg");
      spark.style.setProperty("--d", (120 + (i % 3) * 40) + "px");
      sparks.appendChild(spark);
    }

    var back = el("div", { class: "reveal-face reveal-back" }, [
      el("div", { class: "reveal-back-icon", svg: UI.icon("box") }),
      el("span", { class: "reveal-back-mark", text: "?" }),
      el("span", { class: "reveal-back-label", text: CONTENT.hub.levelWord + " " + level.id })
    ]);
    var front = el("div", { class: "reveal-face reveal-front" }, UI.toolCard(level, true));
    var card = el("button", { class: "reveal-card", type: "button", "aria-label": h.tapToUnlock }, el("div", { class: "reveal-inner" }, [back, front]));

    var actions = [];
    if (nextHref) {
      actions.push(el("a", { class: "btn", href: nextHref, text: ui.nextMission, onclick: function () { close(false); } }));
    }
    actions.push(el("a", { class: "btn btn-soft", href: "#kit", text: ui.toKit, onclick: function () { close(false); } }));
    actions.push(el("button", { class: "btn btn-soft", type: "button", text: h.backToBox, onclick: function () { close(true); } }));

    var overlay = el("div", { class: "reveal c-" + level.color, role: "dialog", "aria-modal": "true", "aria-label": h.unlocked }, [
      el("div", { class: "reveal-rays", "aria-hidden": "true" }),
      el("div", { class: "reveal-flash", "aria-hidden": "true" }),
      el("div", { class: "reveal-center" }, [
        el("p", { class: "reveal-new", role: "status", text: h.newTool }),
        el("div", { class: "reveal-holder" }, [sparks, card]),
        el("p", { class: "reveal-hint", text: h.tapToUnlock }),
        el("div", { class: "btn-row reveal-actions" }, actions)
      ])
    ]);

    // voltear la carta
    function open() {
      if (opened) {
        return;
      }
      opened = true;
      overlay.classList.remove("is-ready");
      overlay.classList.add("is-open");
      card.setAttribute("aria-label", level.tool.name + ". " + level.tool.takeaway);
      later(function () {
        overlay.classList.add("is-done");
        var first = overlay.querySelector(".reveal-actions .btn");
        if (first) {
          first.focus();
        }
      }, 1000);
    }

    // cerrar, si vuelve al maletin se avisa para empezar la animacion del modulo
    function close(toBox) {
      if (closed) {
        return;
      }
      closed = true;
      for (var t = 0; t < timers.length; t++) {
        clearTimeout(timers[t]);
      }
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("intro-open");
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
      if (toBox && onBack) {
        onBack();
      }
    }

    function onKey(event) {
      if (event.key === "Escape") {
        if (opened) {
          close(true);
        } else {
          open();
        }
      }
    }

    card.addEventListener("click", open);
    document.addEventListener("keydown", onKey);
    document.body.appendChild(overlay);
    document.body.classList.add("intro-open");

    // la carta entra, luego tiembla esperando el toque, si no se toca se abre sola
    later(function () { overlay.classList.add("is-in"); }, 30);
    later(function () {
      if (!opened) {
        overlay.classList.add("is-ready");
        card.focus();
      }
    }, 900);
    later(open, 5000);
  }

  return { show: show };
})();
