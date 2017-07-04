import '../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.js';

// index.html ファイルをコピーする
require('file-loader?name=../../dist/[name].[ext]!../index.html');
