/**
 * ChatGPTクラス
 */

// 指定期間
var days = 30;
const API_KEY = "";
const AI_CONTENT = `
  前提条件：
    あなたはパーソナルトレーナーです。
    性別は女性で、年齢は25歳です。
    ダイエット経験があり、トレーニングの中でもダイエットに関する専門的な知識を有しています。
  
  文章を生成するときのポイント
    これから過去${days}日間の体重データを渡します。体重データは日数分ないかもしれませんが、気にしないでください。
    柔らかい文章で書いてください。
    行が2,3続く時は改行してください。
    トークンの最大は500なのでそれに収まる範囲で文章を作成してください。
    以下の内容は含めてください。
      1番最近の体重について
      体重の推移がうまくいっているかどうか
      今後のダイエットについてアドバイス
  `

/**
 * ChatGPT APIにリクエストしてメッセージを生成する
 * 
 * @param {}
 * @return {} 
  {
    "id": "xxxxxxxxxxxxxxxx",
    "usage": {"total_tokens": 989.0, "prompt_tokens": 574.0, "completion_tokens": 415.0},
    "choices": [
      {
        "message": {
          "content": "過去30日間の体重データをありがとうございます。まず、直近の体重は66.6kgですね。体重の推移を見ると、一定の変動がありますね。安定して減量を続けるためには食事管理と適切なトレーニングが重要です。\n\nあなたの目標は2024年6月までに63kgになることですね。この目標を達成するためには、食事内容を見直すことが大切です。バランスの取れた食事を心がけ、タンパク質をしっかり摂取しつつ、過剰なカロリー摂取を避けるようにしましょう。また、トレーニングでは有酸素運動と筋トレを組み合わせることで、脂肪燃焼を促進し、筋肉を増やす助けになります。\n\n定期的な体重測定と食事・トレーニングの記録をしっかり行い、進捗を確認しながら調整していくことが大切です。焦らず着実に取り組んでいきましょう。目標達成まであと少しですが、コツコツと努力を重ねることで必ず成功に近づけるはずです。頑張ってください！",
          "role": "assistant"
        },
        "finish_reason": "stop",
        "index": 0.0,
        "logprobs": null
      }
    ],
    "system_fingerprint": "fp_4f2ebda25a",
    "object": "chat.completion",
    "created": 1710664785,
    "model": "gpt-3.5-turbo-0125"
  };
 */
function getMessageFromChatGPT(withingsData) {
  var apiURL = "https://api.openai.com/v1/chat/completions";

  const USER_CONTENT = `
  前提条件
    私はダイエットのためにパーソナルトレーニングを申し込みました。
    名前は〇〇です。
    性別は男性で、年齢は26歳です。
    ダイエットの目的は健康的な体を手に入れるためで、痩せつつ筋肉を増やしたいと考えています。
    ダイエット開始前の体重は68kg
    目標は2024年6月までに体重を63kgにすること
  
  ユーザー要求
  過去${days}日間の体重データ${withingsData}を元にダイエットに関するアドバイスをください。
`;
  var payload = JSON.stringify({
    "model": "gpt-3.5-turbo",
    "messages": [
      // AIにどのような情報やスタイルで応答すべきか前提条件を与える
      {
        "role": "system",
        "content": AI_CONTENT
      },
      // ユーザーの質問やリクエスト
      {
        "role": "user",
        "content": USER_CONTENT
      },
    ],
    // テキストの多様性を制御
    "temperature": 0.7,
    // 最大トークン
    "max_tokens": 500,
    "top_p": 1.0,
    "frequency_penalty": 0.0,
    "presence_penalty": 0.0
  });

  var options = {
    "method" : "post",
    "contentType": "application/json", // コンテントタイプを指定
    "headers": {
      "Authorization": "Bearer " + API_KEY
    },
    "payload" : payload,
    "muteHttpExceptions": true // エラーハンドリングをカスタマイズする場合はtrueに設定
  };

  try {
    var response = UrlFetchApp.fetch(apiURL, options);
    var jsonResponse = JSON.parse(response.getContentText());
    var formattedJson = JSON.stringify(jsonResponse, null, 2); // 第二引数にnullを、第三引数にスペースの数を指定
    var message = getMessageFromJson(formattedJson);
    return message;

  } catch(e) {
    Logger.log("ChatGPT APIをリクエスト・整形中にエラーが発生しました。エラー: " + e.toString());
  }

  /**
   * JSONからメッセージだけを取得する
   * 
   * @param {} json
   * @return {string} message
   */
  function getMessageFromJson(json) {
    var jsonObject = JSON.parse(json);
    var message = jsonObject.choices[0].message.content;
    return message
  }

}
