// Music player system - HTML5 Audio with royalty-free tracks
const musicTracks = [
    { id: 'track-1', title: 'Song 1', artist: 'SoundHelix', file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { id: 'track-2', title: 'Song 2', artist: 'SoundHelix', file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { id: 'track-3', title: 'Song 3', artist: 'SoundHelix', file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    { id: 'track-4', title: 'Song 4', artist: 'SoundHelix', file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
    { id: 'track-5', title: 'Song 5', artist: 'SoundHelix', file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
    { id: 'track-6', title: 'Song 6', artist: 'SoundHelix', file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
    { id: 'track-7', title: 'Song 7', artist: 'SoundHelix', file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
    { id: 'track-8', title: 'Song 8', artist: 'SoundHelix', file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' }
];

let currentTrackIndex = 0;
let musicPlaying = false;
let musicAudio = null;

function initMusicPlayer() {
    musicAudio = new Audio();
    musicAudio.loop = true;

    const savedTrack = localStorage.getItem('uno_music_track');
    if (savedTrack) {
        const idx = musicTracks.findIndex(t => t.id === savedTrack);
        if (idx >= 0) currentTrackIndex = idx;
    }

    const savedVolume = localStorage.getItem('uno_music_volume');
    musicAudio.volume = savedVolume ? parseFloat(savedVolume) : 0.3;

    musicAudio.src = musicTracks[currentTrackIndex].file;
    renderMusicPlayer();
}

function renderMusicPlayer() {
    const container = document.getElementById('music-player');
    if (!container) return;

    const track = musicTracks[currentTrackIndex];
    const playBtnText = musicPlaying ? '⏸️' : '▶️';

    container.innerHTML = `
        <div class="music-player-inner">
            <button id="music-play-btn" class="music-btn music-play-btn" title="Play/Pause">${playBtnText}</button>
            <div class="music-info">
                <span class="music-track-title">🎵 ${track.title}</span>
                <span class="music-track-artist">${track.artist}</span>
            </div>
            <button id="music-prev-btn" class="music-btn" title="Previous">⏮️</button>
            <button id="music-next-btn" class="music-btn" title="Next">⏭️</button>
            <select id="music-track-select" class="music-select" title="Select Track">
                ${musicTracks.map((t, i) => `<option value="${i}" ${i === currentTrackIndex ? 'selected' : ''}>${t.title} - ${t.artist}</option>`).join('')}
            </select>
            <div class="music-volume-container">
                <span class="music-volume-icon">🔊</span>
                <input type="range" id="music-volume" class="music-volume-slider" min="0" max="1" step="0.05" value="${musicAudio.volume}">
            </div>
        </div>
    `;

    document.getElementById('music-play-btn').onclick = toggleMusic;
    document.getElementById('music-prev-btn').onclick = prevTrack;
    document.getElementById('music-next-btn').onclick = nextTrack;
    document.getElementById('music-track-select').onchange = (e) => selectTrack(parseInt(e.target.value));
    document.getElementById('music-volume').oninput = (e) => {
        musicAudio.volume = parseFloat(e.target.value);
        localStorage.setItem('uno_music_volume', e.target.value);
    };
}

function toggleMusic() {
    if (musicPlaying) {
        musicAudio.pause();
        musicPlaying = false;
    } else {
        musicAudio.play().catch(() => {
            updateMusicStatus('Could not play music. Check your internet connection.');
        });
        musicPlaying = true;
    }
    renderMusicPlayer();
}

function selectTrack(index) {
    currentTrackIndex = index;
    musicAudio.src = musicTracks[index].file;
    localStorage.setItem('uno_music_track', musicTracks[index].id);
    if (musicPlaying) {
        musicAudio.play().catch(() => {});
    }
    renderMusicPlayer();
}

function nextTrack() {
    selectTrack((currentTrackIndex + 1) % musicTracks.length);
}

function prevTrack() {
    selectTrack((currentTrackIndex - 1 + musicTracks.length) % musicTracks.length);
}

function updateMusicStatus(msg) {
    const statusEl = document.getElementById('game-status');
    if (statusEl) {
        statusEl.textContent = msg;
    }
}
