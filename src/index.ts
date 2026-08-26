export type TooltipPosition =
  | 'bottom'
  | 'top'
  | 'right'
  | 'left'
  | 'bottomleft'
  | 'bottomright'
  | 'topleft'
  | 'topright';

export interface TooltipOptions {
  allowHTML?: boolean;
  backgroundColor?: string;
  borderRadius?: string;
  className?: string;
  color?: string;
  disableOnMobile?: boolean;
  maxWidth?: string;
  offset?: number;
  viewportPadding?: number;
  zIndex?: number;
}

export interface TooltipInstance {
  destroy: () => void;
  hide: () => void;
  refresh: () => void;
}

interface Coordinates {
  left: number;
  top: number;
}

interface ResolvedTooltipOptions {
  allowHTML: boolean;
  backgroundColor: string;
  borderRadius: string;
  className: string;
  color: string;
  disableOnMobile: boolean;
  maxWidth: string;
  offset: number;
  viewportPadding: number;
  zIndex: number;
}

type ActivationType = 'focus' | 'hover';

const tooltipSelector = '[data-tooltip]';
const tooltipPositionsOrder: readonly TooltipPosition[] = [
  'bottom',
  'top',
  'right',
  'left',
  'bottomleft',
  'bottomright',
  'topleft',
  'topright'
];

const defaultOptions: ResolvedTooltipOptions = {
  allowHTML: false,
  backgroundColor: '#000',
  borderRadius: '4px',
  className: '',
  color: '#fff',
  disableOnMobile: false,
  maxWidth: '320px',
  offset: 6,
  viewportPadding: 4,
  zIndex: 2001
};

let tooltipId = 0;
let currentInstance: TooltipInstance | null = null;

const isTooltipPosition = (value: string): value is TooltipPosition => {
  return value === 'bottom'
    || value === 'top'
    || value === 'right'
    || value === 'left'
    || value === 'bottomleft'
    || value === 'bottomright'
    || value === 'topleft'
    || value === 'topright';
};

const normalizeNumber = (value: number | undefined, fallback: number): number => {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : fallback;
};

const resolveOptions = (options: TooltipOptions): ResolvedTooltipOptions => {
  return {
    allowHTML: options.allowHTML ?? defaultOptions.allowHTML,
    backgroundColor: options.backgroundColor ?? defaultOptions.backgroundColor,
    borderRadius: options.borderRadius ?? defaultOptions.borderRadius,
    className: options.className ?? defaultOptions.className,
    color: options.color ?? defaultOptions.color,
    disableOnMobile: options.disableOnMobile ?? defaultOptions.disableOnMobile,
    maxWidth: options.maxWidth ?? defaultOptions.maxWidth,
    offset: normalizeNumber(options.offset, defaultOptions.offset),
    viewportPadding: normalizeNumber(options.viewportPadding, defaultOptions.viewportPadding),
    zIndex: normalizeNumber(options.zIndex, defaultOptions.zIndex)
  };
};

const getTooltipTarget = (eventTarget: EventTarget | null): HTMLElement | null => {
  if (!(eventTarget instanceof Element)) return null;

  const target = eventTarget.closest(tooltipSelector);
  return target instanceof HTMLElement ? target : null;
};

const getTooltipPositions = (target: HTMLElement): TooltipPosition[] => {
  const positions: TooltipPosition[] = [];
  const requestedPositions = (target.dataset.positions ?? '')
    .split(',')
    .map(position => position.trim().toLowerCase())
    .filter(isTooltipPosition);

  for (const position of [...requestedPositions, ...tooltipPositionsOrder]) {
    if (!positions.includes(position)) positions.push(position);
  }

  return positions;
};

const getCoordinates = (
  position: TooltipPosition,
  targetRect: DOMRect,
  tooltipWidth: number,
  tooltipHeight: number,
  offset: number
): Coordinates => {
  const centeredLeft = targetRect.left + (targetRect.width - tooltipWidth) / 2;
  const centeredTop = targetRect.top + (targetRect.height - tooltipHeight) / 2;

  switch (position) {
    case 'top':
      return { left: centeredLeft, top: targetRect.top - tooltipHeight - offset };
    case 'right':
      return { left: targetRect.right + offset, top: centeredTop };
    case 'left':
      return { left: targetRect.left - tooltipWidth - offset, top: centeredTop };
    case 'bottomleft':
      return { left: targetRect.left - tooltipWidth - offset, top: targetRect.bottom + offset };
    case 'bottomright':
      return { left: targetRect.right + offset, top: targetRect.bottom + offset };
    case 'topleft':
      return { left: targetRect.left - tooltipWidth - offset, top: targetRect.top - tooltipHeight - offset };
    case 'topright':
      return { left: targetRect.right + offset, top: targetRect.top - tooltipHeight - offset };
    case 'bottom':
      return { left: centeredLeft, top: targetRect.bottom + offset };
  }
};

const isWithinViewport = (
  coordinates: Coordinates,
  tooltipWidth: number,
  tooltipHeight: number,
  padding: number
): boolean => {
  return coordinates.left >= padding
    && coordinates.top >= padding
    && coordinates.left + tooltipWidth <= window.innerWidth - padding
    && coordinates.top + tooltipHeight <= window.innerHeight - padding;
};

const keepWithinViewport = (
  coordinates: Coordinates,
  tooltipWidth: number,
  tooltipHeight: number,
  padding: number
): Coordinates => {
  const maximumLeft = Math.max(padding, window.innerWidth - tooltipWidth - padding);
  const maximumTop = Math.max(padding, window.innerHeight - tooltipHeight - padding);

  return {
    left: Math.min(Math.max(coordinates.left, padding), maximumLeft),
    top: Math.min(Math.max(coordinates.top, padding), maximumTop)
  };
};

const isTargetVisible = (targetRect: DOMRect): boolean => {
  return targetRect.bottom >= 0
    && targetRect.right >= 0
    && targetRect.top <= window.innerHeight
    && targetRect.left <= window.innerWidth;
};

const isMobileDevice = (): boolean => {
  return typeof window.matchMedia === 'function' && window.matchMedia('(hover: none)').matches;
};

const createTooltipElement = (options: ResolvedTooltipOptions): HTMLSpanElement => {
  const tooltip = document.createElement('span');
  tooltip.id = `sohrabi-tooltip-${++tooltipId}`;
  tooltip.className = `sohrabi-tooltip ${options.className}`.trim();
  tooltip.setAttribute('aria-hidden', 'true');
  tooltip.setAttribute('role', 'tooltip');

  Object.assign(tooltip.style, {
    backgroundColor: options.backgroundColor,
    borderRadius: options.borderRadius,
    boxSizing: 'border-box',
    color: options.color,
    display: 'none',
    left: '0',
    maxWidth: options.maxWidth,
    padding: '5px 8px',
    pointerEvents: 'none',
    position: 'fixed',
    textAlign: 'center',
    top: '0',
    visibility: 'hidden',
    whiteSpace: 'normal',
    zIndex: String(options.zIndex)
  });

  return tooltip;
};

export const initTooltip = (options: TooltipOptions = {}): TooltipInstance => {
  if (currentInstance) return currentInstance;

  const resolvedOptions = resolveOptions(options);
  const tooltip = createTooltipElement(resolvedOptions);
  const container = document.body ?? document.documentElement;

  if (!container) throw new Error('Tooltip requires a document element.');
  container.appendChild(tooltip);

  const activationTypes = new Set<ActivationType>();
  let activeTarget: HTMLElement | null = null;
  let animationFrame: number | null = null;
  let destroyed = false;
  let previousAriaDescribedBy: string | null = null;

  const disconnectTooltipFromTarget = (): void => {
    if (!activeTarget) return;

    if (previousAriaDescribedBy === null) activeTarget.removeAttribute('aria-describedby');
    else activeTarget.setAttribute('aria-describedby', previousAriaDescribedBy);
  };

  const hide = (): void => {
    if (animationFrame !== null) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    disconnectTooltipFromTarget();
    activationTypes.clear();
    activeTarget = null;
    previousAriaDescribedBy = null;
    tooltip.style.display = 'none';
    tooltip.style.visibility = 'hidden';
    tooltip.setAttribute('aria-hidden', 'true');
  };

  const updatePosition = (): void => {
    if (!activeTarget || !activeTarget.isConnected) {
      hide();
      return;
    }

    const targetRect = activeTarget.getBoundingClientRect();
    if (!isTargetVisible(targetRect)) {
      hide();
      return;
    }

    const tooltipRect = tooltip.getBoundingClientRect();
    const tooltipWidth = tooltipRect.width || tooltip.offsetWidth;
    const tooltipHeight = tooltipRect.height || tooltip.offsetHeight;
    const positions = getTooltipPositions(activeTarget);
    let selectedPosition = positions[0] ?? 'bottom';
    let selectedCoordinates = getCoordinates(
      selectedPosition,
      targetRect,
      tooltipWidth,
      tooltipHeight,
      resolvedOptions.offset
    );

    for (const position of positions) {
      const coordinates = getCoordinates(
        position,
        targetRect,
        tooltipWidth,
        tooltipHeight,
        resolvedOptions.offset
      );

      if (isWithinViewport(
        coordinates,
        tooltipWidth,
        tooltipHeight,
        resolvedOptions.viewportPadding
      )) {
        selectedPosition = position;
        selectedCoordinates = coordinates;
        break;
      }
    }

    const coordinates = keepWithinViewport(
      selectedCoordinates,
      tooltipWidth,
      tooltipHeight,
      resolvedOptions.viewportPadding
    );

    tooltip.dataset.position = selectedPosition;
    tooltip.style.left = `${coordinates.left}px`;
    tooltip.style.top = `${coordinates.top}px`;
    tooltip.style.visibility = 'visible';
    tooltip.setAttribute('aria-hidden', 'false');
  };

  const renderContent = (target: HTMLElement): boolean => {
    const content = target.getAttribute('data-tooltip');
    if (!content) return false;

    if (resolvedOptions.allowHTML) tooltip.innerHTML = content;
    else tooltip.textContent = content;

    return true;
  };

  const show = (target: HTMLElement, activationType: ActivationType): void => {
    if (destroyed || (resolvedOptions.disableOnMobile && isMobileDevice())) return;

    if (activeTarget !== target) {
      disconnectTooltipFromTarget();
      activationTypes.clear();
      activeTarget = target;
      previousAriaDescribedBy = target.getAttribute('aria-describedby');
      const describedBy = previousAriaDescribedBy
        ? `${previousAriaDescribedBy} ${tooltip.id}`
        : tooltip.id;
      target.setAttribute('aria-describedby', describedBy);
    }

    activationTypes.add(activationType);
    if (!renderContent(target)) {
      hide();
      return;
    }

    tooltip.style.display = 'block';
    tooltip.style.visibility = 'hidden';
    updatePosition();
  };

  const deactivate = (activationType: ActivationType): void => {
    activationTypes.delete(activationType);
    if (activationTypes.size === 0) hide();
  };

  const schedulePositionUpdate = (): void => {
    if (!activeTarget || animationFrame !== null) return;

    animationFrame = window.requestAnimationFrame(() => {
      animationFrame = null;
      updatePosition();
    });
  };

  const onMouseOver = (event: MouseEvent): void => {
    const target = getTooltipTarget(event.target);
    if (target) show(target, 'hover');
  };

  const onMouseOut = (event: MouseEvent): void => {
    if (!activeTarget) return;
    if (!(event.target instanceof Node) || !activeTarget.contains(event.target)) return;
    if (event.relatedTarget instanceof Node && activeTarget.contains(event.relatedTarget)) return;
    deactivate('hover');
  };

  const onFocusIn = (event: FocusEvent): void => {
    const target = getTooltipTarget(event.target);
    if (target) show(target, 'focus');
  };

  const onFocusOut = (event: FocusEvent): void => {
    if (!activeTarget) return;
    if (!(event.target instanceof Node) || !activeTarget.contains(event.target)) return;
    if (event.relatedTarget instanceof Node && activeTarget.contains(event.relatedTarget)) return;
    deactivate('focus');
  };

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') hide();
  };

  document.addEventListener('mouseover', onMouseOver);
  document.addEventListener('mouseout', onMouseOut);
  document.addEventListener('focusin', onFocusIn);
  document.addEventListener('focusout', onFocusOut);
  document.addEventListener('keydown', onKeyDown);
  window.addEventListener('resize', schedulePositionUpdate);
  window.addEventListener('scroll', schedulePositionUpdate, true);

  const instance: TooltipInstance = {
    destroy: () => {
      if (destroyed) return;
      destroyed = true;
      hide();
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', schedulePositionUpdate);
      window.removeEventListener('scroll', schedulePositionUpdate, true);
      tooltip.remove();
      currentInstance = null;
    },
    hide,
    refresh: () => {
      if (!activeTarget || !renderContent(activeTarget)) {
        hide();
        return;
      }

      updatePosition();
    }
  };

  currentInstance = instance;
  return instance;
};
