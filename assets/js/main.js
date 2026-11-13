/**
 * Wood Carving Studio — Main Application Script
 * Vanilla JS | Accessible | Zero External Dependencies
 */

(function () {
  'use strict';

  // State Management
  const STORAGE_KEY_THEME = 'wcs_theme';
  const STORAGE_KEY_DIR = 'wcs_direction';

  // DOM Elements
  const htmlEl = document.documentElement;
  const pageLoader = document.getElementById('page-loader');
  const siteHeader = document.querySelector('.site-header');
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  // Theme Toggles
  const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');

  // Direction Toggles
  const dirToggleDesktop = document.getElementById('dir-toggle-desktop');
  const dirToggleMobile = document.getElementById('dir-toggle-mobile');

  // Navigation & Dropdown
  const homeDropdownBtn = document.getElementById('home-dropdown-btn');
  const homeDropdownMenu = document.getElementById('home-dropdown-menu');

  // Mobile Drawer
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileDrawerBackdrop = document.getElementById('mobile-drawer-backdrop');
  const mobileHomeAccordionBtn = document.getElementById('mobile-home-accordion-btn');
  const mobileHomeSubnav = document.getElementById('mobile-home-subnav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-subnav-link');

  // Login Modal
  const loginBtnDesktop = document.getElementById('login-btn-desktop');
  const loginBtnMobile = document.getElementById('login-btn-mobile');
  const loginModal = document.getElementById('login-modal');
  const loginModalClose = document.getElementById('login-modal-close');
  const modalTabLogin = document.getElementById('tab-login-btn');
  const modalTabRegister = document.getElementById('tab-register-btn');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');

  /* ==========================================================================
     1. Preloader System
     ========================================================================== */
  function hideLoader() {
    if (pageLoader && !pageLoader.classList.contains('loaded')) {
      pageLoader.classList.add('loaded');
      setTimeout(() => {
        pageLoader.style.display = 'none';
      }, 450);
    }
  }

  window.addEventListener('load', () => {
    setTimeout(hideLoader, 350);
  });
  // Fallback timeout in case asset loading hangs
  setTimeout(hideLoader, 2000);

  /* ==========================================================================
     2. Theme System (Strict #000000 Dark Mode)
     ========================================================================== */
  function applyTheme(theme) {
    if (theme === 'dark') {
      htmlEl.classList.add('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
      updateThemeButtons(true);
    } else {
      htmlEl.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
      updateThemeButtons(false);
    }
  }

  function updateThemeButtons(isDark) {
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    [themeToggleDesktop, themeToggleMobile].forEach(btn => {
      if (btn) {
        btn.setAttribute('aria-label', label);
        btn.setAttribute('title', label);
        const sunIcon = btn.querySelector('.icon-sun');
        const moonIcon = btn.querySelector('.icon-moon');
        if (sunIcon && moonIcon) {
          if (isDark) {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
          } else {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
          }
        }
      }
    });
  }

  function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
    if (savedTheme) {
      applyTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyTheme('dark');
    } else {
      applyTheme('light');
    }
  }

  function toggleTheme() {
    const isDark = htmlEl.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
  }

  if (themeToggleDesktop) themeToggleDesktop.addEventListener('click', toggleTheme);
  if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

  /* ==========================================================================
     3. RTL / LTR Direction System
     ========================================================================== */
  function applyDirection(dir) {
    htmlEl.dir = dir;
    localStorage.setItem(STORAGE_KEY_DIR, dir);
    const label = dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL';
    [dirToggleDesktop, dirToggleMobile].forEach(btn => {
      if (btn) {
        btn.setAttribute('aria-label', label);
        btn.setAttribute('title', label);
        const textSpan = btn.querySelector('.dir-label');
        if (textSpan) {
          textSpan.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
        }
      }
    });
  }

  function initDirection() {
    const savedDir = localStorage.getItem(STORAGE_KEY_DIR);
    if (savedDir) {
      applyDirection(savedDir);
    } else {
      applyDirection('ltr');
    }
  }

  function toggleDirection() {
    closeMobileDrawer();
    const current = htmlEl.dir || 'ltr';
    applyDirection(current === 'rtl' ? 'ltr' : 'rtl');
  }

  if (dirToggleDesktop) dirToggleDesktop.addEventListener('click', toggleDirection);
  if (dirToggleMobile) dirToggleMobile.addEventListener('click', toggleDirection);

  /* ==========================================================================
     4. Home Dropdown (Click Only — Hover Disabled)
     ========================================================================== */
  function toggleHomeDropdown(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!homeDropdownMenu) return;
    const isOpen = homeDropdownMenu.classList.contains('open');
    if (isOpen) {
      closeHomeDropdown();
    } else {
      openHomeDropdown();
    }
  }

  function openHomeDropdown() {
    if (homeDropdownMenu && homeDropdownBtn) {
      homeDropdownMenu.classList.add('open');
      homeDropdownBtn.setAttribute('aria-expanded', 'true');
    }
  }

  function closeHomeDropdown() {
    if (homeDropdownMenu && homeDropdownBtn) {
      homeDropdownMenu.classList.remove('open');
      homeDropdownBtn.setAttribute('aria-expanded', 'false');
    }
  }

  if (homeDropdownBtn) {
    homeDropdownBtn.addEventListener('click', toggleHomeDropdown);
    homeDropdownBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeHomeDropdown();
    });
  }

  // Ensure dropdown links close dropdown when selected
  const dropdownLinks = document.querySelectorAll('.dropdown-link');
  dropdownLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeHomeDropdown();
    });
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (homeDropdownMenu && homeDropdownMenu.classList.contains('open')) {
      if (!homeDropdownMenu.contains(e.target) && !homeDropdownBtn.contains(e.target)) {
        closeHomeDropdown();
      }
    }
  });

  // Automatically close dropdown on window scroll
  window.addEventListener('scroll', () => {
    if (homeDropdownMenu && homeDropdownMenu.classList.contains('open')) {
      closeHomeDropdown();
    }
  }, { passive: true });

  /* ==========================================================================
     5. Mobile Menu & Accordion
     ========================================================================== */
  function resetMobileAccordion() {
    if (mobileHomeSubnav && mobileHomeAccordionBtn) {
      mobileHomeSubnav.classList.remove('open');
      mobileHomeAccordionBtn.setAttribute('aria-expanded', 'false');
      const arrow = mobileHomeAccordionBtn.querySelector('.accordion-arrow');
      if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
  }

  function openMobileDrawer() {
    if (mobileDrawer && mobileDrawerBackdrop) {
      // Ensure accordion starts completely closed automatically whenever drawer opens
      resetMobileAccordion();
      mobileDrawer.classList.add('open');
      mobileDrawerBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (mobileToggleBtn) mobileToggleBtn.setAttribute('aria-expanded', 'true');
    }
  }

  function closeMobileDrawer() {
    if (mobileDrawer && mobileDrawerBackdrop) {
      resetMobileAccordion();
      mobileDrawer.classList.remove('open');
      mobileDrawerBackdrop.classList.remove('open');
      document.body.style.overflow = '';
      if (mobileToggleBtn) mobileToggleBtn.setAttribute('aria-expanded', 'false');
    }
  }

  if (mobileToggleBtn) mobileToggleBtn.addEventListener('click', openMobileDrawer);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileDrawer);
  if (mobileDrawerBackdrop) mobileDrawerBackdrop.addEventListener('click', closeMobileDrawer);

  // Mobile Home Accordion (Click only — toggle open/closed)
  if (mobileHomeAccordionBtn && mobileHomeSubnav) {
    mobileHomeAccordionBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = mobileHomeSubnav.classList.contains('open');
      const arrow = mobileHomeAccordionBtn.querySelector('.accordion-arrow');
      if (isOpen) {
        mobileHomeSubnav.classList.remove('open');
        mobileHomeAccordionBtn.setAttribute('aria-expanded', 'false');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
      } else {
        mobileHomeSubnav.classList.add('open');
        mobileHomeAccordionBtn.setAttribute('aria-expanded', 'true');
        if (arrow) arrow.style.transform = 'rotate(180deg)';
      }
    });
  }

  // Clicking any mobile navigation anchor link closes the drawer (accordion toggle button excluded)
  const mobileNavAnchors = document.querySelectorAll('.mobile-drawer-nav a');
  mobileNavAnchors.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileDrawer();
    });
  });

  /* ==========================================================================
     6. Login / Register Modal
     ========================================================================== */
  function openLoginModal(e) {
    if (e) e.preventDefault();
    closeMobileDrawer();
    if (loginModal) {
      loginModal.classList.add('open');
      loginModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      // Focus first input
      setTimeout(() => {
        const firstInput = loginModal.querySelector('input');
        if (firstInput) firstInput.focus();
      }, 100);
    }
  }

  function closeLoginModal() {
    if (loginModal) {
      loginModal.classList.remove('open');
      loginModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (loginBtnDesktop) loginBtnDesktop.addEventListener('click', openLoginModal);
  if (loginBtnMobile) loginBtnMobile.addEventListener('click', openLoginModal);
  if (loginModalClose) loginModalClose.addEventListener('click', closeLoginModal);

  if (loginModal) {
    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) {
        closeLoginModal();
      }
    });
  }

  // Modal Tab Switching
  if (modalTabLogin && modalTabRegister && formLogin && formRegister) {
    modalTabLogin.addEventListener('click', () => {
      modalTabLogin.classList.add('active');
      modalTabRegister.classList.remove('active');
      formLogin.classList.remove('hidden');
      formRegister.classList.add('hidden');
    });

    modalTabRegister.addEventListener('click', () => {
      modalTabRegister.classList.add('active');
      modalTabLogin.classList.remove('active');
      formRegister.classList.remove('hidden');
      formLogin.classList.add('hidden');
    });
  }

  /* ==========================================================================
     7. Scroll Header & Scroll-to-Top
     ========================================================================== */
  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;

    // Fixed header shadow
    if (siteHeader) {
      if (scrollY > 15) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Scroll to top button visibility
    if (scrollTopBtn) {
      if (scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     8. Active Navigation Highlighting
     ========================================================================== */
  function getCurrentPageName() {
    let path = window.location.pathname || '';
    try {
      path = decodeURIComponent(path);
    } catch (e) {}
    path = path.replace(/\\/g, '/');
    let file = path.split('/').pop().split('?')[0].split('#')[0];
    if (!file || file === '' || file === '/') {
      file = 'index.html';
    }
    file = file.toLowerCase();
    if (file === 'home_2.html' || file === 'home 2.html') {
      file = 'home-2.html';
    }
    return file;
  }

  function highlightActiveNav() {
    const currentFile = getCurrentPageName();
    const isHome1 = currentFile === 'index.html';
    const isHome2 = currentFile === 'home-2.html';
    const isHome = isHome1 || isHome2;

    const allLinks = document.querySelectorAll('.nav-link, .dropdown-link, .mobile-nav-link, .mobile-subnav-link');
    allLinks.forEach(link => link.classList.remove('active'));

    if (isHome) {
      // Highlight "Home" in desktop header navigation
      if (homeDropdownBtn) {
        homeDropdownBtn.classList.add('active');
      }
      // Highlight "Home" in mobile drawer
      if (mobileHomeAccordionBtn) {
        mobileHomeAccordionBtn.classList.add('active');
      }

      // Highlight the specific active home item in dropdown and mobile subnav
      const targetHref = isHome1 ? 'index.html' : 'home-2.html';
      document.querySelectorAll(`a[href="${targetHref}"]`).forEach(link => {
        if (link.classList.contains('dropdown-link') || link.classList.contains('mobile-subnav-link')) {
          link.classList.add('active');
        }
      });
    } else {
      // Highlight current inner page
      allLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
          const linkFile = href.replace(/\\/g, '/').split('/').pop().split('?')[0].split('#')[0].toLowerCase();
          if (linkFile === currentFile) {
            link.classList.add('active');
          }
        }
      });
    }
  }

  /* ==========================================================================
     Interactive Specimen Gallery Switcher
     ========================================================================== */
  const galleryThumbs = document.querySelectorAll('.gallery-thumb-btn');
  const mainSpecimenImg = document.getElementById('main-specimen-img');
  const mainSpecimenCaption = document.getElementById('main-specimen-caption');

  if (galleryThumbs.length > 0 && mainSpecimenImg) {
    galleryThumbs.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetSrc = btn.getAttribute('data-img-src');
        const targetAlt = btn.getAttribute('data-img-alt') || 'Master carved specimen view';
        const targetCaption = btn.getAttribute('data-img-caption') || '';

        if (targetSrc) {
          mainSpecimenImg.classList.add('opacity-0');
          setTimeout(() => {
            mainSpecimenImg.src = targetSrc;
            mainSpecimenImg.alt = targetAlt;
            if (mainSpecimenCaption && targetCaption) {
              mainSpecimenCaption.textContent = targetCaption;
            }
            mainSpecimenImg.classList.remove('opacity-0');
          }, 150);
        }

        galleryThumbs.forEach((b) => b.classList.remove('border-amber-600', 'ring-2', 'ring-amber-500'));
        btn.classList.add('border-amber-600', 'ring-2', 'ring-amber-500');
      });
    });
  }

  /* ==========================================================================
     Catalog Reserve Piece In-Page Synchronization
     ========================================================================== */
  const reserveTriggers = document.querySelectorAll('.reserve-trigger-btn');
  const resPieceSelect = document.getElementById('res-piece');
  if (reserveTriggers.length > 0 && resPieceSelect) {
    reserveTriggers.forEach((btn) => {
      btn.addEventListener('click', () => {
        const pieceId = btn.getAttribute('data-piece');
        if (pieceId) {
          resPieceSelect.value = pieceId;
          // Smooth scroll into view
          const targetSection = document.getElementById('reserve-piece');
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
          }
          resPieceSelect.focus();
        }
      });
    });
  }

  /* ==========================================================================
     Catalog Pagination (3 Items per Page Across 9 Specimens)
     ========================================================================== */
  const catalogPagination = document.getElementById('catalog-pagination');
  if (catalogPagination) {
    const catalogCards = document.querySelectorAll('[data-catalog-page]');
    const pageButtons = catalogPagination.querySelectorAll('.catalog-page-btn');
    const prevBtn = document.getElementById('cat-prev-btn');
    const nextBtn = document.getElementById('cat-next-btn');
    let currentCatalogPage = 1;
    const totalCatalogPages = 3;

    function renderCatalogPage(targetPage, shouldScroll) {
      currentCatalogPage = targetPage;

      catalogCards.forEach((card) => {
        const page = parseInt(card.getAttribute('data-catalog-page'), 10);
        if (page === currentCatalogPage) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });

      pageButtons.forEach((btn) => {
        const pageNum = parseInt(btn.getAttribute('data-page'), 10);
        if (pageNum === currentCatalogPage) {
          btn.setAttribute('aria-current', 'page');
          btn.className = 'catalog-page-btn w-10 h-10 rounded-lg text-xs font-bold transition-all bg-amber-800 dark:bg-amber-600 text-white shadow-sm';
        } else {
          btn.removeAttribute('aria-current');
          btn.className = 'catalog-page-btn w-10 h-10 rounded-lg text-xs font-bold transition-all border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 hover:bg-amber-600/10 hover:border-amber-600/40';
        }
      });

      if (prevBtn) {
        prevBtn.disabled = (currentCatalogPage <= 1);
      }
      if (nextBtn) {
        nextBtn.disabled = (currentCatalogPage >= totalCatalogPages);
      }

      if (shouldScroll) {
        const catalogHeading = document.getElementById('catalog-heading');
        if (catalogHeading) {
          catalogHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }

    pageButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const page = parseInt(btn.getAttribute('data-page'), 10);
        if (page && page !== currentCatalogPage) {
          renderCatalogPage(page, true);
        }
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentCatalogPage > 1) {
          renderCatalogPage(currentCatalogPage - 1, true);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentCatalogPage < totalCatalogPages) {
          renderCatalogPage(currentCatalogPage + 1, true);
        }
      });
    }

    // Initialize with Page 1
    renderCatalogPage(1, false);
  }

  /* ==========================================================================
     Global Keydown Listener (Escape handling)
     ========================================================================== */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeHomeDropdown();
      closeMobileDrawer();
      closeLoginModal();
    }
  });

  /* ==========================================================================
     Initialization
     ========================================================================== */
  initTheme();
  initDirection();
  highlightActiveNav();
  handleScroll();

})();

