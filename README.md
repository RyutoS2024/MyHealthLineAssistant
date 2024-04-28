# MyHealthLineAssistant

## 概要
体重データを元にダイエットのアドバイスをしてくれるAIBot

## 機能

- 今日の計測結果（体重と体脂肪率、除脂肪体重）を伝える
- 1週間の体重推移を簡単にまとめてくれる
- 体重に関するアドバイスをくれる
- 以上の内容をLINEに通知する

## 処理フローの流れ

1. Withings APIから体重データを取得する
2. 体重データをChatGPT APIで読み込み、メッセージを生成する
3. 生成したメッセージをLINEメッセージングAPIでLINEに通知させる

![20240319_MyHealthLineAssistant](https://github.com/RyutoS2024/MyHealthLineAssistant/assets/87289018/8ac03872-5c44-4749-ad1f-0f919f38eb9d)


## 技術

- Google Apps Script
- Google Spreadsheet
- Withings API
- ChatGPT API
- LINE Messaging APIg

## 拡張機能の予定

- LINEからメッセージを受け取り相互にコミュニケーションを取れるようにする
- カロミルAPIやトレーニング記録を付けたAPIからデータを取り、それも加えてメッセージを生成できるようにする

