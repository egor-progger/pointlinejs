const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  target: "web",
  stats: {
    errorDetails: true,
    children: true,
  },
  entry: {
    "examples/basic-example/basic-example": path.resolve(__dirname, 'src/examples/basic-example/basic-example.ts'),
    "examples/collapsable/collapsable": path.resolve(__dirname, 'src/examples/collapsable/collapsable.ts'),
    "examples/comments/comments": path.resolve(__dirname, 'src/examples/comments/comments.ts'),
  },
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
      { test: /\.(png|jp(e*)g|svg|gif)$/, use: {
        loader: 'url-loader', // this need file-loader
        options: {
        limit: 50000
    } }
  },
      {
        test: /\.ts?$/,
        use: [
          {
            loader: "ts-loader",
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
    new HtmlWebpackPlugin({
      inject: true,
      template: "src/examples/basic-example/index.html",
      filename: "examples/basic-example/index.html",
      chunks: 'examples/basic-example/basic-example',
      
      excludeChunks: ['examples/basic-example/collapsable']
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: "src/examples/collapsable/index.html",
      filename: "examples/collapsable/index.html",
      chunks: 'examples/collapsable/collapsable',
      excludeChunks: ['examples/basic-example/basic-example']
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: "src/examples/comments/index.html",
      filename: "examples/comments/index.html",
      chunks: 'examples/comments/comments',
      excludeChunks: ['examples/basic-example/basic-example', 'examples/basic-example/collapsable']
    }),
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
