/* =========================================================
   NGVega S.U.R.L — Interacciones
   ========================================================= */

(() => {
  'use strict';

  // =========================================================
  // 1. AÑO DINÁMICO EN FOOTER
  // =========================================================
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  // =========================================================
  // 2. MENÚ MÓVIL
  // =========================================================
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    // Cierra al hacer clic en un enlace
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }


  // =========================================================
  // 3. FORMULARIO → WHATSAPP
  // =========================================================

  // ⚙️ CONFIGURACIÓN: WhatsApp principal de NGVega
  // Formato: código de país + número, SIN "+", SIN espacios
  // Cuba = 53
  const WHATSAPP_NUMBER = '5354256523';   // 👈 principal
  // Alternativo: '5355961751'

  const form = document.getElementById('contactForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      const data = {
        nombre: form.nombre.value.trim(),
        modelo: form.modelo.value.trim(),
        problema: form.problema.value,
        detalle: form.detalle.value.trim()
      };

      let valid = true;

      if (!data.nombre) { setError('nombre', 'Por favor, indica tu nombre.'); valid = false; }
      if (!data.modelo) { setError('modelo', 'Indica el modelo de tu equipo.'); valid = false; }
      if (!data.problema) { setError('problema', 'Selecciona el servicio que necesitas.'); valid = false; }

      if (!valid) {
        const firstError = form.querySelector('.has-error input, .has-error select');
        if (firstError) firstError.focus();
        return;
      }

      // Mensaje preformateado elegante
      const mensaje =
        `*Nueva solicitud — NGVega S.U.R.L*%0A%0A` +
        `👤 *Nombre:* ${encodeURIComponent(data.nombre)}%0A` +
        `📱 *Modelo:* ${encodeURIComponent(data.modelo)}%0A` +
        `🔧 *Servicio:* ${encodeURIComponent(data.problema)}` +
        (data.detalle ? `%0A📝 *Detalle:* ${encodeURIComponent(data.detalle)}` : '') +
        `%0A%0A_Enviado desde la web de NGVega_`;

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`;

      // Feedback visual
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Abriendo WhatsApp…';

      window.open(url, '_blank', 'noopener');

      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = original;
      }, 1500);
    });

    function setError(name, msg) {
      const field = form[name]?.closest('.field');
      if (!field) return;
      field.classList.add('has-error');
      const err = field.querySelector('.error');
      if (err) err.textContent = msg;
    }

    function clearErrors() {
      form.querySelectorAll('.has-error').forEach(f => f.classList.remove('has-error'));
      form.querySelectorAll('.error').forEach(e => (e.textContent = ''));
    }

    // Limpia error al escribir
    form.querySelectorAll('input, select, textarea').forEach(el => {
      el.addEventListener('input', () => {
        const field = el.closest('.field');
        field?.classList.remove('has-error');
        const err = field?.querySelector('.error');
        if (err) err.textContent = '';
      });
    });
  }


  // =========================================================
  // 4. SCROLL REVEAL SUAVE
  // =========================================================
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.card, .step, .feature, .price-card, .testimonial, .section__head')
      .forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity .6s ease, transform .6s ease';
        io.observe(el);
      });
  }


  // =========================================================
  // 5. CONVERSIÓN USD → CUP (precios automáticos)
  // =========================================================

  // ⚙️ CONFIGURACIÓN: tasa del día (1 USD = X CUP)
  // Ajústala según el mercado informal cubano
  const TASA_CUP = 650;   // 👈 cambia aquí la tasa

  function actualizarPreciosCUP() {
    // Actualiza la nota de tasa
    const tasaEl = document.getElementById('tasa-cup');
    if (tasaEl) tasaEl.textContent = TASA_CUP.toLocaleString('es-CU');

    // Actualiza cada precio en CUP
    document.querySelectorAll('.price-card__cup').forEach(el => {
      const usdMin = parseFloat(el.dataset.usdMin);
      const usdMax = parseFloat(el.dataset.usdMax);
      if (isNaN(usdMin) || isNaN(usdMax)) return;

      const cupMin = Math.round(usdMin * TASA_CUP);
      const cupMax = Math.round(usdMax * TASA_CUP);

      el.textContent = `≈ ${cupMin.toLocaleString('es-CU')} – ${cupMax.toLocaleString('es-CU')} CUP`;
    });
  }

  // Ejecuta cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', actualizarPreciosCUP);
  } else {
    actualizarPreciosCUP();
  }

})();