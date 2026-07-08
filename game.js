// Game State
let gameState = {
    deck: [],
    discardPile: [],
    playerHand: [],
    aiHand: [],
    currentTurn: 'player', // 'player' or 'ai' (or 'player2' for multiplayer)
    direction: 1, // 1 for clockwise, -1 for counter-clockwise
    currentColor: null,
    currentValue: null,
    gameActive: false,
    mustDrawCards: 0,
    playerCalledUno: false,
    difficulty: 2, // 1 = Easy, 2 = Medium, 3 = Hard
    gameMode: 'ai', // 'ai' or 'multiplayer'
    player2CalledUno: false
};

// Card colors and values
const colors = ['red', 'blue', 'green', 'yellow'];
const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', 'reverse', 'draw2'];
const wildCards = ['wild', 'wild4'];

// User Management
let currentUser = null;

// Simple hash function for passwords (not secure, but functional for demo)
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}

// Get users from localStorage
function getUsers() {
    const users = localStorage.getItem('uno_users');
    return users ? JSON.parse(users) : {};
}

// Save users to localStorage
function saveUsers(users) {
    localStorage.setItem('uno_users', JSON.stringify(users));
}

// Register new user
function registerUser(username, password) {
    const users = getUsers();
    
    if (users[username]) {
        return { success: false, message: 'Username already exists' };
    }
    
    users[username] = {
        password: simpleHash(password),
        wins: 0,
        losses: 0
    };
    
    saveUsers(users);
    return { success: true, message: 'Account created successfully' };
}

// Login user
function loginUser(username, password) {
    const users = getUsers();
    
    if (!users[username]) {
        return { success: false, message: 'User not found' };
    }
    
    if (users[username].password !== simpleHash(password)) {
        return { success: false, message: 'Incorrect password' };
    }
    
    currentUser = username;
    localStorage.setItem('uno_current_user', username);
    return { success: true, message: 'Login successful' };
}

// Logout user
function logoutUser() {
    currentUser = null;
    localStorage.removeItem('uno_current_user');
}

// Check if user is logged in
function checkLoggedIn() {
    const savedUser = localStorage.getItem('uno_current_user');
    if (savedUser) {
        currentUser = savedUser;
        return true;
    }
    return false;
}

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const menuScreen = document.getElementById('menu-screen');
const gameScreen = document.getElementById('game-screen');
const playerCardsEl = document.getElementById('player-cards');
const opponentCardsEl = document.getElementById('opponent-cards');
const opponentNameEl = document.getElementById('opponent-name');

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
    gameState.aiHand = []; // This will be player2 in multiplayer
    
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
    if (gameState.gameMode === 'multiplayer') {
        // Multiplayer: switch between player and player2
        gameState.currentTurn = gameState.currentTurn === 'player' ? 'player2' : 'player';
    } else {
        // AI mode: switch between player and AI
        gameState.currentTurn = gameState.currentTurn === 'player' ? 'ai' : 'player';
    }
    
    updateTurnDisplay();
    
    if (gameState.currentTurn === 'ai' && gameState.gameMode === 'ai') {
        setTimeout(aiTurn, 1000);
    }
}

// Update turn display
function updateTurnDisplay() {
    if (gameState.gameMode === 'multiplayer') {
        currentTurnDisplay.textContent = gameState.currentTurn === 'player' ? "Player 1's Turn" : "Player 2's Turn";
    } else {
        currentTurnDisplay.textContent = gameState.currentTurn === 'player' ? "Your Turn" : "AI's Turn";
    }
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
    
    if (gameState.gameMode === 'multiplayer') {
        // In multiplayer, show player2's cards face up (with a different style)
        gameState.aiHand.forEach((card, index) => {
            const cardEl = createCardElement(card, true);
            cardEl.onclick = () => handlePlayer2CardClick(card);
            if (canPlayCard(card) && gameState.currentTurn === 'player2') {
                cardEl.classList.add('playable');
            }
            opponentCardsEl.appendChild(cardEl);
        });
    } else {
        // In AI mode, show card backs
        gameState.aiHand.forEach(() => {
            const cardEl = document.createElement('div');
            cardEl.className = 'opponent-card';
            opponentCardsEl.appendChild(cardEl);
        });
    }
    
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

// Handle player 2 card click (multiplayer)
function handlePlayer2CardClick(card) {
    if (gameState.currentTurn !== 'player2' || !gameState.gameActive) return;
    
    if (!canPlayCard(card)) {
        updateStatus("Player 2 can't play this card!");
        return;
    }
    
    // Check UNO call
    if (gameState.aiHand.length === 2 && !gameState.player2CalledUno) {
        // Player 2 forgot to call UNO - penalty
        updateStatus("Player 2 forgot to call UNO! Draw 2 cards!");
        drawCards(2, false);
        renderOpponentHand();
    }
    
    gameState.player2CalledUno = false;
    
    if (card.type === 'wild') {
        // Show color selection modal for player 2
        showColorModalForPlayer2(card);
    } else {
        playCard(card, gameState.aiHand, false);
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

// Show color selection modal for player 2
function showColorModalForPlayer2(card) {
    colorModal.classList.remove('hidden');
    
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.onclick = () => {
            const selectedColor = btn.dataset.color;
            gameState.currentColor = selectedColor;
            colorModal.classList.add('hidden');
            
            playCard(card, gameState.aiHand, false);
            renderAll();
            
            if (gameState.gameActive) {
                switchTurn();
            }
        };
    });
}

// Handle draw deck click
drawDeckEl.onclick = () => {
    if (!gameState.gameActive) return;
    
    // Check if it's the current player's turn (player or player2 in multiplayer)
    const isPlayerTurn = gameState.currentTurn === 'player';
    const isPlayer2Turn = gameState.currentTurn === 'player2';
    
    if (!isPlayerTurn && !isPlayer2Turn) return;
    
    const hand = isPlayerTurn ? gameState.playerHand : gameState.aiHand;
    const playerName = isPlayerTurn ? 'You' : 'Player 2';
    
    const drawnCard = drawCard();
    if (drawnCard) {
        hand.push(drawnCard);
        
        if (isPlayerTurn) {
            renderPlayerHand();
        } else {
            renderOpponentHand();
        }
        
        // Check if drawn card can be played
        if (canPlayCard(drawnCard)) {
            updateStatus(`${playerName} drew a playable card!`);
        } else {
            updateStatus(`${playerName} drew a card. Pass turn.`);
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
        let cardToPlay;
        
        // Different strategies based on difficulty
        if (gameState.difficulty === 1) {
            // Easy: Random choice
            cardToPlay = playableCards[Math.floor(Math.random() * playableCards.length)];
        } else if (gameState.difficulty === 2) {
            // Medium: Prioritize action cards, then match color, then wild cards
            playableCards.sort((a, b) => {
                if (a.type === 'wild' && b.type !== 'wild') return 1;
                if (a.type !== 'wild' && b.type === 'wild') return -1;
                if (a.type === 'action' && b.type !== 'action') return -1;
                if (a.type !== 'action' && b.type === 'action') return 1;
                return 0;
            });
            cardToPlay = playableCards[0];
        } else {
            // Hard: Optimal strategy - save wild cards for emergencies, use action cards strategically
            playableCards.sort((a, b) => {
                // Prioritize action cards that hurt player
                if (a.value === 'wild4' && b.value !== 'wild4') return 1;
                if (a.value !== 'wild4' && b.value === 'wild4') return -1;
                if (a.value === 'draw2' && b.value !== 'draw2') return -1;
                if (a.value !== 'draw2' && b.value === 'draw2') return 1;
                if (a.value === 'skip' && b.value !== 'skip') return -1;
                if (a.value !== 'skip' && b.value === 'skip') return 1;
                // Match color to keep options open
                if (a.color === gameState.currentColor && b.color !== gameState.currentColor) return -1;
                if (a.color !== gameState.currentColor && b.color === gameState.currentColor) return 1;
                // Save wild cards
                if (a.type === 'wild' && b.type !== 'wild') return 1;
                if (a.type !== 'wild' && b.type === 'wild') return -1;
                return 0;
            });
            cardToPlay = playableCards[0];
        }
        
        if (cardToPlay.type === 'wild') {
            // AI chooses color based on difficulty
            if (gameState.difficulty === 1) {
                // Easy: Random color
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                gameState.currentColor = randomColor;
            } else if (gameState.difficulty === 2) {
                // Medium: Most common color in hand
                const colorCounts = { red: 0, blue: 0, green: 0, yellow: 0 };
                gameState.aiHand.forEach(card => {
                    if (card.color !== 'wild') colorCounts[card.color]++;
                });
                const bestColor = Object.entries(colorCounts).sort((a, b) => b[1] - a[1])[0][0];
                gameState.currentColor = bestColor;
            } else {
                // Hard: Choose color AI has most of AND player likely doesn't
                const colorCounts = { red: 0, blue: 0, green: 0, yellow: 0 };
                gameState.aiHand.forEach(card => {
                    if (card.color !== 'wild') colorCounts[card.color]++;
                });
                const bestColor = Object.entries(colorCounts).sort((a, b) => b[1] - a[1])[0][0];
                gameState.currentColor = bestColor;
            }
        }
        
        playCard(cardToPlay, gameState.aiHand, false);
        renderAll();
        
        // AI calls UNO
        if (gameState.aiHand.length === 1) {
            // Easy difficulty might forget to call UNO
            if (gameState.difficulty === 1 && Math.random() > 0.7) {
                updateStatus("AI forgot to call UNO!");
            } else {
                updateStatus("AI calls UNO!");
            }
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
            
            // Hard difficulty: try to play drawn card if possible
            if (gameState.difficulty === 3 && canPlayCard(drawnCard)) {
                setTimeout(() => {
                    if (gameState.currentTurn === 'ai' && gameState.gameActive) {
                        aiTurn();
                    }
                }, 500);
            }
        }
        
        if (gameState.gameActive) {
            switchTurn();
        }
    }
}

// UNO button click
unoBtn.onclick = () => {
    if (gameState.currentTurn === 'player') {
        gameState.playerCalledUno = true;
        unoBtn.classList.add('hidden');
        updateStatus("Player 1 calls UNO!");
    } else if (gameState.currentTurn === 'player2' && gameState.gameMode === 'multiplayer') {
        gameState.player2CalledUno = true;
        unoBtn.classList.add('hidden');
        updateStatus("Player 2 calls UNO!");
    }
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
    gameState.player2CalledUno = false;
    
    directionDisplay.textContent = '→';
    unoBtn.classList.add('hidden');
    
    // Update opponent name based on game mode
    if (gameState.gameMode === 'multiplayer') {
        opponentNameEl.textContent = '👤 Player 2';
    } else {
        opponentNameEl.textContent = '🤖 AI Opponent';
    }
    
    renderAll();
    updateTurnDisplay();
    
    if (gameState.gameMode === 'multiplayer') {
        updateStatus("Game started! Player 1's turn.");
    } else {
        const difficultyNames = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };
        updateStatus(`Game started! Difficulty: ${difficultyNames[gameState.difficulty]}. Your turn.`);
    }
}

// End game
function endGame(playerWon) {
    gameState.gameActive = false;
    
    const winMessage = document.getElementById('win-message');
    const winSubtitle = document.getElementById('win-subtitle');
    
    if (gameState.gameMode === 'multiplayer') {
        if (playerWon) {
            winMessage.textContent = '🎉 Player 1 Wins!';
            winSubtitle.textContent = 'Congratulations!';
        } else {
            winMessage.textContent = '🎉 Player 2 Wins!';
            winSubtitle.textContent = 'Well played!';
        }
    } else {
        if (playerWon) {
            winMessage.textContent = '🎉 You Win!';
            winSubtitle.textContent = 'Congratulations!';
        } else {
            winMessage.textContent = '😢 AI Wins!';
            winSubtitle.textContent = 'Better luck next time!';
        }
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
    gameState.gameMode = 'ai';
    menuScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    startGame();
};

document.getElementById('play-multiplayer-btn').onclick = () => {
    gameState.gameMode = 'multiplayer';
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
        // Remove active class from all buttons
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        // Set difficulty
        gameState.difficulty = parseInt(btn.dataset.difficulty);
    };
});

// Set default difficulty (Medium)
document.querySelector('.difficulty-btn[data-difficulty="2"]').classList.add('active');

// Authentication event listeners
document.getElementById('show-signup').onclick = (e) => {
    e.preventDefault();
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
};

document.getElementById('show-login').onclick = (e) => {
    e.preventDefault();
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
};

document.getElementById('login-btn').onclick = () => {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    if (!username || !password) {
        alert('Please enter username and password');
        return;
    }
    
    const result = loginUser(username, password);
    
    if (result.success) {
        document.getElementById('current-username').textContent = username;
        loginScreen.classList.add('hidden');
        menuScreen.classList.remove('hidden');
    } else {
        alert(result.message);
    }
};

document.getElementById('signup-btn').onclick = () => {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    
    if (!username || !password || !confirm) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password !== confirm) {
        alert('Passwords do not match');
        return;
    }
    
    if (password.length < 4) {
        alert('Password must be at least 4 characters');
        return;
    }
    
    const result = registerUser(username, password);
    
    if (result.success) {
        alert(result.message);
        document.getElementById('signup-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('signup-username').value = '';
        document.getElementById('signup-password').value = '';
        document.getElementById('signup-confirm').value = '';
    } else {
        alert(result.message);
    }
};

document.getElementById('logout-btn').onclick = () => {
    logoutUser();
    menuScreen.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
};

// Check if user is already logged in on page load
if (checkLoggedIn()) {
    document.getElementById('current-username').textContent = currentUser;
    loginScreen.classList.add('hidden');
    menuScreen.classList.remove('hidden');
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
