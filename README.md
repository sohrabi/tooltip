![GitHub top language](https://img.shields.io/github/languages/top/sohrabi/tooltip?color=blue&logo=Ionic&logoColor=white) ![GitHub stars](https://img.shields.io/github/stars/sohrabi/tooltip?color=success&logo=github) ![GitHub forks](https://img.shields.io/github/forks/sohrabi/tooltip?color=orange&logo=Furry%20Network&logoColor=white) ![GitHub last commit](https://img.shields.io/github/last-commit/sohrabi/tooltip?color=ff69b4&label=update&logo=git&logoColor=white)


<img alt="npm package minimized gzipped size (select exports)" src="https://img.shields.io/bundlejs/size/%40sohrabi%2Ftooltip"> <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/%40sohrabi%2Ftooltip">

[![npm version](https://badge.fury.io/js/%40sohrabi%2Ftooltip.svg?v=new)](https://www.npmjs.com/package/@sohrabi/tooltip)
<img src="https://shields.io/badge/build-passing-blue"/>
<img src="https://shields.io/badge/analyze-passing-blue"/>
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=plastic)](https://raw.githubusercontent.com/sohrabi/tooltip/main/LICENSE)

<img alt="npm" src="https://img.shields.io/npm/dt/%40sohrabi%2Ftooltip?label=total%20download"> <img alt="npm" src="https://img.shields.io/npm/dw/%40sohrabi%2Ftooltip?label=weekly download">

# tooltip

simple js css tooltip

to install:
```
npm i @sohrabi/tooltip
```

how to import:
```
import { initTooltip } from "@sohrabi/tooltip";
```

how to use:

<table border="1">
    <thead>
        <tr><th>option</th><th>description</th></tr>
        <tr><tr><td>tooltip</td><td>Text Or Html to show as tooltip</td></tr>
    </thead>
    <tbody>
        <tr>
            <td>positions</td>
            <td>Comma separated list of positions to change the positioning<br />
            default priority is as follow:
            <br />
            bottom,
            top,
            right,
            left,
            bottomleft,
            bottomright,
            topleft,
            topright
            </td>
        </tr>
    </tbody>
</table>

<hr/>


```
<span data-tooltip="test tooltip" data-positions="right,top">hover me to show tooltip</span>
```

```
const tooltipInstance = initTooltip();
```

```
tooltipInstance.destroy();
```

check demo here:
<a href="https://sohrabi.github.io/tooltip-demo.html">Open demo page</a>
