// Rank system - trophies earned by winning against AI

const ranks = [
    { id: 'bronze',    name: 'Bronze',    icon: '🥉', minTrophies: 0,    color: '#cd7f32' },
    { id: 'silver',    name: 'Silver',    icon: '🥈', minTrophies: 10,   color: '#c0c0c0' },
    { id: 'gold',      name: 'Gold',      icon: '🥇', minTrophies: 25,   color: '#ffd700' },
    { id: 'platinum',  name: 'Platinum',  icon: '💎', minTrophies: 50,   color: '#e5e4e2' },
    { id: 'diamond',   name: 'Diamond',   icon: '🔷', minTrophies: 100,  color: '#48dbfb' },
    { id: 'master',    name: 'Master',    icon: '👑', minTrophies: 175,  color: '#a29bfe' },
    { id: 'grandmaster', name: 'Grandmaster', icon: '🏆', minTrophies: 300, color: '#fd79a8' },
    { id: 'titanium',  name: 'Titanium',  icon: '⚡', minTrophies: 500,  color: '#00cec9' }
];

// Trophies awarded per win based on difficulty
const trophyRewards = { 1: 5, 2: 10, 3: 20 };

function getTrophies() {
    return parseInt(localStorage.getItem('uno_trophies') || '0');
}

function addTrophies(amount) {
    const current = getTrophies();
    const newTotal = current + amount;
    localStorage.setItem('uno_trophies', newTotal);
    return newTotal;
}

function getCurrentRank() {
    const trophies = getTrophies();
    let current = ranks[0];
    for (let i = 0; i < ranks.length; i++) {
        if (trophies >= ranks[i].minTrophies) {
            current = ranks[i];
        }
    }
    return current;
}

function getNextRank() {
    const trophies = getTrophies();
    for (let i = 0; i < ranks.length; i++) {
        if (trophies < ranks[i].minTrophies) {
            return ranks[i];
        }
    }
    return null; // Max rank reached
}

function renderRankPage() {
    const container = document.getElementById('rank-content');
    if (!container) return;

    const trophies = getTrophies();
    const currentRank = getCurrentRank();
    const nextRank = getNextRank();

    let html = '';

    // Current rank banner
    html += `<div class="rank-current-banner" style="border-color: ${currentRank.color};">`;
    html += `<div class="rank-current-icon" style="color: ${currentRank.color};">${currentRank.icon}</div>`;
    html += `<div class="rank-current-info">`;
    html += `<h2 class="rank-current-name" style="color: ${currentRank.color};">${currentRank.name}</h2>`;
    html += `<div class="rank-trophies-display">🏆 ${trophies} Trophies</div>`;
    html += `</div></div>`;

    // Progress to next rank
    if (nextRank) {
        const progress = ((trophies - currentRank.minTrophies) / (nextRank.minTrophies - currentRank.minTrophies)) * 100;
        const remaining = nextRank.minTrophies - trophies;
        html += `<div class="rank-progress-section">`;
        html += `<div class="rank-progress-label">Progress to ${nextRank.icon} ${nextRank.name}</div>`;
        html += `<div class="rank-progress-bar">`;
        html += `<div class="rank-progress-fill" style="width: ${progress}%; background: ${nextRank.color};"></div>`;
        html += `</div>`;
        html += `<div class="rank-progress-text">${remaining} more trophies needed</div>`;
        html += `</div>`;
    } else {
        html += `<div class="rank-progress-section">`;
        html += `<div class="rank-max-label">⚡ Maximum rank achieved! You are a legend! ⚡</div>`;
        html += `</div>`;
    }

    // Trophy rewards info
    html += `<div class="rank-rewards-section">`;
    html += `<h3 class="rank-section-title">🏆 Trophies Per Win</h3>`;
    html += `<div class="rank-rewards-grid">`;
    html += `<div class="rank-reward-card easy"><span class="rank-reward-difficulty">Easy</span><span class="rank-reward-amount">+5 🏆</span></div>`;
    html += `<div class="rank-reward-card medium"><span class="rank-reward-difficulty">Medium</span><span class="rank-reward-amount">+10 🏆</span></div>`;
    html += `<div class="rank-reward-card hard"><span class="rank-reward-difficulty">Hard</span><span class="rank-reward-amount">+20 🏆</span></div>`;
    html += `</div></div>`;

    // All ranks list
    html += `<div class="rank-list-section">`;
    html += `<h3 class="rank-section-title">📊 All Ranks</h3>`;
    html += `<div class="rank-list">`;
    ranks.forEach(r => {
        const isCurrent = r.id === currentRank.id;
        const isUnlocked = trophies >= r.minTrophies;
        const cls = isCurrent ? 'rank-list-item current' : (isUnlocked ? 'rank-list-item unlocked' : 'rank-list-item locked');
        html += `<div class="${cls}" style="${isCurrent ? 'border-color:' + r.color + ';' : ''}">`;
        html += `<span class="rank-list-icon" style="${isUnlocked ? 'color:' + r.color + ';' : ''}">${isUnlocked ? r.icon : '🔒'}</span>`;
        html += `<span class="rank-list-name">${r.name}</span>`;
        html += `<span class="rank-list-trophies">${r.minTrophies} 🏆</span>`;
        html += `</div>`;
    });
    html += `</div></div>`;

    // Leaderboard
    const leaderboard = getLeaderboard();
    html += `<div class="rank-leaderboard-section">`;
    html += `<h3 class="rank-section-title">🏅 Leaderboard</h3>`;
    html += `<div class="leaderboard-list">`;
    leaderboard.forEach((entry, i) => {
        const isYou = entry.isYou;
        const rank = getRankByTrophies(entry.trophies);
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`;
        const cls = isYou ? 'leaderboard-item you' : 'leaderboard-item';
        html += `<div class="${cls}">`;
        html += `<span class="leaderboard-position">${medal}</span>`;
        html += `<span class="leaderboard-avatar">${entry.avatar}</span>`;
        html += `<span class="leaderboard-name">${entry.name}${isYou ? ' (You)' : ''}</span>`;
        html += `<span class="leaderboard-flag">${entry.flag}</span>`;
        html += `<span class="leaderboard-rank" style="color: ${rank.color};">${rank.icon}</span>`;
        html += `<span class="leaderboard-trophies">${entry.trophies} 🏆</span>`;
        html += `</div>`;
    });
    html += `</div></div>`;

    container.innerHTML = html;
}

// --- Leaderboard logic ---

const leaderboardNames = [
    'Alex', 'Sam', 'Jordan', 'Casey', 'Riley', 'Morgan', 'Taylor', 'Jamie',
    'Chris', 'Avery', 'Quinn', 'Dakota', 'Skyler', 'Cameron', 'Devon', 'Reese',
    'Blake', 'Drew', 'Emerson', 'Finley', 'Hayden', 'Kai', 'Logan', 'Parker',
    'River', 'Sage', 'Aiden', 'Lucas', 'Maya', 'Nora', 'Oscar', 'Ivy'
];

function getRankByTrophies(trophies) {
    let current = ranks[0];
    for (let i = 0; i < ranks.length; i++) {
        if (trophies >= ranks[i].minTrophies) {
            current = ranks[i];
        }
    }
    return current;
}

function getLeaderboard() {
    // Generate stable AI players based on a seed so the leaderboard is consistent
    const playerTrophies = getTrophies();
    const playerAvatar = selectedAvatar ? selectedAvatar.emoji : '👤';
    const playerFlag = selectedCountry ? selectedCountry.flag : '🏳️';
    const playerName = selectedAvatar ? selectedAvatar.name : 'You';

    // Use a seed from localStorage so AI players don't change every render
    let seed = parseInt(localStorage.getItem('uno_lb_seed') || '0');
    if (!seed) {
        seed = Math.floor(Math.random() * 100000) + 1;
        localStorage.setItem('uno_lb_seed', seed);
    }

    const aiPlayers = [];
    const usedNames = new Set();
    for (let i = 0; i < 19; i++) {
        // Pseudo-random based on seed
        const r1 = ((seed * (i + 1) * 9301 + 49297) % 233280) / 233280;
        const r2 = ((seed * (i + 3) * 4921 + 12893) % 233280) / 233280;
        const r3 = ((seed * (i + 7) * 2017 + 8192) % 233280) / 233280;

        let nameIdx = Math.floor(r1 * leaderboardNames.length);
        while (usedNames.has(leaderboardNames[nameIdx])) {
            nameIdx = (nameIdx + 1) % leaderboardNames.length;
        }
        usedNames.add(leaderboardNames[nameIdx]);

        const allAvatars = getAllAvatars();
        const av = allAvatars[Math.floor(r2 * allAvatars.length)];
        const co = countries[Math.floor(r3 * countries.length)];

        // All players start at 0 trophies
        const aiTrophies = 0;

        aiPlayers.push({
            name: leaderboardNames[nameIdx],
            avatar: av.emoji,
            flag: co.flag,
            trophies: aiTrophies,
            isYou: false
        });
    }

    // Add the player
    aiPlayers.push({
        name: playerName,
        avatar: playerAvatar,
        flag: playerFlag,
        trophies: playerTrophies,
        isYou: true
    });

    // Sort by trophies descending
    aiPlayers.sort((a, b) => b.trophies - a.trophies);

    return aiPlayers;
}
