# PointlineJS

PointlineJS is an SVG based JS library for drawing tree diagrams.
It relies on Treant-JS, Raphael for handling SVG and animations, JQuery.

# Build status

[![Node.js Package](https://github.com/egor-progger/pointlinejs/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/egor-progger/pointlinejs/actions/workflows/npm-publish.yml)
[![NPM Downloads](https://img.shields.io/npm/dm/pointlinejs?label=npm%20downloads)](https://www.npmjs.com/package/pointlinejs)
[![NPM Version](https://img.shields.io/npm/v/pointlinejs?label=Current%20version)](https://www.npmjs.com/package/pointlinejs)
[![Static Badge](https://img.shields.io/badge/Documentation-green)](https://egor-progger.github.io/pointlinejs/documentation/)
[![Quick start example](https://img.shields.io/badge/Quick_start_example-blue)](https://github.com/egor-progger/pointlinejs-quick-start/)

# Add to project

1. Install PointlineJS:

`npm i pointlinejs`

2. Import PointlineJS:

`import { PointlineJS } from "pointlinejs";`

3. Create DOM-element in html where draw PointlineJS chart:

`<div id="tree-simple" style="height: 600px; width: 900px;"></div>`

4. Describe config chart in typescript file:

```
const simple_chart_config = {
  chart: {
    container: "#tree-simple",
  },

  nodeStructure: {
    text: { name: "Parent node" },
    children: [
      {
        text: { name: "First child" },
      },
      {
        text: { name: "Second child" },
      },
    ],
  },
};
```

5. Draw chart:

```
const testTree = new PointlineJS(simple_chart_config);
testTree.getTree();
testTree.draw();
```

For run demo also see "Quick start" section.

# Quick start

1. clone repository with command:

```
$ git clone https://github.com/egor-progger/pointlinejs-quick-start
```

2. to run this example you need to install some dependencies:

```
$ cd pointlinejs-quick-start
$ npm install
```

3. start local web-server:

```
$ npx webpack serve
```

4. open in browser address http://localhost:9001

For Docs, Examples, and everything else see: https://egor-progger.github.io/pointlinejs/documentation/

# Development

## Requirements

Node version: minimum 20.18.1

## How to compile sources

`npx webpack --config webpack.config.js`

## How to run dev-server for debugging

1. `npm run start`
2. open `http://localhost:9000/documentation/` in browser
