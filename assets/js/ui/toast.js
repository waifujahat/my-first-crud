export function initToast() {
  const element = document.getElementById('toast');
  let timer = null;
  return function notify(message, kind = 'success') {
    window.clearTimeout(timer);
    element.textContent = message;
    element.className = `toast toast-${kind === 'error' ? 'error' : 'success'}`;
    element.setAttribute('role', kind === 'error' ? 'alert' : 'status');
    element.hidden = false;
    timer = window.setTimeout(() => {
      element.hidden = true;
    }, 4000);
  };
}
