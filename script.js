// Pega os elementos do HTML
const elHours = document.getElementById('hours')
const elMinutes = document.getElementById('minutes')
const elSeconds = document.getElementById('seconds')
const elAMPM = document.getElementById('ampm')
const elDate = document.getElementById('date')
const elProgress = document.getElementById('progress')




// Configura o círculo

const R = 40;
const circumference = 2 * Math.PI * R;
elProgress.style.stroke = 'url(#grad)';
elProgress.style.strokeDasharray = circumference;

let use24 = true;

// Função auxiliar: força 2 dígitos
function two (n) {
    return String(n).padStart(2, '0');
}

// Função que muda o fundo conforme a hora
function getGradientForHour(hour, player) {
    if (hour >= 6 && hour < 12) return ['#2aa198','#0a2f6b']; // manhã
    if(hour >= 12 && hour < 18) return ['#ffd166','#ef476f']; // tarde
    if(hour >= 18 && hour < 20) return ['#2b5876','#4e4376']; // pôr do sol
    return ['#0f2027','#2c5364']; // noite
}

// Atualiza relógio
function updateClock() {
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();

    const ampm = h >= 12 ? 'PM' : 'AM';
    if(!use24) {
        h = h % 12 || 12; 
        elAMPM.textContent = ampm;
    } else {
        elAMPM.textContent = '24h'
    }

    elHours.textContent = two(h);
    elMinutes.textContent = two(m);
    elSeconds.textContent = two(s);
    
     // data completa
     const fmt = new Intl.DateTimeFormat('pt-BR', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
     elDate.textContent = fmt.format(now);

     // muda o fundo
     const [bg1, bg2] = getGradientForHour(now.getHours());
     document.documentElement.style.setProperty('--bg1', bg1);
     document.documentElement.style.setProperty('--bg2', bg2);

     // progresso do anel
      const progress = (s + now.getMilliseconds()/1000) / 60;
      const offset = circumference * (1 - progress);
      elProgress.style.strokeDashoffset = offset;
}


setInterval(updateClock, 250);
updateClock();

// clique para alternar 12/24h
document.getElementById('clock').addEventListener('click', () => {
    use24 = !use24;
    updateClock ();
});

// Parte Playlist
const playlist = [
    { name: "Music 1", src: "audios/musica1.mp3" },
    { name: "Music 2", src: "audios/musica2.mp3" },
    { name: "Music 3", src: "audios/musica3.mp3" },
    { name: "Music 4", src: "audios/musica4.mp3" },
    { name: "Music 5", src: "audios/musica5.mp3" }
];

// Parte Elementos do HTML (PLAYLIST)
const player = document.getElementById("player");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const trackName = document.getElementById("trackName");
const volumeBar = document.getElementById("volumeBar");

let currentTrack = 0; // gurda qual musica da playlist esta tocando
let isPlaying = false; // guarda se a musica esta tocando (true) ou pausada (false)

// Parte função para carregar musica
function loadTrack(index) {
    currentTrack = index;               // atualiza a música atual
    player.src = playlist[index].src;   // troca o arquivo do <audio>
    trackName.textContent = playlist[index].name;   // troca o texto no HTML
    if (isPlaying) player.play();   // se já estava tocando, continua tocando
}

// Botão play e pause
playBtn.addEventListener("click", () => {   // escuta quando o botão é clicado
    if (!isPlaying) {       // se não esta tocando, toca/ se ja esta tocando, pausa
        player.play();
        playBtn.textContent = "⏸"; //começa a musica
    } else {
        player.pause();
        playBtn.textContent = "▶"; //pausa a musica
    }
    isPlaying = !isPlaying; //  inverte o estado (se era false, vira true; se era true, vira false)
});

// Botões proxima e anterior
nextBtn.addEventListener("click", () => {
    let nextIndex = (currentTrack + 1) % playlist.length;   //passa para a próxima musica, faz com que, quando chegar no final da lista, volte para a primeira
    loadTrack(nextIndex);
});

// Musica anterior
prevBtn.addEventListener("click", () => {
    let prevIndex = (currentTrack - 1 + playlist.length) % playlist.length; //volta para a música anterior
    loadTrack(prevIndex);
});

// Barra de volume
volumeBar.addEventListener("input", () => {
    player.volume = volumeBar.value;
});

//Musica acabou => vai para proxima
player.addEventListener("ended", () => {        //endend = é um evento que dispara quando a musica termina
    let nextIndex = (currentTrack + 1) % playlist.length;
    loadTrack(nextIndex);
});

// volta para a primeira musica
loadTrack(currentTrack);  //Chama a função loadTrack(0) para já mostrar a primeira música da playlist quando a página abre
