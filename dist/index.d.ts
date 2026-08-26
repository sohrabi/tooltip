export type TooltipPosition = 'bottom' | 'top' | 'right' | 'left' | 'bottomleft' | 'bottomright' | 'topleft' | 'topright';
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
export declare const initTooltip: (options?: TooltipOptions) => TooltipInstance;
