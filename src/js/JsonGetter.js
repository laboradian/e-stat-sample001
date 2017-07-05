/* global $ */

import { fixedEncodeURIComponent } from './libs.js';

class JsonGetter {

  //constructor() {
  //}

  prepareUrl() {

    // アプリケーションID
    const APP_ID = 'f1049ebf163b7e7aa48dc2d12d33903825890b4d';

    // API URL
    // ここでは、「統計データ取得」API を利用する
    // http://api.e-stat.go.jp/rest/2.0/app/getStatsData?appId=<アプリケーションID>&statsDataId=C0020050213000&cdCat01=%23A03503
    const API_URL = "http://api.e-stat.go.jp/rest/2.0/app/json/getStatsData";
    // 統計表ID
    const statsDataId ="C0020050213000";
    //コード
    const cdCat01 ="#A03503";

    return `${API_URL}?appId=${fixedEncodeURIComponent(APP_ID)}&statsDataId=${fixedEncodeURIComponent(statsDataId)}&cdCat01=${fixedEncodeURIComponent(cdCat01)}`;
  }

  getJson() {
    return new Promise ((resolve, reject) => {
      // ここに本来の非同期処理を書く。
      // その際、処理の終了後には resolve か reject を呼ぶようにする。
      // resolveの中から、thenで渡した第一引数のクロージャが実行される。
      // rejectの中からは、thenで渡した第二引数のクロージャが実行される。

      const url = this.prepareUrl();
      //console.log($);

      $.getJSON(url/*, function(jsonData){}*/)
      .done((jsonData) => {
        //const statusCode = jsonData['GET_STATS_DATA']['RESULT']['STATUS'];
        console.log('jsonData', jsonData);
        //console.log('statusCode', statusCode);

        //reject(new Error('エラーのテストです！'));

        // 統計データの数値情報を抽出します
        // Javascriptのfilterを使って、jsonデータからデータを抽出します
        const valueData = jsonData['GET_STATS_DATA']['STATISTICAL_DATA']['DATA_INF']['VALUE']
          .filter((/*item, index*/) => { return true; } );
        //console.log('valueData', valueData);

        // メタ情報から横軸事項を取得
        const apiMetaYokoList = jsonData['GET_STATS_DATA']['STATISTICAL_DATA']['CLASS_INF']['CLASS_OBJ'].filter((item/*, index*/) => {
          if (item['@id'] == 'time'){
            return true;
          }
        });
        //console.log('apiMetaYokoList', apiMetaYokoList);

        // 単位を取得
        const apiMetaCat01List = jsonData['GET_STATS_DATA']['STATISTICAL_DATA']['CLASS_INF']['CLASS_OBJ'].filter((item/*, index*/) => {
          if (item['@id'] == 'cat01'){
            return true;
          }
        });
        //console.log('apiMetaCat01List', apiMetaCat01List);
        const Unit = apiMetaCat01List[0]['CLASS']['@unit'];
        //console.log('Unit', Unit);

        // グラフに描画するデータを格納する配列
        const graphData = new Array();
        for (const key in valueData) {
          // メタ情報
          const apiYokoName = apiMetaYokoList[0]['CLASS'].filter((item/*, index*/) => {
            if (item['@code'] == valueData[key]['@time']){
              return true;
            }
          });
          graphData.push({
            name : `${apiYokoName[0]['@name']}年`,
            value: valueData[key]['$']
          });
        }

        resolve({ originalData:jsonData, data:graphData, unit:Unit });
      })
      .fail((jqxhr, textStatus, error) => {
        reject(new Error(error));
      })
      ;
    });
  }
}

export { JsonGetter };
