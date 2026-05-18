# 🎯 Interview Question Generator

> A clean, fast, AI-powered tool that generates tailored interview questions for any job title — built by **Melo Associates**.

---

## ✨ Features

- 🤖 **AI-generated questions** via the [Groq](https://console.groq.com) API (LLaMA 3.3 70B)
- ⚡ **Instant results** — Groq's inference is exceptionally fast
- 🌙 **Dark / Light mode** toggle with OS preference detection and `localStorage` persistence
- 📱 **Fully responsive** — works on mobile, tablet, and desktop
- ♿ **Accessible** — semantic HTML, ARIA labels, keyboard navigation (Enter to submit)
- 🔒 **API key stays local** — config is gitignored and never committed

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
├── config.js           # 🔑 Your API key (gitignored — never commit this)
├── config.example.js   # Template — safe to commit
└── .gitignore
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/interview-question-generator.git
cd interview-question-generator
```

### 2. Set up your API key

Copy the example config and add your key:

```bash
cp config.example.js config.js
```

Get a free API key at [console.groq.com/keys](https://console.groq.com/keys).

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
| AI | [Groq API](https://console.groq.com) — LLaMA 3.3 70B |
| Font | [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts |

---

## 🔐 Security Note

`config.js` (which contains your API key) is listed in `.gitignore` and will **never** be committed. Only `config.example.js` — which contains a placeholder — is tracked by git.

If you plan to deploy this publicly, move the API call to a server-side function or proxy to avoid exposing your key in client-side code.

---

## 📄 License

MIT — feel free to use, adapt, and build on this.

---

<p align="center">Powered by <strong>Melo Associates</strong></p>
