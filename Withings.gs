/**
 * Withingsクラス
 */
const CLINET_ID = "xxxxxxxxxxxxxx";
const CLIENT_SECRET = "yyyyyyyyyyyyyy";

/**
 * 体重計アプリWithingsから体重データを取得する
 * 
 * @param {} unixTime UNIX時間
 * @return
 * {body={measuregrps=[{hash_deviceid=xxxxxxxxxxxxx, created=1.714263105E9, deviceid=xxxxxxxxx, measures=[{type=1.0, algo=3.0, fm=128.0, unit=-3.0, value=66400.0}, {type=8.0, algo=3.0, unit=-2.0, value=700.0, fm=128.0}, {value=5640.0, type=76.0, fm=128.0, algo=3.0, unit=-2.0}, {value=4180.0, unit=-2.0, type=77.0, fm=128.0, algo=3.0}, {algo=3.0, value=300.0, fm=128.0, unit=-2.0, type=88.0}, {value=10542.0, unit=-3.0, type=6.0}, {value=59400.0, type=5.0, unit=-3.0}], date=1.714263029E9, model=Body+, grpid=5.474599423E9, category=1.0, modified=1.714263105E9, modelid=13.0, comment=null, attrib=0.0}, {comment=null, model=Body+, modelid=13.0, created=1.714263106E9, deviceid=eda63b48cdc577f3a7966a751254a3cfca5377b3, measures=[{unit=-3.0, algo=3.0, value=66400.0, type=1.0, fm=128.0}, {fm=128.0, value=700.0, type=8.0, algo=3.0, unit=-2.0}, {value=5640.0, fm=128.0, type=76.0, unit=-2.0, algo=3.0}, {type=77.0, fm=128.0, unit=-2.0, value=4180.0, algo=3.0}, {type=88.0, value=300.0, algo=3.0, unit=-2.0, fm=128.0}, {type=6.0, value=10542.0, unit=-3.0}, {unit=-3.0, value=59400.0, type=5.0}], date=1.71426308E9, attrib=0.0, grpid=5.474599437E9, category=1.0, modified=1.714263106E9, hash_deviceid=eda63b48cdc577f3a7966a751254a3cfca5377b3}, {grpid=5.474599431E9, date=1.714263053E9, category=1.0, model=Body+, comment=null, hash_deviceid=eda63b48cdc577f3a7966a751254a3cfca5377b3, modelid=13.0, deviceid=eda63b48cdc577f3a7966a751254a3cfca5377b3, modified=1.714263106E9, measures=[{fm=128.0, unit=-3.0, algo=3.0, value=66400.0, type=1.0}, {unit=-2.0, value=700.0, algo=3.0, type=8.0, fm=128.0}, {algo=3.0, type=76.0, fm=128.0, unit=-2.0, value=5640.0}, {algo=3.0, unit=-2.0, type=77.0, fm=128.0, value=4180.0}, {algo=3.0, value=300.0, unit=-2.0, type=88.0, fm=128.0}, {unit=-3.0, type=6.0, value=10542.0}, {type=5.0, value=59400.0, unit=-3.0}], created=1.714263106E9, attrib=0.0}], timezone=Asia/Tokyo, updatetime=1.714263106E9}, status=0.0}
 */
function getJsonObjectFromWithings(unixTime) {

  // SpreadsheetからAccessTokenを取得する
  var accessToken = getTokensArray()[0][0];
  var measType = "1,5,6"; // 測定タイプ
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
  var jsonObject = JSON.parse(response.getContentText());

  Logger.log(jsonObject)

  return jsonObject;
}

/**
 * Withings APIにアクセスしてAccess TokenとRefresh Tokenを更新する
 * 2時間に1回実行しなければならない
 * 
 * @params
 * @return
 * 
 */
function updateTokens() {
  // SpreadsheetからRefreshTokenを取得する
  var refreshToken = getTokensArray()[0][1];
  
  // アクセスエンドポイント
  var url = 'https://wbsapi.withings.net/v2/oauth2';
  
  var payload = {
    "action": "requesttoken",
    "client_id": CLINET_ID,
    "client_secret": CLIENT_SECRET,
    "grant_type": "refresh_token",
    "refresh_token": refreshToken
  };
  
  var options = {
    "method" : "post",
    "payload" : payload,
    "muteHttpExceptions": true // HTTP例外をミュートに設定。レスポンスコードに関わらず処理を続行
  };
  
  // エンドポイントにアクセスするときにエラーがあれば、ログを表示する
  try {
    // Withings APIからレスポンスを受け取る
    var response = UrlFetchApp.fetch(url, options);
    // レスポンスをパースする
    var jsonResponse = JSON.parse(response.getContentText());
    Logger.log(jsonResponse)

    // スプレッドシートにアクセストークンとリフレッシュトークンを登録する
    setTokens(jsonResponse.body.access_token, jsonResponse.body.refresh_token)
  } catch (e) {
    Logger.log("Withings APIをリクエスト・整形中にエラーが発生しました。エラー: " + e.toString());
  }
}

/**
 * Withings JSONデータから体重と日付を取得する
 * 1つのオブジェクトにまとめて、リストに追加する
 * 
 * @param withingsObject
 * @return Object
 * {data=[{日付=1.714263029E9, 除脂肪体重={value=59400.0, unit=-3.0, type=5.0}, 体脂肪率={unit=-3.0, value=10542.0, type=6.0}, 体重={type=1.0, algo=3.0, fm=128.0, value=66400.0, unit=-3.0}}, {除脂肪体重={unit=-3.0, type=5.0, value=59400.0}, 日付=1.71426308E9, 体脂肪率={unit=-3.0, type=6.0, value=10542.0}, 体重={unit=-3.0, algo=3.0, value=66400.0, fm=128.0, type=1.0}}, {体脂肪率={unit=-3.0, type=6.0, value=10542.0}, 日付=1.714263053E9, 除脂肪体重={type=5.0, unit=-3.0, value=59400.0}, 体重={algo=3.0, unit=-3.0, value=66400.0, fm=128.0, type=1.0}}]}
 */
function getformatWithingsJson(withingsObject) {

  // 体重データが入る配列
  var weightArray = [];

  // 要素分だけループする
  for (var i=0; i < withingsObject.body.measuregrps.length; i++) {

    // 日付
    var date = withingsObject.body.measuregrps[i].date;
    // Unix時間を日本時間に変換する
    var formatDate = convertUnixTimeToJST(date);

    // 体重
    // nullチェック
    if (withingsObject.body.measuregrps[i].measures[0] == null) {
      var formatWeight = null
    } else {
      var weight = withingsObject.body.measuregrps[i].measures[0].value;
      var formatWeight = weight /1000;
    }

    // 体脂肪率
    // nullチェック
    if (withingsObject.body.measuregrps[i].measures[5] == null) {
      var formatFatRatio = null;
    } else {
      var fatRatio = withingsObject.body.measuregrps[i].measures[5].value;
      var formatFatRatio = fatRatio / 1000;
    }
    
    // 除脂肪体重
    // nullチェック
    if (withingsObject.body.measuregrps[i].measures[6] == null) {
      var formatFatFreeMass = null;
    } else {
      var fatFreeMass = withingsObject.body.measuregrps[i].measures[6].value;
      var formatFatFreeMass = fatFreeMass / 1000;
    }

    // 新しいオブジェクトを作成する
    var weightResultObject = {
      "日付": formatDate,
      "体重(kg)": formatWeight,
      "体脂肪率(%)": formatFatRatio,
      "除脂肪体重(kg)": formatFatFreeMass
    }

    Logger.log(weightResultObject)

    // 体重配列に計測結果を入れる
    weightArray.push(weightResultObject)
  }

  //　オブジェクト化する
    var withingsObject = {
      "data": weightArray
    }

    Logger.log(withingsObject)
    return withingsObject;
}