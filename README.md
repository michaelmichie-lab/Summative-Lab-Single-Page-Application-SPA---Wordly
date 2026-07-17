# Wordly Dictionary SPA

A simple, fast, and responsive Single Page Application (SPA) that lets you look up English words, view definitions, listen to audio pronunciations, and save your favorites.

---

##  Features
*   **Word Search:** Real-time definitions, parts of speech, usage examples, and synonyms.
*   **Audio Pronunciation:** Play native audio recordings (when available) along with phonetic text.
*   **Favorites Catalog:** Save words to a bookmarked list that stays saved even after refreshing, using `localStorage`.
*   **Dynamic Theme:** A quick toggle button to switch between clean light mode and dark mode.
*   **Error Handling:** Displays clear messages if a word is misspelled or not found.

---

##  Technologies Used
*   HTML5, CSS3, and Vanilla JavaScript
*   **Free Dictionary API:** `https://api.dictionaryapi.dev/api/v2/entries/en/{word}`
*   **localStorage:** For saving your favorite words and theme preferences.

---

##  Project Structure
```text
wordly/
├── assets/
│   └── screenshot.png       # App screenshot
├── css/
│   └── styles.css            # Styles for light, dark, and layout
├── js/
│   └── index.js             # API fetching and storage logic
├── index.html               # Main SPA structure
└── README.md                # This file
