# PointlineJS

PointlineJS is an SVG based JS library for drawing tree diagrams.
It relies on Treant-JS, Raphael for handling SVG and animations, JQuery.

# Build status

[![Node.js Package](https://github.com/egor-progger/pointlinejs/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/egor-progger/pointlinejs/actions/workflows/npm-publish.yml)

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

Node version: minimum 18.12.0

## How to compile sources

`npx webpack --config webpack.config.js`

## How to run dev-server for debugging

1. `npm run start`
2. open `http://localhost:9000/documentation/` in browser

## How to build package for import from tarball locally

1. `npm run pack`
2. copy pointlinejs-[package version].tgz to your other project.
3. add in your other project in package.json in section `dependencies` this code:
   `"pointlinejs": "file:./pointlinejs-[package version].tgz"`
4. run `npm install --save`
5. include PoinlineJS library in your script.ts like this:

   ```
   import { PointlineJS } from "pointlinejs";
   const simple_chart_config = {
    chart: {
        container: "#tree-simple"
    },

    nodeStructure: {
        text: { name: "Parent node" },
        children: [
            {
                text: { name: "First child" }
            },
            {
                text: { name: "Second child" }
            }
        ]
    }
   };
   const test = new PointlineJS(simple_chart_config);
   test.getTree();
   test.draw();
   ```

6. add div in your html. Example based on index.html:

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>PointlineJS Example</title>
  </head>
  <body>
    <div id="tree-simple" style="height: 600px; width: 900px;"></div>
  </body>
</html>
```
