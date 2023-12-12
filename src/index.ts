const defaultStyles = 'position:fixed;viibility:hidden;padding:5px;z-index:2001;color:#ffffff;background:#000000 !important;border:1px solid #151515 !important;border-radius:4px;text-align:center;min-width:60px;pointer-events:none;';
const tooltipPositionsOrder = "bottom,top,right,left,bottomleft,bottomright,topleft,topright";
const tooltipId = "simple-tooltip";
const defaulOffset = 1;

const isTooltipWithinViewport = (left: number, top: number, width: number, height: number) => {
  return (
    left >= 0 &&
    top >= 0 &&
    left + width <= window.innerWidth &&
    top + height <= window.innerHeight
  );
};

const showTooltip = (element: HTMLElement, tooltipContent: string, positions: string[]) => {
  let tooltip = document.getElementById(tooltipId);
  if (!tooltip) {
    tooltip = document.createElement("span");
    tooltip.setAttribute("style", defaultStyles);
    tooltip.classList.add("tooltip")
    tooltip.id = tooltipId;
    document.body.append(tooltip);
  }
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

const handleMouseHover = (element: HTMLElement, tooltipContent: string, positions: string[]) => {
  showTooltip(element, tooltipContent, positions);
};

const hideTooltip = () => {
  const tooltip = document.getElementById(tooltipId);
  if (tooltip) {
    tooltip.style.display = "none";
    tooltip.style.visibility = "hidden";
  }
};

export const initTooltip = () => {
  if (window["tooltipAlreadyInited"]) return;
  window["tooltipAlreadyInited"] = true;
  document.addEventListener("mousemove", (e) => {
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
      handleMouseHover(elm, elm.dataset?.tooltip, positions);
      elm.addEventListener("mouseenter", () => { handleMouseHover(elm, elm.dataset?.tooltip, positions); });
      elm.addEventListener("mouseleave", () => { hideTooltip(); });
    }
  });
}