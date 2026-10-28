export const GENDERS = ['Laki-laki', 'Perempuan'];
export const COUNTRIES = [
  'Indonesia',
  'Malaysia',
  'Amerika Serikat',
  'Jepang',
  'Korea Selatan',
  'Lainnya',
];

export const GENDER_LABELS = { laki: 'Laki-laki', perempuan: 'Perempuan' };
export const COUNTRY_LABELS = {
  indonesia: 'Indonesia',
  malaysia: 'Malaysia',
  amerika_serikat: 'Amerika Serikat',
  jepang: 'Jepang',
  korea_selatan: 'Korea Selatan',
  lainnya: 'Lainnya',
};

export function createUser(input, id) {
  return {
    id,
    nama: input.nama.trim(),
    email: input.email.trim(),
    nomorHP: input.nomorHP.trim(),
    gender: input.gender,
    negara: input.negara,
  };
}

export function validateField(field, rawValue, users = [], excludedId = null) {
  const value = String(rawValue ?? '').trim();
  if (field === 'nama') {
    if (
      value.length < 3 ||
      value.length > 60 ||
      !/^[\p{L}\p{M} .'-]+$/u.test(value) ||
      !/\p{L}/u.test(value)
    ) {
      return 'Nama harus 3–60 karakter dan memakai karakter nama yang valid';
    }
  } else if (field === 'email') {
    if (value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      return 'Masukkan alamat email yang valid';
    }
    if (
      users.some(
        (user) => user.id !== excludedId && user.email.toLowerCase() === value.toLowerCase(),
      )
    ) {
      return 'Email sudah terdaftar';
    }
  } else if (field === 'nomorHP') {
    if (!/^\d{7,16}$/.test(value)) {
      return 'Nomor HP harus berisi 7–16 digit angka';
    }
    if (users.some((user) => user.id !== excludedId && user.nomorHP === value)) {
      return 'Nomor HP sudah terdaftar';
    }
  }
  return null;
}

export function validateUser(input, users = [], excludedId = null) {
  for (const field of ['nama', 'email', 'nomorHP']) {
    const error = validateField(field, input[field], users, excludedId);
    if (error) return { field, message: error };
  }
  if (!GENDERS.includes(input.gender)) {
    return { field: 'gender', message: 'Pilih jenis kelamin yang valid' };
  }
  if (!COUNTRIES.includes(input.negara)) {
    return { field: 'negara', message: 'Pilih warga negara yang valid' };
  }
  return null;
}

export function addUser(users, user) {
  return [...users, user];
}

export function updateUser(users, id, changes) {
  return users.map((user) => (user.id === id ? { ...user, ...changes, id } : user));
}

export function deleteUser(users, id) {
  return users.filter((user) => user.id !== id);
}

export function filterUsers(users, options = {}) {
  const keyword = String(options.keyword ?? '')
    .trim()
    .toLocaleLowerCase('id-ID');
  const column = ['nama', 'email', 'nomorHP', 'gender', 'negara'].includes(options.kolom)
    ? options.kolom
    : 'nama';
  return users.filter(
    (user) =>
      String(user[column]).toLocaleLowerCase('id-ID').includes(keyword) &&
      (options.gender === 'semua' || !options.gender || user.gender === options.gender),
  );
}

export function calculateStatistics(users) {
  return users.reduce(
    (result, user) => {
      result.total++;
      if (user.gender === 'Laki-laki') result.laki++;
      if (user.gender === 'Perempuan') result.perempuan++;
      if (user.negara === 'Indonesia') result.indonesia++;
      else if (user.negara === 'Malaysia') result.malaysia++;
      else result.negaraLainnya++;
      return result;
    },
    {
      total: 0,
      laki: 0,
      perempuan: 0,
      indonesia: 0,
      malaysia: 0,
      negaraLainnya: 0,
    },
  );
}

export function isStoredUser(value) {
  return Boolean(
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    typeof value.id === 'string' &&
    value.id.length > 0 &&
    ['nama', 'email', 'nomorHP', 'gender', 'negara'].every((key) => typeof value[key] === 'string'),
  );
}
