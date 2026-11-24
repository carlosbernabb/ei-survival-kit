// escena 3d del maletin de supervivencia hecha con three.js
// modo hero: maletin cerrado girando en la bienvenida
// modo hub: maletin abierto con 6 modulos que se pueden elegir
// modo cinema: tomas de camara para la intro

var Scene3D = (function () {
  var ACCENTS = {
    orange: "#f07a1e",
    cyan: "#6f9fc4",
    yellow: "#d9a640",
    green: "#8aa65a",
    red: "#d0503f",
    steel: "#aeb6bf"
  };
  var HEAVY = "Impact, Haettenschweiler, 'Arial Black', sans-serif";
  var PLAIN = "'Segoe UI', Arial, sans-serif";

  // revisa si el navegador puede dibujar 3d
  function supported() {
    if (typeof THREE === "undefined" || typeof THREE.RoundedBoxGeometry === "undefined") {
      return false;
    }
    try {
      var test = document.createElement("canvas");
      return !!(test.getContext("webgl2") || test.getContext("webgl"));
    } catch (e) {
      return false;
    }
  }

  function reducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  // parte un texto en lineas que quepan en el ancho
  function wrapText(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var current = "";
    for (var i = 0; i < words.length; i++) {
      var test = current ? current + " " + words[i] : words[i];
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = words[i];
      } else {
        current = test;
      }
    }
    if (current) {
      lines.push(current);
    }
    return lines;
  }

  function makeTexture(canvas, renderer) {
    var tex = new THREE.CanvasTexture(canvas);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return tex;
  }

  // etiqueta de arriba de cada modulo
  function moduleLabel(level, done, renderer) {
    var canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    var ctx = canvas.getContext("2d");
    var accent = ACCENTS[level.color] || ACCENTS.orange;

    ctx.fillStyle = "#1a1d21";
    ctx.fillRect(0, 0, 512, 512);

    // lineas finas como metal cepillado
    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    ctx.lineWidth = 2;
    for (var y = 0; y < 512; y += 8) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    // franja de color con el numero de mision
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, 512, 92);
    ctx.fillStyle = "#111316";
    ctx.font = "56px " + HEAVY;
    ctx.textBaseline = "middle";
    var number = String(level.id).padStart(2, "0");
    ctx.fillText((CONTENT.hub.levelWord + " " + number).toUpperCase(), 30, 48);

    // titulo de la mision
    ctx.fillStyle = "#e9ecef";
    ctx.font = "64px " + HEAVY;
    ctx.textBaseline = "top";
    var lines = wrapText(ctx, level.title.toUpperCase(), 452);
    for (var i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], 30, 126 + i * 70);
    }

    // tema de la unidad
    ctx.fillStyle = "#a9b1bb";
    ctx.font = "bold 34px " + PLAIN;
    ctx.fillText(level.topic, 30, 140 + lines.length * 70);

    // estado abajo
    ctx.fillStyle = done ? accent : "#30353c";
    ctx.fillRect(0, 432, 512, 80);
    ctx.fillStyle = done ? "#111316" : "#e9ecef";
    ctx.font = "44px " + HEAVY;
    ctx.textBaseline = "middle";
    ctx.fillText((done ? CONTENT.hub.statusDone : CONTENT.hub.statusReady).toUpperCase(), 30, 473);

    ctx.strokeStyle = accent;
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, 502, 502);

    return makeTexture(canvas, renderer);
  }

  // franjas de precaucion
  function hazard(ctx, x, y, w, h) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.fillStyle = "#111316";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#f07a1e";
    for (var s = x - h; s < x + w + h; s += 48) {
      ctx.beginPath();
      ctx.moveTo(s, y + h);
      ctx.lineTo(s + 24, y + h);
      ctx.lineTo(s + 24 + h, y);
      ctx.lineTo(s + h, y);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  // etiqueta de la tapa
  function lidLabel(renderer) {
    var canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 700;
    var ctx = canvas.getContext("2d");
    var t = CONTENT.scene;

    ctx.fillStyle = "#16191c";
    ctx.fillRect(0, 0, 1024, 700);

    // puntitos como espuma de proteccion
    ctx.fillStyle = "rgba(255, 255, 255, 0.035)";
    for (var y = 20; y < 700; y += 34) {
      for (var x = 20; x < 1024; x += 34) {
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    hazard(ctx, 0, 0, 1024, 56);
    hazard(ctx, 0, 644, 1024, 56);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#f07a1e";
    ctx.font = "150px " + HEAVY;
    ctx.fillText(t.lidTitle.toUpperCase(), 512, 290);

    ctx.fillStyle = "#c3cad2";
    ctx.font = "bold 44px " + PLAIN;
    ctx.fillText(t.lidSub.toUpperCase(), 512, 410);

    ctx.fillStyle = "#7d8691";
    ctx.font = "bold 34px " + PLAIN;
    ctx.fillText(t.lidSmall.toUpperCase(), 512, 480);

    return makeTexture(canvas, renderer);
  }

  // placa del frente
  function plateLabel(renderer) {
    var canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#2a2f35";
    ctx.fillRect(0, 0, 512, 128);
    ctx.strokeStyle = "#5a626c";
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, 506, 122);
    ctx.fillStyle = "#f07a1e";
    ctx.font = "76px " + HEAVY;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(CONTENT.scene.plate.toUpperCase(), 256, 68);
    return makeTexture(canvas, renderer);
  }

  // arma el maletin completo
  function buildCase(renderer, levels, doneMap) {
    var W = 6.2;
    var H = 1.5;
    var D = 4.3;

    var group = new THREE.Group();
    var pickables = [];
    var modules = [];

    var metal = new THREE.MeshStandardMaterial({ color: 0x1b1e22, metalness: 0.6, roughness: 0.5 });
    var trim = new THREE.MeshStandardMaterial({ color: 0x3b4149, metalness: 0.75, roughness: 0.35 });
    var orange = new THREE.MeshStandardMaterial({ color: 0xf07a1e, metalness: 0.3, roughness: 0.5 });
    var foam = new THREE.MeshStandardMaterial({ color: 0x141619, roughness: 1, metalness: 0 });
    var pocket = new THREE.MeshStandardMaterial({ color: 0x0a0b0d, roughness: 1, metalness: 0 });

    function add(mesh, x, y, z) {
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      return mesh;
    }

    // cuerpo
    add(new THREE.Mesh(new THREE.RoundedBoxGeometry(W, H, D, 4, 0.18), metal), 0, H / 2, 0);

    // espuma de adentro y orilla de metal
    add(new THREE.Mesh(new THREE.BoxGeometry(W - 0.4, 0.06, D - 0.4), foam), 0, H + 0.02, 0);
    add(new THREE.Mesh(new THREE.BoxGeometry(W - 0.1, 0.16, 0.2), trim), 0, H + 0.06, D / 2 - 0.12);
    add(new THREE.Mesh(new THREE.BoxGeometry(W - 0.1, 0.16, 0.2), trim), 0, H + 0.06, -D / 2 + 0.12);
    add(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.16, D - 0.1), trim), W / 2 - 0.12, H + 0.06, 0);
    add(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.16, D - 0.1), trim), -W / 2 + 0.12, H + 0.06, 0);

    // costillas, broches, asa y placa del frente
    add(new THREE.Mesh(new THREE.BoxGeometry(W - 1.4, 0.08, 0.08), trim), 0, 0.3, D / 2);
    add(new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.5, 0.14), orange), -2.15, H - 0.3, D / 2 + 0.04);
    add(new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.5, 0.14), orange), 2.15, H - 0.3, D / 2 + 0.04);

    var handle = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.075, 12, 32, Math.PI), trim);
    handle.rotation.x = Math.PI / 2;
    add(handle, 0, 0.62, D / 2 + 0.02);

    var plate = new THREE.Mesh(
      new THREE.PlaneGeometry(1.7, 0.42),
      new THREE.MeshStandardMaterial({ map: plateLabel(renderer), roughness: 0.6, metalness: 0.2 })
    );
    plate.position.set(0, H - 0.32, D / 2 + 0.005);
    group.add(plate);

    // tapa con bisagra atras
    var hinge = new THREE.Group();
    hinge.position.set(0, H, -D / 2);
    group.add(hinge);

    var lid = new THREE.Mesh(new THREE.RoundedBoxGeometry(W, 0.55, D, 4, 0.18), metal);
    lid.position.set(0, 0.275, D / 2);
    lid.castShadow = true;
    lid.receiveShadow = true;
    hinge.add(lid);

    var lidTex = lidLabel(renderer);
    var lidMat = new THREE.MeshStandardMaterial({ map: lidTex, roughness: 0.9, metalness: 0 });

    // etiqueta por dentro de la tapa, se ve cuando esta abierta
    var inside = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.6, D - 0.6), lidMat);
    inside.rotation.x = Math.PI / 2;
    inside.position.set(0, -0.003, D / 2);
    hinge.add(inside);

    // etiqueta por fuera de la tapa, se ve cuando esta cerrada
    var outside = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.8, D - 0.8), lidMat);
    outside.rotation.x = -Math.PI / 2;
    outside.position.set(0, 0.553, D / 2);
    hinge.add(outside);

    var keeperA = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.22, 0.14), trim);
    keeperA.position.set(-2.15, 0.14, D + 0.04);
    hinge.add(keeperA);
    var keeperB = keeperA.clone();
    keeperB.position.x = 2.15;
    hinge.add(keeperB);

    // modulos de las misiones
    if (levels) {
      var xs = [-1.95, 0, 1.95];
      var zs = [-0.98, 1.0];
      var bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e2226, metalness: 0.5, roughness: 0.45 });

      for (var i = 0; i < levels.length; i++) {
        var level = levels[i];
        var done = doneMap[level.id] === true;
        var accent = new THREE.Color(ACCENTS[level.color] || ACCENTS.orange);
        var x = xs[i % 3];
        var z = zs[Math.floor(i / 3)];

        // hueco en la espuma
        var hole = new THREE.Mesh(new THREE.PlaneGeometry(1.78, 1.78), pocket);
        hole.rotation.x = -Math.PI / 2;
        hole.position.set(x, H + 0.052, z);
        group.add(hole);

        var mod = new THREE.Group();
        mod.position.set(x, H + 0.22, z);
        group.add(mod);

        var box = new THREE.Mesh(new THREE.RoundedBoxGeometry(1.6, 0.32, 1.6, 3, 0.06), bodyMat);
        box.castShadow = true;
        box.receiveShadow = true;
        box.userData.levelId = level.id;
        mod.add(box);

        var labelMat = new THREE.MeshStandardMaterial({
          map: moduleLabel(level, done, renderer),
          roughness: 0.7,
          metalness: 0.1,
          emissive: 0xffffff,
          emissiveIntensity: 0.06
        });
        labelMat.emissiveMap = labelMat.map;
        var label = new THREE.Mesh(new THREE.PlaneGeometry(1.48, 1.48), labelMat);
        label.rotation.x = -Math.PI / 2;
        label.position.y = 0.162;
        label.userData.levelId = level.id;
        mod.add(label);

        // foquito de estado en la esquina
        var led = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.06, 0.05, 16),
          new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: done ? 0.9 : 0.12 })
        );
        led.position.set(0.66, 0.17, -0.66);
        mod.add(led);

        pickables.push(box, label);
        modules.push({ id: level.id, level: level, group: mod, label: labelMat, led: led.material, baseY: mod.position.y, lift: 0 });
      }
    }

    return { group: group, hinge: hinge, pickables: pickables, modules: modules };
  }

  // monta la escena dentro de un contenedor y regresa una funcion para limpiarla
  function mount(container, options) {
    var mode = options.mode;
    var calm = reducedMotion();

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x0c0d0f, 1);
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.insertBefore(renderer.domElement, container.firstChild);

    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0c0d0f, 14, 32);
    var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);

    // luces: ambiente, luz principal con sombra, contraluz naranja y relleno frio
    scene.add(new THREE.HemisphereLight(0xdfe7f0, 0x0c0d0f, 0.45));
    var key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(5, 10, 7);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -7;
    key.shadow.camera.right = 7;
    key.shadow.camera.top = 7;
    key.shadow.camera.bottom = -7;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 30;
    key.shadow.bias = -0.0005;
    key.shadow.normalBias = 0.02;
    scene.add(key);
    var rim = new THREE.PointLight(0xf07a1e, 0.9, 18);
    rim.position.set(-6, 3.5, -4);
    scene.add(rim);
    var fillLight = new THREE.PointLight(0x9fb4c8, 0.5, 18);
    fillLight.position.set(6, 3, -3);
    scene.add(fillLight);

    // piso con cuadricula
    var floor = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80),
      new THREE.MeshStandardMaterial({ color: 0x111316, roughness: 0.95 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    var grid = new THREE.GridHelper(80, 80, 0x2e333a, 0x1b1e22);
    grid.position.y = 0.003;
    scene.add(grid);

    var kit = buildCase(renderer, mode === "hero" ? null : options.levels, options.doneMap || {});
    scene.add(kit.group);

    // animacion cuando se acaba de ganar una herramienta
    var unlockMod = null;
    var unlockStart = 0;
    var unlockLight = null;
    var unlockFocus = new THREE.Vector3();
    var unlockLook = new THREE.Vector3();
    var unlockClose = new THREE.Vector3();
    if (options.unlockId) {
      for (var u = 0; u < kit.modules.length; u++) {
        if (kit.modules[u].id === options.unlockId) {
          unlockMod = kit.modules[u];
        }
      }
    }
    if (unlockMod) {
      unlockStart = performance.now();
      unlockLight = new THREE.PointLight(new THREE.Color(ACCENTS[unlockMod.level.color] || ACCENTS.orange), 0, 7);
      unlockLight.position.set(unlockMod.group.position.x, unlockMod.baseY + 2.4, unlockMod.group.position.z);
      kit.group.add(unlockLight);
    }
    var normalPos = new THREE.Vector3();

    // camara segun el modo
    var target = mode === "hub" ? new THREE.Vector3(0, 2.25, -0.4) : new THREE.Vector3(0, 0.9, 0);
    var baseOffset = mode === "hub" ? new THREE.Vector3(0, 4.6, 9.9) : new THREE.Vector3(0, 3.4, 9.2);

    function resize() {
      var w = container.clientWidth;
      var h = container.clientHeight;
      if (w === 0 || h === 0) {
        return;
      }
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // en pantallas angostas la camara se aleja para que quepa todo
      var factor = camera.aspect < 1.35 ? Math.min(1.35 / camera.aspect, 2.3) : 1;
      camera.position.copy(target).add(baseOffset.clone().multiplyScalar(factor));
      camera.lookAt(target);
      camera.updateProjectionMatrix();
      normalPos.copy(camera.position);
    }

    // animacion de la tapa
    var lidOpen = -1.95;
    var lidStart = performance.now();
    var lidTime = calm ? 0 : 1400;
    // si se acaba de desbloquear algo o viene de la intro la tapa ya esta abierta
    if (unlockMod || options.lidOpenNow) {
      lidTime = 1;
    }
    if (mode !== "hub") {
      kit.hinge.rotation.x = 0;
    } else if (calm) {
      kit.hinge.rotation.x = lidOpen;
    }

    // arrastrar para girar y click para elegir
    var yaw = mode === "hero" ? (typeof options.startYaw === "number" ? options.startYaw : 0.5) : 0;
    var targetYaw = yaw;
    var dragging = false;
    var moved = 0;
    var startX = 0;
    var startYaw = 0;
    var hovered = null;
    var pointer = new THREE.Vector2();
    var raycaster = new THREE.Raycaster();
    var canvas = renderer.domElement;

    function pickAt(clientX, clientY) {
      if (mode !== "hub") {
        return null;
      }
      var rect = canvas.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      var hits = raycaster.intersectObjects(kit.pickables, false);
      if (hits.length > 0) {
        var id = hits[0].object.userData.levelId;
        for (var i = 0; i < kit.modules.length; i++) {
          if (kit.modules[i].id === id) {
            return kit.modules[i];
          }
        }
      }
      return null;
    }

    function setHover(mod) {
      hovered = mod;
      container.classList.toggle("is-hover", mod !== null);
      if (!options.tip) {
        return;
      }
      if (mod) {
        options.tip.textContent = CONTENT.hub.levelWord + " " + mod.id + ": " + mod.level.title;
        options.tip.className = "stage-tip is-on c-" + mod.level.color;
      } else {
        options.tip.className = "stage-tip";
      }
    }

    function onDown(event) {
      // en la cinematica no se puede mover la camara
      if (mode === "cinema") {
        return;
      }
      dragging = true;
      moved = 0;
      startX = event.clientX;
      startYaw = targetYaw;
      container.classList.add("is-dragging");
      if (canvas.setPointerCapture) {
        canvas.setPointerCapture(event.pointerId);
      }
    }

    function onMove(event) {
      if (dragging) {
        var dx = event.clientX - startX;
        moved = Math.max(moved, Math.abs(dx));
        var limit = mode === "hub" ? 0.9 : 10;
        targetYaw = Math.max(-limit, Math.min(limit, startYaw + dx * 0.008));
      } else if (event.pointerType === "mouse") {
        setHover(pickAt(event.clientX, event.clientY));
      }
    }

    function onUp(event) {
      container.classList.remove("is-dragging");
      if (!dragging) {
        return;
      }
      dragging = false;
      if (moved < 6) {
        var mod = pickAt(event.clientX, event.clientY);
        if (mod && options.onPick) {
          options.onPick(mod.id);
        }
      }
    }

    function onLeave() {
      if (!dragging) {
        setHover(null);
      }
    }

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onLeave);

    var observer = null;
    if (window.ResizeObserver) {
      observer = new ResizeObserver(resize);
      observer.observe(container);
    } else {
      window.addEventListener("resize", resize);
    }
    resize();

    var frame = 0;
    var clock = new THREE.Clock();
    var tipPos = new THREE.Vector3();

    function easeOut(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    // ciclo de dibujo
    function tick() {
      frame = requestAnimationFrame(tick);
      var t = clock.getElapsedTime();

      if (mode === "hub" && !calm) {
        var p = Math.min((performance.now() - lidStart) / lidTime, 1);
        kit.hinge.rotation.x = lidOpen * easeOut(p);
      }

      // giro suave, en hero da vueltas solo
      if (mode === "hero" && !dragging && !calm) {
        targetYaw += 0.004;
      }
      var sway = !calm && !dragging && mode === "hub" ? Math.sin(t * 0.4) * 0.06 : 0;
      yaw += (targetYaw + sway - yaw) * 0.12;
      kit.group.rotation.y = yaw;

      // en la cinematica la intro decide la toma y la tapa
      if (options.cameraAt) {
        var shot = options.cameraAt();
        camera.position.set(shot.pos[0], shot.pos[1], shot.pos[2]);
        camera.lookAt(shot.target[0], shot.target[1], shot.target[2]);
      }
      if (options.lidAt) {
        kit.hinge.rotation.x = options.lidAt();
      }

      // el modulo elegido se levanta
      for (var i = 0; i < kit.modules.length; i++) {
        var m = kit.modules[i];
        var goal = hovered === m ? 0.28 : 0;
        m.lift += (goal - m.lift) * 0.2;
        m.group.position.y = m.baseY + m.lift;
        m.label.emissiveIntensity = 0.06 + m.lift * 0.5;
      }

      // el modulo nuevo baja a su lugar brillando y la camara se aleja
      if (unlockMod) {
        var ut = (performance.now() - unlockStart) / 1000;
        var drop = calm ? 0 : Math.max(0, 1 - ut / 1.4);
        unlockMod.group.position.y = unlockMod.baseY + 1.1 * drop * drop;
        unlockMod.label.emissiveIntensity = 0.06 + (calm ? 0.3 : 0.3 + 0.25 * Math.sin(ut * 6));
        unlockMod.led.emissiveIntensity = 1.4 + Math.sin(ut * 10) * 0.6;
        unlockLight.intensity = 2.2 * Math.max(0, 1 - ut / 4);

        if (!calm && ut < 3.6) {
          unlockFocus.set(unlockMod.group.position.x, unlockMod.baseY, unlockMod.group.position.z);
          kit.group.localToWorld(unlockFocus);
          unlockClose.set(unlockFocus.x, unlockFocus.y + 3.2, unlockFocus.z + 3.6);
          var k = Math.max(0, Math.min(1, (ut - 1.3) / 2.3));
          k = k * k * (3 - 2 * k);
          camera.position.lerpVectors(unlockClose, normalPos, k);
          unlockLook.lerpVectors(unlockFocus, target, k);
          camera.lookAt(unlockLook);
        }

        if (ut > 4) {
          camera.position.copy(normalPos);
          camera.lookAt(target);
          unlockMod.led.emissiveIntensity = 0.9;
          unlockLight.intensity = 0;
          unlockMod = null;
        }
      }

      // la etiqueta flotante sigue al modulo
      if (hovered && options.tip) {
        hovered.group.getWorldPosition(tipPos);
        tipPos.project(camera);
        options.tip.style.left = ((tipPos.x + 1) / 2) * container.clientWidth + "px";
        options.tip.style.top = ((1 - tipPos.y) / 2) * container.clientHeight + "px";
      }

      renderer.render(scene, camera);
    }
    tick();

    // limpia todo al salir de la pantalla
    return function cleanup() {
      cancelAnimationFrame(frame);
      if (observer) {
        observer.disconnect();
      } else {
        window.removeEventListener("resize", resize);
      }
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      scene.traverse(function (obj) {
        if (obj.geometry) {
          obj.geometry.dispose();
        }
        if (obj.material) {
          if (obj.material.map) {
            obj.material.map.dispose();
          }
          obj.material.dispose();
        }
      });
      renderer.dispose();
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }

  return {
    supported: supported,
    mount: mount
  };
})();
