// ========== RELÓGIO DIGITAL ==========
const elHours = document.getElementById('hours');
const elMinutes = document.getElementById('minutes');
const elSeconds = document.getElementById('seconds');
const elAMPM = document.getElementById('ampm');
const elDate = document.getElementById('date');
const elProgress = document.getElementById('progress');

// Responsividade
window.addEventListener('resize', function () {
    const body = document.body;
    if (window.innerWidth < 768) {
        body.style.padding = '20px';
    } else {
        body.style.padding = '0';
    }
});

document.addEventListener('DOMContentLoaded', function () {
    window.dispatchEvent(new Event('resize'));
});

// Configura o círculo
const R = 40;
const circumference = 2 * Math.PI * R;
elProgress.style.stroke = 'url(#grad)';
elProgress.style.strokeDasharray = circumference;

let use24 = true;
let currentTimezone = null;

function two(n) {
    return String(n).padStart(2, '0');
}

function getGradientForHour(hour) {
    if (hour >= 6 && hour < 12) return ['#2aa198', '#0a2f6b'];
    if (hour >= 12 && hour < 18) return ['#ffd166', '#ef476f'];
    if (hour >= 18 && hour < 20) return ['#2b5876', '#4e4376'];
    return ['#0f2027', '#2c5364'];
}

function updateClock() {
    const now = currentTimezone ?
        new Date(new Date().toLocaleString("en-US", { timeZone: currentTimezone.timezone })) :
        new Date();

    let h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();

    const ampm = h >= 12 ? 'PM' : 'AM';
    if (!use24) {
        h = h % 12 || 12;
        elAMPM.textContent = ampm;
    } else {
        elAMPM.textContent = '24h';
    }

    elHours.textContent = two(h);
    elMinutes.textContent = two(m);
    elSeconds.textContent = two(s);

    const fmt = new Intl.DateTimeFormat('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    elDate.textContent = fmt.format(now);

    const [bg1, bg2] = getGradientForHour(now.getHours());
    document.documentElement.style.setProperty('--bg1', bg1);
    document.documentElement.style.setProperty('--bg2', bg2);

    const progress = (s + now.getMilliseconds() / 1000) / 60;
    const offset = circumference * (1 - progress);
    elProgress.style.strokeDashoffset = offset;
}

setInterval(updateClock, 250);
updateClock();

document.getElementById('clock').addEventListener('click', () => {
    use24 = !use24;
    updateClock();
});

// ========== PLAYER DE MÚSICA ==========
const playlist = [
    { name: "Music 1", src: "audios/musica1.mp3" },
    { name: "Music 2", src: "audios/musica2.mp3" },
    { name: "Music 3", src: "audios/musica3.mp3" },
    { name: "Music 4", src: "audios/musica4.mp3" },
    { name: "Music 5", src: "audios/musica5.mp3" }
];

const player = document.getElementById("player");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const trackName = document.getElementById("trackName");
const volumeBar = document.getElementById("volumeBar");

let currentTrack = 0;
let isPlaying = false;

function loadTrack(index) {
    currentTrack = index;
    player.src = playlist[index].src;
    trackName.textContent = playlist[index].name;
    if (isPlaying) player.play();
}

playBtn.addEventListener("click", () => {
    if (!isPlaying) {
        player.play();
        playBtn.textContent = "⏸";
    } else {
        player.pause();
        playBtn.textContent = "▶";
    }
    isPlaying = !isPlaying;
});

nextBtn.addEventListener("click", () => {
    let nextIndex = (currentTrack + 1) % playlist.length;
    loadTrack(nextIndex);
});

prevBtn.addEventListener("click", () => {
    let prevIndex = (currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack(prevIndex);
});

volumeBar.addEventListener("input", () => {
    player.volume = volumeBar.value;
});

player.addEventListener("ended", () => {
    let nextIndex = (currentTrack + 1) % playlist.length;
    loadTrack(nextIndex);
});

loadTrack(currentTrack);

// ========== BARRA DE PESQUISA DE HORÁRIO MUNDIAL ==========
const timezoneMapping = {
    'brasil': { timezone: 'America/Sao_Paulo', country: 'BR', name: 'Brasil' },
    'brazil': { timezone: 'America/Sao_Paulo', country: 'BR', name: 'Brasil' },
    'são paulo': { timezone: 'America/Sao_Paulo', country: 'BR', name: 'São Paulo' },
    'sao paulo': { timezone: 'America/Sao_Paulo', country: 'BR', name: 'São Paulo' },
    'rio de janeiro': { timezone: 'America/Sao_Paulo', country: 'BR', name: 'Rio de Janeiro' },
    'eua': { timezone: 'America/New_York', country: 'US', name: 'EUA' },
    'usa': { timezone: 'America/New_York', country: 'US', name: 'EUA' },
    'estados unidos': { timezone: 'America/New_York', country: 'US', name: 'Estados Unidos' },
    'nova york': { timezone: 'America/New_York', country: 'US', name: 'Nova York' },
    'new york': { timezone: 'America/New_York', country: 'US', name: 'New York' },
    'londres': { timezone: 'Europe/London', country: 'GB', name: 'Londres' },
    'london': { timezone: 'Europe/London', country: 'GB', name: 'London' },
    'reino unido': { timezone: 'Europe/London', country: 'GB', name: 'Reino Unido' },
    'inglaterra': { timezone: 'Europe/London', country: 'GB', name: 'Inglaterra' },
    'paris': { timezone: 'Europe/Paris', country: 'FR', name: 'Paris' },
    'frança': { timezone: 'Europe/Paris', country: 'FR', name: 'França' },
    'franca': { timezone: 'Europe/Paris', country: 'FR', name: 'França' },
    'japão': { timezone: 'Asia/Tokyo', country: 'JP', name: 'Japão' },
    'japao': { timezone: 'Asia/Tokyo', country: 'JP', name: 'Japão' },
    'toquio': { timezone: 'Asia/Tokyo', country: 'JP', name: 'Tóquio' },
    'tokyo': { timezone: 'Asia/Tokyo', country: 'JP', name: 'Tokyo' }
};

function searchWorldTime() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase().trim();
    const flagElement = document.getElementById('clockFlag');
    const locationElement = document.getElementById('clockLocation');

    if (!searchInput) {
        alert('Por favor, digite o nome de um país ou cidade.');
        return;
    }

    const locationData = timezoneMapping[searchInput];

    if (!locationData) {
        alert('Local não encontrado. Tente: Brasil, EUA, Londres, Paris, Tóquio, etc.');
        return;
    }

    currentTimezone = locationData;

    flagElement.src = `https://flagcdn.com/w40/${locationData.country.toLowerCase()}.png`;
    flagElement.alt = `Bandeira ${locationData.country}`;
    flagElement.style.display = 'block';

    locationElement.textContent = locationData.name;
    locationElement.style.display = 'block';

    document.getElementById('resetBtn').style.display = 'inline';
}

function resetToLocalTime() {
    currentTimezone = null;
    const flagElement = document.getElementById('clockFlag');
    const locationElement = document.getElementById('clockLocation');

    flagElement.style.display = 'none';
    locationElement.style.display = 'none';
    document.getElementById('resetBtn').style.display = 'none';
}

document.getElementById('searchBtn').addEventListener('click', searchWorldTime);
document.getElementById('resetBtn').addEventListener('click', resetToLocalTime);

document.getElementById('searchInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchWorldTime();
    }
});

console.log('✅ Sistema carregado com sucesso!');