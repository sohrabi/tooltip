import { afterEach, describe, expect, it, vi } from 'vitest';
import { initTooltip } from '../src/index';

const createTarget = (content = 'Helpful text'): HTMLButtonElement => {
  const target = document.createElement('button');
  target.dataset.tooltip = content;
  document.body.appendChild(target);
  vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(new DOMRect(100, 100, 40, 20));
  return target;
};

const getTooltip = (): HTMLElement => {
  const tooltip = document.querySelector('.sohrabi-tooltip');
  if (!(tooltip instanceof HTMLElement)) throw new Error('Tooltip element was not created.');

  vi.spyOn(tooltip, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 80, 30));
  return tooltip;
};

const hover = (target: HTMLElement): void => {
  target.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
};

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe('initTooltip', () => {
  it('creates one hidden and accessible tooltip element', () => {
    const instance = initTooltip();
    const tooltip = getTooltip();

    expect(tooltip.getAttribute('role')).toBe('tooltip');
    expect(tooltip.getAttribute('aria-hidden')).toBe('true');
    expect(tooltip.style.display).toBe('none');

    instance.destroy();
  });

  it('returns the existing instance when initialized more than once', () => {
    const firstInstance = initTooltip();
    const secondInstance = initTooltip({ color: 'red' });

    expect(secondInstance).toBe(firstInstance);
    expect(document.querySelectorAll('.sohrabi-tooltip')).toHaveLength(1);
    firstInstance.destroy();
  });

  it('shows plain text on hover and links it to the target', () => {
    const target = createTarget('<strong>Safe content</strong>');
    const instance = initTooltip();
    const tooltip = getTooltip();

    hover(target);

    expect(tooltip.textContent).toBe('<strong>Safe content</strong>');
    expect(tooltip.querySelector('strong')).toBeNull();
    expect(tooltip.style.visibility).toBe('visible');
    expect(tooltip.getAttribute('aria-hidden')).toBe('false');
    expect(target.getAttribute('aria-describedby')).toContain(tooltip.id);

    instance.destroy();
  });

  it('renders HTML only when it is explicitly enabled', () => {
    const target = createTarget('<strong>Trusted content</strong>');
    const instance = initTooltip({ allowHTML: true });
    const tooltip = getTooltip();

    hover(target);

    expect(tooltip.querySelector('strong')?.textContent).toBe('Trusted content');
    instance.destroy();
  });

  it('uses valid requested positions and ignores invalid values', () => {
    const target = createTarget();
    target.dataset.positions = 'invalid, right';
    const instance = initTooltip({ offset: 8 });
    const tooltip = getTooltip();

    hover(target);

    expect(tooltip.dataset.position).toBe('right');
    expect(tooltip.style.left).toBe('148px');
    instance.destroy();
  });

  it('falls back to a position that fits inside the viewport', () => {
    const target = createTarget();
    target.dataset.positions = 'right';
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(new DOMRect(980, 100, 40, 20));
    const instance = initTooltip();
    const tooltip = getTooltip();

    hover(target);

    expect(tooltip.dataset.position).toBe('left');
    expect(tooltip.style.visibility).toBe('visible');
    instance.destroy();
  });

  it('keeps the tooltip visible while the target remains focused', () => {
    const target = createTarget();
    const instance = initTooltip();
    const tooltip = getTooltip();

    hover(target);
    target.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    target.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));

    expect(tooltip.style.display).toBe('block');
    target.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    expect(tooltip.style.display).toBe('none');

    instance.destroy();
  });

  it('restores an existing aria-describedby value when hidden', () => {
    const target = createTarget();
    target.setAttribute('aria-describedby', 'existing-description');
    const instance = initTooltip();
    getTooltip();

    hover(target);
    instance.hide();

    expect(target.getAttribute('aria-describedby')).toBe('existing-description');
    instance.destroy();
  });

  it('refreshes changed content without creating another tooltip', () => {
    const target = createTarget('Before');
    const instance = initTooltip();
    const tooltip = getTooltip();

    hover(target);
    target.dataset.tooltip = 'After';
    instance.refresh();

    expect(tooltip.textContent).toBe('After');
    expect(document.querySelectorAll('.sohrabi-tooltip')).toHaveLength(1);
    instance.destroy();
  });

  it('hides on Escape', () => {
    const target = createTarget();
    const instance = initTooltip();
    const tooltip = getTooltip();

    hover(target);
    document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));

    expect(tooltip.style.display).toBe('none');
    instance.destroy();
  });

  it('removes the element and all behavior when destroyed', () => {
    const target = createTarget();
    const instance = initTooltip();
    getTooltip();

    instance.destroy();
    instance.destroy();
    hover(target);

    expect(document.querySelector('.sohrabi-tooltip')).toBeNull();
    expect(target.hasAttribute('aria-describedby')).toBe(false);
  });
});
