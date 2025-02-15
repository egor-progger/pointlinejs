const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackInjector = require('html-webpack-injector');

const entryType = { withTypescript: 'withTypescript' };
const entries = [
  {
    name: 'examples/basic-example/basic-example',
    type: entryType.withTypescript,
  },
  { name: 'examples/collapsable/collapsable', type: entryType.withTypescript },
  { name: 'examples/comments/comments', type: entryType.withTypescript },
  { name: 'examples/connectors/connectors', type: entryType.withTypescript },
  {
    name: 'examples/custom-color-plus-scrollbar/custom-color-plus-scrollbar',
    type: entryType.withTypescript,
  },
  {
    name: 'examples/custom-colored/custom-colored',
    type: entryType.withTypescript,
  },
  {
    name: 'examples/evolution-tree/evolution-tree',
    type: entryType.withTypescript,
  },
  { name: 'examples/no-parent/no-parent', type: entryType.withTypescript },
  {
    name: 'examples/simple-scrollbar/simple-scrollbar',
    type: entryType.withTypescript,
  },
  {
    name: 'examples/super-simple/super-simple',
    type: entryType.withTypescript,
  },
  { name: 'examples/tennis-draw/tennis-draw', type: entryType.withTypescript },
  { name: 'examples/test-ground/test-ground', type: entryType.withTypescript },
  { name: 'examples/timeline/timeline', type: entryType.withTypescript },
  {
    name: 'examples/action-buttons/action-buttons',
    type: entryType.withTypescript,
  },
  { name: 'documentation/documentation', type: entryType.withTypescript },
];
/**
 *
 * @param {{name:string, type: entryType}[]} entries
 * @returns
 */
function generateEntries(entries) {
  const result = {};
  for (const entry of entries) {
    if (entry.type === entryType.withTypescript) {
      result[entry.name] = path.resolve(__dirname, `./src/${entry.name}.ts`);
    }
  }
  return result;
}

/**
 *
 * @param {{name:string, type: entryType}[]} entries
 * @returns
 */
function generateHtmlPlugin(entries) {
  const result = [];
  for (const entry of entries) {
    const excludeChunks = entries
      .filter((item) => item !== entry.name)
      .map((item) => item.name);
    const htmlDirectoryArray = entry.name.split('/');
    const htmlDirectory = htmlDirectoryArray
      .splice(0, htmlDirectoryArray.length - 1)
      .join('/');
    const htmlPlugin = new HtmlWebpackPlugin({
      inject: true,
      template: `src/${htmlDirectory}/index.html`,
      filename: `${htmlDirectory}/index.html`,
      chunks: entry.name,
      excludeChunks: excludeChunks,
    });
    result.push(htmlPlugin);
  }
  return result;
}

const generatedEntries = generateEntries(entries);
const htmlPlugins = generateHtmlPlugin(entries);

module.exports = {
  mode: 'development',
  target: 'web',
  stats: {
    errorDetails: true,
    children: true,
  },
  entry: generatedEntries,
  module: {
    rules: [
      {
        test: /\.(png|jp(e*)g|svg|gif)$/,
        use: {
          loader: 'url-loader', // this need file-loader
          options: {
            limit: 50000,
          },
        },
      },
      {
        test: /\.ts?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.json',
            },
          },
        ],
      },
      {
        test: /\.(sass|scss|css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      eve: 'eve-raphael/eve',
      jQuery: 'jquery/src/jquery',
      $: 'jquery/src/jquery',
      '@pointlinejs': path.resolve(__dirname, './src/pointlinejs'),
    },
  },
  plugins: [
    new HtmlWebpackInjector(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    ...htmlPlugins,
    new webpack.HotModuleReplacementPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'src/examples/headshots', to: 'examples/headshots' },
        {
          from: 'src/examples/collapsable/img',
          to: 'examples/collapsable/img',
        },
        {
          from: 'src/examples/comments/avatar.jpg',
          to: 'examples/comments/avatar.jpg',
        },
        {
          from: 'src/examples/evolution-tree/img',
          to: 'examples/evolution-tree/img',
        },
        {
          from: 'src/examples/tennis-draw/flags',
          to: 'examples/tennis-draw/flags',
        },
        {
          from: 'src/examples/tennis-draw/trophy.png',
          to: 'examples/tennis-draw/trophy.png',
        },
        {
          from: 'src/examples/test-ground/image.png',
          to: 'examples/test-ground/image.png',
        },
        {
          from: 'src/examples/test-ground/slika-manja.jpg',
          to: 'examples/test-ground/slika-manja.jpg',
        },
        {
          from: 'src/documentation/images',
          to: 'documentation/images',
        },
        {
          from: 'src/documentation/index.html',
          to: 'documentation',
        },
        {
          from: 'src/documentation/index.html',
          to: 'documentation',
        },
      ],
    }),
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    compress: true,
    port: 9000,
    hot: true,
    open: ['/documentation/'],
    static: {
      serveIndex: true,
    },
  },
};
