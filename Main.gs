/**
 * Mainクラス
 */


/**
 * Withigsアプリから体重データを取得し、LINEに送信する
 * 
 * @param
 * @return
 */
function main() {

  // 全てのトリガーを削除する
  deleteExistingTriggers();

  // 2時間後のトリガーを作成する
  createNextTrigger();

  // Withingsから取得する期間
  var jstTime = getTime();

  // 日本時間からUNIX時間に変換する
  var unxiTIme = convertJSTToUnixTime(jstTime);

  // Unix時間以降の体重データをWithingsからJsonデータとして取得する
  var measureJson = getJsonFromWithings(unxiTIme);

  // もし午前9時なら以下の処理を実行する
  var now = new Date();
  if (now.getHours() == 9) {
    // 体重データと日付データ入ったオブジェクトリストを取得する
    var weightAndDateObjectList = getWeightAndDateObjectList(measureJson);

    // ChatGPTからメッセージを取得する
    var message = getMessageFromChatGPT(weightAndDateObjectList);

    // メッセージをLINEへ送る
    sendLineMessage(message);
  }
}



