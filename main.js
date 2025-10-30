document.addEventListener('DOMContentLoaded', () => {
    /* ===========================
       1) MENÚ / DROPDOWNS
    =========================== */
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const dropdowns = document.querySelectorAll('.dropdown');

    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Control de dropdowns
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        if (!link) return;

        link.addEventListener('click', (e) => {
            e.preventDefault();
            // cerrar los demás dropdowns
            dropdowns.forEach(d => d !== dropdown && d.classList.remove('active'));
            // alternar el actual
            dropdown.classList.toggle('active');
        });
    });

    // Cerrar menú en mobile al hacer click en un enlace que NO sea dropdown
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                const parentLi = link.closest('li');
                if (!parentLi.classList.contains('dropdown')) {
                    mobileMenu?.classList.remove('active');
                    navMenu?.classList.remove('active');
                    dropdowns.forEach(d => d.classList.remove('active'));
                }
            }
        });
    });

    // Cerrar dropdowns al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (window.innerWidth > 768 && !e.target.closest('.dropdown')) {
            dropdowns.forEach(d => d.classList.remove('active'));
        }
    });

    // Reset menú al cambiar de tamaño
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            mobileMenu?.classList.remove('active');
            navMenu?.classList.remove('active');
        } else {
            dropdowns.forEach(d => d.classList.remove('active'));
        }
    });

    /* ===========================
       2) ATALLOS DEL FOOTER
    =========================== */
    const footerLinks = document.querySelectorAll('footer a[data-destino]');
    if (footerLinks.length > 0) {
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const destino = link.getAttribute('data-destino');
                const navMenu = document.getElementById('nav-menu');
                const dropdown = document.querySelector('.dropdown');
                const mobileMenu = document.getElementById('mobile-menu');

                if (!navMenu || !dropdown) return;

                // Subir hasta el nav
                navMenu.scrollIntoView({ behavior: 'smooth' });

                // Abrir menú y submenú
                navMenu.classList.add('active');
                dropdown.classList.add('active');
                if (mobileMenu && window.innerWidth <= 768) {
                    mobileMenu.classList.add('active');
                }

                // Si es "destinos" → solo abre el submenú
                if (destino === "destinos") return;

                // Buscar destino en dropdown
                const destinoLink = Array.from(dropdown.querySelectorAll('.dropdown-content a'))
                    .find(a => a.textContent.trim() === destino);

                if (destinoLink) {
                    destinoLink.classList.add('highlight');
                    setTimeout(() => destinoLink.classList.remove('highlight'), 3000);
                }
            });
        });
    }

    /* ===========================
       3) CARRUSEL
    =========================== */
    const carousels = document.querySelectorAll('.carousel, .hero-carousel');
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.querySelectorAll('img'));
        let currentIndex = 0;
        let autoSlideInterval;

        function updateCarousel() {
            const slideWidth = carousel.clientWidth;
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        }

        function startAutoSlide() {
            if (carousel.classList.contains('hero-carousel')) {
                autoSlideInterval = setInterval(() => {
                    currentIndex = (currentIndex + 1) % slides.length;
                    updateCarousel();
                }, 9000);
            }
        }

        // Iniciar carrusel automático para hero-carousel
        if (carousel.classList.contains('hero-carousel')) {
            startAutoSlide();
        }

        // Ajustar al redimensionar
        window.addEventListener('resize', updateCarousel);

        // Controles manuales del carrusel
        if (carousel.classList.contains('carousel')) {
            const prevBtn = carousel.querySelector('.carousel-btn.prev');
            const nextBtn = carousel.querySelector('.carousel-btn.next');
            const indicators = Array.from(carousel.querySelectorAll('.carousel-indicators .material-symbols-outlined'));

            function updateIndicators(index) {
                indicators.forEach((ind, i) => {
                    if (i === index) {
                        ind.textContent = "radio_button_checked";
                        ind.classList.add("active");
                    } else {
                        ind.textContent = "radio_button_unchecked";
                        ind.classList.remove("active");
                    }
                });
            }

            // Botón siguiente
            nextBtn?.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
                updateIndicators(currentIndex);
            });

            // Botón anterior
            prevBtn?.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
                updateIndicators(currentIndex);
            });

            // Click en indicadores
            indicators.forEach((ind, i) => {
                ind.addEventListener('click', () => {
                    currentIndex = i;
                    updateCarousel();
                    updateIndicators(currentIndex);
                });
            });

            // Inicializar indicadores
            updateIndicators(currentIndex);
        }

        // Inicializar
        updateCarousel();
    });
});