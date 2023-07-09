const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const entries = ['examples/basic-example/basic-example', 'examples/collapsable/collapsable',
'examples/comments/comments', 'examples/connectors/connectors',
'examples/custom-color-plus-scrollbar/custom-color-plus-scrollbar',
'examples/custom-colored/custom-colored'];

/**
 * 
 * @param {string[]} entries 
 * @returns 
 */
function generateEntries(entries) {
  const result = {};
  for(const entry of entries) {
    result[entry] = path.resolve(__dirname, `src/${entry}.ts`);
  }
  return result;
}

/**
 * 
 * @param {string[]} entries 
 * @returns 
 */
function generateHtmlPlugin(entries) {
  const result = [];
  for(const entry of entries) {
    const excludeChunks = entries.filter((item) => item !== entry);
    const htmlDirectoryArray = entry.split('/');
    const htmlDirectory = htmlDirectoryArray.slice(0, htmlDirectoryArray.length-1).join('/');
    result.push(
      new HtmlWebpackPlugin({
        inject: true,
        template: `src/${htmlDirectory}/index.html`,
        filename: `${htmlDirectory}/index.html`,
        chunks: entry,
        excludeChunks: excludeChunks  
      })
    );
  }
  return result;
}

const generatedEntries = generateEntries(entries);
const htmlPlugins = generateHtmlPlugin(entries);

module.exports = {
  mode: 'development',
  target: "web",
  stats: {
    errorDetails: true,
    children: true,
  },
  entry: generatedEntries,
  module: {
    rules: [
      // {
      //   test: require.resolve("Treant"),
      //   use: [
      //     { loader: "expose-loader"},
      //     {
      //       loader: "ts-loader",
      //       // options: {
      //       //   compilerOptions: {
      //       //     noEmit: false, // this option will solve the issue
      //       //     noImplicitAny: false
      //       //   },
      //       // },
      //     },
      //   ],
      //   options: {
      //     exposes: [
      //       {
      //         globalName: "Treant",
      //         moduleLocalName: "Treant",
      //       }
      //     ],
      //   }
      // },
      {
        test: /\.(png|jp(e*)g|svg|gif)$/, use: {
          loader: 'url-loader', // this need file-loader
          options: {
            limit: 50000
          }
        }
      },
      {
        test: /\.ts?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.json"
            }
            // options: {
            //   compilerOptions: {
            //     noEmit: false, // this option will solve the issue
            //     noImplicitAny: false
            //   },
            // },
          },
        ],
      },
      {
        test: /\.(sass|scss|css)$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      eve: "eve-raphael/eve",
      jQuery: "jquery/src/jquery",
      $: "jquery/src/jquery",
      "@treantjs": path.resolve(__dirname, './src/treant'),
      "@graphjs": path.resolve(__dirname, './src/graphjs')
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: "[name].css",
      chunkFilename: "[id].css",
      // ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
    ...htmlPlugins,
    new webpack.HotModuleReplacementPlugin(),
    new CopyPlugin({
      patterns: [
        { from: "src/examples/headshots", to: "examples/headshots" },
        { from: "src/examples/collapsable/img", to: "examples/collapsable/img" },
        { from: "src/examples/comments/avatar.jpg", to: "examples/comments/avatar.jpg" }
      ],
    }),
  ],
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    compress: true,
    port: 9000,
    hot: true,
  },
};
