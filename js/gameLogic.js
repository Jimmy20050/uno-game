// Initialize deck
function createDeck() {
    const deck = [];
    
    colors.forEach(color => {
        deck.push({ color, value: '0', type: 'number' });
        
        for (let i = 1; i < values.length; i++) {
            deck.push({ color, value: values[i], type: values[i] === 'skip' || values[i] === 'reverse' || values[i] === 'draw2' ? 'action' : 'number' });
            deck.push({ color, value: values[i], type: values[i] === 'skip' || values[i] === 'reverse' || values[i] === 'draw2' ? 'action' : 'number' });
        }
    });
    
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
        if (gameState.discardPile.length > 1) {
            const topCard = gameState.discardPile.pop();
            gameState.deck = shuffleDeck(gameState.discardPile);
            gameState.discardPile = [topCard];
        } else {
            return null;
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
    
    if (card.type !== 'wild') {
        gameState.currentColor = card.color;
        gameState.currentValue = card.value;
    }
    
    handleSpecialCard(card, isPlayer);
    
    if (hand.length === 0) {
        endGame(isPlayer);
        return true;
    }
    
    if (isPlayer && hand.length === 1) {
        gameState.playerCalledUno = true;
        updateStatus("UNO!");
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
    
    if (aiAvatar) {
        const flagStr = aiCountry ? aiCountry.flag + ' ' : '';
        opponentNameEl.textContent = `${flagStr}${aiAvatar.emoji} ${aiAvatar.name}`;
    } else {
        opponentNameEl.textContent = '🤖 AI Opponent';
    }
    
    renderAll();
    updateTurnDisplay();
    
    const difficultyNames = { 1: t('easy'), 2: t('medium'), 3: t('hard') };
    updateStatus(`${t('gameStarted')} (${t('difficulty')}: ${difficultyNames[gameState.difficulty]})`);
}

// End game
function endGame(playerWon) {
    gameState.gameActive = false;
    
    const winMessage = document.getElementById('win-message');
    const winSubtitle = document.getElementById('win-subtitle');
    
    if (playerWon) {
        const reward = trophyRewards[gameState.difficulty] || 1;
        const newTotal = addTrophies(reward);
        const rank = getCurrentRank();
        winMessage.textContent = '🎉 You Win!';
        winSubtitle.textContent = `+${reward} 🏆 | Total: ${newTotal} 🏆 | Rank: ${rank.icon} ${rank.name}`;
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
