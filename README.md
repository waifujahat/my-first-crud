# CRUD OPERATOR

**Live Demo:** [https://waifujahat.github.io/my-first-crud/](https://waifujahat.github.io/my-first-crud/)

**Repository:** [https://github.com/waifujahat/my-first-crud](https://github.com/waifujahat/my-first-crud)

Dashboard sederhana untuk mengelola data pengguna menggunakan **HTML, CSS dan JavaScript**

Proyek ini awalnya saya buat untuk latihan CRUD (*Create, Read, Update, Delete*). Seiring pengembangan, saya menambahkan pencarian, filter, validasi formulir, statistik pengguna dan penyimpanan data menggunakan Local Storage

Aplikasi ini menggunakan **JavaScript** tanpa framework

## Tentang Proyek

CRUD OPERATOR memiliki tiga halaman utama :

- **Beranda** — menampilkan ringkasan pengguna dan statistik berdasarkan jenis kelamin serta kewarganegaraan
- **Data Pengguna** — tempat untuk menambah, mencari, mengedit dan menghapus data pengguna
- **Setting** — berisi pengaturan dan informasi aplikasi

Aplikasi berjalan di browser tanpa backend atau database server
Data pengguna disimpan di **Local Storage**, sehingga perubahan tetap tersedia setelah halaman dimuat ulang selama data browser belum dihapus

## Fitur

- **CRUD Pengguna** — tambah, tampilkan, edit langsung di tabel, dan hapus data dengan dialog konfirmasi
- **Validasi Formulir** — memeriksa nama, email, dan nomor HP, termasuk mencegah email atau nomor HP duplikat
- **Pencarian & Filter** — mencari pengguna berdasarkan kolom yang dipilih serta memfilter berdasarkan jenis kelamin
- **Statistik Pengguna** — menampilkan jumlah pengguna berdasarkan jenis kelamin dan kewarganegaraan
- **Local Storage** — menyimpan perubahan data secara lokal di browser.
- **Isi Cepat** — mengambil data contoh dari [Random User API](https://randomuser.me/) untuk mengisi formulir
- **Dark Mode** — menyediakan pilihan tema terang dan gelap
- **Responsive Sidebar** — menyesuaikan navigasi untuk desktop dan perangkat mobile
- **Music Player** — memutar audio dari folder `assets/audio/`, dengan kontrol play/pause dan pemilihan lagu acak

Saat pertama kali dibuka **tanpa data tersimpan sebelumnya**, aplikasi menampilkan **50 pengguna contoh** untuk mencoba fitur CRUD

## Teknologi yang Digunakan

| Teknologi | Kegunaan |
| --- | --- |
| HTML5 | Struktur halaman dan formulir |
| CSS3 | Tampilan, layout responsif, dan tema |
| JavaScript (ES Modules) | Logika CRUD dan interaksi aplikasi |
| Local Storage | Penyimpanan data dan preferensi pada browser |
| Fetch API | Mengambil data dari Random User API |
| Node.js Test Runner | Menjalankan pengujian otomatis |

Proyek ini tidak menggunakan React, Vue atau framework backend

## Cara Menjalankan

Karena menggunakan **JavaScript ES Modules**, aplikasi sebaiknya dijalankan melalui server lokal bukan dengan membuka `index.html` secara langsung

### Menggunakan Node.js

Jika Node.js sudah terpasang, buka terminal di folder proyek lalu jalankan :

```bash
npx http-server . -p 8080 -c-1
```

Buka di browser :

```text
http://localhost:8080
```

Saat pertama kali digunakan, `npx` mungkin meminta izin untuk mengunduh package `http-server`

### Menggunakan Python

Jika menggunakan Python 3, jalankan :

```bash
python -m http.server 8000
```

Atau pada sistem yang menggunakan perintah `python3` :

```bash
python3 -m http.server 8000
```

Kemudian buka :

```text
http://localhost:8000
```

Tidak perlu menginstal dependency khusus untuk menjalankan aplikasi
Fitur **Isi Cepat** membutuhkan koneksi internet untuk mengambil data dari Random User API, sedangkan fitur CRUD utama dapat berjalan tanpa API eksternal

## Struktur Folder

Setelah beberapa kali pengembangan, struktur JavaScript dan CSS saya pisahkan menjadi beberapa file berdasarkan fungsinya.

```text
my-first-crud/
├── assets/
│   ├── audio/
│   │   ├── README.md
│   │   └── *.wav
│   │
│   ├── css/
│   │   ├── base.css
│   │   ├── dashboard.css
│   │   ├── music.css
│   │   ├── pages.css
│   │   ├── sidebar.css
│   │   └── theme.css
│   │
│   └── js/
│       ├── main.js
│       │
│       ├── data/
│       │   └── sample-users.js
│       │
│       ├── domain/
│       │   └── user.js
│       │
│       ├── services/
│       │   └── user-repository.js
│       │
│       ├── ui/
│       │   ├── confirm-dialog.js
│       │   ├── field-feedback.js
│       │   ├── toast.js
│       │   └── user-table.js
│       │
│       └── features/
│           ├── music-player.js
│           ├── navigation.js
│           ├── random-user.js
│           ├── sidebar.js
│           ├── theme.js
│           └── users-controller.js
│
├── tests/
│   ├── project-structure.test.js
│   └── user-domain.test.js
│
├── .gitignore
├── index.html
├── LICENSE
├── package.json
└── README.md
```

Beberapa bagian penting dari struktur ini :

- `domain/user.js` menangani logika CRUD, validasi, pencarian, dan statistik
- `services/user-repository.js` menangani penyimpanan dan pembacaan data
- `features/users-controller.js` menghubungkan logika pengguna dengan interaksi halaman
- `ui/` berisi fungsi untuk menampilkan tabel, notifikasi, dan dialog
- `features/music-player.js` menangani pemutaran audio
- `main.js` menjadi titik awal untuk menjalankan modul aplikasi