/**
 * LINEクラス
 */

const ACCESS_TOKEN = "";
// メッセージを送信したいユーザーまたはグループのID
const USER_ID = "";


/**
 * ChatGPTで生成したメッセージをLINEに通知する
 * 
 * @param {string}
 */
function sendLineMessage(messageFromChatGPT) {
  var message = messageFromChatGPT;

  var url = 'https://api.line.me/v2/bot/message/push';
  var headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + ACCESS_TOKEN
  };
  var postData = {
    'to': USER_ID,
    'messages': [{'type': 'text', 'text': message}]
  };
  
  var options = {
    'method': 'post',
    'headers': headers,
    'payload': JSON.stringify(postData),
    'muteHttpExceptions': true // HTTP例外をミュートに設定
  };
  
  UrlFetchApp.fetch(url, options);
}
