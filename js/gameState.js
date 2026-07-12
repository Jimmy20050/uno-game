// Game State
let gameState = {
    deck: [],
    discardPile: [],
    playerHand: [],
    aiHand: [],
    currentTurn: 'player',
    direction: 1,
    currentColor: null,
    currentValue: null,
    gameActive: false,
    mustDrawCards: 0,
    playerCalledUno: false,
    difficulty: 2,
    counterUnoWindow: false,
    counterUnoTimer: null
};

// Card colors and values
const colors = ['red', 'blue', 'green', 'yellow'];
const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', 'reverse', 'draw2'];
const wildCards = ['wild', 'wild4'];

// DOM Elements
const menuScreen = document.getElementById('menu-screen');
const gameScreen = document.getElementById('game-screen');
const playersScreen = document.getElementById('players-screen');
const rankScreen = document.getElementById('rank-screen');
const playerCardsEl = document.getElementById('player-cards');
const opponentCardsEl = document.getElementById('opponent-cards');
const opponentNameEl = document.getElementById('opponent-name');
const drawDeckEl = document.getElementById('draw-deck');
const discardPileEl = document.getElementById('discard-pile');
const gameStatusEl = document.getElementById('game-status');
const currentTurnDisplay = document.getElementById('current-turn-display');
const directionDisplay = document.getElementById('direction-display');
const playerCardCount = document.getElementById('player-card-count');
const opponentCardCount = document.getElementById('opponent-card-count');
const unoBtn = document.getElementById('uno-btn');
const counterUnoBtn = document.getElementById('counter-uno-btn');
const colorDisplay = document.getElementById('color-display');
const colorModal = document.getElementById('color-modal');
const rulesModal = document.getElementById('rules-modal');
const winModal = document.getElementById('win-modal');
