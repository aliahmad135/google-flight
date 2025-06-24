# Google Flights Clone ✈️

A responsive React + Vite application that mimics Google Flights search UI and consumes the **Sky-Scrapper** RapidAPI.  
Fetches data directly from Sky-Scrapper RapidAPI from the client side.

---

## ✨ Features

- Origin / destination autocomplete (live Sky-Scrapper `searchAirport` endpoint)
- Date, passenger-count & cabin-class selectors
- Flight-results grid
- React Router, TanStack Query, Tailwind CSS

---

## 🖥️ Local Development

### 1 . Clone & install

```bash
# SSH
git clone git@github.com:aliahmad135/google-flight.git
# or HTTPS
git clone https://github.com/aliahmad135/google-flight.git
cd google-flight/project
npm install       # front-end deps
```

### 2 . RapidAPI credentials

Create a **.env** file at `project/.env`:

```
VITE_RAPIDAPI_KEY=YOUR_RAPIDAPI_KEY
VITE_RAPIDAPI_HOST=sky-scrapper.p.rapidapi.com
# no proxy needed
```

### 3 . Run the front-end

```bash
npm run dev        # Vite dev server → http://localhost:5173
```

Open the browser, type at least 3 letters in the From/To boxes, pick a suggestion, set dates and hit **Search flights**.

If PerimeterX (captcha) blocks you, open the request once in RapidAPI's web console, solve the captcha, copy the `px` cookies into your browser—local development usually works after that.

---

## 🏗️ Build & preview

```bash
npm run build   # Production bundle → ./dist
npm run preview # Serve the production build locally
```

---

## 📜 Tech stack

- React 18 + Vite
- TypeScript (components are mixed TS/JS – allowJs enabled)
- Tailwind CSS 3
- TanStack Query

---

## 📄 Licence

MIT – free to use, modify, share.
