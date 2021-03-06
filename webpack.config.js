const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = [
{
  /* ----------------
     JS用モジュール
    ----------------- */
  entry: {
    main: "./src/js/main.js"
  },
  output: {
    path: path.resolve(__dirname, "dist/js"),
    publicPath: '/js/',
    filename: "[name].js"
  },
  plugins: [
    /* use jQuery as Global */
    new webpack.ProvidePlugin({
        jQuery: "jquery",
        $: "jquery"
    })
  ],
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {}
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {}
        }
      }
    ]
  }
},
{
  /* ----------------
     CSS用モジュール
    ----------------- */
  entry: {
    main: "./src/scss/main.scss"
  },
  output: {
    path: path.resolve(__dirname, "dist/css"),
    publicPath: '/css/',
    filename: "[name].css"
  },
  module: {
    rules: [
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader'
          }
        ]
      },
      // Sassファイルの読み込みとコンパイル
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        // ローダー名
        use: [
          MiniCssExtractPlugin.loader,
          // CSSをバンドルするための機能
          {
            loader: 'css-loader',
            options: {
            },
          },
          // PostCSS
          {
            loader: "postcss-loader",
            options: {
              plugins: function () {
                return [
                  require('precss'),
                  require('autoprefixer')
                ];
              }
            }
          },
          // Sassをバンドルするための機能
          {
            loader: 'sass-loader',
            options: {
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './[name].css'
    })
  ],
  resolve: {
    // style-loader の中で、.jsファイルを拡張子なしで requireしているところがあるため、'.js'が必要
    extensions: ['.css', '.js']
  },
}
];
