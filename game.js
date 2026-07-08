// Game State
let gameState = {
    deck: [],
    discardPile: [],
    playerHand: [],
    aiHand: [],
    currentTurn: 'player', // 'player' or 'ai'
    direction: 1, // 1 for clockwise, -1 for counter-clockwise
    currentColor: null,
    currentValue: null,
    gameActive: false,
    mustDrawCards: 0,
    playerCalledUno: false
};

// Card colors and values
const colors = ['red', 'blue', 'green', 'yellow'];
const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', 'reverse', 'draw2'];
const wildCards = ['wild', 'wild4'];

// DOM Elements
const menuScreen = document.getElementById('menu-screen');
const gameScreen = document.getElementById('game-screen');
const playerCardsEl = document.getElementById('player-cards');
const opponentCardsEl = document.getElementById('opponent-cards');
const discardPileEl = document.getElementById('discard-pile');
const drawDeckEl = document.getElementById('draw-deck');
const gameStatusEl = document.getElementById('game-status');
const currentTurnDisplay = document.getElementById('current-turn-display');
const directionDisplay = document.getElementById('direction-display');
const playerCardCount = document.getElementById('player-card-count');
const opponentCardCount = document.getElementById('opponent-card-count');
const unoBtn = document.getElementById('uno-btn');
const colorModal = document.getElementById('color-modal');
const rulesModal = document.getElementById('rules-modal');
const winModal = document.getElementById('win-modal');

// Initialize deck
function createDeck() {
    const deck = [];
    
    // Add number cards and action cards
    colors.forEach(color => {
        // One 0 card per color
        deck.push({ color, value: '0', type: 'number' });
        
        // Two of each 1-9 and action cards
        for (let i = 1; i < values.length; i++) {
            deck.push({ color, value: values[i], type: values[i] === 'skip' || values[i] === 'reverse' || values[i] === 'draw2' ? 'action' : 'number' });
            deck.push({ color, value: values[i], type: values[i] === 'skip' || values[i] === 'reverse' || values[i] === 'draw2' ? 'action' : 'number' });
        }
    });
    
    // Add wild cards (4 of each)
    for (let i = 0; i < 4; i++) {
        deck.push({ color: 'wild', value: 'wild', type: 'wild' });
        deck.push({ color: 'wild', value: 'wild4', type: 'wild' });
    }
    
    return shuffleDeck(deck);
}

// Shuffle deck
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// Draw card from deck
function drawCard() {
    if (gameState.deck.length === 0) {
        // Reshuffle discard pile into deck
        if (gameState.discardPile.length > 1) {
            const topCard = gameState.discardPile.pop();
            gameState.deck = shuffleDeck(gameState.discardPile);
            gameState.discardPile = [topCard];
        } else {
            return null; // No cards available
        }
    }
    return gameState.deck.pop();
}

// Deal cards
function dealCards() {
    gameState.playerHand = [];
    gameState.aiHand = [];
    
    for (let i = 0; i < 7; i++) {
        gameState.playerHand.push(drawCard());
        gameState.aiHand.push(drawCard());
    }
    
    // Start discard pile with a number card (not wild)
    let startCard;
    do {
        startCard = drawCard();
        if (startCard.type === 'wild') {
            gameState.deck.unshift(startCard);
            gameState.deck = shuffleDeck(gameState.deck);
        }
    } while (startCard.type === 'wild');
    
    gameState.discardPile = [startCard];
    gameState.currentColor = startCard.color;
    gameState.currentValue = startCard.value;
}

// Check if card can be played
function canPlayCard(card) {
    if (card.type === 'wild') return true;
    if (card.color === gameState.currentColor) return true;
    if (card.value === gameState.currentValue) return true;
    return false;
}

// Play a card
function playCard(card, hand, isPlayer) {
    const cardIndex = hand.findIndex(c => c === card);
    if (cardIndex === -1) return false;
    
    hand.splice(cardIndex, 1);
    gameState.discardPile.push(card);
    
    // Update current color and value
    if (card.type !== 'wild') {
        gameState.currentColor = card.color;
        gameState.currentValue = card.value;
    }
    
    // Handle special cards
    handleSpecialCard(card, isPlayer);
    
    // Check for win
    if (hand.length === 0) {
        endGame(isPlayer);
        return true;
    }
    
    // Show UNO button if player has 1 card
    if (isPlayer && hand.length === 1) {
        unoBtn.classList.remove('hidden');
    } else {
        unoBtn.classList.add('hidden');
    }
    
    return true;
}

// Handle special card effects
function handleSpecialCard(card, isPlayer) {
    const opponent = isPlayer ? 'ai' : 'player';
    
    switch (card.value) {
        case 'skip':
            gameState.currentTurn = opponent;
            updateStatus(`${isPlayer ? 'AI' : 'You'} got skipped!`);
            break;
        case 'reverse':
            gameState.direction *= -1;
            directionDisplay.textContent = gameState.direction === 1 ? '→' : '←';
            updateStatus('Direction reversed!');
            break;
        case 'draw2':
            gameState.mustDrawCards = 2;
            updateStatus(`${isPlayer ? 'AI' : 'You'} must draw 2 cards!`);
            break;
        case 'wild4':
            gameState.mustDrawCards = 4;
            updateStatus(`${isPlayer ? 'AI' : 'You'} must draw 4 cards!`);
            break;
    }
}

// Draw cards for player
function drawCards(count, isPlayer) {
    const hand = isPlayer ? gameState.playerHand : gameState.aiHand;
    for (let i = 0; i < count; i++) {
        const card = drawCard();
        if (card) hand.push(card);
    }
    gameState.mustDrawCards = 0;
}

// Switch turn
function switchTurn() {
    gameState.currentTurn = gameState.currentTurn === 'player' ? 'ai' : 'player';
    updateTurnDisplay();
    
    if (gameState.currentTurn === 'ai') {
        setTimeout(aiTurn, 1000);
    }
}

// Update turn display
function updateTurnDisplay() {
    currentTurnDisplay.textContent = gameState.currentTurn === 'player' ? "Your Turn" : "AI's Turn";
}

// Update game status
function updateStatus(message) {
    gameStatusEl.textContent = message;
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
        updateStatus("You can't play this card!");
        return;
    }
    
    // Check UNO call
    if (gameState.playerHand.length === 2 && !gameState.playerCalledUno) {
        // Player forgot to call UNO - penalty
        updateStatus("You forgot to call UNO! Draw 2 cards!");
        drawCards(2, true);
        renderPlayerHand();
    }
    
    gameState.playerCalledUno = false;
    
    if (card.type === 'wild') {
        // Show color selection modal
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

// Handle draw deck click
drawDeckEl.onclick = () => {
    if (gameState.currentTurn !== 'player' || !gameState.gameActive) return;
    
    const drawnCard = drawCard();
    if (drawnCard) {
        gameState.playerHand.push(drawnCard);
        renderPlayerHand();
        
        // Check if drawn card can be played
        if (canPlayCard(drawnCard)) {
            updateStatus("You drew a playable card!");
        } else {
            updateStatus("You drew a card. Pass turn.");
            setTimeout(switchTurn, 1000);
        }
    }
};

// AI Turn
function aiTurn() {
    if (!gameState.gameActive || gameState.currentTurn !== 'ai') return;
    
    // Handle must draw cards
    if (gameState.mustDrawCards > 0) {
        drawCards(gameState.mustDrawCards, false);
        renderOpponentHand();
        switchTurn();
        return;
    }
    
    // Find playable cards
    const playableCards = gameState.aiHand.filter(card => canPlayCard(card));
    
    if (playableCards.length > 0) {
        // AI strategy: prioritize action cards, then match color, then wild cards
        playableCards.sort((a, b) => {
            if (a.type === 'wild' && b.type !== 'wild') return 1;
            if (a.type !== 'wild' && b.type === 'wild') return -1;
            if (a.type === 'action' && b.type !== 'action') return -1;
            if (a.type !== 'action' && b.type === 'action') return 1;
            return 0;
        });
        
        const cardToPlay = playableCards[0];
        
        if (cardToPlay.type === 'wild') {
            // AI chooses most common color in hand
            const colorCounts = { red: 0, blue: 0, green: 0, yellow: 0 };
            gameState.aiHand.forEach(card => {
                if (card.color !== 'wild') colorCounts[card.color]++;
            });
            const bestColor = Object.entries(colorCounts).sort((a, b) => b[1] - a[1])[0][0];
            gameState.currentColor = bestColor;
        }
        
        playCard(cardToPlay, gameState.aiHand, false);
        renderAll();
        
        // AI calls UNO
        if (gameState.aiHand.length === 1) {
            updateStatus("AI calls UNO!");
        }
        
        if (gameState.gameActive) {
            switchTurn();
        }
    } else {
        // AI draws a card
        const drawnCard = drawCard();
        if (drawnCard) {
            gameState.aiHand.push(drawnCard);
            renderOpponentHand();
            updateStatus("AI drew a card");
        }
        
        if (gameState.gameActive) {
            switchTurn();
        }
    }
}

// UNO button click
unoBtn.onclick = () => {
    gameState.playerCalledUno = true;
    unoBtn.classList.add('hidden');
    updateStatus("UNO!");
};

// Render all game elements
function renderAll() {
    renderPlayerHand();
    renderOpponentHand();
    renderDiscardPile();
}

// Start game
function startGame() {
    gameState.deck = createDeck();
    dealCards();
    gameState.currentTurn = 'player';
    gameState.direction = 1;
    gameState.gameActive = true;
    gameState.mustDrawCards = 0;
    gameState.playerCalledUno = false;
    
    directionDisplay.textContent = '→';
    unoBtn.classList.add('hidden');
    
    renderAll();
    updateTurnDisplay();
    updateStatus("Game started! Your turn.");
}

// End game
function endGame(playerWon) {
    gameState.gameActive = false;
    
    const winMessage = document.getElementById('win-message');
    const winSubtitle = document.getElementById('win-subtitle');
    
    if (playerWon) {
        winMessage.textContent = '🎉 You Win!';
        winSubtitle.textContent = 'Congratulations!';
    } else {
        winMessage.textContent = '😢 AI Wins!';
        winSubtitle.textContent = 'Better luck next time!';
    }
    
    winModal.classList.remove('hidden');
}

// Reset game
function resetGame() {
    winModal.classList.add('hidden');
    startGame();
}

// Back to menu
function backToMenu() {
    gameState.gameActive = false;
    gameScreen.classList.add('hidden');
    menuScreen.classList.remove('hidden');
    winModal.classList.add('hidden');
}

// Event Listeners
document.getElementById('play-ai-btn').onclick = () => {
    menuScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    startGame();
};

document.getElementById('play-multiplayer-btn').onclick = () => {
    alert('Multiplayer feature coming soon! For now, play against the AI.');
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
