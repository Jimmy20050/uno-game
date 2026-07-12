// Handle draw deck click
drawDeckEl.onclick = () => {
    if (!gameState.gameActive) return;
    if (gameState.currentTurn !== 'player') return;
    
    // Check if player has any playable cards
    const hasPlayable = gameState.playerHand.some(card => canPlayCard(card));
    if (hasPlayable) {
        updateStatus("You can't draw when you have a playable card!");
        return;
    }
    
    const drawnCard = drawCard();
    if (drawnCard) {
        gameState.playerHand.push(drawnCard);
        renderPlayerHand();
        
        if (canPlayCard(drawnCard)) {
            updateStatus("You drew a playable card! Turn passes.");
        } else {
            updateStatus("You drew a card. Turn passes.");
        }
        setTimeout(switchTurn, 1000);
    }
};

// UNO button click
unoBtn.onclick = () => {
    if (gameState.currentTurn === 'player') {
        gameState.playerCalledUno = true;
        unoBtn.classList.add('hidden');
        updateStatus("You call UNO!");
        closeCounterUnoWindow();
    }
};

// Event Listeners
document.getElementById('play-ai-btn').onclick = () => {
    if (!selectedAvatar) {
        const av = getRandomAvatar();
        selectAvatar(av.id);
    }
    pickAIAvatar();
    updateGameAvatars();
    menuScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    startGame();
};

document.getElementById('rules-btn').onclick = () => {
    rulesModal.classList.remove('hidden');
};

document.getElementById('close-rules-btn').onclick = () => {
    rulesModal.classList.add('hidden');
};

document.getElementById('back-to-menu-btn').onclick = backToMenu;

document.getElementById('play-again-btn').onclick = resetGame;

document.getElementById('back-to-menu-from-win-btn').onclick = backToMenu;

// Difficulty button event listeners
document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        gameState.difficulty = parseInt(btn.dataset.difficulty);
        localStorage.setItem('uno_difficulty', btn.dataset.difficulty);
    };
});

// Set default difficulty (Medium)
document.querySelector('.difficulty-btn[data-difficulty="2"]').classList.add('active');

// Load saved difficulty
const savedDiff = localStorage.getItem('uno_difficulty');
if (savedDiff) {
    gameState.difficulty = parseInt(savedDiff);
    document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
    const diffBtn = document.querySelector(`.difficulty-btn[data-difficulty="${savedDiff}"]`);
    if (diffBtn) diffBtn.classList.add('active');
}

// Language selector event listener
document.getElementById('language-selector').addEventListener('change', (e) => {
    switchLanguage(e.target.value);
});

// Background selector event listeners
document.querySelectorAll('.bg-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.bg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const bg = btn.dataset.bg;
        document.body.className = '';
        document.body.classList.add('bg-' + bg);
        localStorage.setItem('uno_background', bg);
    };
});

// Load saved language preference
const savedLanguage = localStorage.getItem('uno_language');
if (savedLanguage && translations[savedLanguage]) {
    currentLanguage = savedLanguage;
    document.getElementById('language-selector').value = savedLanguage;
    updateAllText();
}

// Load saved background preference
const savedBg = localStorage.getItem('uno_background');
if (savedBg) {
    document.body.className = '';
    document.body.classList.add('bg-' + savedBg);
    document.querySelectorAll('.bg-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector(`.bg-btn[data-bg="${savedBg}"]`);
    if (activeBtn) activeBtn.classList.add('active');
} else {
    document.body.classList.add('bg-default');
}

// Close modals on outside click
colorModal.onclick = (e) => {
    if (e.target === colorModal) colorModal.classList.add('hidden');
};

rulesModal.onclick = (e) => {
    if (e.target === rulesModal) rulesModal.classList.add('hidden');
};

winModal.onclick = (e) => {
    if (e.target === winModal) winModal.classList.add('hidden');
};

// Initialize music player
initMusicPlayer();

// Load saved avatar preference
const savedAvatar = localStorage.getItem('uno_avatar');
if (savedAvatar) {
    const av = getAvatarById(savedAvatar);
    if (av) selectedAvatar = av;
}

// Load saved country preference
const savedCountry = localStorage.getItem('uno_country');
if (savedCountry) {
    const co = getCountryByCode(savedCountry);
    if (co) selectedCountry = co;
}

// --- Navigation Menu ---
const navMenuBtn = document.getElementById('nav-menu-btn');
const navDropdown = document.getElementById('nav-dropdown');

navMenuBtn.onclick = (e) => {
    e.stopPropagation();
    navDropdown.classList.toggle('hidden');
};

document.addEventListener('click', (e) => {
    if (!navDropdown.contains(e.target) && e.target !== navMenuBtn) {
        navDropdown.classList.add('hidden');
    }
});

function showScreen(screenEl) {
    menuScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    playersScreen.classList.add('hidden');
    rankScreen.classList.add('hidden');
    screenEl.classList.remove('hidden');
    navDropdown.classList.add('hidden');
}

function navigateTo(navTarget) {
    switch (navTarget) {
        case 'home':
            gameState.gameActive = false;
            showScreen(menuScreen);
            break;
        case 'players':
            renderPlayersPage();
            showScreen(playersScreen);
            break;
        case 'rank':
            renderRankPage();
            showScreen(rankScreen);
            break;
        case 'quit':
            gameState.gameActive = false;
            showScreen(menuScreen);
            winModal.classList.add('hidden');
            colorModal.classList.add('hidden');
            rulesModal.classList.add('hidden');
            break;
    }
}

document.querySelectorAll('.nav-dropdown-item').forEach(btn => {
    btn.onclick = () => navigateTo(btn.dataset.nav);
});
