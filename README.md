# 🎯 Interview Question Generator

> A clean, fast, AI-powered tool that generates tailored interview questions for any job title — built by **Melo Associates**.

---

## ✨ Features

- 🤖 **AI-generated questions** via the [Groq](https://console.groq.com) API (LLaMA 3.3 70B)
- ⚡ **Instant results** — Groq's inference is exceptionally fast
- 🌙 **Dark / Light mode** toggle with OS preference detection and `localStorage` persistence
- 📱 **Fully responsive** — works on mobile, tablet, and desktop
- ♿ **Accessible** — semantic HTML, ARIA labels, keyboard navigation (Enter to submit)

---

## 🖼️ Preview

> _Add a screenshot here — drag an image into this area on GitHub._

---

## 🗂️ Project Structure

```
interview-question-generator/
├── index.html          # App markup (no inline styles or scripts)
├── styles.css          # All CSS — variables, components, dark/light themes
├── app.js              # All JavaScript — API calls, DOM, theme toggle
└── .gitignore
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/interview-question-generator.git
cd interview-question-generator
```


### 3. Serve the app

No build step needed. Use any static file server:

```bash
# Using npx serve
npx serve .

# Or using Python
python3 -m http.server 3456
```

Then open [http://localhost:3456](http://localhost:3456) in your browser.

> **⚠️ Note:** Open via a local server, not by double-clicking `index.html`. Browsers block `fetch()` requests from `file://` origins.

---

## 🛠️ Tech Stack

| Layer | Choice |
|---|---|
| Markup | Semantic HTML5 |
| Styling | Vanilla CSS (custom properties, no framework) |
| Logic | Vanilla JavaScript (no bundler required) |
| AI | [Groq ] — LLaMA 3.3 70B |
| Font | [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts |

---

## 📄 License

MIT — feel free to use, adapt, and build on this.

---

<p align="center">Powered by <strong>Melo Associates</strong></p>
