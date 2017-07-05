/* global $, Morris */
import '../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.js';
import { JsonGetter } from './JsonGetter.js';

// index.html ファイルをコピーする
require('file-loader?name=../../dist/[name].[ext]!../index.html');

document.querySelector('#btnGetData').addEventListener('click', () => {

  const loadingArea = $('#loadingArea');
  const resultArea = $('#resultArea');
  const errMsg = $('#errMsg');

  loadingArea.removeClass('hidden');

  (new JsonGetter()).getJson().then((response) => {

    resultArea.removeClass('hidden');
    loadingArea.addClass('hidden');

    $('#resultJsonOriginal').text(JSON.stringify(response.originalData, null, "\t"));
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

    $('#loadingArea').addClass('hidden');
    errMsg.text(`${error.name}: ${error.message}`).removeClass('hidden');

  });
});

document.querySelector('#btnClearData').addEventListener('click', () => {

  $('#loadingArea').addClass('hidden');
  $('#resultArea').addClass('hidden');
  $('#resultJson').text('');
  $('#mygraph').text('');
  $('#errMsg').addClass('hidden');

});
