// Update turn display
function updateTurnDisplay() {
    currentTurnDisplay.textContent = gameState.currentTurn === 'player' ? t('yourTurn') : t('aiTurn');
}

// Update game status
function updateStatus(message) {
    gameStatusEl.textContent = message;
}

// Update color display
function updateColorDisplay() {
    colorDisplay.classList.remove('red', 'blue', 'green', 'yellow');
    if (gameState.currentColor) {
        colorDisplay.classList.add(gameState.currentColor);
    }
}

// Render player's hand
function renderPlayerHand() {
    playerCardsEl.innerHTML = '';
    
    gameState.playerHand.forEach((card, index) => {
        const cardEl = createCardElement(card, true);
        cardEl.onclick = () => handlePlayerCardClick(card);
        if (canPlayCard(card) && gameState.currentTurn === 'player') {
            cardEl.classList.add('playable');
        }
        playerCardsEl.appendChild(cardEl);
    });
    
    playerCardCount.textContent = `${gameState.playerHand.length} cards`;
}

// Render opponent's hand
function renderOpponentHand() {
    opponentCardsEl.innerHTML = '';
    
    gameState.aiHand.forEach(() => {
        const cardEl = document.createElement('div');
        cardEl.className = 'opponent-card';
        opponentCardsEl.appendChild(cardEl);
    });
    
    opponentCardCount.textContent = `${gameState.aiHand.length} cards`;
}

// Render discard pile
function renderDiscardPile() {
    const topCard = gameState.discardPile[gameState.discardPile.length - 1];
    if (topCard) {
        discardPileEl.innerHTML = '';
        const cardEl = createCardElement(topCard, false);
        cardEl.style.cursor = 'default';
        cardEl.style.transform = 'scale(1.1)';
        cardEl.style.transition = 'transform 0.3s ease';
        discardPileEl.appendChild(cardEl);
    }
}

// Create card element
function createCardElement(card, isInteractive) {
    const cardEl = document.createElement('div');
    cardEl.className = `card ${card.color}`;
    
    let displayValue = card.value;
    let displayType = card.type;
    
    if (card.value === 'skip') {
        displayValue = '🚫';
        displayType = 'Skip';
    } else if (card.value === 'reverse') {
        displayValue = '🔄';
        displayType = 'Reverse';
    } else if (card.value === 'draw2') {
        displayValue = '+2';
        displayType = 'Draw Two';
    } else if (card.value === 'wild') {
        displayValue = '🌈';
        displayType = 'Wild';
    } else if (card.value === 'wild4') {
        displayValue = '+4';
        displayType = 'Wild +4';
    }
    
    cardEl.innerHTML = `
        <div class="card-value">${displayValue}</div>
        <div class="card-type">${displayType}</div>
    `;
    
    return cardEl;
}

// Handle player card click
function handlePlayerCardClick(card) {
    if (gameState.currentTurn !== 'player' || !gameState.gameActive) return;
    
    if (!canPlayCard(card)) {
        updateStatus(t('cantPlayCard'));
        return;
    }
    
    gameState.playerCalledUno = false;
    
    if (card.type === 'wild') {
        showColorModal(card);
    } else {
        playCard(card, gameState.playerHand, true);
        renderAll();
        
        if (gameState.gameActive) {
            switchTurn();
        }
    }
}

// Show color selection modal
function showColorModal(card) {
    colorModal.classList.remove('hidden');
    
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.onclick = () => {
            const selectedColor = btn.dataset.color;
            gameState.currentColor = selectedColor;
            colorModal.classList.add('hidden');
            
            playCard(card, gameState.playerHand, true);
            renderAll();
            
            if (gameState.gameActive) {
                switchTurn();
            }
        };
    });
}

// Open counter UNO window
function openCounterUnoWindow() {
    gameState.counterUnoWindow = true;
    counterUnoBtn.classList.remove('hidden');
    
    gameState.counterUnoTimer = setTimeout(() => {
        closeCounterUnoWindow();
    }, 3000);
}

// Close counter UNO window
function closeCounterUnoWindow() {
    gameState.counterUnoWindow = false;
    counterUnoBtn.classList.add('hidden');
    if (gameState.counterUnoTimer) {
        clearTimeout(gameState.counterUnoTimer);
        gameState.counterUnoTimer = null;
    }
}

// Render all game elements
function renderAll() {
    renderPlayerHand();
    renderOpponentHand();
    renderDiscardPile();
    updateColorDisplay();
}
