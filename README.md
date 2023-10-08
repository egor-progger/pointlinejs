# PointlineJS

PointlineJS is an SVG based JS library for drawing tree diagrams.
It relies on Treant-JS, Raphael for handling SVG and animations, JQuery.

For Docs, Examples, and everything else see: /_ TODO _/

# Compile

`npx webpack --config webpack.config.js`

# Dev-server

1. `npx webpack serve`
2. open `http://localhost:9000/documentation/` in browser

# Build package for import from tarball locally

1. `npm run pack`
2. copy pointlinejs-[package version].tgz to your other project.
3. add in your other project in package.json in section `dependencies` this code:
   `"pointlinejs": "file:./pointlinejs-[package version].tgz"`
4. run `npm install --save`
5. include PoinlineJS library in your code like this:
   ```
   import { PointlineJS } from 'pointlinejs';
   const test = new PointlineJS(null);
   ```
