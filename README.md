# MyHealthLineAssistant

## 概要
体重データを元にダイエットのアドバイスをしてくれるAIBot

## 機能

- 直近の体重記録を教えてくれる
- 目標体重に向けて順調に推移しているか把握できる
- ダイエットのアドバイスを教えてくれる
- LINEへ通知する

## 処理フローの流れ

1. Withings APIから体重データを取得する
2. 体重データをChatGPT APIで読み込み、メッセージを生成する
3. 生成したメッセージをLINEメッセージングAPIでLINEに通知させる

![20240319_MyHealthLineAssistant](https://github.com/RyutoS2024/MyHealthLineAssistant/assets/87289018/8ac03872-5c44-4749-ad1f-0f919f38eb9d)


## 技術

- Google Apps Script
- Withings API
- ChatGPT API
- LINE Messaging API

## 拡張機能の予定

- 体重データ以外に脂肪、筋肉量、体脂肪率のデータも取得できるようにする
- LINEからメッセージを受け取り相互にコミュニケーションを取れるようにする
- カロミルAPIやトレーニング記録を付けたAPIからデータを取り、それも加えてメッセージを生成できるようにする

