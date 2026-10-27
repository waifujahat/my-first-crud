export function showFieldFeedback(input, message) {
    let info = input.nextElementSibling;
    if (!info?.classList.contains("pesan-validasi")) {
        info = document.createElement("small");
        info.className = "pesan-validasi";
        input.insertAdjacentElement("afterend", info);
    }
    input.classList.toggle("input-invalid", Boolean(message));
    input.classList.toggle("input-valid", !message);
    input.setAttribute("aria-invalid", String(Boolean(message)));
    info.className = `pesan-validasi ${message ? "pesan-error" : "pesan-success"}`;
    info.textContent = message || "Data valid";
}

export function clearFieldFeedback(input) {
    input.classList.remove("input-valid", "input-invalid");
    input.removeAttribute("aria-invalid");
    if (input.nextElementSibling?.classList.contains("pesan-validasi")) {
        input.nextElementSibling.remove();
    }
}
