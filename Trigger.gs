/**
 * Triggerクラス
 */


/**
 * 既存のトリガーを全て削除する
 */
function deleteExistingTriggers() {
  // このスクリプトに紐づいている既存のトリガーを取得し、削除する
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
}


/**
 * Main関数を実行する用のトリガーを作成する
 */
function createMainTrigger() {
  var date = new Date();
  date.setHours(date.getHours() + 24, 0, 0, 0); 
  ScriptApp.newTrigger("main")
    .timeBased()
    .at(date)
    .create();
}