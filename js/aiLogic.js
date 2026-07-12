// AI Turn
function aiTurn() {
    if (!gameState.gameActive || gameState.currentTurn !== 'ai') return;
    
    // Handle must draw cards
    if (gameState.mustDrawCards > 0) {
        drawCards(gameState.mustDrawCards, false);
        renderOpponentHand();
        updateStatus("AI drew " + gameState.mustDrawCards + " cards!");
        switchTurn();
        return;
    }
    
    // Find playable cards
    const playableCards = gameState.aiHand.filter(card => canPlayCard(card));
    
    if (playableCards.length > 0) {
        let cardToPlay;
        
        if (gameState.difficulty === 1) {
            // === EASY ===
            // 60% chance to play randomly, 40% chance to pick first available
            if (Math.random() < 0.6) {
                cardToPlay = playableCards[Math.floor(Math.random() * playableCards.length)];
            } else {
                cardToPlay = playableCards[0];
            }
        } else if (gameState.difficulty === 2) {
            // === MEDIUM ===
            // Prioritize action cards, then number cards, save wild cards
            playableCards.sort((a, b) => {
                if (a.type === 'wild' && b.type !== 'wild') return 1;
                if (a.type !== 'wild' && b.type === 'wild') return -1;
                if (a.type === 'action' && b.type !== 'action') return -1;
                if (a.type !== 'action' && b.type === 'action') return 1;
                return 0;
            });
            cardToPlay = playableCards[0];
        } else {
            // === HARD ===
            // Strategic: prioritize cards that hurt the player most
            // 1. Play +4 when player has few cards (finish them off or stall)
            // 2. Play +2 to force draws
            // 3. Play skip to deny player's turn
            // 4. Play reverse (less useful in 2-player but still skips)
            // 5. Play matching color to preserve other colors
            // 6. Save wild cards for when no other option
            const playerCardCount = gameState.playerHand.length;
            
            playableCards.sort((a, b) => {
                // If player has few cards, prioritize disruptive cards
                if (playerCardCount <= 3) {
                    if (a.value === 'wild4' && b.value !== 'wild4') return -1;
                    if (a.value !== 'wild4' && b.value === 'wild4') return 1;
                    if (a.value === 'draw2' && b.value !== 'draw2') return -1;
                    if (a.value !== 'draw2' && b.value === 'draw2') return 1;
                    if (a.value === 'skip' && b.value !== 'skip') return -1;
                    if (a.value !== 'skip' && b.value === 'skip') return 1;
                }
                // Always prefer action cards over number cards
                if (a.type === 'action' && b.type !== 'action') return -1;
                if (a.type !== 'action' && b.type === 'action') return 1;
                // Prefer matching color to keep hand flexible
                if (a.color === gameState.currentColor && b.color !== gameState.currentColor) return -1;
                if (a.color !== gameState.currentColor && b.color === gameState.currentColor) return 1;
                // Save wild cards for last
                if (a.type === 'wild' && b.type !== 'wild') return 1;
                if (a.type !== 'wild' && b.type === 'wild') return -1;
                return 0;
            });
            cardToPlay = playableCards[0];
        }
        
        // Choose color for wild cards
        if (cardToPlay.type === 'wild') {
            if (gameState.difficulty === 1) {
                // Easy: random color
                gameState.currentColor = colors[Math.floor(Math.random() * colors.length)];
            } else if (gameState.difficulty === 2) {
                // Medium: most common color in hand
                gameState.currentColor = getMostCommonColor(gameState.aiHand);
            } else {
                // Hard: most common color, but if AI has few cards, pick color player likely lacks
                const aiColorCounts = countColors(gameState.aiHand);
                const playerColorCounts = countColors(gameState.playerHand);
                // Pick the color AI has most of that player has least of
                let bestColor = colors[0];
                let bestScore = -Infinity;
                colors.forEach(c => {
                    const score = aiColorCounts[c] * 2 - playerColorCounts[c];
                    if (score > bestScore) {
                        bestScore = score;
                        bestColor = c;
                    }
                });
                gameState.currentColor = bestColor;
            }
        }
        
        playCard(cardToPlay, gameState.aiHand, false);
        renderAll();
        
        // AI calls UNO
        if (gameState.aiHand.length === 1) {
            if (gameState.difficulty === 1) {
                // Easy: 50% chance to forget
                if (Math.random() < 0.5) {
                    updateStatus("AI forgot to call UNO!");
                } else {
                    updateStatus("AI calls UNO!");
                }
            } else {
                // Medium & Hard: always calls UNO
                updateStatus("AI calls UNO!");
            }
        }
        
        if (gameState.gameActive) {
            switchTurn();
        }
    } else {
        // AI draws a card and passes turn
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

// Helper: count cards of each color in a hand
function countColors(hand) {
    const counts = { red: 0, blue: 0, green: 0, yellow: 0 };
    hand.forEach(card => {
        if (card.color !== 'wild') counts[card.color]++;
    });
    return counts;
}

// Helper: get most common color in hand
function getMostCommonColor(hand) {
    const counts = countColors(hand);
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}
