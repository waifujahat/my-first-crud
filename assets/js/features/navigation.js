export function initNavigation() {
  const pages = {
    overview: document.getElementById('pageOverview'),
    pengguna: document.getElementById('pagePengguna'),
    setting: document.getElementById('pageSetting'),
  };
  const config = {
    overview: {
      title: 'Beranda',
      description: 'Informasi statistik',
      breadcrumb: 'Beranda',
    },
    pengguna: {
      title: 'Data Pengguna',
      description: 'Cari, tambah, edit, dan kelola seluruh data pengguna',
      breadcrumb: 'Data Pengguna',
    },
    setting: {
      title: 'Setting',
      description: 'Kelola preferensi dan informasi aplikasi',
      breadcrumb: 'Setting',
    },
  };
  const links = document.querySelectorAll('.side-nav .nav-link[data-page]');
  const title = document.querySelector('.header h1');
  const description = document.querySelector('.header p');
  const breadcrumb = document.getElementById('pageBreadcrumb');
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  function showPage(requested) {
    const name = Object.hasOwn(pages, requested) ? requested : 'overview';
    Object.entries(pages).forEach(([pageName, page]) => {
      page.hidden = pageName !== name;
    });
    links.forEach((link) => {
      const active = link.dataset.page === name;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    title.textContent = config[name].title;
    description.textContent = config[name].description;
    breadcrumb.textContent = config[name].breadcrumb;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }

  links.forEach((link) =>
    link.addEventListener('click', () => {
      if (window.location.hash === link.getAttribute('href')) showPage(link.dataset.page);
    }),
  );
  window.addEventListener('hashchange', () => showPage(window.location.hash.slice(1)));
  showPage(window.location.hash.slice(1) || 'overview');
}
