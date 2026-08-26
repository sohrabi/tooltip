# @sohrabi/tooltip

A tiny, dependency-free and accessible tooltip for JavaScript and TypeScript.

[![npm version](https://img.shields.io/npm/v/%40sohrabi%2Ftooltip)](https://www.npmjs.com/package/@sohrabi/tooltip)
[![CI](https://github.com/sohrabi/tooltip/actions/workflows/ci.yml/badge.svg)](https://github.com/sohrabi/tooltip/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/%40sohrabi%2Ftooltip)](./LICENSE)

## Why use it?

- **Tiny:** about 2.2 kB gzip.
- **Zero dependencies:** no framework or runtime package is required.
- **Easy to use:** add two attributes to any HTML element.
- **Flexible:** supports eight positions and automatically avoids viewport overflow.
- **Accessible:** works with hover and keyboard focus, includes ARIA attributes and closes with <kbd>Escape</kbd>.
- **Safe by default:** content is rendered as text unless trusted HTML is explicitly enabled.
- **Ready for any setup:** use it through npm, ESM, CommonJS or a plain `<script>` tag.

## Install

```bash
npm install @sohrabi/tooltip
```

## Use with npm

```ts
import { initTooltip } from '@sohrabi/tooltip';

const tooltip = initTooltip();
```

Add `data-tooltip` to any element:

```html
<button data-tooltip="Saves your changes">Save</button>
```

Initialize the library once after the page is ready. The same instance handles existing elements and elements added later.
Repeated calls return the active instance, so the options from the first call remain in effect until `destroy()` is called.

## Use without npm

Load the browser bundle from a CDN near the end of `<body>`:

```html
<button data-tooltip="Saves your changes">Save</button>

<script src="https://cdn.jsdelivr.net/npm/@sohrabi/tooltip@2.0.0/dist/tooltip.min.js"></script>
<script>
  const tooltip = initTooltip();
</script>
```

The browser bundle exposes both `window.initTooltip` for convenience and `window.SohrabiTooltip.initTooltip` as a namespaced API.

For production websites, pin the CDN URL to an exact version as shown above.

## Choose preferred positions

Use `data-positions` with a comma-separated priority list:

```html
<button
  data-tooltip="The first position with enough space is used"
  data-positions="right, top, bottom"
>
  Hover or focus me
</button>
```

Available positions:

| Position | Description |
| --- | --- |
| `top` | Centered above the element |
| `right` | Centered on the right |
| `bottom` | Centered below the element |
| `left` | Centered on the left |
| `topleft` | Outside the top-left corner |
| `topright` | Outside the top-right corner |
| `bottomleft` | Outside the bottom-left corner |
| `bottomright` | Outside the bottom-right corner |

If none of the requested positions fits, the tooltip is kept inside the viewport.

## Options

All options are optional:

```ts
const tooltip = initTooltip({
  backgroundColor: '#1f2937',
  borderRadius: '6px',
  color: '#fff',
  maxWidth: '280px',
  offset: 8
});
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `allowHTML` | `boolean` | `false` | Render trusted tooltip content as HTML |
| `backgroundColor` | `string` | `#000` | Background color |
| `borderRadius` | `string` | `4px` | Border radius |
| `className` | `string` | `''` | Additional CSS class names |
| `color` | `string` | `#fff` | Text color |
| `disableOnMobile` | `boolean` | `false` | Disable tooltips on devices without hover support |
| `maxWidth` | `string` | `320px` | Maximum tooltip width |
| `offset` | `number` | `6` | Distance from the target in pixels |
| `viewportPadding` | `number` | `4` | Minimum distance from viewport edges in pixels |
| `zIndex` | `number` | `2001` | Tooltip stacking order |

Invalid negative or non-finite numeric values fall back to their defaults.

## Custom styles

Every tooltip has the `sohrabi-tooltip` class. Use `className` to add a project-specific class:

```ts
initTooltip({ className: 'app-tooltip' });
```

```css
.app-tooltip {
  box-shadow: 0 4px 12px rgb(0 0 0 / 20%);
  font: 500 14px/1.4 system-ui, sans-serif;
}

.app-tooltip[data-position='top'] {
  margin-top: -2px;
}
```

Use the JavaScript options for colors, radius, maximum width and z-index because those core values are applied inline.

## Trusted HTML content

HTML is disabled by default to prevent accidental script injection. If all tooltip content is trusted, enable it explicitly:

```ts
initTooltip({ allowHTML: true });
```

```html
<span data-tooltip="&lt;strong&gt;Important&lt;/strong&gt; message">
  Details
</span>
```

Never enable `allowHTML` for content supplied by users or another untrusted source.

## Instance methods

`initTooltip()` returns an instance with three methods:

```ts
const tooltip = initTooltip();

tooltip.refresh(); // Refresh active content and position.
tooltip.hide();    // Hide the active tooltip.
tooltip.destroy(); // Remove the tooltip and all event listeners.
```

Call `destroy()` when the library is no longer needed. Calling it more than once is safe.

## TypeScript

Type declarations are included in the package:

```ts
import {
  initTooltip,
  type TooltipInstance,
  type TooltipOptions,
  type TooltipPosition
} from '@sohrabi/tooltip';
```

## Browser support

The browser bundle targets modern browsers with ES2021 and standard DOM APIs. It supports current versions of Chrome, Edge, Firefox and Safari.

## Development

```bash
npm install
npm run check
```

`npm run check` runs strict TypeScript validation, the test suite, the production build and the gzip size limit.

## License

[ISC](./LICENSE)
