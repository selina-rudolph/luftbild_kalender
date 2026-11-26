/*
 * Trage hier für jedes Türchen den Bildpfad und mindestens eine richtige
 * Antwort ein. Weitere Schreibweisen kommen als zusätzliche Antworten dazu.
 */
const riddles = [
  { day: 1, image: "bilder/Stein_am_Rhein.jpg", answers: ["Stein am Rhein"], solution: "Stein am Rhein" },
  { day: 2, image: "bilder/colmar.jpg", answers: ["Colmar"], solution: "Colmar" },
  { day: 3, image: "bilder/schiener_berg.jpg", answers: ["Schiener Berg"], solution: "Schiener Berg" },
  { day: 4, image: "bilder/camping_aigen_salzburg.jpg", answers: ["Camping Aigen", "Campingplatz Aigen", "Campingplatz Salzburg"], solution: "Camping Aigen Salzburg" },
  { day: 5, image: "bilder/Most na Soci.jpg", answers: ["Most na Soci"], solution: "Most na Soci" },
  { day: 6, image: "bilder/San_Bernardino.jpg", answers: ["San Bernardino","San Bernardino Pass"], solution: "San Bernardino" },
  { day: 7, image: "bilder/Palmanova.jpg", answers: ["Palmanova"], solution: "Palmanova" },
  { day: 8, image: "bilder/Offenburg_Bahnhof.jpg", answers: ["Offenburg Bahnhof","Bahnhof Offenburg","Offenburg"], solution: "Offenburg Bahnhof" },
  { day: 9, image: "bilder/Graz.jpg", answers: ["Graz"], solution: "Graz" },
  { day: 10, image: "bilder/Tägermoos.jpg", answers: ["Tägermoos"], solution: "Tägermoos" },
  { day: 11, image: "bilder/Planetarium.jpg", answers: ["Planetarium","Planetarium Berlin","Zeiss Großplanetarium"], solution: "Planetarium Berlin" },
  { day: 12, image: "bilder/Camping Draufluss.jpg", answers: ["Camping Draufluss","Campingplatz Draufluss"], solution: "Camping Draufluss" },
  { day: 13, image: "bilder/Böblingen.jpg", answers: ["Böblingen"], solution: "Böblingen" },
  { day: 14, image: "bilder/Reschensee.jpg", answers: ["Reschensee"], solution: "Reschensee" },
  { day: 15, image: "bilder/Letteallee.jpg", answers: ["Letteallee","Berlin Letteallee"], solution: "Letteallee" },
  { day: 16, image: "bilder/Osiacher_See.jpg", answers: ["Osiacher See"], solution: "Osiacher See" },
  { day: 17, image: "bilder/Bucklinweg.jpg", answers: ["Bucklinweg","Ravensburg"], solution: "Bucklinweg Ravensburg" },
  { day: 18, image: "bilder/Dorftirol.jpg", answers: ["Dorftirol"], solution: "Dorftirol" },
  { day: 19, image: "bilder/Rezzonico_comer_see.jpg", answers: ["Rezzonico","Rezzonico Comer See","Comer See"], solution: "Rezzonico Comer See" },
  { day: 20, image: "bilder/Gastein.jpg", answers: ["Bad Gastein"], solution: "Bad Gastein" },
  { day: 21, image: "bilder/Bled.jpg", answers: ["Bled","Bleder See"], solution: "Bleder See" },
  { day: 22, image: "bilder/Friedrichshafen.jpg", answers: ["Friedrichshafen"], solution: "Friedrichshafen" },
  { day: 23, image: "bilder/klosterweiher.jpg", answers: ["Klosterweiher","Klosterweiher Sankt Georgen"], solution: "Klosterweiher Sankt Georgen" },
  { day: 24, image: "bilder/Sandseele.jpg", answers: ["Sandseele","Camping Sandseele","Sandseele Reichenau"], solution: "Sandseele" }
];

// Zum Testen auf true setzen, damit alle Türchen sofort freigeschaltet sind.
const TEST_MODE = true;
const STORAGE_KEY = "foto-adventskalender-solved-v1";

const calendar = document.getElementById("calendar");
const backdrop = document.getElementById("modal-backdrop");
const dialog = document.getElementById("photo-dialog");
const closeButton = document.getElementById("close-button");
const quizImage = document.getElementById("quiz-image");
const imageFallback = document.getElementById("image-fallback");
const answerForm = document.getElementById("answer-form");
const answerInput = document.getElementById("answer-input");
const feedback = document.getElementById("feedback");

let activeRiddle = null;
let lastFocusedElement = null;
let solvedDays = loadSolvedDays();

function loadSolvedDays() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(stored) ? stored.filter(Number.isInteger) : [];
  } catch {
    return [];
  }
}

function saveSolvedDays() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(solvedDays));
  } catch {
    // Das Spiel funktioniert weiter, auch wenn der Browser localStorage blockiert.
  }
}

function isUnlocked(day) {
  if (TEST_MODE) return true;

  const now = new Date();
  return now.getMonth() === 11 && now.getDate() >= day;
}

function normalizeAnswer(value) {
  return value
    .trim()
    .toLocaleLowerCase("de-DE")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]/g, "");
}

function renderCalendar() {
  calendar.innerHTML = "";

  riddles.forEach((riddle) => {
    const solved = solvedDays.includes(riddle.day);
    const unlocked = isUnlocked(riddle.day);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "door";
    button.textContent = String(riddle.day);
    button.disabled = !unlocked;
    button.classList.toggle("is-openable", unlocked && !solved);
    button.classList.toggle("is-solved", solved);
    button.setAttribute(
      "aria-label",
      `Türchen ${riddle.day}${solved ? ", gelöst" : unlocked ? ", öffnen" : ", noch verschlossen"}`
    );

    if (unlocked) {
      button.addEventListener("click", () => openRiddle(riddle));
    }
    calendar.appendChild(button);
  });
}

function openRiddle(riddle) {
  activeRiddle = riddle;
  lastFocusedElement = document.activeElement;

  document.getElementById("dialog-title").textContent = `Türchen ${riddle.day}`;
  quizImage.onerror = null;
  quizImage.hidden = !riddle.image;
  imageFallback.hidden = Boolean(riddle.image);
  if (riddle.image) {
    quizImage.src = riddle.image;
    quizImage.alt = `Foto zu Türchen ${riddle.day}`;
    quizImage.onerror = () => {
      quizImage.hidden = true;
      imageFallback.hidden = false;
    };
  } else {
    quizImage.removeAttribute("src");
    imageFallback.textContent = "Für dieses Türchen wurde noch kein Foto hinterlegt.";
  }

  answerInput.value = "";
  answerInput.disabled = solvedDays.includes(riddle.day);
  answerInput.placeholder = solvedDays.includes(riddle.day)
    ? "Dieses Türchen hast du bereits gelöst"
    : "Wo ist das?";
  answerForm.querySelector(".submit-button").disabled = solvedDays.includes(riddle.day);
  answerForm.querySelector(".submit-button").textContent = solvedDays.includes(riddle.day)
    ? "Bereits gelöst"
    : "Antwort überprüfen";

  setFeedback(solvedDays.includes(riddle.day)
    ? `Richtig gelöst: ${riddle.solution || "Glückwunsch!"}`
    : "");

  backdrop.hidden = false;
  document.body.classList.add("modal-open");
  closeButton.focus();
}

function closeRiddle() {
  backdrop.hidden = true;
  document.body.classList.remove("modal-open");
  activeRiddle = null;
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}

function setFeedback(message, type = "") {
  feedback.textContent = message;
  feedback.className = `feedback${type ? ` is-${type}` : ""}`;
}

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!activeRiddle) return;

  const answer = normalizeAnswer(answerInput.value);
  if (!answer) {
    setFeedback("Bitte gib eine Antwort ein.", "wrong");
    return;
  }

  const acceptedAnswers = activeRiddle.answers.map(normalizeAnswer).filter(Boolean);

  if (acceptedAnswers.length === 0) {
    setFeedback("Für dieses Türchen wurden die Lösungen noch nicht eingetragen.", "wrong");
    return;
  }

  if (acceptedAnswers.includes(answer)) {
    if (!solvedDays.includes(activeRiddle.day)) {
      solvedDays.push(activeRiddle.day);
      saveSolvedDays();
    }
    renderCalendar();
    answerInput.disabled = true;
    answerForm.querySelector(".submit-button").disabled = true;
    answerForm.querySelector(".submit-button").textContent = "Richtig";
    setFeedback(`Richtig! ${activeRiddle.solution || ""}`.trim(), "correct");
  } else {
    setFeedback("Das ist leider nicht richtig. Versuch es noch einmal!", "wrong");
  }
});

closeButton.addEventListener("click", closeRiddle);

backdrop.addEventListener("click", (event) => {
  if (event.target === backdrop) closeRiddle();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !backdrop.hidden) closeRiddle();
});

renderCalendar();
