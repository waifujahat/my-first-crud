import { SAMPLE_USERS } from "../data/sample-users.js";
import {
    createUser, GENDER_LABELS, COUNTRY_LABELS, validateField, validateUser,
    addUser, updateUser, deleteUser, filterUsers, calculateStatistics
} from "../domain/user.js";
import { loadUsers, saveUsers } from "../services/user-repository.js";
import { renderUserTable } from "../ui/user-table.js";
import { showFieldFeedback, clearFieldFeedback } from "../ui/field-feedback.js";

const createId = () => crypto.randomUUID();

export function initUsersController({ notify, confirmAction }) {
    const tbody = document.getElementById("TabelPengguna");
    const form = document.getElementById("FormPengguna");
    const modal = document.getElementById("modalTambahPengguna");
    const btnAdd = document.getElementById("btnTambahData");
    const btnClose = document.getElementById("btnTutupModal");
    const searchInput = document.getElementById("cariPengguna");
    const searchColumn = document.getElementById("kolomPencarian");
    const genderFilter = document.getElementById("filterGender");
    const searchLabel = document.getElementById("hasilPencarian");

    const initial = loadUsers({ createId });
    let blocked = initial.status === "error";
    let users = initial.status === "empty"
        ? SAMPLE_USERS.map(([nama, email, nomorHP, gender, negara]) => ({
            id: createId(), nama, email, nomorHP, gender, negara
        }))
        : initial.users;
    let currentSearch = { keyword: "", kolom: "nama", gender: "semua" };
    let editingId = null;
    let editingDraft = null;

    function render() {
        const visible = filterUsers(users, currentSearch);
        renderUserTable(tbody, visible, editingId, editingDraft);
        searchLabel.textContent = `${visible.length} dari ${users.length} pengguna ditampilkan`;
        const stats = calculateStatistics(users);
        const ids = {
            totalPengguna: stats.total, totalLaki: stats.laki,
            totalPerempuan: stats.perempuan, totalIndonesia: stats.indonesia,
            totalMalaysia: stats.malaysia, totalNegaraLainnya: stats.negaraLainnya
        };
        for (const [id, count] of Object.entries(ids)) {
            document.getElementById(id).textContent = count;
        }
    }

    function commit(nextUsers) {
        if (blocked) {
            notify("Penyimpanan tidak dapat dibaca. Perbaiki data browser sebelum mengubah pengguna.", "error");
            return false;
        }
        if (!saveUsers(nextUsers)) {
            notify("Gagal menyimpan data pengguna. Periksa kapasitas atau izin browser.", "error");
            return false;
        }
        users = nextUsers;
        render();
        return true;
    }

    function getFormValues() {
        const values = new FormData(form);
        return {
            nama: String(values.get("nama") ?? ""),
            email: String(values.get("email") ?? ""),
            nomorHP: String(values.get("nomorHP") ?? ""),
            gender: GENDER_LABELS[values.get("gender")],
            negara: COUNTRY_LABELS[values.get("warga_negara")]
        };
    }

    function resetFormFeedback() {
        ["nama", "email", "nomorHP"].forEach(id =>
            clearFieldFeedback(document.getElementById(id)));
    }

    form.addEventListener("input", event => {
        const field = event.target?.id;
        if (!["nama", "email", "nomorHP"].includes(field)) return;
        const value = event.target.value.trim();
        if (!value) {
            clearFieldFeedback(event.target);
            return;
        }
        showFieldFeedback(event.target, validateField(field, value, users));
    });

    form.addEventListener("submit", event => {
        event.preventDefault();
        const values = getFormValues();
        const error = validateUser(values, users);
        if (error) {
            notify(error.message, "error");
            document.getElementById(error.field === "negara" ? "FormPengguna" : error.field)?.focus();
            return;
        }
        const user = createUser(values, createId());
        if (!commit(addUser(users, user))) return;
        form.reset();
        resetFormFeedback();
        modal.close();
        notify("Pengguna ditambahkan");
    });

    btnAdd.addEventListener("click", async () => {
        if (blocked) {
            notify("Data tersimpan tidak valid atau tidak dapat dibaca.", "error");
            return;
        }
        if (!await confirmAction("Tambah Pengguna", "Apakah kamu ingin menambahkan pengguna baru?", "Ya, Tambah")) return;
        modal.showModal();
        document.getElementById("nama").focus({ preventScroll: true });
    });

    btnClose.addEventListener("click", () => modal.close());
    modal.addEventListener("close", () => {
        form.reset();
        resetFormFeedback();
    });

    tbody.addEventListener("input", event => {
        const field = event.target?.dataset.field;
        const row = event.target?.closest("tr");
        if (!editingDraft || row?.dataset.userId !== editingId || !field) return;
        editingDraft[field] = event.target.value;
        if (!["nama", "email", "nomorHP"].includes(field)) return;
        const value = event.target.value.trim();
        if (!value) clearFieldFeedback(event.target);
        else showFieldFeedback(event.target, validateField(field, value, users, editingId));
    });
    tbody.addEventListener("change", event => {
        const field = event.target?.dataset.field;
        if (editingDraft && event.target.closest("tr")?.dataset.userId === editingId && field) {
            editingDraft[field] = event.target.value;
        }
    });

    tbody.addEventListener("click", async event => {
        const button = event.target.closest("button[data-action]");
        const row = button?.closest("tr[data-user-id]");
        if (!row) return;
        const id = row.dataset.userId;
        const action = button.dataset.action;
        const user = users.find(item => item.id === id);
        if (!user) return;

        if (action === "delete") {
            if (!await confirmAction("Hapus Pengguna", `Apakah kamu yakin ingin menghapus data ${user.nama}?`, "Ya, Hapus")) return;
            if (!users.some(item => item.id === id)) return;
            if (commit(deleteUser(users, id))) {
                if (editingId === id) { editingId = null; editingDraft = null; render(); }
                notify("Pengguna berhasil dihapus");
            }
        } else if (action === "edit") {
            if (editingId && editingId !== id) {
                notify("Selesaikan atau batalkan edit yang sedang aktif dahulu", "error");
                return;
            }
            if (!await confirmAction("Edit Pengguna", `Apakah kamu ingin mengedit data ${user.nama}?`, "Ya, Edit")) return;
            if (!users.some(item => item.id === id)) return;
            editingId = id;
            editingDraft = { ...user };
            render();
            tbody.querySelector(`tr[data-user-id="${CSS.escape(id)}"] input[data-field="nama"]`)?.focus();
        } else if (action === "save") {
            if (editingId !== id || !editingDraft) return;
            const error = validateUser(editingDraft, users, id);
            if (error) {
                notify(error.message, "error");
                const input = row.querySelector(`[data-field="${error.field}"]`);
                if (input && input.tagName === "INPUT") showFieldFeedback(input, error.message);
                input?.focus();
                return;
            }
            const next = updateUser(users, id, createUser(editingDraft, id));
            if (!commit(next)) return;
            editingId = null;
            editingDraft = null;
            render();
            notify("Data pengguna diperbarui");
        } else if (action === "cancel") {
            editingId = null;
            editingDraft = null;
            render();
        }
    });

    function cancelEditWhenFiltering() {
        if (editingId !== null) {
            editingId = null;
            editingDraft = null;
            notify("Edit yang belum disimpan dibatalkan saat filter berubah", "error");
        }
    }

    function runSearch() {
        cancelEditWhenFiltering();
        currentSearch = {
            keyword: searchInput.value,
            kolom: searchColumn.value,
            gender: genderFilter.value
        };
        render();
    }
    document.getElementById("btnCari").addEventListener("click", runSearch);
    searchInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            runSearch();
        }
    });
    document.getElementById("resetPencarian").addEventListener("click", () => {
        cancelEditWhenFiltering();
        searchInput.value = "";
        searchColumn.value = "nama";
        genderFilter.value = "semua";
        currentSearch = { keyword: "", kolom: "nama", gender: "semua" };
        render();
        searchInput.focus();
    });

    render();
    if (blocked) {
        notify("Local Storage gagal dibaca; data tidak ditimpa demi keamanan.", "error");
    } else if (initial.migrated) {
        notify("Data dari versi lama berhasil dipindahkan ke format baru");
    }
    return { getUsers: () => users.map(item => ({ ...item })) };
}
