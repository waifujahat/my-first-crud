const THEME_KEY = 'crud_operator_theme';

export function initTheme(notify) {
  const toggle = document.getElementById('themeToggle');
  const label = document.getElementById('themeStatus');

  function apply(value) {
    const dark = value === 'dark';
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    toggle.checked = dark;
    label.textContent = dark ? 'Mode gelap aktif' : 'Mode terang aktif';
  }
  try {
    apply(localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light');
  } catch (error) {
    console.warn('Preferensi tema tidak dapat dibaca:', error);
    apply('light');
  }
  toggle.addEventListener('change', () => {
    const theme = toggle.checked ? 'dark' : 'light';
    apply(theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.warn('Preferensi tema tidak dapat disimpan:', error);
      notify('Tema berubah, tetapi preferensi tidak dapat disimpan', 'error');
    }
  });
}
