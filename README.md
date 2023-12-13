
![GitHub top language](https://img.shields.io/github/languages/top/sohrabi/tooltip?color=blue&logo=Ionic&logoColor=white) ![GitHub stars](https://img.shields.io/github/stars/sohrabi/tooltip?color=success&logo=github) ![GitHub forks](https://img.shields.io/github/forks/sohrabi/tooltip?color=orange&logo=Furry%20Network&logoColor=white) ![GitHub last commit](https://img.shields.io/github/last-commit/sohrabi/tooltip?color=ff69b4&label=update&logo=git&logoColor=white)


<img alt="npm package minimized gzipped size (select exports)" src="https://img.shields.io/bundlejs/size/%40sohrabi%2Ftooltip"> <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/%40sohrabi%2Ftooltip">

[![npm version](https://badge.fury.io/js/%40sohrabi%2Ftooltip.svg?v=new)](https://www.npmjs.com/package/@sohrabi/tooltip)
<img src="https://shields.io/badge/build-passing-blue"/>
<img src="https://shields.io/badge/analyze-passing-blue"/>
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=plastic)](https://raw.githubusercontent.com/sohrabi/tooltip/main/LICENSE)

<img alt="npm" src="https://img.shields.io/npm/dt/%40sohrabi%2Ftooltip?label=total%20download"> <img alt="npm" src="https://img.shields.io/npm/dw/%40sohrabi%2Ftooltip?label=weekly download">

# tooltip

simple  css js tooltip

#### Note that you can show both simple text or complex html in you'r tooltip. For html tag you should use `HTML entities (character entities)` instead of tags itself, for example
<pre>text before break line &lt;br/&gt; text after break line</pre>
you shuld do it like this:
```
<span data-tooltip="text before break line &lt;br/&gt; text after break line" data-positions="right,top">hover me to show tooltip</span>
```
for html entities visit here:
<a href="https://www.w3schools.com/html/html_entities.asp" target="_blank">html entities</a>

### install:

```
npm i @sohrabi/tooltip
```

#### import:
```
import { initTooltip } from "@sohrabi/tooltip";
```

### html element data attributes

<table border="1">
    <thead>
        <tr><th>data attribute</th><th>description</th></tr>
    </thead>
    <tbody>
        <tr><tr><td>tooltip</td><td>Text Or Html to show as tooltip</td></tr>
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

### html element attributes:
```
<span data-tooltip="test tooltip" data-positions="right,top">hover me to show tooltip</span>
```
### initial tooltip
```
const tooltipInstance = initTooltip();
```
### destroy tooltip
```
tooltipInstance.destroy();
```
<hr/>

### custom configs:
<table border="1">
    <thead>
        <tr><th>name</th><th>default</th></tr>
    </thead>
    <tbody>
        <tr><tr><td>disableOnMobile</td><td>false</td></tr>
        <tr><tr><td>color</td><td>#fff</td></tr>
        <tr><tr><td>backgroundColor</td><td>#000</td></tr>
        <tr><tr><td>borderRadius</td><td>4px</td></tr>
    </tbody>
</table>

<hr/>

### custom config sample
```
const tooltipInstance = initTooltip({ 
    disableOnMobile: true,
    backgroundColor: "lightyellow",
    color: "#9e0101"
    });
```

### Online Demo
<a href="https://sohrabi.github.io/tooltip-demo.html">Open demo page</a>


## Using in ES5

If you want to use this library in you'r ES5 application, simple refrence the following js file.

```
<script type="text/javascript" src="https://unpkg.com/@sohrabi/tooltip/dist/index.js"></script>
```