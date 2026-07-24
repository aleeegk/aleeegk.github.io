🇪🇸 Español | [🇬🇧 English](README.en.md)

# ⏳ Escala del Tiempo | Timeline Scale

> **Un millón de años, una sola línea.**  
> Una herramienta educativa e interactiva que pone en perspectiva 4.600 millones de años de historia, prehistoria y geología en un único eje visual fluido.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=github&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

🌐 **Demo en vivo:** [https://aleeegk.github.io](https://aleeegk.github.io)

---

## 📖 Tabla de Contenidos
- [Acerca del Proyecto](#-acerca-del-proyecto)
- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Uso Local](#-instalación-y-uso-local)
- [Despliegue en GitHub Pages](#-despliegue-en-github-pages)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## 🌐 Acerca del Proyecto

**Escala del Tiempo** es una aplicación web interactiva diseñada para resolver una gran dificultad en la divulgación de la historia y la ciencia: **comprender la verdadera magnitud del tiempo geológico e histórico**.

A menudo, la historia humana y la historia de la Tierra se representan por separado. Esta aplicación une más de **4.600 millones de años** en un solo eje timeline con una **escala de compresión dinámica**, permitiendo a estudiantes, educadores y mentes curiosas comparar eventos del pasado remoto con la historia reciente de manera fluida e intuitiva.

---

## ✨ Características Principales

- **🌌 Compresión Temporal Dinámica:** Visualiza la prehistoria, eras geológicas y la historia escrita en una misma línea de tiempo no lineal donde cada época ofrece una perspectiva proporcional.
- **🎨 Diseño "Liquid Glass" & Aesthetica Premium:** Interfaz con estilo glassmorphism moderno, temas claro/oscuro, viñeta dinámica y animaciones de alta fluidez.
- **🔍 Búsqueda Global e Inteligente:** Encuentra cualquier evento, era geológica o año específico al instante mediante el buscador con filtro de texto y modal de resultados.
- **📜 Panel de Eras y Etapas:** Desplegable lateral interactivo para saltar rápidamente a las eras geológicas (*Hadeano, Arqueano, Mesozoico, Cenozoico...*) y edades históricas (*Edad Antigua, Media, Moderna, Contemporánea...*).
- **🌍 Soporte Multilingüe (i18n):** Conmutación instantánea entre **Español, English, Français, Italiano y Català** en toda la interfaz sin necesidad de recargar la página.
- **↕️↔️ Orientación Adaptable:** Cambia entre vista vertical u horizontal para ajustarse a cualquier tipo de pantalla o preferencia de navegación.
- **📽️ Modo Proyector:** Modo de vista limpia y maximizada pensado para exposiciones, aulas de clase y presentaciones.
- **📱 100% Responsive & Accesible:** Optimizado para dispositivos móviles, tablets y ordenadores de escritorio, compatible con navegación por teclado (flechas ↑/↓).
- **⚡ Super Ligero:** Construido sin frameworks pesados ni dependencias externas innecesarias para garantizar una carga ultrarrápida.
- **🧩 Modo Quiz:** Pon a prueba lo aprendido con preguntas aleatorias sobre los hitos históricos, cuatro opciones de respuesta y un contador de aciertos en vivo.
- **📥 Sin conexión / PWA:** Guarda la aplicación completa para uso sin conexión desde el panel de ajustes — funciona sin internet después de la primera visita.

---

## 🛠️ Tecnologías Utilizadas

- **HTML5 Semántico:** Estructura optimizada para accesibilidad y motores de búsqueda (SEO).
- **CSS3 Vanilla:** Variables de CSS (Custom Properties), Flexbox, CSS Grid, efectos de cristal (Glassmorphism) y transiciones aceleradas por GPU.
- **JavaScript ES6+ Vanilla:** Lógica de navegación temporal, motor de búsqueda interactivo, traducciones dinámicas (i18n) y control del DOM sin dependencias de frameworks.
- **Lucide Icons:** Iconografía limpia y vectorial.

---

## 📂 Estructura del Proyecto

```plaintext
Escala del tiempo/
│
├── index.html           # Estructura principal (Landing, App timeline, Paneles y Modales)
├── styles.css           # Sistema de diseño, tokens CSS, Glassmorphism, Temas y Responsive
├── script.js            # Base de datos de hitos, motor de renderizado, cálculo temporal e i18n
├── manifest.json        # Manifiesto PWA (nombre, iconos, color de tema)
├── service-worker.js    # Service Worker para caché sin conexión
├── icon-192.png          # Icono PWA 192×192
├── icon-512.png          # Icono PWA 512×512
├── README.md             # Documentación del proyecto (Español)
├── README.en.md          # Documentación del proyecto (English)
└── google98ba93eee4db0035.html # Archivo de verificación para Google Search Console
```

---

## 🚀 Instalación y Uso Local

No se requiere ningún proceso de compilación ni instalación de paquetes vía `npm`.

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/aleeegk/aleeegk.github.io.git
   cd aleeegk.github.io
   ```

2. **Abrir en el navegador:**
   - Puedes abrir directamente el archivo `index.html` en tu navegador web.
   - O usar una extensión de servidor local como **Live Server** en VS Code, o ejecutar en la terminal:
     ```bash
     # Con Python 3
     python -m http.server 8000

     # O con Node.js npx
     npx serve .
     ```
   - Abre `http://localhost:8000` en tu navegador.

---

## 📤 Despliegue en GitHub Pages

Este repositorio está configurado para publicarse de forma automática en GitHub Pages:

1. Sube los cambios a la rama principal (`main` o `master`).
2. Ve a **Settings** > **Pages** en tu repositorio de GitHub.
3. En **Build and deployment** > **Source**, selecciona `Deploy from a branch`.
4. Elige la rama principal y la carpeta `/ (root)`.
5. Haz clic en **Save**. Tu web estará en línea en `https://aleeegk.github.io`.

---

## 🤝 Contribución

¡Las contribuciones, sugerencias de nuevos hitos o mejoras visuales son bien recibidas!

1. Haz un **Fork** de este repositorio.
2. Crea una nueva rama para tu corrección o función:
   ```bash
   git checkout -b feature/NuevoHitoHistorico
   ```
3. Guarda tus cambios y realiza un commit claro:
   ```bash
   git commit -m "Añadir hito histórico sobre la imprenta de Gutenberg"
   ```
4. Envía los cambios a tu repositorio forkeado (`git push origin feature/NuevoHitoHistorico`).
5. Abre un **Pull Request** detallando tus cambios.

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia **MIT**. Consulta el archivo `LICENSE` para obtener más detalles.

---

<p align="center">
  Hecho con ❤️ para divulgar la historia y la ciencia de forma interactiva.
</p>