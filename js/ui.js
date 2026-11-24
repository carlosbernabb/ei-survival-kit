// funciones de apoyo para crear elementos, iconos y tarjetas

var UI = (function () {
  var INK = "#111316";
  var LIGHT = "#e9ecef";

  // crea un elemento con atributos e hijos
  // el texto del usuario siempre entra como texto, nunca como html
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      for (var key in attrs) {
        var value = attrs[key];
        if (value === null || value === undefined || value === false) {
          continue;
        }
        if (key === "class") {
          node.className = value;
        } else if (key === "text") {
          node.textContent = value;
        } else if (key === "svg") {
          // solo para iconos fijos de este archivo
          node.innerHTML = value;
        } else if (key.indexOf("on") === 0) {
          node.addEventListener(key.substring(2), value);
        } else if (value === true) {
          node.setAttribute(key, "");
        } else {
          node.setAttribute(key, value);
        }
      }
    }
    addChildren(node, children);
    return node;
  }

  function addChildren(node, children) {
    if (children === null || children === undefined) {
      return;
    }
    if (!Array.isArray(children)) {
      children = [children];
    }
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (child === null || child === undefined || child === false) {
        continue;
      }
      if (Array.isArray(child)) {
        addChildren(node, child);
      } else if (typeof child === "string" || typeof child === "number") {
        node.appendChild(document.createTextNode(String(child)));
      } else {
        node.appendChild(child);
      }
    }
  }

  // cambia {n} por el valor que se manda
  function fill(text, values) {
    var result = text;
    for (var key in values) {
      result = result.split("{" + key + "}").join(values[key]);
    }
    return result;
  }

  function svg(inner, viewBox) {
    return '<svg viewBox="' + (viewBox || "0 0 64 64") + '" aria-hidden="true" focusable="false">' + inner + "</svg>";
  }

  // trazo oscuro para iconos sobre color de acento
  var line = ' stroke="' + INK + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
  // trazo claro para iconos sobre fondo oscuro
  var lineLight = ' stroke="' + LIGHT + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';

  // dibujos de cada nivel
  var icons = {
    // maletin tactico plano, sin brillos
    box: svg(
      '<path d="M24 20 V14 A3 3 0 0 1 27 11 H37 A3 3 0 0 1 40 14 V20" fill="none" stroke="#aeb6bf" stroke-width="3"/>' +
      '<rect x="5" y="20" width="54" height="34" rx="5" fill="#2a2f35" stroke="#aeb6bf" stroke-width="2.5"/>' +
      '<path d="M5 31 H59" stroke="#aeb6bf" stroke-width="2.5"/>' +
      '<rect x="13" y="26" width="7" height="10" rx="1.5" fill="#f07a1e"/>' +
      '<rect x="44" y="26" width="7" height="10" rx="1.5" fill="#f07a1e"/>' +
      '<path d="M13 45 H51" stroke="#4a515a" stroke-width="2.5" stroke-linecap="round"/>'
    ),
    mirror: svg(
      '<ellipse cx="32" cy="26" rx="17" ry="21" fill="' + LIGHT + '"' + line + "/>" +
      '<path d="M27 22 V24 M37 22 V24 M27 30 Q32 35 37 30" fill="none"' + line + "/>" +
      '<path d="M32 47 V55 M22 58 H42" fill="none"' + line + "/>"
    ),
    breath: svg(
      '<circle cx="32" cy="32" r="25" fill="' + LIGHT + '"' + line + "/>" +
      '<circle cx="32" cy="32" r="15" fill="none"' + line + "/>" +
      '<path d="M23 32 Q27.5 26 32 32 T41 32" fill="none"' + line + "/>"
    ),
    ladder: svg(
      '<path d="M20 6 L15 58 M44 6 L49 58" fill="none" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M19 16 H45 M18 28 H46 M16.8 40 H47.2 M15.7 52 H48.3" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>'
    ),
    speech: svg(
      '<path d="M10 8 H38 A6 6 0 0 1 44 14 V30 A6 6 0 0 1 38 36 H22 L14 43 V36 H10 A6 6 0 0 1 4 30 V14 A6 6 0 0 1 10 8 Z" fill="' + LIGHT + '"' + line + "/>" +
      '<path d="M30 28 H54 A6 6 0 0 1 60 34 V46 A6 6 0 0 1 54 52 H52 V58 L45 52 H30 A6 6 0 0 1 24 46 V34 A6 6 0 0 1 30 28 Z" fill="' + INK + '"' + line + "/>" +
      '<circle cx="34" cy="40" r="2.5" fill="' + LIGHT + '"/><circle cx="42" cy="40" r="2.5" fill="' + LIGHT + '"/><circle cx="50" cy="40" r="2.5" fill="' + LIGHT + '"/>'
    ),
    backpack: svg(
      '<path d="M24 15 A8 8 0 0 1 40 15" fill="none"' + line + "/>" +
      '<rect x="12" y="14" width="40" height="44" rx="12" fill="' + LIGHT + '"' + line + "/>" +
      '<rect x="20" y="36" width="24" height="15" rx="5" fill="' + INK + '"' + line + "/>" +
      '<path d="M20 27 H44" fill="none"' + line + "/>"
    ),
    chart: svg(
      '<polygon points="32,5 59,32 32,59 5,32" fill="' + LIGHT + '"' + line + "/>" +
      '<path d="M32 5 V59 M5 32 H59" fill="none" stroke="' + INK + '" stroke-width="1.5"/>' +
      '<polygon points="32,15 49,32 32,46 16,32" fill="' + INK + '" fill-opacity="0.85" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>'
    ),
    check: svg(
      '<circle cx="32" cy="32" r="26" fill="#8aa65a"' + line + "/>" +
      '<path d="M20 33 L28 41 L45 23" fill="none" stroke="' + INK + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'
    ),
    lock: svg(
      '<path d="M22 28 V20 A10 10 0 0 1 42 20 V28" fill="none"' + lineLight + "/>" +
      '<rect x="14" y="28" width="36" height="28" rx="7" fill="#2a2f35"' + lineLight + "/>" +
      '<circle cx="32" cy="41" r="3.5" fill="' + LIGHT + '"/>'
    )
  };

  // dibujos del clima de animo, con trazo claro porque van sobre fondo oscuro
  var cloudPath = "M18 46 H46 A10 10 0 0 0 46 26 A14 14 0 0 0 20 24 A11 11 0 0 0 18 46 Z";
  var sunRays = "";
  var angles = [0, 45, 90, 135, 180, 225, 270, 315];
  for (var i = 0; i < angles.length; i++) {
    sunRays += '<path d="M32 8 V14" transform="rotate(' + angles[i] + ' 32 32)" fill="none" stroke="#d9a640" stroke-width="3" stroke-linecap="round"/>';
  }

  var weatherIcons = {
    sunny: svg(sunRays + '<circle cx="32" cy="32" r="12" fill="#d9a640" stroke="#f07a1e" stroke-width="3"/>'),
    partly: svg(
      '<g transform="translate(-6 -8) scale(0.85)">' + sunRays + '<circle cx="32" cy="32" r="12" fill="#d9a640" stroke="#f07a1e" stroke-width="3"/></g>' +
      '<path d="' + cloudPath + '" transform="translate(4 6)" fill="#3a4048"' + lineLight + "/>"
    ),
    cloudy: svg(
      '<path d="' + cloudPath + '" transform="translate(-8 -6) scale(0.8)" fill="#2a2f35"' + lineLight + "/>" +
      '<path d="' + cloudPath + '" transform="translate(2 4)" fill="#3a4048"' + lineLight + "/>"
    ),
    rainy: svg(
      '<path d="' + cloudPath + '" transform="translate(0 -8)" fill="#2f4f66"' + lineLight + "/>" +
      '<path d="M22 46 L19 54 M32 46 L29 54 M42 46 L39 54" fill="none" stroke="#6f9fc4" stroke-width="3.5" stroke-linecap="round"/>'
    ),
    stormy: svg(
      '<path d="' + cloudPath + '" transform="translate(0 -10)" fill="#3a3236"' + lineLight + "/>" +
      '<path d="M33 36 L25 49 H32 L28 60 L41 44 H34 L38 36 Z" fill="#d9a640" stroke="#f07a1e" stroke-width="2" stroke-linejoin="round"/>'
    )
  };

  function icon(name) {
    return icons[name] || "";
  }

  function weatherIcon(id) {
    return weatherIcons[id] || "";
  }

  function findWeather(id) {
    for (var i = 0; i < CONTENT.weather.length; i++) {
      if (CONTENT.weather[i].id === id) {
        return CONTENT.weather[i];
      }
    }
    return null;
  }

  function findLevel(id) {
    for (var i = 0; i < CONTENT.levels.length; i++) {
      if (CONTENT.levels[i].id === Number(id)) {
        return CONTENT.levels[i];
      }
    }
    return null;
  }

  // etiqueta de la rubrica para las aplicaciones de ie
  function badge(type, extra) {
    var text = CONTENT.badges[type];
    if (extra) {
      text = text + ": " + extra;
    }
    return el("span", { class: "badge badge-" + type, text: text });
  }

  function levelBadges(level) {
    return el("div", { class: "badge-list" }, [
      level.application ? badge("application", level.topic) : null,
      level.activity ? badge("activity", level.activity) : null
    ]);
  }

  // tarjeta de herramienta, bloqueada o desbloqueada
  function toolCard(level, unlocked, isNew) {
    var classes = "tool-card c-" + level.color;
    if (!unlocked) {
      classes += " is-locked";
    }
    if (isNew) {
      classes += " is-new";
    }

    var name = unlocked ? level.tool.name : CONTENT.kit.lockedName;
    var text = unlocked ? level.tool.takeaway : CONTENT.kit.lockedText;

    return el("article", { class: classes }, [
      el("div", { class: "tool-card-top" }, [
        el("div", { class: "tool-card-icon", svg: unlocked ? icon(level.icon) : icon("lock") }),
        el("span", { class: "tool-card-unit", text: level.unit })
      ]),
      el("div", { class: "tool-card-body" }, [
        el("h3", { class: "tool-card-name", text: name }),
        el("p", { class: "tool-card-takeaway", text: text }),
        el("p", { class: "tool-card-foot", text: CONTENT.hub.levelWord + " " + level.id + ": " + level.title })
      ])
    ]);
  }

  return {
    el: el,
    fill: fill,
    icon: icon,
    weatherIcon: weatherIcon,
    findWeather: findWeather,
    findLevel: findLevel,
    badge: badge,
    levelBadges: levelBadges,
    toolCard: toolCard
  };
})();
