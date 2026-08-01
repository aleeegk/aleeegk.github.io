🇬🇧 English | [🇪🇸 Español](README.md)

# ⏳ Escala del Tiempo | Timeline Scale

> **One million years, a single timeline.**  
> An interactive educational tool that puts 4.6 billion years of history, prehistory and geology into perspective on a single fluid visual axis.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=github&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

🌐 **Live demo:** [https://aleeegk.github.io](https://aleeegk.github.io)

---

## 📖 Table of Contents
- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Technologies Used](#-technologies-used)
- [Project Structure](#-project-structure)
- [Local Installation & Usage](#-local-installation--usage)
- [Deploying to GitHub Pages](#-deploying-to-github-pages)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌐 About the Project

**Escala del Tiempo** (Timeline Scale) is an interactive web application designed to solve a major challenge in science and history communication: **understanding the true magnitude of geological and historical time**.

Human history and Earth's history are often represented separately. This app unites more than **4.6 billion years** on a single timeline axis with a **dynamic compression scale**, allowing students, educators and curious minds to compare events from the distant past with recent history in a seamless and intuitive way.

---

## ✨ Key Features

- **🌌 Dynamic Temporal Compression:** Visualise prehistory, geological eras and written history on a single non-linear timeline where each epoch offers a proportional perspective.
- **🎨 "Liquid Glass" & Premium Aesthetics:** Interface with modern glassmorphism style, light/dark themes, dynamic vignette and high-fluidity animations.
- **🔍 Smart Global Search:** Find any event, geological era or specific year instantly via the text-filter search bar and results modal.
- **📜 Eras & Stages Panel:** Interactive side panel to jump quickly to geological eras (*Hadean, Archean, Mesozoic, Cenozoic…*) and historical ages (*Ancient, Medieval, Modern, Contemporary…*).
- **🌍 Multilingual Support (i18n):** Instant switching between **Spanish**, **English**, **French**, **Italian** and **Catalan** across the entire interface without page reload.
- **↕️↔️ Adaptive Orientation:** Switch between vertical and horizontal view to fit any screen type or navigation preference.
- **📽️ Projector Mode:** Clean, maximised view designed for exhibitions, classrooms and presentations.
- **📱 100% Responsive & Accessible:** Optimised for mobile devices, tablets and desktops, with keyboard navigation support (↑/↓ arrows).
- **⚡ Ultra Lightweight:** Built without heavy frameworks or unnecessary external dependencies for ultra-fast loading.
- **🧩 Quiz Mode:** Interactive quiz that tests your knowledge of historical events with random questions, four answer choices and a live score counter.
- **📥 Offline / PWA:** Save the full app for offline use directly from the Settings panel — works without an internet connection after the first visit.

---

## 🛠️ Technologies Used

- **Semantic HTML5:** Structure optimised for accessibility and search engines (SEO).
- **Vanilla CSS3:** CSS Custom Properties, Flexbox, CSS Grid, glassmorphism effects and GPU-accelerated transitions.
- **Vanilla JavaScript ES6+:** Timeline navigation logic, interactive search engine, dynamic translations (i18n) and DOM control without framework dependencies.
- **Lucide Icons:** Clean, vector iconography.

---

## 📂 Project Structure

```plaintext
Escala del tiempo/
│
├── index.html           # Main structure (Landing, App timeline, Panels and Modals)
├── styles.css           # Design system, CSS tokens, Glassmorphism, Themes and Responsive
├── script.js            # Milestone database, rendering engine, temporal calculation & i18n
├── manifest.json        # PWA manifest (name, icons, theme color)
├── service-worker.js    # Service Worker for offline caching
├── icon-192.png         # PWA icon 192×192
├── icon-512.png         # PWA icon 512×512
├── README.md            # Project documentation (Spanish)
├── README.en.md         # Project documentation (English)
└── google98ba93eee4db0035.html  # Google Search Console verification file
```

---

## 🚀 Local Installation & Usage

No build process or `npm` package installation is required.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aleeegk/aleeegk.github.io.git
   cd aleeegk.github.io
   ```

2. **Open in the browser:**
   - You can open the `index.html` file directly in your web browser.
   - Or use a local server extension like **Live Server** in VS Code, or run in the terminal:
     ```bash
     # With Python 3
     python -m http.server 8000

     # Or with Node.js npx
     npx serve .
     ```
   - Open `http://localhost:8000` in your browser.

---

## 📤 Deploying to GitHub Pages

This repository is configured to publish automatically to GitHub Pages:

1. Push your changes to the main branch (`main` or `master`).
2. Go to **Settings** > **Pages** in your GitHub repository.
3. Under **Build and deployment** > **Source**, select `Deploy from a branch`.
4. Choose the main branch and the `/ (root)` folder.
5. Click **Save**. Your site will be live at `https://aleeegk.github.io`.

---

## 🤝 Contributing

Contributions, suggestions for new milestones or visual improvements are welcome!

1. **Fork** this repository.
2. Create a new branch for your fix or feature:
   ```bash
   git checkout -b feature/NewHistoricalMilestone
   ```
3. Save your changes and make a clear commit:
   ```bash
   git commit -m "Add historical milestone about Gutenberg's printing press"
   ```
4. Push the changes to your forked repository (`git push origin feature/NewHistoricalMilestone`).
5. Open a **Pull Request** detailing your changes.

---

## 📄 License

This project is distributed under the **MIT** licence. See the `LICENSE` file for more details.

---

<p align="center">
  Made with ❤️ to share history and science in an interactive way.
</p>
