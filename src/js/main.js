/* global $, Morris */
import '../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.js';
import { JsonGetter } from './JsonGetter.js';

// index.html ファイルをコピーする
require('file-loader?name=../../dist/[name].[ext]!../index.html');

document.querySelector('#btnGetData').addEventListener('click', () => {

  const loadingArea = $('#loadingArea');
  const resultArea = $('#resultArea');

  loadingArea.removeClass('hidden');

  (new JsonGetter()).getJson().then((response) => {

    resultArea.removeClass('hidden');
    loadingArea.addClass('hidden');

    $('#resultJson').text(JSON.stringify(response.data, null, "\t"));
    new Morris.Bar({
      element: 'mygraph',
      data: response.data,
      xkey: 'name',
      ykeys: ['value'],
      xLabels: "年",
      labels: ['値'],
      postUnits: response.unit,
      gridLineColor: '#000000',
      hideHover: 'auto'
    });
  }, (error) => {
    console.error("Failed!", error);
  });
});

document.querySelector('#btnClearData').addEventListener('click', () => {

  $('#resultArea').addClass('hidden');
  $('#resultJson').text('');
  $('#mygraph').text('');

});
