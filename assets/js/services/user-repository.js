import { isStoredUser } from "../domain/user.js";
export const LEGACY_STORAGE_KEY = "crud_data_pengguna";
export const STORAGE_KEY = "crud_operator_users_v2";
const CURRENT_VERSION = 2;

export function migrateLegacyUsers(legacyRows, createId) {
    if (!Array.isArray(legacyRows) || !legacyRows.every(row =>
        Array.isArray(row) && row.length === 5 && row.every(value => typeof value === "string"))) {
        throw new Error("Format data versi lama tidak valid");
    }
    return legacyRows.map(([nama, email, nomorHP, gender, negara]) => ({
        id: createId(), nama, email, nomorHP, gender, negara
    }));
}

function parseCurrentData(raw) {
    const payload = JSON.parse(raw);
    if (!payload || payload.version !== CURRENT_VERSION || !Array.isArray(payload.users) ||
        !payload.users.every(isStoredUser)) {
        throw new Error("Struktur penyimpanan versi baru tidak valid");
    }
    const ids = payload.users.map(user => user.id);
    if (new Set(ids).size !== ids.length) {
        throw new Error("Ada ID pengguna duplikat dalam penyimpanan");
    }
    return payload.users;
}

export function saveUsers(users, storage) {
    try {
        const target = storage ?? window.localStorage;
        target.setItem(STORAGE_KEY, JSON.stringify({ version: CURRENT_VERSION, users }));
        return true;
    } catch (error) {
        console.error("Gagal menyimpan data:", error);
        return false;
    }
}

export function loadUsers({ storage, createId = () => crypto.randomUUID() } = {}) {
    try {
        const target = storage ?? window.localStorage;
        const current = target.getItem(STORAGE_KEY);
        if (current !== null) {
            return { status: "success", users: parseCurrentData(current), migrated: false };
        }

        const legacy = target.getItem(LEGACY_STORAGE_KEY);
        if (legacy !== null) {
            const users = migrateLegacyUsers(JSON.parse(legacy), createId);
            // Bila migrasi gagal disimpan, jangan lanjutkan sebagai database kosong.
            if (!saveUsers(users, target)) throw new Error("Gagal menyimpan hasil migrasi");
            return { status: "success", users, migrated: true };
        }

        return { status: "empty", users: [], migrated: false };
    } catch (error) {
        console.error("Gagal memuat data:", error);
        return { status: "error", users: [], migrated: false, error };
    }
}
