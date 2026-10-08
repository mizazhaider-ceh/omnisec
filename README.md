<div align="center">

# 🛡️ The OmniSec Roadmap

### Zero-to-Hero Offensive Security, taught the way I wished someone taught me.

**✦ A The PenTrix Project** — OmniSec is the cybersecurity track of [The PenTrix](https://www.mizazhaider-ceh.dev/), the student learning platform I'm building.

[![Stars](https://img.shields.io/github/stars/mizazhaider-ceh/omnisec?style=for-the-badge&logo=github&color=2dd4bf)](https://github.com/mizazhaider-ceh/omnisec/stargazers)
[![Forks](https://img.shields.io/github/forks/mizazhaider-ceh/omnisec?style=for-the-badge&logo=github&color=a78bfa)](https://github.com/mizazhaider-ceh/omnisec/network/members)
[![License](https://img.shields.io/github/license/mizazhaider-ceh/omnisec?style=for-the-badge&color=38bdf8)](LICENSE)
[![Offline](https://img.shields.io/badge/100%25-offline-f472b6?style=for-the-badge)](https://github.com/mizazhaider-ceh/omnisec)

**7 phases · 50+ topics · 70+ languages · 100% offline · progress tracking in your browser**

[🚀 Open the Live Roadmap](https://mizazhaider-ceh.github.io/omnisec/) · [⭐ Why I built this](#-why-i-built-this) · [🤝 Contribute](#-contributing)

</div>

---

## ✨ What this is

Most roadmaps are flat images, paid funnels, or giant tool lists with zero guidance on **what to actually do**. OmniSec is different: every single topic is a **mini-lesson** with

- 🎯 **What to learn**: the concepts that actually matter
- 🛠️ **What to do**: concrete hands-on steps and commands
- 🧰 **Tools**: the ones you will really touch
- 📚 **Free resources**: the best links, no paywalls
- ⭐ **Don't-Skip Gems**: the small things students skip and regret later

From absolute beginner to advanced bug bounty hunter, one roadmap, end to end.

## 🔥 Features

| Feature | Details |
|---|---|
| 🗺️ **Full curriculum** | 7 phases: mindset and ethics, fundamentals, networking, Linux, Windows, web hacking, bug bounty and career |
| 🗺️ **Multi-page experience** | Home with 7 phase cards, each phase its own page, every topic a dedicated detail page with breadcrumbs and prev/next navigation |
| ⭐ **Don't-Skip Gems** | Flagged topics + a dedicated filter for the things learners quietly skip |
| ✅ **Progress tracking** | Tick topics off, your progress saves in the browser. Live ring, per-phase counters |
| 🌍 **70+ languages** | Instant UI switching with full RTL support (Arabic, Urdu, Persian, Hebrew) |
| 🎨 **Galaxy UI** | Animated starfield, nebula, glassmorphism, pastel frosted-glass light theme with a galaxy dark mode |
| 🛡️ **Cyber mascots** | Hand-drawn SVG guardians per phase, zero external images |
| 📴 **100% offline** | No backend, no build step, no install. Works anywhere |
| 🔍 **Smart search** | Jump to any topic, tool, tag, or resource instantly |

## 📸 Preview

> Open it and scroll. The galaxy does the talking.

<div align="center">
  <img src="https://img.shields.io/badge/Preview-Live_Demo-2dd4bf?style=for-the-badge&logo=googlechrome" alt="preview badge" />
  <br/>
  <a href="https://mizazhaider-ceh.github.io/omnisec/"><b>👉 Launch the interactive roadmap</b></a>
</div>

## 🗺️ The 7 phases

| # | Phase | What you conquer |
|---|---|---|
| 0 | 🧭 Mindset, Ethics & Your Lab | Think like an attacker, stay legal, build a safe practice lab |
| 1 | 🖥️ Computer Fundamentals | How computers, OSes, and data encoding really work |
| 2 | 🌐 Networking Fundamentals | TCP/IP, subnetting, DNS, Wireshark, HTTP mastery |
| 3 | 🐧 Linux Deep Dive | CLI, permissions, scripting, SSH tunneling, tmux |
| 4 | 🪟 Windows & Active Directory | Internals, PowerShell, NTLM/Kerberos, AD attacks |
| 5 | 🕸️ Web Hacking | OWASP Top 10, Burp Suite, XSS, SQLi, SSRF, and more |
| 6 | 🏆 Bug Bounty & Career | Methodology, reporting, platforms, getting paid |

Each phase breaks into stages, each stage into numbered topics in learning order.

## 🚀 Usage

No build. No install. No backend.

```bash
# Option 1: just open it
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows

# Option 2: serve it locally
python3 -m http.server 8000
# then visit http://localhost:8000
```

To host it: drop the folder on **GitHub Pages**, Netlify, Vercel, or any static host. Zero configuration needed.

## 🗂️ Project structure

```
omnisec/
├── index.html          # Entry point (galaxy hero, dashboard, footer)
├── css/
│   └── styles.css      # Galaxy UI: starfield, nebula, glass, animations
├── js/
│   ├── roadmap-data.js # The full curriculum (edit this to add topics)
│   ├── i18n.js         # 70+ languages and UI translations
│   ├── characters.js   # Offline SVG cyber mascots
│   └── app.js          # Rendering, progress, search, starfield, filters
├── README.md
├── LICENSE
└── .gitignore
```

## 🤝 Contributing

This is open source for the community. Found a missing attack vector, a dead link, or a better resource? Jump in.

To add a topic, edit `js/roadmap-data.js`:

```js
{ id:"n_unique", t:"Topic Title", d:"One line: what it is.",
  lv:1, time:"~3h", skip:false,
  tip:"The thing most people get wrong.",
  learn:["Concept you must understand"],
  do:["Concrete hands-on step"],
  tools:["Burp Suite"],
  res:[{t:"Resource label", u:"https://example.com"}] }
```

- Set `skip:true` to flag a commonly-skipped gem.
- To add UI translations, extend `STRINGS` in `js/i18n.js`.
- PRs for new topics, tooling updates, and translations are welcome.

## 💬 Why I built this

When I started in cybersecurity, every roadmap I found was either a flat image with no depth, a paid course funnel, or a giant list of tools with zero guidance on what to actually do. I kept thinking: someone should build the roadmap I wished I had.

So I built it myself.

Every topic here is a mini-lesson: what to understand, the exact hands-on steps to practice it, the tools you will actually touch, and free resources to go deeper. The ⭐ gems are the small things I watched students (including me) skip, then pay for later.

I made it **fully offline** because great learning should not need great internet. I translated the interface into **70+ languages** because talent is everywhere, and language should never be the wall. And your progress saves in your browser, because this is a journey you measure in months, not minutes.

If this roadmap helps even one person go from "where do I start" to their first real bounty, it was worth every hour.

## 👨‍💻 Author

<div align="center">

### Muhammad Izaz Haider

**Lover of AI × Offensive Security**

🏆 CSCB 2026: #1 Web (Junior Division) · 🎯 YesWeHack hunter **MIHX01** · 🎓 Howest MTS3-CS Cybersecurity

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0a66c2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/muhammad-izaz-haider-091639314/)
[![Portfolio](https://img.shields.io/badge/Portfolio-mizazhaider--ceh.dev-2dd4bf?style=for-the-badge&logo=googlechrome)](https://www.mizazhaider-ceh.dev/)
[![GitHub](https://img.shields.io/badge/GitHub-mizazhaider--ceh-181717?style=for-the-badge&logo=github)](https://github.com/mizazhaider-ceh)

</div>

## ⚖️ Disclaimer

This roadmap is for **education and authorized testing only**. Never test systems you do not own or lack explicit written permission to assess. Stay legal. Stay curious.

---

<div align="center">

*© 2026 Muhammad Izaz Haider: made for the global security community.* 🛡️

**If this helped you, drop a ⭐. It genuinely keeps me building.**

</div>
