import { clearFieldFeedback } from '../ui/field-feedback.js';

const API_URL = 'https://randomuser.me/api/1.4/?inc=name,email,gender,cell,nat';
const COUNTRY_BY_NAT = {
  ID: 'indonesia',
  MY: 'malaysia',
  US: 'amerika_serikat',
  JP: 'jepang',
  KR: 'korea_selatan',
};

export function initRandomUser(notify) {
  const button = document.getElementById('btnGenerateUser');
  const form = document.getElementById('FormPengguna');
  button.addEventListener('click', async () => {
    button.disabled = true;
    button.textContent = 'Mengambil data...';
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      const user = result.results?.[0];
      if (result.error || !user?.name?.first || !user?.name?.last || !user.email) {
        throw new Error('Data API tidak lengkap');
      }
      const phone = String(user.cell || '').replace(/\D/g, '');
      if (!/^\d{7,16}$/.test(phone)) throw new Error('Nomor HP API tidak sesuai format');
      form.reset();
      for (const id of ['nama', 'email', 'nomorHP']) {
        clearFieldFeedback(document.getElementById(id));
      }
      document.getElementById('nama').value = `${user.name.first} ${user.name.last}`;
      document.getElementById('email').value = user.email;
      document.getElementById('nomorHP').value = phone;
      form.querySelector(
        `input[name="gender"][value="${user.gender === 'male' ? 'laki' : 'perempuan'}"]`,
      ).checked = true;
      const nat = COUNTRY_BY_NAT[user.nat] || 'lainnya';
      form.querySelector(`input[name="warga_negara"][value="${nat}"]`).checked = true;
      notify('Semua field berhasil diisi dari API');
    } catch (error) {
      console.error('Random User API:', error);
      notify(`Isi Cepat gagal: ${error.message}`, 'error');
    } finally {
      button.disabled = false;
      button.textContent = '+ Isi Cepat';
    }
  });
}
