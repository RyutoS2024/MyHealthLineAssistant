/**
 * Dateクラス
 * 実行日の1週間前の日付を取得する
 */

// Withingsから取得する期間
const DAYS = 30;


/**
 * 1週間前の午前9時を取得する
 * 日本時間：2024年2月1日 00:00:00
 * UNIX時間：1706713200
 * 
 * 日本時間：2024年3月10日 00:00:00
 * UNIX時間：1.7100288E9
 * 
 * 日本時間：2024年3月17日 00:00:00
 * UNIX時間：1710601200
 * 
 * 午前9時の時間を取得する
 * 
 * @param {}
 * @return {} 
 */
function getTimeAtOneMonthAgo() {
  var now = new Date(); // 現在の日時を取得
  now.setDate(now.getDate() - DAYS); // 現在からdays日前の日付を設定
  now.setHours(9, 0, 0, 0); // 時間を9時0分0秒0ミリ秒に設定
  return now;
}

/**
 * 日本時間をUnix時間に変換する
 * 
 * @param {} time 
 * @return {}
 */
function convertJSTToUnixTime(time) {
  // Unix時間（秒単位）に変換
  var unixTime = Math.floor(time.getTime() / 1000);
  
  return unixTime;
}

/**
 * UNIX時間をJST日本時間に変換する
 * 
 * @param {} unixTime
 * @return {} formattedDate 
 */
function convertUnixTimeToJST(unixTime) {
  // Unix時間をミリ秒に変換してDateオブジェクトを生成
  var date = new Date(unixTime * 1000);
  // 日本時間にフォーマットしてログに出力
  var formattedDate = Utilities.formatDate(date, "JST", "yyyy/MM/dd E");
  return formattedDate;
}