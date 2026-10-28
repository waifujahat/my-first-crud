export function initConfirmDialog() {
  const dialog = document.getElementById('modalKonfirmasi');
  const title = document.getElementById('judulKonfirmasi');
  const message = document.getElementById('pesanKonfirmasi');
  const yes = document.getElementById('btnYaKonfirmasi');

  return function confirmAction(heading, description, actionLabel = 'Ya') {
    if (dialog.open) return Promise.resolve(false);
    title.textContent = heading;
    message.textContent = description;
    yes.textContent = actionLabel;
    dialog.returnValue = '';
    return new Promise((resolve) => {
      dialog.addEventListener('close', () => resolve(dialog.returnValue === 'ya'), { once: true });
      dialog.showModal();
    });
  };
}
