/**
 * motion.ts — Helpers de animação com Motion One
 * Importar nos componentes que precisam de animação dinâmica.
 * Para animações simples de scroll reveal, usar [data-reveal] no HTML
 * que é tratado automaticamente pelo BaseLayout.
 */

/**
 * Anima um contador de 0 até `target`.
 * Usar no Stats.astro e qualquer número que deve "contar" na tela.
 *
 * @example
 * animateCounter(document.querySelector('.stat-number'), 1500)
 */
export function animateCounter(el: Element, target: number, duration = 1800): void {
  const start = performance.now();
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  function step(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(easeOutCubic(progress) * target);
    el.textContent = value.toLocaleString('pt-BR');
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/**
 * Anima um counter com prefixo e/ou sufixo.
 * @example
 * animateCounterFull(el, { target: 30, prefix: '€' })
 * animateCounterFull(el, { target: 67, suffix: '%' })
 */
export function animateCounterFull(
  el: Element,
  opts: { target: number; prefix?: string; suffix?: string; duration?: number }
): void {
  const { target, prefix = '', suffix = '', duration = 1800 } = opts;
  const start = performance.now();
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);

  function step(now: number) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = prefix + Math.round(ease(progress) * target).toLocaleString('pt-BR') + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/**
 * Dispara animação quando elemento entra na viewport.
 * Wraper genérico para IntersectionObserver.
 */
export function onVisible(
  el: Element,
  callback: (el: Element) => void,
  threshold = 0.3
): void {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold }
  );
  obs.observe(el);
}

/**
 * Aplica stagger (delay crescente) em um grupo de filhos.
 * Útil em grids de cards para entrar em cascata.
 *
 * @example
 * staggerChildren('.features-grid', '.card', 100)
 */
export function staggerChildren(
  parentSelector: string,
  childSelector: string,
  delayMs = 80
): void {
  const parent = document.querySelector(parentSelector);
  if (!parent) return;

  const children = parent.querySelectorAll(childSelector);
  onVisible(parent, () => {
    children.forEach((child, i) => {
      setTimeout(() => {
        child.classList.add('visible');
      }, i * delayMs);
    });
  });
}

/**
 * Anima a entrada do Hero — scale + fade suave.
 * Chamar após DOMContentLoaded.
 */
export function animateHeroEntry(selector = '.hero-content'): void {
  const el = document.querySelector(selector) as HTMLElement | null;
  if (!el) return;
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  });
}
