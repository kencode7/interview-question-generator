/**
 * app.js — Interview Question Generator
 *
 * Depends on: config.js (must be loaded first via <script> in index.html)
 * Reads CONFIG.GROQ_API_KEY, CONFIG.GROQ_MODEL, CONFIG.GROQ_API_URL
 */

// ─────────────────────────────────────────────
// DOM REFERENCES
// ─────────────────────────────────────────────
const inputEl        = document.getElementById("job-title-input");
const submitBtn      = document.getElementById("submit-btn");
const errorEl        = document.getElementById("error-message");
const resultsSection = document.getElementById("results-section");
const questionsList  = document.getElementById("questions-list");
const roleTag        = document.getElementById("results-role-tag");

// ─────────────────────────────────────────────
// STATE — prevent duplicate submissions
// ─────────────────────────────────────────────
let isLoading = false;

// ─────────────────────────────────────────────
// EVENT LISTENERS
// ─────────────────────────────────────────────

submitBtn.addEventListener("click", handleSubmit);

inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSubmit();
});

// ─────────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────────
async function handleSubmit() {
  if (isLoading) return;

  const jobTitle = inputEl.value.trim();

  if (!jobTitle) {
    showError("Please enter a job title before generating questions.");
    inputEl.focus();
    return;
  }

  // On production (Netlify) there is no CONFIG — the key lives server-side.
  // Only check for the key when running locally.
  const isLocal = ["localhost", "127.0.0.1"].includes(location.hostname);
  if (isLocal && (!CONFIG.GROQ_API_KEY || CONFIG.GROQ_API_KEY === "YOUR_GROQ_API_KEY_HERE")) {
    showError("No API key found. Open config.js and paste your Groq API key.");
    return;
  }

  hideError();
  hideResults();
  setLoading(true);

  try {
    const questions = await fetchInterviewQuestions(jobTitle);
    renderQuestions(jobTitle, questions);
  } catch (err) {
    showError(err.message || "Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
}

// ─────────────────────────────────────────────
// API — routes to Netlify function in production,
//        calls Groq directly on localhost
// ─────────────────────────────────────────────
async function fetchInterviewQuestions(jobTitle) {
  const isLocal = ["localhost", "127.0.0.1"].includes(location.hostname);

  let response;

  if (isLocal) {
    // ── Local dev: call Groq directly using config.js ──────────────────
    const prompt =
      `Generate exactly 3 thoughtful and professional interview questions for a ` +
      `candidate applying for the role of ${jobTitle}. Keep the questions concise, ` +
      `practical, and specific to the role. Return only the numbered list, no extra commentary.`;

    response = await fetch(CONFIG.GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${CONFIG.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model:       CONFIG.GROQ_MODEL,
        messages:    [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens:  512,
      }),
    });
  } else {
    // ── Production: proxy via Netlify serverless function ──────────────
    response = await fetch("/.netlify/functions/generate-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobTitle }),
    });
  }

  // Handle non-2xx HTTP errors with friendly messages
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const apiMsg = errorData?.error?.message || `HTTP ${response.status}`;

    if (response.status === 401) {
      throw new Error("Invalid API key — check your GROQ_API_KEY in config.js.");
    } else if (response.status === 429) {
      throw new Error("Rate limit reached — please wait a moment and try again.");
    } else if (response.status === 400) {
      throw new Error(`Bad request: ${apiMsg}`);
    } else {
      throw new Error(`API error: ${apiMsg}`);
    }
  }

  const data = await response.json();
  const rawText = data?.choices?.[0]?.message?.content;

  if (!rawText) {
    throw new Error("Groq returned an empty response. Please try again.");
  }

  return parseQuestions(rawText);
}

// ─────────────────────────────────────────────
// PARSING — turn the model's text into an array
// ─────────────────────────────────────────────
function parseQuestions(rawText) {
  const lines = rawText
    .split("\n")
    .map((line) =>
      line
        .replace(/^[\d]+[.)]\s*|^[-*•]\s*|^\*\*[\d]+[.)]\*\*\s*/g, "")
        .trim()
    )
    .filter((line) => line.length > 10); // discard blank / very short lines

  if (lines.length < 1) {
    throw new Error("Could not parse questions from the response. Please try again.");
  }

  return lines.slice(0, 3);
}

// ─────────────────────────────────────────────
// RENDER — build question cards in the DOM
// ─────────────────────────────────────────────
function renderQuestions(jobTitle, questions) {
  roleTag.textContent = jobTitle;
  questionsList.innerHTML = "";

  questions.forEach((question, index) => {
    const card = document.createElement("div");
    card.className = "question-card";
    card.innerHTML = `
      <div class="question-number">${index + 1}</div>
      <p class="question-text">${escapeHtml(question)}</p>
    `;
    questionsList.appendChild(card);
  });

  resultsSection.classList.add("visible");
  resultsSection.style.display = "block";
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ─────────────────────────────────────────────
// UI STATE HELPERS
// ─────────────────────────────────────────────

/** Toggle the loading state: spinner, disabled controls, button label */
function setLoading(state) {
  isLoading = state;
  submitBtn.disabled = state;
  inputEl.disabled   = state;

  submitBtn.innerHTML = state
    ? `<div class="spinner"></div> Generating…`
    : "Generate Questions";
}

/** Display an error message below the input */
function showError(message) {
  errorEl.textContent = `⚠️ ${message}`;
  errorEl.classList.add("visible");
}

/** Hide the error message */
function hideError() {
  errorEl.textContent = "";
  errorEl.classList.remove("visible");
}

/** Hide the results section */
function hideResults() {
  resultsSection.classList.remove("visible");
  resultsSection.style.display = "none";
  questionsList.innerHTML = "";
}

/** Sanitise user-provided strings before injecting into innerHTML */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ─────────────────────────────────────────────
// THEME TOGGLE
// ─────────────────────────────────────────────
const themeToggleBtn = document.getElementById("theme-toggle");
const iconMoon       = document.getElementById("icon-moon");
const iconSun        = document.getElementById("icon-sun");

/** Sync the button icons to the current theme */
function syncThemeIcons(theme) {
  const isDark = theme === "dark";
  iconMoon.style.display = isDark  ? "" : "none";
  iconSun.style.display  = !isDark ? "" : "none";
}

// Apply icons on initial load (theme already set by the inline <script> in head)
syncThemeIcons(document.documentElement.getAttribute("data-theme") || "dark");

themeToggleBtn.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const next    = current === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  syncThemeIcons(next);
});

