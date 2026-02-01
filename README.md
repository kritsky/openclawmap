# 🦞 OpenClaw Architecture Map

Interactive architecture diagram for OpenClaw — a personal AI gateway system.

![OpenClaw Map](https://img.shields.io/badge/React-18-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan) ![Vite](https://img.shields.io/badge/Vite-5-purple)

## Features

- 🖱️ **Drag & Drop** — перетаскивай узлы
- 👆 **Interactive** — клик для деталей
- 🔗 **Connections** — визуализация связей
- 📱 **Responsive** — адаптивный дизайн
- ✨ **Animated** — анимированный поток данных

## Quick Start

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## Deploy to Vercel

### Option 1: Vercel CLI (рекомендуется)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (из папки проекта)
vercel

# Deploy to production
vercel --prod
```

### Option 2: GitHub Integration

1. Загрузи проект на GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create openclaw-map --public --push
   ```

2. Зайди на [vercel.com](https://vercel.com)

3. "Add New Project" → Import Git Repository

4. Выбери репозиторий `openclaw-map`

5. Настройки автоматически определятся (Vite)

6. Нажми "Deploy"

### Option 3: Direct Upload

1. Build проект:
   ```bash
   npm run build
   ```

2. На [vercel.com](https://vercel.com) выбери "Add New Project"

3. Перетащи папку `dist/` в область загрузки

## Project Structure

```
openclaw-map/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          # Main component
│   ├── main.jsx         # Entry point
│   └── index.css        # Tailwind + animations
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Tech Stack

- **React 18** — UI library
- **Vite 5** — build tool
- **Tailwind CSS 3.4** — styling
- **Orbitron + JetBrains Mono** — typography

## Customization

### Добавить новый узел

В `src/App.jsx`:

```javascript
const concepts = {
  // ... existing nodes
  newNode: {
    title: "NEW NODE",
    icon: "🆕",
    color: "#00FF00",
    desc: "Description here",
    points: ["Point 1", "Point 2", "Point 3"],
    tier: "CORE"  // CORE | INPUT | PROC | DATA | EXEC
  }
};

const layout = {
  // ... existing positions
  newNode: { x: 300, y: 500 }
};

const links = [
  // ... existing links
  ['gateway', 'newNode'],  // Add connection
];
```

## License

MIT

---

Built with 🦞 for OpenClaw documentation
