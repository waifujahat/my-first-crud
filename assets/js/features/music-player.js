export function initMusicPlayer() {

    // DAFTAR MUSIK LOKAL
    const playlist = [
    {
        title: "Afterlife",
        artist: "Avenged Sevenfold",
        src: "./assets/audio/Avenged Sevenfold - Afterlife.wav"
    },
    {
        title: "Almost Easy",
        artist: "Avenged Sevenfold",
        src: "./assets/audio/Avenged Sevenfold - Almost Easy.wav"
    },
    {
        title: "Critical Acclaim",
        artist: "Avenged Sevenfold",
        src: "./assets/audio/Avenged Sevenfold - Critical Acclaim.wav"
    },
    {
        title: "Bat Country",
        artist: "Avenged Sevenfold",
        src: "./assets/audio/Avenged Sevenfold - Bat Country.wav"
    },
    {
        title: "Hail to the King",
        artist: "Avenged Sevenfold",
        src: "./assets/audio/Avenged Sevenfold - Hail to the King.wav"
    },
    {
        title: "Nightmare",
        artist: "Avenged Sevenfold",
        src: "./assets/audio/Avenged Sevenfold - Nightmare.wav"
    },
    {
        title: "Seize the Day",
        artist: "Avenged Sevenfold",
        src: "./assets/audio/Avenged Sevenfold - Seize the Day.wav"
    },
    {
        title: "So Far Away",
        artist: "Avenged Sevenfold",
        src: "./assets/audio/Avenged Sevenfold - So Far Away.wav"
    },
    {
        title: "A Little Piece of Heaven",
        artist: "Avenged Sevenfold",
        src: "./assets/audio/Avenged Sevenfold - A Little Piece of Heaven.wav"
    }
];

    const audio = document.getElementById("musicAudio");
    const btnToggle = document.getElementById("musicToggle");
    const btnClose = document.getElementById("musicClose");
    const btnPlay = document.getElementById("musicPlay");
    const btnNext = document.getElementById("musicNext");
    const panel = document.getElementById("musicPanel");

    const judul = document.getElementById("musicTitle");
    const artis = document.getElementById("musicArtist");
    const cover = document.getElementById("musicCover");
    const status = document.getElementById("musicStatus");
    const credit = document.getElementById("musicCredit");

    let indexAktif = -1;
    function pilihLaguAcak() {
        if (playlist.length === 0) return;

        let indexBaru;

        do {
            indexBaru = Math.floor(
                Math.random() * playlist.length
            );
        } while (
            playlist.length > 1 &&
            indexBaru === indexAktif
        );

        indexAktif = indexBaru;

        const lagu = playlist[indexAktif];

        audio.src = lagu.src;
        audio.load();

        judul.textContent = lagu.title;
        artis.textContent = lagu.artist;
        cover.hidden = true;
        cover.removeAttribute("src");
        credit.hidden = true;

        status.textContent = "Siap diputar";
    }

    async function putarMusik() {
        try {
            await audio.play();
        } catch (error) {
            console.error("Gagal memutar musik:", error);
            status.textContent =
                "Gagal memutar musik. Periksa file audio lokal.";
        }
    }

    btnPlay.addEventListener("click", () => {
        if (audio.paused) {
            putarMusik();
        } else {
            audio.pause();
        }
    });

    btnNext.addEventListener("click", () => {
        pilihLaguAcak();
        putarMusik();
    });

    audio.addEventListener("ended", () => {
        pilihLaguAcak();
        putarMusik();
    });

    audio.addEventListener("play", () => {
        btnPlay.textContent = "⏸";
        btnPlay.setAttribute("aria-label", "Jeda musik");
        status.textContent = "Sedang diputar";
    });

    audio.addEventListener("pause", () => {
        btnPlay.textContent = "▶";
        btnPlay.setAttribute("aria-label", "Putar musik");
        status.textContent = "Musik dijeda";
    });

    audio.addEventListener("error", () => {
        status.textContent =
            "File musik tidak ditemukan atau tidak didukung";
    });

    function aturPanel(terbuka) {
        panel.hidden = !terbuka;

        btnToggle.setAttribute(
            "aria-expanded",
            String(terbuka)
        );
    }

    btnToggle.addEventListener("click", () => {
        aturPanel(panel.hidden);
    });

    btnClose.addEventListener("click", () => {
        aturPanel(false);
        btnToggle.focus();
    });

    audio.volume = 0.3;

    if (playlist.length > 0) {
        btnPlay.disabled = false;
        btnNext.disabled = false;
        pilihLaguAcak();
    } else {
        status.textContent = "Playlist masih kosong";
    }
}
