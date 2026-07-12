const avatarCategories = {
    animals: {
        label: 'Animals',
        icon: '🐾',
        avatars: [
            { id: 'dog', emoji: '🐶', name: 'Dog' },
            { id: 'cat', emoji: '🐱', name: 'Cat' },
            { id: 'lion', emoji: '🦁', name: 'Lion' },
            { id: 'tiger', emoji: '🐯', name: 'Tiger' },
            { id: 'panda', emoji: '🐼', name: 'Panda' },
            { id: 'fox', emoji: '🦊', name: 'Fox' },
            { id: 'bear', emoji: '🐻', name: 'Bear' },
            { id: 'monkey', emoji: '🐵', name: 'Monkey' },
            { id: 'rabbit', emoji: '🐰', name: 'Rabbit' },
            { id: 'wolf', emoji: '🐺', name: 'Wolf' },
            { id: 'frog', emoji: '🐸', name: 'Frog' },
            { id: 'penguin', emoji: '🐧', name: 'Penguin' },
            { id: 'unicorn', emoji: '🦄', name: 'Unicorn' },
            { id: 'dragon', emoji: '🐲', name: 'Dragon' },
            { id: 'owl', emoji: '🦉', name: 'Owl' },
            { id: 'eagle', emoji: '🦅', name: 'Eagle' }
        ]
    },
    youtubers: {
        label: 'YouTubers',
        icon: '📹',
        avatars: [
            { id: 'mrbeast', emoji: '🤑', name: 'MrBeast' },
            { id: 'pewdiepie', emoji: '🎮', name: 'PewDiePie' },
            { id: 'markiplier', emoji: '🎤', name: 'Markiplier' },
            { id: 'jacksepticeye', emoji: '🍀', name: 'Jacksepticeye' },
            { id: 'ninja', emoji: '🥷', name: 'Ninja' },
            { id: 'dantdm', emoji: '💎', name: 'DanTDM' },
            { id: 'dream', emoji: '😄', name: 'Dream' },
            { id: 'logal', emoji: '🎬', name: 'Logan Paul' }
        ]
    },
    frenchYoutubers: {
        label: 'French YouTubers',
        icon: '🇫🇷',
        avatars: [
            { id: 'squeezie', emoji: '🎮', name: 'Squeezie' },
            { id: 'cyprien', emoji: '😎', name: 'Cyprien' },
            { id: 'norman', emoji: '🍿', name: 'Norman' },
            { id: 'ludovik', emoji: '🎲', name: 'Ludovik' },
            { id: 'amos', emoji: '😂', name: 'Amixem' },
            { id: 'kemar', emoji: '🧀', name: 'Kemar' },
            { id: 'mistermv', emoji: '🏎️', name: 'Mister MV' },
            { id: 'domingo', emoji: '⚽', name: 'Domingo' }
        ]
    },
    englishYoutubers: {
        label: 'English YouTubers',
        icon: '🇬🇧',
        avatars: [
            { id: 'ksi', emoji: '🥊', name: 'KSI' },
            { id: 'sidemen', emoji: '⚽', name: 'Sidemen' },
            { id: 'w2s', emoji: '🎮', name: 'W2S' },
            { id: 'miniminter', emoji: '⚽', name: 'Miniminter' },
            { id: 'zerkaa', emoji: '🎯', name: 'Zerkaa' },
            { id: 'vikkstar', emoji: '🔫', name: 'Vikkstar' },
            { id: 'tobjizzle', emoji: '🏀', name: 'TBJZL' },
            { id: 'behzinga', emoji: '💪', name: 'Behzinga' }
        ]
    },
    singers: {
        label: 'Famous Singers',
        icon: '🎵',
        avatars: [
            { id: 'mj', emoji: '🕺', name: 'Michael Jackson' },
            { id: 'elvis', emoji: '🎸', name: 'Elvis Presley' },
            { id: 'freddie', emoji: '👑', name: 'Freddie Mercury' },
            { id: 'beyonce', emoji: '🐝', name: 'Beyoncé' },
            { id: 'adele', emoji: '💔', name: 'Adele' },
            { id: 'drake', emoji: '🦉', name: 'Drake' },
            { id: 'rihanna', emoji: '💎', name: 'Rihanna' },
            { id: 'ed', emoji: '🎸', name: 'Ed Sheeran' },
            { id: 'taylor', emoji: '✨', name: 'Taylor Swift' },
            { id: 'weeknd', emoji: '🔴', name: 'The Weeknd' },
            { id: 'bts', emoji: '💜', name: 'BTS' },
            { id: 'shakira', emoji: '💃', name: 'Shakira' }
        ]
    }
};

const countries = [
    { code: 'us', flag: '🇺🇸', name: 'United States' },
    { code: 'fr', flag: '🇫🇷', name: 'France' },
    { code: 'gb', flag: '🇬🇧', name: 'United Kingdom' },
    { code: 'es', flag: '🇪🇸', name: 'Spain' },
    { code: 'de', flag: '🇩🇪', name: 'Germany' },
    { code: 'it', flag: '🇮🇹', name: 'Italy' },
    { code: 'pt', flag: '🇵🇹', name: 'Portugal' },
    { code: 'cn', flag: '🇨🇳', name: 'China' },
    { code: 'jp', flag: '🇯🇵', name: 'Japan' },
    { code: 'kr', flag: '🇰🇷', name: 'South Korea' },
    { code: 'ru', flag: '🇷🇺', name: 'Russia' },
    { code: 'ca', flag: '🇨🇦', name: 'Canada' },
    { code: 'br', flag: '🇧🇷', name: 'Brazil' },
    { code: 'mx', flag: '🇲🇽', name: 'Mexico' },
    { code: 'au', flag: '🇦🇺', name: 'Australia' },
    { code: 'in', flag: '🇮🇳', name: 'India' },
    { code: 'nl', flag: '🇳🇱', name: 'Netherlands' },
    { code: 'be', flag: '🇧🇪', name: 'Belgium' },
    { code: 'ch', flag: '🇨🇭', name: 'Switzerland' },
    { code: 'se', flag: '🇸🇪', name: 'Sweden' },
    { code: 'no', flag: '🇳🇴', name: 'Norway' },
    { code: 'pl', flag: '🇵🇱', name: 'Poland' },
    { code: 'ie', flag: '🇮🇪', name: 'Ireland' },
    { code: 'ar', flag: '🇦🇷', name: 'Argentina' },
    { code: 'za', flag: '🇿🇦', name: 'South Africa' },
    { code: 'eg', flag: '🇪🇬', name: 'Egypt' },
    { code: 'ma', flag: '🇲🇦', name: 'Morocco' },
    { code: 'dz', flag: '🇩🇿', name: 'Algeria' },
    { code: 'tn', flag: '🇹🇳', name: 'Tunisia' },
    { code: 'sn', flag: '🇸🇳', name: 'Senegal' },
    { code: 'ci', flag: '🇨🇮', name: "Côte d'Ivoire" },
    { code: 'cm', flag: '🇨🇲', name: 'Cameroon' },
    { code: 'world', flag: '🌍', name: 'Global' }
];

let selectedAvatar = null;
let aiAvatar = null;
let selectedCountry = null;
let aiCountry = null;

function getAllAvatars() {
    let all = [];
    Object.values(avatarCategories).forEach(cat => {
        all = all.concat(cat.avatars);
    });
    return all;
}

function getAvatarById(id) {
    for (const cat of Object.values(avatarCategories)) {
        const found = cat.avatars.find(a => a.id === id);
        if (found) return found;
    }
    return null;
}

function getRandomAvatar() {
    const all = getAllAvatars();
    return all[Math.floor(Math.random() * all.length)];
}

function renderAvatarSelection() {
    const container = document.getElementById('avatar-grid');
    if (!container) return;
    container.innerHTML = '';

    Object.entries(avatarCategories).forEach(([catKey, cat]) => {
        const catSection = document.createElement('div');
        catSection.className = 'avatar-category';

        const catLabel = document.createElement('p');
        catLabel.className = 'avatar-category-label';
        catLabel.textContent = `${cat.icon} ${cat.label}`;
        catSection.appendChild(catLabel);

        const avatarGrid = document.createElement('div');
        avatarGrid.className = 'avatar-items';

        cat.avatars.forEach(av => {
            const btn = document.createElement('button');
            btn.className = 'avatar-item';
            btn.dataset.avatarId = av.id;
            btn.title = av.name;
            btn.innerHTML = `<span class="avatar-emoji">${av.emoji}</span><span class="avatar-name">${av.name}</span>`;
            btn.onclick = () => selectAvatar(av.id);
            avatarGrid.appendChild(btn);
        });

        catSection.appendChild(avatarGrid);
        container.appendChild(catSection);
    });

    // Restore selected avatar from localStorage
    const saved = localStorage.getItem('uno_avatar');
    if (saved) {
        const av = getAvatarById(saved);
        if (av) {
            selectedAvatar = av;
            updateAvatarPreview();
            highlightSelectedAvatar(saved);
        }
    }
}

function selectAvatar(id) {
    const av = getAvatarById(id);
    if (!av) return;
    selectedAvatar = av;
    localStorage.setItem('uno_avatar', id);
    updateAvatarPreview();
    highlightSelectedAvatar(id);
}

function highlightSelectedAvatar(id) {
    document.querySelectorAll('.avatar-item').forEach(item => {
        item.classList.toggle('selected', item.dataset.avatarId === id);
    });
}

function updateAvatarPreview() {
    const preview = document.getElementById('avatar-preview');
    if (!preview) return;
    if (selectedAvatar) {
        preview.innerHTML = `<span class="avatar-emoji">${selectedAvatar.emoji}</span><span class="avatar-preview-name">${selectedAvatar.name}</span>`;
    } else {
        preview.innerHTML = `<span class="avatar-emoji">❓</span><span class="avatar-preview-name">Pick an avatar!</span>`;
    }
}

function pickAIAvatar() {
    aiAvatar = getRandomAvatar();
    aiCountry = getRandomCountry();
}

function updateGameAvatars() {
    const playerAvatarEl = document.getElementById('player-avatar');
    const aiAvatarEl = document.getElementById('ai-avatar');
    const playerFlagEl = document.getElementById('player-flag');
    const aiFlagEl = document.getElementById('ai-flag');

    if (playerAvatarEl && selectedAvatar) {
        playerAvatarEl.textContent = selectedAvatar.emoji;
        playerAvatarEl.title = selectedAvatar.name;
    }
    if (aiAvatarEl && aiAvatar) {
        aiAvatarEl.textContent = aiAvatar.emoji;
        aiAvatarEl.title = aiAvatar.name;
    }
    if (playerFlagEl && selectedCountry) {
        playerFlagEl.textContent = selectedCountry.flag;
        playerFlagEl.title = selectedCountry.name;
    }
    if (aiFlagEl && aiCountry) {
        aiFlagEl.textContent = aiCountry.flag;
        aiFlagEl.title = aiCountry.name;
    }
}

// --- Country functions ---

function getCountryByCode(code) {
    return countries.find(c => c.code === code) || null;
}

function getRandomCountry() {
    return countries[Math.floor(Math.random() * countries.length)];
}

function renderCountrySelection() {
    const container = document.getElementById('country-grid');
    if (!container) return;
    container.innerHTML = '';

    countries.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'country-item';
        btn.dataset.countryCode = c.code;
        btn.title = c.name;
        btn.innerHTML = `<span class="country-flag">${c.flag}</span><span class="country-name">${c.name}</span>`;
        btn.onclick = () => selectCountry(c.code);
        container.appendChild(btn);
    });

    const saved = localStorage.getItem('uno_country');
    if (saved) {
        const co = getCountryByCode(saved);
        if (co) {
            selectedCountry = co;
            updateCountryPreview();
            highlightSelectedCountry(saved);
        }
    }
}

function selectCountry(code) {
    const co = getCountryByCode(code);
    if (!co) return;
    selectedCountry = co;
    localStorage.setItem('uno_country', code);
    updateCountryPreview();
    highlightSelectedCountry(code);
}

function highlightSelectedCountry(code) {
    document.querySelectorAll('.country-item').forEach(item => {
        item.classList.toggle('selected', item.dataset.countryCode === code);
    });
}

function updateCountryPreview() {
    const preview = document.getElementById('country-preview');
    if (!preview) return;
    if (selectedCountry) {
        preview.innerHTML = `<span class="country-flag">${selectedCountry.flag}</span><span class="country-preview-name">${selectedCountry.name}</span>`;
    } else {
        preview.innerHTML = `<span class="country-flag">🏳️</span><span class="country-preview-name">Pick your country!</span>`;
    }
}

// --- Players page rendering ---

function renderPlayersPage() {
    // Re-render avatar and country selection grids on the players page
    renderAvatarSelection();
    renderCountrySelection();

    const container = document.getElementById('players-gallery');
    if (!container) return;
    container.innerHTML = '';

    // Show all avatars grouped by category with country flags
    Object.entries(avatarCategories).forEach(([catKey, cat]) => {
        const catSection = document.createElement('div');
        catSection.className = 'players-category-section';

        const catTitle = document.createElement('h3');
        catTitle.className = 'players-category-title';
        catTitle.textContent = `${cat.icon} ${cat.label}`;
        catSection.appendChild(catTitle);

        const gallery = document.createElement('div');
        gallery.className = 'players-gallery-grid';

        cat.avatars.forEach(av => {
            const card = document.createElement('div');
            card.className = 'player-profile-card';

            // Assign a random country flag for display variety
            const randomCountry = getRandomCountry();

            card.innerHTML = `
                <div class="player-profile-avatar">
                    <span class="player-profile-emoji">${av.emoji}</span>
                    <span class="player-profile-flag">${randomCountry.flag}</span>
                </div>
                <div class="player-profile-info">
                    <span class="player-profile-name">${av.name}</span>
                    <span class="player-profile-country">${randomCountry.name}</span>
                </div>
            `;
            gallery.appendChild(card);
        });

        catSection.appendChild(gallery);
        container.appendChild(catSection);
    });

    // Show "You" card at the top if avatar selected
    if (selectedAvatar) {
        const yourCard = document.createElement('div');
        yourCard.className = 'player-profile-card your-card';
        const flag = selectedCountry ? selectedCountry.flag : '🏳️';
        const countryName = selectedCountry ? selectedCountry.name : 'No country';
        yourCard.innerHTML = `
            <div class="player-profile-avatar">
                <span class="player-profile-emoji">${selectedAvatar.emoji}</span>
                <span class="player-profile-flag">${flag}</span>
            </div>
            <div class="player-profile-info">
                <span class="player-profile-name">${selectedAvatar.name} (You)</span>
                <span class="player-profile-country">${countryName}</span>
            </div>
        `;
        const yourSection = document.createElement('div');
        yourSection.className = 'players-category-section';
        const yourTitle = document.createElement('h3');
        yourTitle.className = 'players-category-title';
        yourTitle.textContent = '⭐ Your Profile';
        yourSection.appendChild(yourTitle);
        const yourGallery = document.createElement('div');
        yourGallery.className = 'players-gallery-grid';
        yourGallery.appendChild(yourCard);
        yourSection.appendChild(yourGallery);
        container.insertBefore(yourSection, container.firstChild);
    }
}
