UNDANGAN DIGITAL YANUAR & FANESA
Tanggal: 12 September 2026

CARA MEMBUKA
1. Ekstrak berkas ZIP.
2. Buka index.html melalui browser.
3. Untuk publikasi online, unggah seluruh isi folder ke Netlify, Vercel, GitHub Pages, atau hosting biasa.

BAGIAN YANG PERLU DIGANTI
- Nama orang tua kedua mempelai.
- Username Instagram.
- Jam acara jika berbeda.
- Nama dan alamat lokasi.
- Tautan Google Maps.
- Cerita perjalanan hubungan.
- Foto pada bagian profil dan galeri.
- Data rekening hadiah.

CARA MENAMBAHKAN FOTO
Pilihan termudah:
1. Buat folder bernama assets.
2. Masukkan foto, misalnya yanuar.jpg, fanesa.jpg, galeri-1.jpg.
3. Pada style.css, ganti latar elemen terkait dengan:
   background-image: url("assets/yanuar.jpg");
   background-size: cover;
   background-position: center;

CARA MENAMBAHKAN MUSIK
1. Simpan musik legal milik Anda sebagai assets/music.mp3.
2. Pada index.html, cari:
   <source src="" type="audio/mpeg" />
3. Ubah menjadi:
   <source src="assets/music.mp3" type="audio/mpeg" />

NAMA TAMU PERSONAL
Gunakan parameter URL:
index.html?to=Bapak%20Andi%20dan%20Keluarga

CATATAN RSVP
RSVP pada versi ini tersimpan di browser/perangkat tamu menggunakan localStorage.
Agar semua jawaban masuk ke satu database, hubungkan formulir ke Google Sheets,
Firebase, Supabase, Formspree, atau backend pilihan Anda.
