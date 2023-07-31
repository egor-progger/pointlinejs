# PointlineJS

PointlineJS is an SVG based JS library for drawing tree diagrams.
It relies on Treant-JS, Raphael for handling SVG and animations, JQuery.

For Docs, Examples, and everything else see: /_ TODO _/

# Compile

`npx webpack --config webpack.config.js`

# Examples

1. compile project:
   `npx webpack --config webpack.config.js`
2. open index.html from `dist\examples` folder in browser

# Dev-server

1. `npx webpack serve`
2. open `http://localhost:9000/documentation` in browser

# Build package for import from tarball locally

1. `npm run build`
2. `npm pack`
3. copy pointlinejs-[package version].tgz to your other project.
4. add in your other project in package.json in section `dependencies` this code:
   `"treantjs": "file:./treantjs-1.0.0.tgz"`
5. run `npm install --save`
6. include PoinlineJS library in your code like this:
   ```
   import { PointlineJS } from 'treantjs';
   const test = new PointlineJS(null);
   ```
