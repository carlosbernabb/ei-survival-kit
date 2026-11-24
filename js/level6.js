// mision 6: measure your success
// pasos: segundo check in, confianza en los 4 dominios y mapa de ie

var LEVELS = window.LEVELS || {};
window.LEVELS = LEVELS;

LEVELS[6] = (function () {
  // parte un nombre largo en dos lineas para la grafica
  function lines(name) {
    if (name.indexOf(" ") !== -1) {
      return name.split(" ");
    }
    if (name.length > 12 && name.indexOf("-") !== -1) {
      var at = name.indexOf("-") + 1;
      return [name.substring(0, at), name.substring(at)];
    }
    return [name];
  }

  // grafica de radar con 4 ejes, valores del 1 al 5
  function radar(domains, values) {
    var cx = 180;
    var cy = 130;
    var R = 88;
    // arriba, derecha, abajo, izquierda
    var dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    var out = "";

    for (var g = 1; g <= 5; g++) {
      var pts = [];
      for (var i = 0; i < 4; i++) {
        pts.push((cx + dirs[i][0] * R * g / 5).toFixed(1) + "," + (cy + dirs[i][1] * R * g / 5).toFixed(1));
      }
      out += '<polygon points="' + pts.join(" ") + '" fill="none" stroke="#2e333a" stroke-width="1.5"/>';
    }
    out += '<path d="M' + cx + " " + (cy - R) + " V" + (cy + R) + " M" + (cx - R) + " " + cy + " H" + (cx + R) + '" stroke="#2e333a" stroke-width="1.5"/>';

    var shape = [];
    for (var k = 0; k < 4; k++) {
      var v = values[k] / 5;
      shape.push((cx + dirs[k][0] * R * v).toFixed(1) + "," + (cy + dirs[k][1] * R * v).toFixed(1));
    }
    out += '<polygon points="' + shape.join(" ") + '" fill="rgba(240,122,30,0.35)" stroke="#f07a1e" stroke-width="3" stroke-linejoin="round"/>';
    for (var d = 0; d < shape.length; d++) {
      var xy = shape[d].split(",");
      out += '<circle cx="' + xy[0] + '" cy="' + xy[1] + '" r="4.5" fill="#f07a1e"/>';
    }

    // nombres de cada eje
    var spots = [
      { x: cx, y: cy - R - 12, anchor: "middle" },
      { x: cx + R + 10, y: cy, anchor: "start" },
      { x: cx, y: cy + R + 20, anchor: "middle" },
      { x: cx - R - 10, y: cy, anchor: "end" }
    ];
    for (var n = 0; n < 4; n++) {
      var parts = lines(domains[n].name);
      var startY = spots[n].y - (parts.length - 1) * 7;
      out += '<text text-anchor="' + spots[n].anchor + '" font-size="12" font-weight="700" fill="#d8dee6">';
      for (var p = 0; p < parts.length; p++) {
        out += '<tspan x="' + spots[n].x + '" y="' + (startY + p * 14) + '">' + parts[p] + " " + (p === parts.length - 1 ? values[n] : "") + "</tspan>";
      }
      out += "</text>";
    }

    var label = [];
    for (var a = 0; a < 4; a++) {
      label.push(domains[a].name + " " + values[a]);
    }
    return '<svg viewBox="0 0 360 260" role="img" aria-label="' + CONTENT.missions[6].mapTitle + ": " + label.join(", ") + '">' + out + "</svg>";
  }

  function weatherStat(el, mood, label) {
    var w = mood ? UI.findWeather(mood.id) : null;
    return el("div", { class: "stat" }, [
      w ? el("div", { svg: UI.weatherIcon(w.id) }) : el("strong", { text: "-" }),
      el("span", { text: label + ": " + (w ? w.label : CONTENT.exportFile.notYet) })
    ]);
  }

  function render(api) {
    var t = CONTENT.missions[6];
    var ui = CONTENT.missionUi;

    Mission.start(api, [
      // paso 1: actividad, el clima de animo otra vez
      function (ctx) {
        var current = Store.data.moodAfter;
        var error = ctx.el("p", { class: "error-text", role: "alert" });
        var picker = App.weatherPicker("mood-after", current ? current.id : "");
        picker.addEventListener("change", function () { error.textContent = ""; });
        var next = ctx.nextButton(ui.save, function () {
          var picked = picker.querySelector('input[name="mood-after"]:checked');
          if (!picked) {
            error.textContent = t.afterError;
            return;
          }
          Store.setMood("after", picked.value, "");
          ctx.next();
        });
        return ctx.panel(t.afterTitle, [ctx.activity(), ctx.lead(t.afterText), picker, error, ctx.el("div", { class: "btn-row" }, next)]);
      },

      // paso 2: actividad, confianza del 1 al 5 en cada dominio
      function (ctx) {
        var values = (ctx.answers.domains || [3, 3, 3, 3]).slice();
        var list = ctx.el("div");
        for (var i = 0; i < t.domains.length; i++) {
          list.appendChild(domainSlider(i));
        }
        function domainSlider(i) {
          var id = "domain-" + i;
          var output = ctx.el("output", { for: id, text: String(values[i]) });
          var slider = ctx.el("input", { type: "range", id: id, min: "1", max: "5", step: "1", value: String(values[i]) });
          slider.addEventListener("input", function () {
            values[i] = Number(slider.value);
            output.textContent = slider.value;
          });
          return ctx.el("div", { class: "domain" }, [
            ctx.el("label", { for: id }, [ctx.el("span", { text: t.domains[i].name }), output]),
            ctx.el("p", { text: t.domains[i].hint }),
            slider
          ]);
        }
        return ctx.panel(t.slidersTitle, [
          ctx.activity(),
          ctx.lead(t.slidersText),
          list,
          ctx.el("div", { class: "btn-row" }, ctx.nextButton(ui.save, function () {
            ctx.answers.domains = values;
            ctx.save();
            ctx.next();
          }))
        ]);
      },

      // paso 3: mi mapa de ie y el antes y despues
      function (ctx) {
        return ctx.panel(t.mapTitle, [
          ctx.el("div", { class: "dash" }, [
            ctx.el("div", { class: "visual", svg: radar(t.domains, ctx.answers.domains || [3, 3, 3, 3]) }),
            ctx.el("div", { class: "stat-row" }, [
              weatherStat(ctx.el, Store.data.moodBefore, t.before),
              weatherStat(ctx.el, Store.data.moodAfter, t.after),
              ctx.el("div", { class: "stat" }, [ctx.el("strong", { text: String(Store.toolsCount()) + "/6" }), ctx.el("span", { text: t.tools })])
            ])
          ]),
          ctx.lead(t.mapText),
          ctx.el("div", { class: "btn-row" }, ctx.nextButton(ui.next))
        ]);
      }
    ]);
  }

  function summary(answers) {
    var t = CONTENT.missions[6];
    if (!answers.domains) {
      return [];
    }
    var parts = [];
    for (var i = 0; i < t.domains.length; i++) {
      parts.push(t.domains[i].name + " " + answers.domains[i]);
    }
    return [t.summaryDomains + " " + parts.join(", ")];
  }

  return { render: render, summary: summary };
})();
