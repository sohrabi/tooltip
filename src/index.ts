const defaultStyles = 'position:fixed;visibility:hidden;padding:5px;z-index:2001;color:#fff;background:#000;border:1px solid #151515;border-radius:4px;text-align:center;min-width:60px;pointer-events:none;';
const tooltipPositionsOrder = ['bottom', 'top', 'right', 'left', 'bottomleft', 'bottomright', 'topleft', 'topright'];
const tooltipAlreadyInited = 'tooltipAlreadyInited';
const tooltipAttr = 'data-tooltip';

const isTooltipWithinViewport = (left: number, top: number, width: number, height: number): boolean => {
  return left >= 0 && top >= 0 && left + width <= window.innerWidth && top + height <= window.innerHeight;
};

const isDeviceMobile = (): boolean => {
  const mobileRegex = /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/ig;
  return mobileRegex.test(window.navigator.userAgent);
};

const getTooltipPositions = (element: HTMLElement): string[] => {
  return (element.dataset.positions || "").split(",")
    .concat(tooltipPositionsOrder)
    .filter((value, index, self) => value.trim() && self.indexOf(value) === index);
};

const setPosition = (tooltipElm: HTMLElement, elmRect: DOMRect, tooltipWidth: number, tooltipHeight: number, position: string): void => {
  const halfWidth = elmRect.width / 2;
  const halfHeight = elmRect.height / 2;
  const centerLeft = elmRect.left + halfWidth;
  const centerTop = elmRect.top + halfHeight;
  const offsetLeft = centerLeft - tooltipWidth / 2;
  const offsetTop = centerTop - tooltipHeight / 2;
  const defaultOffset = 1;

  const rectBottom = elmRect.bottom + defaultOffset;
  const rectOffsetLeft = elmRect.left - tooltipWidth - defaultOffset;
  const rectOffsetTop = elmRect.top - tooltipHeight - defaultOffset;

  const positions = {
    top: {
      left: offsetLeft,
      top: rectOffsetTop
    },
    topleft: {
      left: rectOffsetLeft,
      top: rectOffsetTop,
    },
    topright: {
      left: elmRect.right + defaultOffset,
      top: rectOffsetTop,
    },
    right: {
      left: elmRect.right + defaultOffset,
      top: offsetTop,
    },
    left: {
      left: rectOffsetLeft,
      top: offsetTop,
    },
    bottom: {
      left: offsetLeft,
      top: rectBottom,
    },
    bottomleft: {
      left: rectOffsetLeft,
      top: rectBottom,
    },
    bottomright: {
      left: elmRect.right + defaultOffset,
      top: rectBottom,
    }
  }

  const { left, top } = positions[position];
  Object.assign(tooltipElm.style, {
    left: `${left}px`,
    top: `${top}px`,
    visibility: isTooltipWithinViewport(left, top, tooltipWidth, tooltipHeight) ? 'visible' : 'hidden'
  });
};

const showTooltip = (element: HTMLElement, tooltipElm: HTMLElement): void => {
  const content = element.dataset.tooltip;
  if (!content) return;

  tooltipElm.innerHTML = content;
  const elmRect = element.getBoundingClientRect();
  const tooltipStyle = tooltipElm.style;

  tooltipElm.style.display = 'block';

  const tooltipWidth = tooltipElm.offsetWidth;
  const tooltipHeight = tooltipElm.offsetHeight;

  const positions = getTooltipPositions(element);

  for (const position of positions) {
    setPosition(tooltipElm, elmRect, tooltipWidth, tooltipHeight, position);
    if (tooltipStyle.visibility === 'visible') break;
  }
};

const hideTooltip = (tooltipElm: HTMLElement): void => {
  Object.assign(tooltipElm.style, {
    display: 'none',
    visibility: 'hidden'
  });
};

export const initTooltip = (opt: {  disableOnMobile: boolean,  color: string,  backgroundColor: string,  borderRadius: string}): { destroy: () => void } => {
  if (window[tooltipAlreadyInited]) return;
  window[tooltipAlreadyInited] = true;

  opt = Object.assign({
    disableOnMobile: false,
    color: "#fff",
    backgroundColor: "#000",
    borderRadius: "4px"
  }, opt);
  console.error("tooltip.style", opt);

  const tooltip = document.createElement('span');
  Object.assign(tooltip.style, {
    position: "fixed",
    visibility: "hidden",
    padding: "5px",
    zIndex: 2001,
    color: opt.color,
    backgroundColor: opt.backgroundColor,
    borderRadius: opt.borderRadius,
    textAlign: "center",
    minWidth: "60px",
    pointerEvents: "none"
  });

  tooltip.classList.add('tooltip');
  document.body.appendChild(tooltip);

  const eventHandlers = new Map<HTMLElement, { hide: () => void; show: () => void; }>();

  document.addEventListener('mouseover', e => {
    if (opt.disableOnMobile && isDeviceMobile()) return;

    const element: HTMLElement = (e.target as HTMLElement)?.closest("[" + tooltipAttr + "]");
    if (!element?.dataset?.tooltip || eventHandlers.has(element)) return;

    const show = () => (opt.disableOnMobile && isDeviceMobile()) || showTooltip(element, tooltip);
    const hide = () => hideTooltip(tooltip);

    element.addEventListener('mouseenter', show);
    element.addEventListener('mouseleave', hide);

    eventHandlers.set(element, { show, hide });
  });

  return {
    destroy: () => {
      eventHandlers.forEach((handlers, element) => {
        element.removeEventListener('mouseenter', handlers.show);
        element.removeEventListener('mouseleave', handlers.hide);
      });
      eventHandlers.clear();
      tooltip.remove();
      window[tooltipAlreadyInited] = undefined;
    }
  };
};