window.addEventListener('load', function() {
  
  // Element Hooks
  const themeToggle = document.getElementById('themeToggle');
  const searchForm = document.getElementById('searchForm');
  const wordInput = document.getElementById('wordInput');
  const resultsContainer = document.getElementById('resultsContainer');
  const savedList = document.getElementById('savedList');
  const savedCount = document.getElementById('savedCount');

  // Load / Setup Saved Array
  let savedWords = [];
  const storedData = localStorage.getItem('savedWords');
  if (storedData) {
    savedWords = JSON.parse(storedData);
  }

  // Draw bookmarks lists on start
  updateSavedUI();

  // ===================================================================
  // Theme Switching System
  // ===================================================================
  themeToggle.addEventListener('click', function() {
    const isNightNow = document.body.classList.toggle('night');
    if (isNightNow) {
      localStorage.setItem('theme', 'night');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });

  if (localStorage.getItem('theme') === 'night') {
    document.body.classList.add('night');
  }

  // ===================================================================
  // Word Lookups
  // ===================================================================
  searchForm.addEventListener('submit', function(event) {
    event.preventDefault(); 
    const wordToSearch = wordInput.value.trim().toLowerCase();
    if (wordToSearch !== "") {
      searchWord(wordToSearch);
    }
  });

  // Setup helper chip click listener
  const chips = document.querySelectorAll('.chip[data-word]');
  for (let i = 0; i < chips.length; i++) {
    chips[i].addEventListener('click', function() {
      const selectedWord = chips[i].getAttribute('data-word');
      wordInput.value = selectedWord;
      searchWord(selectedWord);
    });
  }

  function searchWord(word) {
    resultsContainer.innerHTML = "<p style='text-align: center; opacity: 0.8;'>Searching dictionary...</p>";

    fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word)
      .then(function(response) {
        if (response.ok === false) {
          throw new Error("Word not found");
        }
        return response.json();
      })
      .then(function(data) {
        renderResult(data[0]);
      })
      .catch(function(error) {
        resultsContainer.innerHTML = "<p style='color: #E63946; text-align: center;'>Could not find: <strong>" + word + "</strong></p>";
      });
  }

  // ===================================================================
  // Render Dynamic Cards (Includes Audio & Save Buttons)
  // ===================================================================
  function renderResult(data) {
    const word = data.word;
    
    // Check bookmark state
    let isSaved = false;
    if (savedWords.indexOf(word) !== -1) {
      isSaved = true;
    }

    // Locate the first valid pronunciation audio file
    let audioUrl = "";
    if (data.phonetics) {
      for (let k = 0; k < data.phonetics.length; k++) {
        if (data.phonetics[k].audio && data.phonetics[k].audio !== "") {
          audioUrl = data.phonetics[k].audio;
          break; 
        }
      }
    }

    // Build the dynamic UI HTML
    let cardHTML = "";
    let cardClass = "entry-card";
    if (isSaved) {
      cardClass = "entry-card is-saved";
    }

    cardHTML += "<div class='" + cardClass + "'>";
    cardHTML += "  <div class='entry-head'>";
    cardHTML += "    <div>";
    cardHTML += "      <h2 style='margin: 0; text-transform: capitalize;'>" + word + "</h2>";
    
    // Append audio button only if sound URL is found
    if (audioUrl !== "") {
      cardHTML += "    <div class='entry-meta' style='margin-top: 8px;'>";
      cardHTML += "      <button id='playAudioBtn' class='audio-btn' data-src='" + audioUrl + "'>🔊</button>";
      cardHTML += "      <span style='opacity: 0.6; font-size: 0.95rem;'>Pronunciation</span>";
      cardHTML += "    </div>";
    }

    cardHTML += "    </div>";
    cardHTML += "    <button id='saveBtn' class='chip'>Save Word</button>";
    cardHTML += "  </div>";

    // Loop through definitions details
    for (let i = 0; i < data.meanings.length; i++) {
      const meaning = data.meanings[i];
      cardHTML += "  <div class='pos-block'>";
      cardHTML += "    <span class='pos-label'>" + meaning.partOfSpeech + "</span>";
      cardHTML += "    <ol class='def-list'>";

      for (let j = 0; j < meaning.definitions.length; j++) {
        if (j >= 2) break; 
        const def = meaning.definitions[j];
        cardHTML += "      <li>" + def.definition + "</li>";
      }

      cardHTML += "    </ol>";
      cardHTML += "  </div>";
    }

    cardHTML += "</div>";

    // Push into the results pane
    resultsContainer.innerHTML = cardHTML;

    // AUDIO CLICK PLAY ACTION
    const playAudioBtn = document.getElementById('playAudioBtn');
    if (playAudioBtn) {
      playAudioBtn.addEventListener('click', function() {
        const soundUrl = playAudioBtn.getAttribute('data-src');
        const audio = new Audio(soundUrl);
        audio.play();
      });
    }

    // SAVE/BOOKMARK CLICK ACTION
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener('click', function() {
      toggleSaveWord(word);
    });
  }

  // ===================================================================
  // Bookmark Drawer Controller
  // ===================================================================
  function toggleSaveWord(word) {
    const index = savedWords.indexOf(word);

    if (index === -1) {
      savedWords.push(word);
    } else {
      savedWords.splice(index, 1);
    }

    localStorage.setItem('savedWords', JSON.stringify(savedWords));
    searchWord(word);
    updateSavedUI();
  }

  function updateSavedUI() {
    savedCount.textContent = savedWords.length;
    savedList.innerHTML = "";

    if (savedWords.length === 0) {
      savedList.innerHTML = "<p style='opacity: 0.6;'>No saved entries yet.</p>";
      return;
    }

    for (let i = 0; i < savedWords.length; i++) {
      const savedWord = savedWords[i];

      const itemCard = document.createElement('div');
      itemCard.className = "saved-card";
      itemCard.innerHTML = "<span>" + savedWord + "</span><span class='remove'>&times;</span>";

      itemCard.addEventListener('click', function(event) {
        if (event.target.className === 'remove') {
          event.stopPropagation(); 
          toggleSaveWord(savedWord);
        } else {
          wordInput.value = savedWord;
          searchWord(savedWord);
        }
      });

      savedList.appendChild(itemCard);
    }
  }
});
function searchWord(word) {
  resultsContainer.innerHTML = "<p style='text-align: center; opacity: 0.8;'>Searching dictionary...</p>";

  // Right here! We take the API link and glue the user's searched word to the end of it
  fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word)
    .then(function(response) {
      if (response.ok === false) {
        throw new Error("Word not found");
      }
      return response.json(); // Converts the raw data from the internet into a readable JS object
    })
    .then(function(data) {
      renderResult(data[0]); // Sends that data to the screen
    })
    .catch(function(error) {
      resultsContainer.innerHTML = "<p style='color: #E63946; text-align: center;'>Could not find: <strong>" + word + "</strong></p>";
    });
}