const tracks = [
    {
        name: "Let me down slowly",
        artist: "Alec Benjamin",
        cover: "https://via.placeholder.com/150",
        source: "./Let Me Down Slowly-(PagalSongs.Com.IN).mp3",
    },
    {
        name: "Let me love you",
        artist: "DJ Snake/Justin Beiber",
        cover: "https://via.placeholder.com/150",
        source: "./Let-Me-Love-You(PaglaSongs).mp3",
    },
    {
        name: "Perfect",
        artist: "Ed Sheeran",
        cover: "https://via.placeholder.com/150",
        source: "./Perfect(PaglaSongs).mp3",
    }
];

let currentTrackIndex = 0;
const audio = document.getElementById('audio');
const playBtn = document.querySelector('.play');
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');
const skipForwardBtn = document.querySelector('.skip-forward');
const skipBackBtn = document.querySelector('.skip-back');
const progressBar = document.querySelector('.progress-bar');
const progress = document.querySelector('.progress');
const currentTimeEl = document.querySelector('.current-time');
const durationEl = document.querySelector('.duration');
const titleEl = document.querySelector('.audio-title');
const artistEl = document.querySelector('.audio-singer');
const coverEl = document.querySelector('.audio-img .img');

function loadTrack(index) {
    const track = tracks[index];
    audio.src = track.source;
    titleEl.textContent = track.name;
    artistEl.textContent = track.artist;
    coverEl.src = track.cover;
}

function playPauseTrack() {
    if (audio.paused) {
        audio.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'inline';
    } else {
        audio.pause();
        playIcon.style.display = 'inline';
        pauseIcon.style.display = 'none';
    }
}

function updateProgress() {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progressPercent}%`;

    const minutes = Math.floor(audio.currentTime / 60);
    const seconds = Math.floor(audio.currentTime % 60);
    currentTimeEl.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function updateDuration() {
    const minutes = Math.floor(audio.duration / 60);
    const seconds = Math.floor(audio.duration % 60);
    durationEl.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;

    audio.currentTime = (clickX / width) * duration;
}

function skipForward() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    audio.play();
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'inline';
}

function skipBack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    audio.play();
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'inline';
}

playBtn.addEventListener('click', playPauseTrack);
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('loadedmetadata', updateDuration);
progress.addEventListener('click', setProgress);
skipForwardBtn.addEventListener('click', skipForward);
skipBackBtn.addEventListener('click', skipBack);

// Load the first track initially
loadTrack(currentTrackIndex);

// Error handling for unsupported source
audio.addEventListener('error', (e) => {
    console.error('Audio error:', e);
    playIcon.style.display = 'inline';
    pauseIcon.style.display = 'none';
});
