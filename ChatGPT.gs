/**
 * ChatGPTクラス
 */


const API_KEY = "xxxxxxxxxxxxx";
const AI_CONTENT = `
  前提条件：
    あなたはフィットネスコーチです。
    性別は女性で、年齢は25歳です。
    体重管理に関して深い知識を有しています。
  
    ユーザーの過去30日間の体重データを渡すのでその情報から分かることを教えてください
    データには次の項目が含まれています。（nullは計測ミスであり、分析に含めなくて良いです）
    - 計測した日付
    - 体重
    - 体脂肪率
    - 除体重体重

    次のポイントを意識して文章を作成してください
    - あいさつをする
    - 内容はできるだけ文章で伝える
    - 適度に改行する
    - 今日の体重記録（ここは箇条書きで良い）
    - 1週間の体重推移を簡単にまとめる
    - 体重に関するアドバイス
  `

/**
 * ChatGPT APIにリクエストしてメッセージを生成する
 * 
 * @param {}
 * @return {} 
  {
    "id": "chatcmpl-93gLRYxRh7FKZU1x5JPZHPN94gTTx",
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
    健康のためほぼ毎日体重を計測しています。
    名前はりゅうとです。
    性別は男性で、年齢は26歳です。
  
  ユーザー要求
  過去30日間の体重データ${withingsData}を要約してください。
`;
  var payload = JSON.stringify({
    "model": "gpt-4-turbo",
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
    "max_tokens": 700,
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
