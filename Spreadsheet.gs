/***
 * SpreadsheetにAccess TokenとRefresh Tokenを入力する
 * 
 * @params
 * AccessToken  アクセストークン
 * RefreshToken リフレッシュトークン
 * 
 * @return
 */
function setTokens(AccessToken, RefreshToken) {
  // スプレッドシートIDを使ってスプレッドシートオブジェクトを取得
  // https://docs.google.com/spreadsheets/d/xxxxxxxxxxxxxx/edit#gid=0
  var spreadsheetId = 'xxxxxxxxxxxxxx';
  var sheetName = 'Tokens'
  
  // スプレッドシートとシートを取得する
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);

  // シートの最後の行を取得
  var lastRow = sheet.getLastRow();

  // 2次元配列を作成する
  var tokensArray = []

  // 配列に配列を追加して行を作成
  tokensArray.push([AccessToken, RefreshToken]);  // 1行目

  // 代入する範囲を指定する
  var range = sheet.getRange(lastRow, 1, 1, 2);
  range.setValues(tokensArray);
}

/**
 * SpreadsheetからAccess TokenとRefresh Tokenを取得する
 * 1行目A列 Access Token
 * 1行目B列 Refresh Token
 * 
 * @return Array [[xxxxxxxxxxxxxxxxx, yyyyyyyyyyyyyyyyy]]
 */
function getTokensArray() {
  var spreadsheetId = 'xxxxxxxxxxxxxxxxx';
  var sheetName = 'Tokens'
  
  // スプレッドシートとシートを取得する
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);

  // シートの最後の行を取得
  var lastRow = sheet.getLastRow();

  // 取得するセルの範囲
  // 2行目のA,B列から値を取得する
  var range = sheet.getRange(lastRow, 1, 1, 2);
  var tokensArray = range.getValues() //2次元配列 

  Logger.log(tokensArray)
  return tokensArray
}