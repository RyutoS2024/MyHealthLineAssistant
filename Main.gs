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

  // 24時間後にトリガーを作成する
  createMainTrigger();

  // 1ヶ月前の午前9:00の時間を取得する
  var timeAtOneMonthAgo = getTimeAtOneMonthAgo();

  // 1ヶ月前の午前9:00の時間をUNIX時間に変換する
  var unixTIme = convertJSTToUnixTime(timeAtOneMonthAgo);

  // １ヶ月前から実行日当日までの体重データを取得する
  var withingsObject = getJsonObjectFromWithings(unixTIme);

  // Withings APIから取得したデータを整形する
  var formatWithingsObject = getformatWithingsJson(withingsObject);

  // ChatGPTからメッセージを取得する
  var message = getMessageFromChatGPT(JSON.stringify(formatWithingsObject));

  // メッセージをLINEへ送る
  sendLineMessage(message);
}