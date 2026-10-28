import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createUser,
  validateField,
  validateUser,
  addUser,
  updateUser,
  deleteUser,
  filterUsers,
  calculateStatistics,
} from '../assets/js/domain/user.js';
import {
  LEGACY_STORAGE_KEY,
  STORAGE_KEY,
  migrateLegacyUsers,
  loadUsers,
  saveUsers,
} from '../assets/js/services/user-repository.js';

const anna = {
  id: 'user-1',
  nama: 'Anna Putri',
  email: 'anna@example.com',
  nomorHP: '08123456789',
  gender: 'Perempuan',
  negara: 'Indonesia',
};
const budi = {
  id: 'user-2',
  nama: 'Budi Santoso',
  email: 'budi@example.com',
  nomorHP: '08123456788',
  gender: 'Laki-laki',
  negara: 'Malaysia',
};

class FakeStorage {
  constructor(data = {}) {
    this.map = new Map(Object.entries(data));
    this.failWrite = false;
  }
  getItem(key) {
    return this.map.get(key) ?? null;
  }
  setItem(key, value) {
    if (this.failWrite) throw new Error('QuotaExceeded');
    this.map.set(key, value);
  }
}

test('menambah pengguna tidak mengubah array asli', () => {
  const initial = [anna];
  const result = addUser(initial, budi);
  assert.deepEqual(initial, [anna]);
  assert.deepEqual(result, [anna, budi]);
});

test('memperbarui dan menghapus berdasarkan ID, bukan posisi baris', () => {
  const changed = updateUser([budi, anna], 'user-1', { nama: 'Anna Baru' });
  assert.equal(changed[0].nama, 'Budi Santoso');
  assert.equal(changed[1].nama, 'Anna Baru');
  assert.deepEqual(
    deleteUser(changed, 'user-2').map((user) => user.id),
    ['user-1'],
  );
});

test('validasi data tidak tergantung pada DOM', () => {
  assert.equal(
    validateField('nama', 'A'),
    'Nama harus 3–60 karakter dan memakai karakter nama yang valid',
  );
  assert.equal(validateField('nomorHP', '08abc'), 'Nomor HP harus berisi 7–16 digit angka');
  assert.equal(validateField('email', ' ANNA@EXAMPLE.COM ', [anna]), 'Email sudah terdaftar');
  assert.equal(validateField('nomorHP', '08123456789', [anna], 'user-1'), null);
  assert.equal(validateUser({ ...anna, nama: 'Anna Baru' }, [anna], 'user-1'), null);
  assert.equal(createUser({ ...anna, nama: '  Anna Baru ' }, 'a').nama, 'Anna Baru');
});

test('pencarian menerapkan kolom tertentu dan gender sekaligus', () => {
  assert.deepEqual(
    filterUsers([anna, budi], {
      keyword: 'MALAYSIA',
      kolom: 'negara',
      gender: 'Laki-laki',
    }),
    [budi],
  );
  assert.deepEqual(
    filterUsers([anna, budi], {
      keyword: 'anna',
      kolom: 'nama',
      gender: 'Laki-laki',
    }),
    [],
  );
});

test('statistik diambil dari semua data, bukan baris yang sedang ditampilkan', () => {
  assert.deepEqual(calculateStatistics([anna, budi]), {
    total: 2,
    laki: 1,
    perempuan: 1,
    indonesia: 1,
    malaysia: 1,
    negaraLainnya: 0,
  });
});

test('data lama dibaca dan dimigrasi tanpa menghapus key lama', () => {
  const legacy = [['Anna Putri', 'anna@example.com', '08123456789', 'Perempuan', 'Indonesia']];
  const storage = new FakeStorage({
    [LEGACY_STORAGE_KEY]: JSON.stringify(legacy),
  });
  const result = loadUsers({ storage, createId: () => 'migrated-id' });
  assert.equal(result.status, 'success');
  assert.equal(result.migrated, true);
  assert.equal(result.users[0].id, 'migrated-id');
  assert.deepEqual(JSON.parse(storage.getItem(LEGACY_STORAGE_KEY)), legacy);
  assert.equal(JSON.parse(storage.getItem(STORAGE_KEY)).version, 2);
  assert.equal(loadUsers({ storage }).migrated, false);
});

test('data invalid mencegah penyimpanan menimpa informasi lama', () => {
  const storage = new FakeStorage({ [LEGACY_STORAGE_KEY]: 'not-json' });
  assert.equal(loadUsers({ storage }).status, 'error');
  assert.equal(storage.getItem(STORAGE_KEY), null);
  assert.throws(() => migrateLegacyUsers([['name', 'email']], () => 'id'));
});

test('data versi baru yang rusak ditolak, bukan diganti dummy', () => {
  const storage = new FakeStorage({
    [STORAGE_KEY]: JSON.stringify({ version: 2, users: [{ id: 'id' }] }),
  });
  assert.equal(loadUsers({ storage }).status, 'error');
});

test('kegagalan menulis storage tidak diam-diam dianggap sukses', () => {
  const storage = new FakeStorage();
  storage.failWrite = true;
  assert.equal(saveUsers([anna], storage), false);
});
