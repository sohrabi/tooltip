const defaultStyles = 'position:fixed;viibility:hidden;padding:5px;z-index:2001;color:#ffffff;background:#000000 !important;border:1px solid #151515 !important;border-radius:4px;text-align:center;min-width:60px;pointer-events:none;';
const tooltipPositionsOrder = "bottom,top,right,left,bottomleft,bottomright,topleft,topright";
const defaulOffset = 1;
const tooltipAlreadyInited = "tooltipAlreadyInited"
const isTooltipWithinViewport = (left: number, top: number, width: number, height: number) => {
  return (
    left >= 0 &&
    top >= 0 &&
    left + width <= window.innerWidth &&
    top + height <= window.innerHeight
  );
};

const showTooltip = (element: HTMLElement, tooltip: HTMLElement, tooltipContent: string, positions: string[]) => {
  tooltip.innerHTML = tooltipContent;
  const elmRect = element.getBoundingClientRect();
  const elmWidth = elmRect.width;
  const elmHeight = elmRect.height;

  tooltip.style.display = "block";
  tooltip.style.top = "0px";
  tooltip.style.left = "0px";

  const tooltipWidth = tooltip.offsetWidth;
  const tooltipHeight = tooltip.offsetHeight;

  for (const position of positions) {
    let top = 0;
    let left = 0;
    switch (position) {
      case "top":
        left = elmRect.left + elmWidth / 2 - tooltipWidth / 2;
        top = elmRect.top - tooltipHeight - defaulOffset;
        break;
      case "right":
        left = elmRect.right + defaulOffset;
        top = elmRect.top + elmHeight / 2 - tooltipHeight / 2;
        break;
      case "bottom":
        left = elmRect.left + elmWidth / 2 - tooltipWidth / 2;
        top = elmRect.bottom + defaulOffset;
        break;
      case "left":
        left = elmRect.left - tooltipWidth - defaulOffset;
        top = elmRect.top + elmHeight / 2 - tooltipHeight / 2;
        break;
      case "topleft":
        left = elmRect.left - tooltipWidth - defaulOffset;
        top = elmRect.top - tooltipHeight - defaulOffset;
        break;
      case "topright":
        left = elmRect.right + defaulOffset;
        top = elmRect.top - tooltipHeight - defaulOffset;
        break;
      case "bottomleft":
        left = elmRect.left - tooltipWidth - defaulOffset;
        top = elmRect.bottom + defaulOffset;
        break;
      case "bottomright":
        left = elmRect.right + defaulOffset;
        top = elmRect.bottom + defaulOffset;
        break;
    }

    if (isTooltipWithinViewport(left, top, tooltipWidth, tooltipHeight)) {
      tooltip.style.left = left + "px";
      tooltip.style.top = top + "px";
      tooltip.style.visibility = "visible";
      break;
    }
  }
};

const hideTooltip = (tooltip: HTMLElement) => {
  if (!tooltip) return;
  tooltip.style.display = "none";
  tooltip.style.visibility = "hidden";
};

export const initTooltip = () => {
  if (window[tooltipAlreadyInited]) return;
  
  window[tooltipAlreadyInited] = true;

  const elmEvents = [];
  const tooltip = document.createElement("span");
  tooltip.setAttribute("style", defaultStyles);
  tooltip.style.display = "none";
  tooltip.style.visibility = "hidden";
  tooltip.classList.add("tooltip")
  document.body.append(tooltip);

  const mouseMove = (e: Event) => {
    const elm = e.target as HTMLElement;
    if (elm?.dataset?.tooltip && !elm?.dataset?.tooltipEventAttached) {
      elm.dataset.tooltipEventAttached = "true";
      const positions = [];
      const positionsSplited = elm.dataset?.positions?.split(",") || [];
      tooltipPositionsOrder.split(",").forEach(p => {
        if (positionsSplited.indexOf(p) === -1)
          positions.push(p.trim());
      });
      positionsSplited.reverse().forEach(p => {
        if (p) positions.unshift(p.trim());
      });
      showTooltip(elm, tooltip, elm.dataset?.tooltip, positions);
      const mouseenter = () => {
        showTooltip(elm, tooltip, elm.dataset?.tooltip, positions);
      };
      const mouseleave = () => {
        hideTooltip(tooltip);
      };
      elmEvents.push({
        elm,
        mouseenter,
        mouseleave
      });
      elm.addEventListener("mouseenter", mouseenter);
      elm.addEventListener("mouseleave", mouseleave);
    }
  };

  document.addEventListener("mousemove", mouseMove);

  return {
    destroy: () => {
      document.removeEventListener("mousemove", mouseMove);
      elmEvents.forEach(elmEvent => {
        elmEvent.elm.removeEventListener("mouseenter", elmEvent.mouseenter);
        elmEvent.elm.removeEventListener("mouseleave", elmEvent.mouseleave);
      });
      window[tooltipAlreadyInited] = undefined;
    }
  }
}