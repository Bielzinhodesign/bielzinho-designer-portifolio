/**
 * ============================================================================
 * PORTFÓLIO BIELZINHO DESIGN - COMPORTAMENTO & INTERATIVIDADE (JS)
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Elementos da Navbar
  const navbar = document.getElementById('mainNavbar');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .hero-section .btn');
  const navbarCollapse = document.getElementById('navbarContent');
  let bsCollapse = null;

  if (navbarCollapse) {
    // Inicializa a instância do Collapse do Bootstrap
    bsCollapse = new bootstrap.Collapse(navbarCollapse, {
      toggle: false
    });
  }

  /* --------------------------------------------------------------------------
     1. NAVEGAÇÃO SUAVE (SMOOTH SCROLL) COM COMPENSAÇÃO DA NAVBAR
     -------------------------------------------------------------------------- */
  navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');

      // Verifica se é um link âncora interno
      if (targetId && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          event.preventDefault();

          // Calcula a posição do elemento compensando a altura da navbar fixa
          const navbarHeight = navbar ? navbar.offsetHeight : 70;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // No mobile: fecha o menu hambúrguer após o clique
          if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            bsCollapse.hide();
          }
        }
      }
    });
  });

  /* --------------------------------------------------------------------------
     2. EFEITO DE NAVBAR AO ROLAR A PÁGINA (SCROLL EFFECT)
     -------------------------------------------------------------------------- */
  const handleNavbarScroll = () => {
    if (!navbar) return;

    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Executa na carga inicial

  /* --------------------------------------------------------------------------
     3. REFRESH DO BOOTSTRAP SCROLLSPY
     -------------------------------------------------------------------------- */
  const scrollSpyElement = document.body;
  if (scrollSpyElement && typeof bootstrap !== 'undefined') {
    const dataSpyList = [].slice.call(document.querySelectorAll('[data-bs-spy="scroll"]'));
    dataSpyList.forEach((dataSpyEl) => {
      bootstrap.ScrollSpy.getInstance(dataSpyEl)?.refresh();
    });
  }

  /* --------------------------------------------------------------------------
     4. LIGHTBOX / VISUALIZAÇÃO AMPLIADA DA GALERIA
     -------------------------------------------------------------------------- */
  const lightbox = document.getElementById('imageLightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const galleryCards = document.querySelectorAll('.project-card');

  const openLightbox = (imgSrc, imgAlt, captionText) => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = imgSrc;
    lightboxImg.alt = imgAlt || 'Imagem ampliada do projeto';
    if (lightboxCaption) {
      lightboxCaption.textContent = captionText || '';
    }
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Limpa a imagem após a transição suave de saída
    setTimeout(() => {
      if (!lightbox.classList.contains('active') && lightboxImg) {
        lightboxImg.src = '';
      }
    }, 350);
  };

  // Associa o clique na foto e na moldura de cada card da galeria
  galleryCards.forEach(card => {
    const photo = card.querySelector('.gallery-photo');
    const titleEl = card.querySelector('.project-title');
    const frame = card.querySelector('.project-frame');

    if (photo) {
      const clickHandler = (e) => {
        e.preventDefault();
        const imgSrc = photo.getAttribute('src');
        const imgAlt = photo.getAttribute('alt');
        const captionText = titleEl ? titleEl.textContent.trim() : '';
        openLightbox(imgSrc, imgAlt, captionText);
      };

      photo.addEventListener('click', clickHandler);
      if (frame) {
        frame.addEventListener('click', clickHandler);
      }
    }
  });

  // Fechar no botão X
  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

  // Fechar ao clicar fora da imagem (no overlay escurecido)
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.id === 'lightboxContainer') {
        closeLightbox();
      }
    });
  }

  // Fechar com a tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      closeLightbox();
    }
  });
});

