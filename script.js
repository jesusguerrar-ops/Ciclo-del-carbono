/* =========================================================
   EL CICLO DEL CARBONO - Juego educativo
   ========================================================= */

let totalScore = 0;

function addTotalScore(points) {
  totalScore += points;
  if (totalScore < 0) totalScore = 0;
  document.getElementById('total-score').textContent = totalScore;
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/* =========================================================
   MASCOTA "CARBO" Y EFECTOS VISUALES
   ========================================================= */
const MOODS = ['mood-happy', 'mood-sad', 'mood-neutral', 'mood-worried', 'mood-excited', 'mood-scared'];

function setMood(id, mood) {
  const el = document.getElementById(id);
  if (!el) return;
  MOODS.forEach(m => el.classList.remove(m));
  el.classList.add('mood-' + mood);
}

function popMascot(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('pop');
  void el.offsetWidth;
  el.classList.add('pop');
}

function shakeMascot(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
}

function setBubble(id, text) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = '';
}

function shakeBody(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
}

const CONFETTI_COLORS = ['#43a047', '#1976d2', '#fb8c00', '#e53935', '#8e24aa', '#fdd835', '#00acc1'];

function burstConfetti(count = 40) {
  const layer = document.getElementById('confetti-layer');
  if (!layer) return;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const size = 6 + Math.random() * 8;
    piece.style.width = size + 'px';
    piece.style.height = (size * 0.5 + Math.random() * 6) + 'px';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const duration = 1.6 + Math.random() * 1.4;
    piece.style.animationDuration = duration + 's';
    piece.style.animationDelay = (Math.random() * 0.3) + 's';
    layer.appendChild(piece);
    setTimeout(() => piece.remove(), (duration + 0.5) * 1000);
  }
}

/* Navegación general */
document.querySelectorAll('.game-card').forEach(card => {
  card.addEventListener('click', () => {
    const n = card.dataset.game;
    showScreen('screen-game' + n);
    startGame(n);
  });
});
document.querySelectorAll('.btn-back').forEach(btn => {
  btn.addEventListener('click', () => showScreen('screen-menu'));
});

function startGame(n) {
  if (n === '1') initGame1();
  if (n === '2') initGame2();
  if (n === '3') initGame3();
  if (n === '4') initGame4();
  if (n === '5') initGame5();
}

/* =========================================================
   JUEGO 1: Elige el destino del carbono
   ========================================================= */
const g1Situations = [
  { text: "🌫️ El CO₂ acaba de ser liberado por una fábrica.", correct: "atmosfera",
    explain: "El CO₂ liberado por la quema de combustibles va primero a la atmósfera." },
  { text: "☀️ Una hoja está absorbiendo CO₂ del aire para hacer fotosíntesis.", correct: "planta",
    explain: "Las plantas capturan el CO₂ atmosférico y lo transforman en materia orgánica." },
  { text: "🌊 El agua del mar está disolviendo el CO₂ de la atmósfera.", correct: "oceano",
    explain: "Los océanos son uno de los reservorios más grandes de carbono del planeta." },
  { text: "💀 Restos de organismos marinos se acumulan en el fondo del mar durante millones de años.", correct: "rocas",
    explain: "Con el tiempo y la presión, esos restos forman rocas sedimentarias como la caliza." },
  { text: "🚗 Un auto quema gasolina y expulsa gases por el escape.", correct: "atmosfera",
    explain: "La combustión de combustibles fósiles libera carbono directamente a la atmósfera." },
  { text: "🌳 Un árbol crece y va almacenando carbono en su tronco y raíces.", correct: "planta",
    explain: "El carbono queda fijado en la biomasa vegetal mientras la planta vive." },
  { text: "🐚 Un caracol marino usa carbonato de calcio para formar su concha.", correct: "rocas",
    explain: "El carbonato de calcio es una forma de carbono que termina en estructuras geológicas." },
  { text: "🌋 Un volcán entra en erupción y libera gases.", correct: "atmosfera",
    explain: "Las erupciones volcánicas liberan CO₂ almacenado en el interior de la Tierra hacia el aire." },
];

let g1 = { round: 0, score: 0, order: [] };

function initGame1() {
  g1.round = 0;
  g1.score = 0;
  g1.order = shuffle([...Array(g1Situations.length).keys()]).slice(0, 8);
  document.getElementById('g1-score').textContent = 0;
  document.getElementById('g1-next').style.display = 'none';
  setMood('mascot-g1', 'neutral');
  setBubble('bubble-g1', 'Observa bien la situación y elige el reservorio correcto 🧐');
  loadG1Round();
}

function loadG1Round() {
  const co2 = document.getElementById('g1-co2');
  co2.className = 'co2-molecule';
  document.getElementById('g1-feedback').textContent = '';
  document.getElementById('g1-feedback').className = 'feedback';
  document.getElementById('g1-next').style.display = 'none';
  document.getElementById('g1-round').textContent = g1.round + 1;

  const situ = g1Situations[g1.order[g1.round]];
  document.getElementById('g1-situation').textContent = situ.text;

  document.querySelectorAll('.dest-btn').forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('correct', 'wrong');
    btn.onclick = () => answerG1(btn, situ);
  });
}

function answerG1(btn, situ) {
  document.querySelectorAll('.dest-btn').forEach(b => b.disabled = true);
  const co2 = document.getElementById('g1-co2');
  const chosen = btn.dataset.dest;
  const isCorrect = chosen === situ.correct;

  co2.classList.add('fly-' + chosen);

  const fb = document.getElementById('g1-feedback');
  if (isCorrect) {
    btn.classList.add('correct');
    fb.textContent = '✅ ¡Correcto! ' + situ.explain;
    fb.className = 'feedback correct';
    g1.score += 10;
    addTotalScore(10);
    setMood('mascot-g1', 'happy');
    setBubble('bubble-g1', '¡Genial! ¡Lo lograste! 🎉');
    burstConfetti(24);
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.dest-btn').forEach(b => { if (b.dataset.dest === situ.correct) b.classList.add('correct'); });
    fb.textContent = '❌ No exactamente. ' + situ.explain;
    fb.className = 'feedback wrong';
    setMood('mascot-g1', 'sad');
    setBubble('bubble-g1', 'Uy, casi... ¡vamos con la siguiente! 💪');
    shakeBody('.g1-body');
  }
  document.getElementById('g1-score').textContent = g1.score;
  document.getElementById('g1-next').style.display = 'block';
}

document.getElementById('g1-next').addEventListener('click', () => {
  g1.round++;
  if (g1.round >= g1.order.length) {
    document.getElementById('g1-situation').textContent = `🏁 ¡Terminaste! Puntaje final: ${g1.score} / ${g1.order.length * 10}`;
    document.querySelectorAll('.dest-btn').forEach(b => b.disabled = true);
    document.getElementById('g1-next').style.display = 'none';
    setMood('mascot-g1', g1.score >= g1.order.length * 7 ? 'excited' : 'happy');
    setBubble('bubble-g1', '¡Muy bien hecho, explorador del carbono! 🌟');
    burstConfetti(60);
  } else {
    setMood('mascot-g1', 'neutral');
    setBubble('bubble-g1', 'Observa bien la situación y elige el reservorio correcto 🧐');
    loadG1Round();
  }
});

/* =========================================================
   JUEGO 2: ¿Qué proceso está ocurriendo?
   ========================================================= */
const g2Scenes = [
  { scene: "🌱 + CO₂ + ☀️ → 🍃", correct: "Fotosíntesis",
    options: ["Respiración", "Fotosíntesis", "Combustión", "Descomposición"],
    explain: "La planta usa luz solar y CO₂ para producir su propio alimento (fotosíntesis)." },
  { scene: "🐄 come 🌿 y libera 💨 CO₂", correct: "Respiración",
    options: ["Respiración", "Fotosíntesis", "Combustión", "Erosión"],
    explain: "Los seres vivos liberan CO₂ al respirar como parte de su metabolismo." },
  { scene: "🔥 madera → 💨 + 🌫️", correct: "Combustión",
    options: ["Fotosíntesis", "Sedimentación", "Combustión", "Respiración"],
    explain: "Al quemar materia orgánica se libera rápidamente el carbono almacenado en ella." },
  { scene: "🍂 hoja muerta + 🦠 → 🌱 nutrientes + CO₂", correct: "Descomposición",
    options: ["Descomposición", "Fotosíntesis", "Combustión", "Respiración"],
    explain: "Los organismos descomponedores liberan el carbono de la materia orgánica muerta." },
  { scene: "🏭 combustibles fósiles → 💨 CO₂ a la atmósfera", correct: "Combustión",
    options: ["Combustión", "Fotosíntesis", "Fosilización", "Respiración"],
    explain: "La quema de combustibles fósiles libera carbono que estuvo almacenado por millones de años." },
  { scene: "💀 restos marinos + presión + tiempo → 🪨", correct: "Fosilización / sedimentación",
    options: ["Fosilización / sedimentación", "Respiración", "Fotosíntesis", "Combustión"],
    explain: "Con presión y tiempo geológico, el carbono orgánico puede convertirse en roca o combustible fósil." },
];

let g2 = { round: 0, score: 0, order: [] };

function initGame2() {
  g2.round = 0;
  g2.score = 0;
  g2.order = shuffle([...Array(g2Scenes.length).keys()]);
  document.getElementById('g2-score').textContent = 0;
  setMood('mascot-g2', 'neutral');
  setBubble('bubble-g2', '¿Qué proceso crees que es este? 🔍');
  loadG2Round();
}

function loadG2Round() {
  const item = g2Scenes[g2.order[g2.round]];
  document.getElementById('g2-round').textContent = g2.round + 1;
  document.getElementById('g2-scene').textContent = item.scene;
  document.getElementById('g2-explain').style.display = 'none';
  document.getElementById('g2-next').style.display = 'none';

  const optsBox = document.getElementById('g2-options');
  optsBox.innerHTML = '';
  const shuffledOpts = shuffle([...item.options]);
  shuffledOpts.forEach(opt => {
    const b = document.createElement('button');
    b.textContent = opt;
    b.onclick = () => answerG2(b, opt, item);
    optsBox.appendChild(b);
  });
}

function answerG2(btn, chosen, item) {
  document.querySelectorAll('#g2-options button').forEach(b => b.disabled = true);
  const isCorrect = chosen === item.correct;
  if (isCorrect) {
    btn.classList.add('correct');
    g2.score += 10;
    addTotalScore(10);
    setMood('mascot-g2', 'happy');
    setBubble('bubble-g2', '¡Exacto! Lo identificaste muy bien 🎯');
    burstConfetti(24);
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('#g2-options button').forEach(b => { if (b.textContent === item.correct) b.classList.add('correct'); });
    setMood('mascot-g2', 'sad');
    setBubble('bubble-g2', 'No era ese... ¡mira la explicación! 📖');
    shakeBody('.g2-body');
  }
  document.getElementById('g2-score').textContent = g2.score;
  const ex = document.getElementById('g2-explain');
  ex.style.display = 'block';
  ex.textContent = (isCorrect ? '✅ ' : '❌ La respuesta correcta es "' + item.correct + '". ') + item.explain;
  document.getElementById('g2-next').style.display = 'block';
}

document.getElementById('g2-next').addEventListener('click', () => {
  g2.round++;
  if (g2.round >= g2.order.length) {
    document.getElementById('g2-scene').textContent = `🏁 ¡Terminaste! Puntaje: ${g2.score} / ${g2.order.length * 10}`;
    document.getElementById('g2-options').innerHTML = '';
    document.getElementById('g2-explain').style.display = 'none';
    document.getElementById('g2-next').style.display = 'none';
    setMood('mascot-g2', g2.score >= g2.order.length * 7 ? 'excited' : 'happy');
    setBubble('bubble-g2', '¡Ya entiendes los procesos del ciclo! 🌟');
    burstConfetti(60);
  } else {
    setMood('mascot-g2', 'neutral');
    setBubble('bubble-g2', '¿Qué proceso crees que es este? 🔍');
    loadG2Round();
  }
});

/* =========================================================
   JUEGO 3: El planeta está en peligro
   ========================================================= */
const g3Crises = [
  { text: "🏭 Una ciudad aumenta la quema de combustibles fósiles para generar electricidad.", correct: "controlar",
    explain: "Controlar las emisiones reduce directamente la cantidad de CO₂ liberado." },
  { text: "🪓 Una zona de selva está siendo talada para ganar terreno agrícola.", correct: "restaurar",
    explain: "Restaurar ecosistemas (reforestar) ayuda a capturar carbono nuevamente." },
  { text: "🗑️ Un vertedero libera grandes cantidades de metano por residuos orgánicos sin tratar.", correct: "residuos",
    explain: "Gestionar bien los residuos evita la liberación de gases de efecto invernadero." },
  { text: "🏢 Un edificio gasta enormes cantidades de energía por mala aislación e iluminación ineficiente.", correct: "eficiencia",
    explain: "Optimizar la eficiencia energética reduce el consumo y las emisiones asociadas." },
  { text: "🚗 El tráfico de una gran ciudad genera niveles altos de CO₂ cada hora pico.", correct: "controlar",
    explain: "Controlar las emisiones (transporte limpio, normativas) ayuda a bajar el CO₂ liberado." },
  { text: "🌾 Un suelo agrícola degradado ya no logra absorber tanto carbono como antes.", correct: "restaurar",
    explain: "Restaurar ecosistemas y suelos mejora su capacidad de capturar carbono." },
];

let g3 = { round: 0, score: 0, co2: 400, order: [] };

function initGame3() {
  g3.round = 0;
  g3.score = 0;
  g3.co2 = 400;
  g3.order = shuffle([...Array(g3Crises.length).keys()]);
  document.getElementById('g3-score').textContent = 0;
  updateG3Balance();
  loadG3Round();
}

function updateG3Balance() {
  document.getElementById('g3-co2').textContent = g3.co2;
  const pct = Math.min(100, Math.max(0, (g3.co2 - 350) / (600 - 350) * 100));
  document.getElementById('g3-bar').style.width = pct + '%';
  const statusEl = document.getElementById('g3-status');
  if (g3.co2 < 430) { statusEl.textContent = '🌎 Estable'; setMood('earth-g3', 'happy'); }
  else if (g3.co2 < 500) { statusEl.textContent = '⚠️ En riesgo'; setMood('earth-g3', 'worried'); }
  else { statusEl.textContent = '🔥 Crítico'; setMood('earth-g3', 'scared'); }
}

function loadG3Round() {
  const item = g3Crises[g3.order[g3.round]];
  document.getElementById('g3-round').textContent = g3.round + 1;
  document.getElementById('g3-crisis').textContent = item.text;
  document.getElementById('g3-feedback').textContent = '';
  document.getElementById('g3-feedback').className = 'feedback';
  document.getElementById('g3-next').style.display = 'none';
  document.querySelectorAll('.action-btn').forEach(b => {
    b.disabled = false;
    b.classList.remove('correct', 'wrong');
    b.onclick = () => answerG3(b, item);
  });
}

function answerG3(btn, item) {
  document.querySelectorAll('.action-btn').forEach(b => b.disabled = true);
  const isCorrect = btn.dataset.action === item.correct;
  const fb = document.getElementById('g3-feedback');
  if (isCorrect) {
    btn.classList.add('correct');
    g3.score += 10;
    g3.co2 = Math.max(380, g3.co2 - 15);
    addTotalScore(10);
    fb.textContent = '✅ ¡Buena decisión! ' + item.explain;
    fb.className = 'feedback correct';
    burstConfetti(20);
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.action-btn').forEach(b => { if (b.dataset.action === item.correct) b.classList.add('correct'); });
    g3.co2 = Math.min(600, g3.co2 + 20);
    fb.textContent = '❌ Esa no era la mejor acción. ' + item.explain;
    fb.className = 'feedback wrong';
    shakeMascot('earth-g3');
    shakeBody('.g3-body');
  }
  document.getElementById('g3-score').textContent = g3.score;
  updateG3Balance();
  document.getElementById('g3-next').style.display = 'block';
}

document.getElementById('g3-next').addEventListener('click', () => {
  g3.round++;
  if (g3.round >= g3.order.length) {
    const msg = g3.co2 < 430 ? '🌎 ¡Lograste mantener el planeta en equilibrio!' :
                g3.co2 < 500 ? '⚠️ El planeta quedó en riesgo, pero sobrevivió.' :
                '🔥 El planeta quedó en estado crítico. ¡Inténtalo de nuevo!';
    document.getElementById('g3-crisis').textContent = `🏁 ${msg} Puntaje: ${g3.score} / ${g3.order.length * 10}`;
    document.querySelectorAll('.action-btn').forEach(b => b.disabled = true);
    document.getElementById('g3-next').style.display = 'none';
    if (g3.co2 < 430) burstConfetti(60);
  } else {
    loadG3Round();
  }
});

/* =========================================================
   JUEGO 4: Arma la cadena del cambio climático
   ========================================================= */
const g4CorrectOrder = [
  "💨 Aumento de CO₂",
  "☀️ Mayor efecto invernadero",
  "🔥 Retención de calor",
  "🌡️ Calentamiento global",
  "🌍 Impactos en ecosistemas"
];

let g4 = { tries: 0, dragSrc: null };

function initGame4() {
  g4.tries = 0;
  document.getElementById('g4-tries').textContent = 0;
  document.getElementById('g4-feedback').textContent = '';
  document.getElementById('g4-feedback').className = 'feedback';
  document.getElementById('g4-next').style.display = 'none';
  setMood('mascot-g4', 'neutral');
  setBubble('bubble-g4', 'Arrastra las piezas en el orden correcto, de causa a efecto 🧩');
  buildG4Pieces();
}

function buildG4Pieces() {
  const pool = document.getElementById('g4-pool');
  const target = document.getElementById('g4-target');
  pool.innerHTML = '';
  target.innerHTML = '';
  const shuffled = shuffle([...g4CorrectOrder]);
  shuffled.forEach(text => pool.appendChild(makeG4Piece(text)));
  enableDropZone(pool);
  enableDropZone(target);
}

function makeG4Piece(text) {
  const div = document.createElement('div');
  div.className = 'chain-piece';
  div.textContent = text;
  div.draggable = true;
  div.dataset.value = text;

  div.addEventListener('dragstart', () => {
    g4.dragSrc = div;
    div.classList.add('dragging');
  });
  div.addEventListener('dragend', () => div.classList.remove('dragging'));

  // Soporte táctil / clic simple: click mueve la pieza al otro contenedor (al final)
  div.addEventListener('click', () => {
    const pool = document.getElementById('g4-pool');
    const target = document.getElementById('g4-target');
    if (div.parentElement === pool) target.appendChild(div);
    else pool.appendChild(div);
    div.classList.remove('placed-correct', 'placed-wrong');
  });

  return div;
}

function enableDropZone(zone) {
  zone.addEventListener('dragover', e => {
    e.preventDefault();
    const afterEl = getDragAfterElement(zone, e.clientX);
    if (!g4.dragSrc) return;
    if (afterEl == null) zone.appendChild(g4.dragSrc);
    else zone.insertBefore(g4.dragSrc, afterEl);
  });
}

function getDragAfterElement(container, x) {
  const els = [...container.querySelectorAll('.chain-piece:not(.dragging)')];
  return els.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = x - box.left - box.width / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

document.getElementById('g4-check').addEventListener('click', () => {
  const target = document.getElementById('g4-target');
  const pieces = [...target.querySelectorAll('.chain-piece')];
  g4.tries++;
  document.getElementById('g4-tries').textContent = g4.tries;
  const fb = document.getElementById('g4-feedback');

  if (pieces.length !== g4CorrectOrder.length) {
    fb.textContent = '⚠️ Coloca las 5 piezas en el recuadro antes de verificar.';
    fb.className = 'feedback wrong';
    return;
  }

  let allCorrect = true;
  pieces.forEach((p, i) => {
    if (p.dataset.value === g4CorrectOrder[i]) {
      p.classList.add('placed-correct');
      p.classList.remove('placed-wrong');
    } else {
      p.classList.add('placed-wrong');
      p.classList.remove('placed-correct');
      allCorrect = false;
    }
  });

  if (allCorrect) {
    fb.textContent = '✅ ¡Cadena correcta! El aumento de CO₂ intensifica el efecto invernadero, retiene calor, calienta el planeta e impacta los ecosistemas.';
    fb.className = 'feedback correct';
    addTotalScore(20);
    document.getElementById('g4-next').style.display = 'block';
    setMood('mascot-g4', 'excited');
    setBubble('bubble-g4', '¡Perfecto! Entendiste la cadena completa 🔗🎉');
    burstConfetti(50);
  } else {
    fb.textContent = '❌ Algunas piezas están en el orden equivocado (marcadas en rojo). Reordénalas e inténtalo otra vez.';
    fb.className = 'feedback wrong';
    setMood('mascot-g4', 'sad');
    setBubble('bubble-g4', 'Casi... revisa las piezas en rojo 🔍');
    shakeBody('.g4-body');
  }
});

document.getElementById('g4-reset').addEventListener('click', buildG4Pieces);

document.getElementById('g4-next').addEventListener('click', () => {
  showScreen('screen-game5');
  initGame5();
});

/* =========================================================
   JUEGO 5: Reto final - salva el ciclo (60 segundos)
   ========================================================= */
const g5Situations = [
  { text: "🌳 Deforestación masiva en la Amazonía.", correct: "restaurar" },
  { text: "🏭 Emisiones industriales sin filtros.", correct: "controlar" },
  { text: "🗑️ Mala gestión de residuos orgánicos en vertederos.", correct: "residuos" },
  { text: "🚜 Cambio de uso del suelo para monocultivos.", correct: "restaurar" },
  { text: "🚗 Aumento del tráfico vehicular en horas pico.", correct: "controlar" },
  { text: "💡 Edificios con enorme desperdicio energético.", correct: "eficiencia" },
  { text: "🔥 Incendios forestales provocados.", correct: "restaurar" },
  { text: "🏭 Fábricas quemando carbón sin control.", correct: "controlar" },
  { text: "🗑️ Basura orgánica acumulada liberando metano.", correct: "residuos" },
  { text: "💡 Fábricas con maquinaria vieja y poco eficiente.", correct: "eficiencia" },
];

let g5 = { score: 0, health: 100, timer: 60, interval: null, current: null, playing: false };

function initGame5() {
  g5.score = 0;
  g5.health = 100;
  g5.timer = 60;
  g5.playing = false;
  document.getElementById('g5-score').textContent = 0;
  document.getElementById('g5-timer').textContent = 60;
  document.getElementById('g5-health').style.width = '100%';
  document.getElementById('g5-health').style.background = 'linear-gradient(90deg, #43a047, #66bb6a)';
  document.getElementById('g5-intro').style.display = 'block';
  document.getElementById('g5-play').style.display = 'none';
  document.getElementById('g5-end').style.display = 'none';
  setMood('earth-g5', 'happy');
  clearInterval(g5.interval);
}

document.getElementById('g5-start').addEventListener('click', () => {
  document.getElementById('g5-intro').style.display = 'none';
  document.getElementById('g5-play').style.display = 'block';
  g5.playing = true;
  nextG5Situation();
  g5.interval = setInterval(() => {
    g5.timer--;
    document.getElementById('g5-timer').textContent = g5.timer;
    if (g5.timer <= 0 || g5.health <= 0) endG5();
  }, 1000);

  document.querySelectorAll('#g5-actions .action-btn').forEach(b => {
    b.onclick = () => answerG5(b);
  });
});

function nextG5Situation() {
  g5.current = g5Situations[Math.floor(Math.random() * g5Situations.length)];
  document.getElementById('g5-situation').textContent = g5.current.text;
  document.getElementById('g5-feedback').textContent = '';
  document.querySelectorAll('#g5-actions .action-btn').forEach(b => {
    b.disabled = false;
    b.classList.remove('correct', 'wrong');
  });
}

function answerG5(btn) {
  if (!g5.playing) return;
  const isCorrect = btn.dataset.action === g5.current.correct;
  const fb = document.getElementById('g5-feedback');
  if (isCorrect) {
    g5.score += 10;
    fb.textContent = '✅ ¡Bien hecho!';
    fb.className = 'feedback correct';
    burstConfetti(16);
  } else {
    g5.health -= 15;
    fb.textContent = '❌ Esa no era la acción correcta.';
    fb.className = 'feedback wrong';
    shakeMascot('earth-g5');
    shakeBody('.g5-body');
  }
  document.getElementById('g5-score').textContent = g5.score;
  document.getElementById('g5-health').style.width = Math.max(0, g5.health) + '%';

  if (g5.health <= 30) {
    document.getElementById('g5-health').style.background = 'linear-gradient(90deg, #e53935, #fb8c00)';
    setMood('earth-g5', 'scared');
  } else if (g5.health <= 60) {
    setMood('earth-g5', 'worried');
  } else {
    setMood('earth-g5', 'happy');
  }

  if (g5.health <= 0) { endG5(); return; }

  setTimeout(nextG5Situation, 500);
}

function endG5() {
  g5.playing = false;
  clearInterval(g5.interval);
  document.getElementById('g5-play').style.display = 'none';
  document.getElementById('g5-end').style.display = 'block';
  addTotalScore(g5.score);

  const title = document.getElementById('g5-end-title');
  const msg = document.getElementById('g5-end-msg');
  if (g5.health <= 0) {
    title.textContent = '💀 El planeta colapsó';
    msg.textContent = `El planeta perdió toda su salud. Puntaje obtenido: ${g5.score}. ¡Vuelve a intentarlo!`;
  } else if (g5.score >= 80) {
    title.textContent = '🌎 ¡Salvaste el ciclo del carbono!';
    msg.textContent = `Excelente trabajo. Puntaje final: ${g5.score}. El planeta te lo agradece.`;
    burstConfetti(80);
  } else {
    title.textContent = '⏱️ ¡Tiempo terminado!';
    msg.textContent = `Puntaje final: ${g5.score}. El planeta sobrevivió, pero puedes hacerlo mejor.`;
  }
}

document.getElementById('g5-restart').addEventListener('click', initGame5);
document.getElementById('g5-menu').addEventListener('click', () => showScreen('screen-menu'));

/* =========================================================
   UTILIDADES
   ========================================================= */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
