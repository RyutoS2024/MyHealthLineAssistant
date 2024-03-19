/**
 * Withingsクラス
 */
const REFRESH_TOKEN = "";
const CLINET_ID = "";
const CLIENT_SECRET = "";

/**
 * 体重計アプリWithingsから体重データを取得する
 * 
 * @param {} unixTime UNIX時間
 *   return:
  {
    "status": 0,
    "body": {
      "updatetime": 1710193133,
      "timezone": "Asia/Tokyo",
      "measuregrps": [
        {
          "grpid": 5272921517,
          "attrib": 0,
          "date": 1708136953,
          "created": 1708136981,
          "modified": 1708136981,
          "category": 1,
          "deviceid": "xxxxxxxxxxxxxxxxx",
          "hash_deviceid": "xxxxxxxxxxxxxxxxx",
          "measures": [
            {
              "value": 64800,
              "type": 1,
              "unit": -3,
              "algo": 0,
              "fm": 128
            }
          ],
          "modelid": 13,
          "model": "Body+",
          "comment": null
        }
      ]
    }
  }
 */
function getJsonFromWithings(unixTime) {
  // アクセストークンを取得する
  var accessToken = getNewAccessTokenFromWithigs();
  var measType = 1; // 測定タイプ
  var lastUpdate = unixTime; // 最終更新時間
  var category = 1; // カテゴリー
  
  var url = 'https://wbsapi.withings.net/measure';
  var headers = {
    "Authorization": "Bearer " + accessToken
  };
  
  var payload = {
    "action": "getmeas",
    "meastype": measType,
    "lastupdate": lastUpdate,
    "category": category
  };
  
  var options = {
    "method" : "post",
    "headers": headers,
    "payload" : payload,
    "muteHttpExceptions": true // HTTP例外をミュートに設定。レスポンスコードに関わらず処理を続行
  };
  
  var response = UrlFetchApp.fetch(url, options);
  var jsonResponse = JSON.parse(response.getContentText());

  // JSONオブジェクトを整形して文字列化
  var formattedJson = JSON.stringify(jsonResponse, null, 2); // 第二引数にnullを、第三引数にスペースの数を指定
  return formattedJson;
}

/**
 * Withings JSONデータから体重と日付を取得する
 * 1つのオブジェクトにまとめて、リストに追加する
 * 
 * @param {}
 * @return {}
 * return:
 * [
 *  {weight=64800.0, date=1.708136953E9},
 *  {weight=64800.0, date=1.708136996E9},
 *  {weight=66600.0, date=1.710193083E9}
 * ]
 */
function getWeightAndDateObjectList(measureJson) {
  var jsonObject = JSON.parse(measureJson);

  // 新しいリストを作成する
  var list = []
  // measuregrpsへのアクセス
  var measuregrpList = jsonObject.body.measuregrps;
  
  // `measuregrps`配列内の各要素に対して処理を行う場合は、以下のようにループを使用できます。
  for (var i = 0; i < measuregrpList.length; i++) {
    var mgroups = measuregrpList[i];
    // 新しいオブジェクトを作成する
    var object = {};

    // Unix時間からJSTに変換する
    jstDate = convertUnixTimeToJST(mgroups.date);

    // 日付データ
    object['date'] = jstDate;

    // 体重データ
    var measure = mgroups.measures[0];
    var calcedWeight = calcWeightValue(measure.value)

    object['weight'] = calcedWeight;

    // リストに追加する
    list.push(object)
  }

  json = convertArrayToJsonString(list);
  return json;
}

/**
 * 体重を計算する
 * 体重 / 1000 で計算する
 * 
 * @param (int) weight 体重（66600）
 * @return (int) result 計算結果
 */
function calcWeightValue(weight) {
  return result = weight / 1000
}

/**
 * 配列をJSON文字列に変換する
 * 
 * @param (list) list リスト []
 * @return (string) JSON文字列
 */
function convertArrayToJsonString(list) {
  // 配列をJSON形式の文字列に変換
  var jsonString = JSON.stringify(list);  
  return jsonString;
}


/**
 * リフレッシュトークンを元に新しいアクセストークンを取得する
  return:
  {
    "status": 0,
    "body": {
      "userid": 36857528,
      "access_token": "xxxxxxxxxxxxxxxxx",
      "refresh_token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "scope": "user.info,user.metrics,user.activity",
      "expires_in": 10800,
      "token_type": "Bearer"
    }
  }
 */
function getTokensFromWithings() {
  var refreshToken = REFRESH_TOKEN;
  var clientId = CLINET_ID;
  var clientSecret = CLIENT_SECRET;
  
  var url = 'https://wbsapi.withings.net/v2/oauth2';
  
  var payload = {
    "action": "requesttoken",
    "client_id": clientId,
    "client_secret": clientSecret,
    "grant_type": "refresh_token",
    "refresh_token": refreshToken
  };
  
  var options = {
    "method" : "post",
    "payload" : payload,
    "muteHttpExceptions": true // HTTP例外をミュートに設定。レスポンスコードに関わらず処理を続行
  };
  
  try {
    var response = UrlFetchApp.fetch(url, options);
    var jsonResponse = JSON.parse(response.getContentText());
    // JSONオブジェクトを整形して文字列化
    var formattedJson = JSON.stringify(jsonResponse, null, 2); // 第二引数にnullを、第三引数にスペースの数を指定
    Logger.log("トークン" + formattedJson)
    return formattedJson;
  } catch (e) {
    Logger.log("Withings APIをリクエスト・整形中にエラーが発生しました。エラー: " + e.toString());
  }
}

/**
 * アクセストークンを保存する
 * 
 * @param {string} json トークン情報
 * param:
    {
      "status": 0,
      "body": {
        "userid": 36857528,
        "access_token": "xxxxxxxxxxxxxxxxxxxxxxx",
        "refresh_token": "xxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "scope": "user.info,user.metrics,user.activity",
        "expires_in": 10800,
        "token_type": "Bearer"
      }
    }
    @return:
 */
function saveAccessToken(json) {
  // JSON文字列をオブジェクトに変換
  var jsonObject = JSON.parse(json);
  var accessToken = jsonObject.body.access_token;
  // アクセストークンをスクリプトのプロパティとして保存
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('ACCESS_TOKEN', accessToken);
}

/**
 * アクセストークンを取得する
 * 
 * @param
 * @return {string} アクセストークン
 */
function getAccessToken() {
  // スクリプトのプロパティからアクセストークンを取得
  var scriptProperties = PropertiesService.getScriptProperties();
  var accessToken = scriptProperties.getProperty('ACCESS_TOKEN');
  return accessToken;
}

/**
 * アクセストークンを更新する
 * 
 * @param
 * @return {string} 新しいアクセストークン
 */
function getNewAccessTokenFromWithigs() {
  // 新しいトークンを取得する
  var tokenJson = getTokensFromWithings();
  // アクセストークンをスクリプトプロパティに保存する
  saveAccessToken(tokenJson);

  // スクリプトプロパティからアクセストークンを取得する
  var newAccessToken = getAccessToken();
  return newAccessToken;
}

