export function initSidebar() {
  const toggle = document.getElementById('btnToggleSidebar');
  const close = document.getElementById('btnCloseSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const sidebar = document.getElementById('sidebarUtama');
  const mobile = matchMedia('(max-width: 850px)');

  function isOpen() {
    return mobile.matches
      ? document.body.classList.contains('sidebar-open')
      : !document.body.classList.contains('sidebar-collapsed');
  }
  function sync() {
    const open = isOpen();
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Tutup sidebar' : 'Buka sidebar');
    sidebar.inert = !open;
  }
  function dismiss() {
    document.body.classList.remove('sidebar-open');
    sync();
  }
  toggle.addEventListener('click', () => {
    document.body.classList.toggle(mobile.matches ? 'sidebar-open' : 'sidebar-collapsed');
    sync();
  });
  close.addEventListener('click', () => {
    dismiss();
    toggle.focus();
  });
  overlay.addEventListener('click', () => {
    dismiss();
    toggle.focus();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobile.matches && isOpen()) {
      dismiss();
      toggle.focus();
    }
  });
  sidebar.querySelectorAll('.nav-link').forEach((link) =>
    link.addEventListener('click', () => {
      if (mobile.matches) dismiss();
    }),
  );
  mobile.addEventListener('change', () => {
    document.body.classList.remove('sidebar-open', 'sidebar-collapsed');
    sync();
  });
  sync();
}
