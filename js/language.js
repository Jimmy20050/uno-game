let currentLanguage = 'en';

// Function to get translation
function t(key) {
    return translations[currentLanguage][key] || translations['en'][key] || key;
}

// Function to switch language
function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('uno_language', lang);
    updateAllText();
}

// Function to update all text on the page
function updateAllText() {
    // Update menu screen text
    document.querySelector('.game-title').textContent = t('gameTitle');
    document.querySelector('.game-subtitle').textContent = t('gameSubtitle');
    
    // Update buttons
    document.querySelector('#play-ai-btn .btn-icon').nextSibling.textContent = ' ' + t('playVsAI');
    document.querySelector('#rules-btn .btn-icon').nextSibling.textContent = ' ' + t('howToPlay');
    
    // Update difficulty section
    document.querySelector('.difficulty-label').textContent = t('selectDifficulty');
    document.querySelector('.difficulty-btn[data-difficulty="1"]').textContent = t('easy');
    document.querySelector('.difficulty-btn[data-difficulty="2"]').textContent = t('medium');
    document.querySelector('.difficulty-btn[data-difficulty="3"]').textContent = t('hard');
    
    // Update language section
    document.querySelector('.language-label').textContent = t('language');
    
    // Update game screen elements
    document.querySelector('#back-to-menu-btn').textContent = '← ' + t('menu');
    document.querySelector('#uno-btn').textContent = t('uno');
    if (aiAvatar) {
        const flagStr = aiCountry ? aiCountry.flag + ' ' : '';
        document.querySelector('#opponent-name').textContent = `${flagStr}${aiAvatar.emoji} ${aiAvatar.name}`;
    } else {
        document.querySelector('#opponent-name').textContent = '🤖 ' + t('aiOpponent');
    }
    if (selectedAvatar) {
        const flagStr = selectedCountry ? selectedCountry.flag + ' ' : '';
        document.querySelector('.player-name').textContent = `${flagStr}${selectedAvatar.emoji} ${selectedAvatar.name}`;
    } else {
        document.querySelector('.player-name').textContent = '👤 ' + t('you');
    }
    document.querySelector('#draw-deck .deck-label').textContent = t('draw');
    document.querySelector('#discard-pile .card-placeholder').textContent = t('discard');
    
    // Update modals
    document.querySelector('#color-modal h2').textContent = t('chooseColor');
    document.querySelector('#rules-modal h2').textContent = t('howToPlay');
    document.querySelector('#close-rules-btn').textContent = t('gotIt');
    document.querySelector('#play-again-btn').textContent = t('playAgain');
    document.querySelector('#back-to-menu-from-win-btn').textContent = t('mainMenu');
    
    // Update rules content
    updateRulesContent();
    
    // Update turn display if game is active
    if (gameState.gameActive) {
        updateTurnDisplay();
    }
}

// Function to update rules content
function updateRulesContent() {
    const rulesText = document.querySelector('.rules-text');
    if (!rulesText) return;
    
    rulesText.innerHTML = `
        <h3>🎯 ${t('objective')}</h3>
        <p>${t('beFirst')}</p>
        
        <h3>🃏 ${t('cardTypes')}</h3>
        <ul>
            <li><strong>${t('numberCards')}</strong></li>
            <li><strong>${t('skip')}</strong></li>
            <li><strong>${t('reverse')}</strong></li>
            <li><strong>${t('drawTwo')}</strong></li>
            <li><strong>${t('wild')}</strong></li>
            <li><strong>${t('wildFour')}</strong></li>
        </ul>
        
        <h3>🎮 ${t('gameplay')}</h3>
        <ul>
            <li>${t('matchCard')}</li>
            <li>${t('drawCantPlay')}</li>
            <li>${t('shoutUno')}</li>
            <li>${t('firstToEmpty')}</li>
        </ul>
    `;
}
