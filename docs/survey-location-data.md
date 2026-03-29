# アンケート回答者の地域情報を取得する方法

## 前提

このサイトでは、回答者の「住んでいる場所そのもの」は取得できません。

取得できるのは、Vercel がリクエスト時に付与する `IPベースの推定地域情報` です。

そのため、正しい表現は以下です。

- `居住地` ではなく `推定地域`
- `住んでいる県` ではなく `アクセス元IPから推定された地域`

特に以下は注意が必要です。

- 携帯回線だと別地域になることがある
- VPN 利用時は大きくずれることがある
- 会社や学校の回線だと、その拠点の地域になることがある
- 番地レベルの特定はできない

## 現在の保存方法

アンケート送信時に、回答内容と一緒に以下の推定地域情報を保存しています。

- `country`
- `region`
- `city`
- `latitude`
- `longitude`

保存処理は [server/surveyHandlers.ts](/Users/kaiki/my/yorumichi-needs-survey/server/surveyHandlers.ts) にあります。

該当箇所:

- 地域情報の取得: [server/surveyHandlers.ts](/Users/kaiki/my/yorumichi-needs-survey/server/surveyHandlers.ts#L161)
- Upstash Redis への保存: [server/surveyHandlers.ts](/Users/kaiki/my/yorumichi-needs-survey/server/surveyHandlers.ts#L210)
- CSV エクスポート: [server/surveyHandlers.ts](/Users/kaiki/my/yorumichi-needs-survey/server/surveyHandlers.ts#L410)

## どのヘッダから取得しているか

Vercel では、リクエストに地域情報ヘッダが付与されます。

現在使っているのは以下です。

- `x-vercel-ip-country`
- `x-vercel-ip-country-region`
- `x-vercel-ip-city`
- `x-vercel-ip-latitude`
- `x-vercel-ip-longitude`

コード上は次のように取得しています。

```ts
const country = req.headers["x-vercel-ip-country"] ?? null;
const region = req.headers["x-vercel-ip-country-region"] ?? null;
const city = req.headers["x-vercel-ip-city"] ?? null;
const latitude = req.headers["x-vercel-ip-latitude"] ?? null;
const longitude = req.headers["x-vercel-ip-longitude"] ?? null;
```

## その人の「住んでいる県」を知りたいときの考え方

### 1. 自動取得だけで判断する場合

保存済みの `region` と `city` を見ます。

- `region`: 都道府県相当の地域コード
- `city`: 推定市区町村

ただし、これは `住んでいる場所` の確定値ではありません。

この方法は以下の用途に向いています。

- 回答者の地域分布の傾向を見る
- どの地域からのアクセスが多いか集計する
- 東京周辺が多いか、地方が多いかを大まかに把握する

### 2. 本当に住んでいる県を知りたい場合

フォームに `都道府県` の選択項目を追加してください。

これが最も確実です。

おすすめは次の構成です。

- 自動取得: `country`, `region`, `city`, `latitude`, `longitude`
- 本人入力: `prefecture`

この形にすると、

- 自動取得で大まかな地域傾向を見る
- 本人入力で居住都道府県を分析する

という使い分けができます。

## 今のデータを確認する方法

保存先は Upstash Redis です。

CSV で確認したい場合は、以下のエンドポイントを使います。

```txt
GET /api/survey-export?token=YOUR_SURVEY_EXPORT_TOKEN
```

または `Authorization` ヘッダでも取得できます。

```txt
Authorization: Bearer YOUR_SURVEY_EXPORT_TOKEN
```

CSV には以下の列が出ます。

- `id`
- `submittedAt`
- `gender`
- `age`
- `stalker_exp`
- `q1_use_app`
- `q2_why_app`
- `q3_use_device`
- `q4_why_device`
- `q5_price`
- `q6_coupon_map`
- `country`
- `region`
- `city`
- `latitude`
- `longitude`

## 「県」として扱うときの実務ルール

運用では、以下のように扱うのが安全です。

- `region` は `推定都道府県` として使う
- `city` は `参考値` として使う
- `latitude` `longitude` は地図表示や傾向把握用にだけ使う
- 分析資料では `居住地` ではなく `推定地域` と書く

## 追加で取得できる情報

必要なら、以下も保存できます。

- `x-vercel-ip-timezone`
- `x-vercel-ip-continent`
- `x-vercel-ip-postal-code`
- `accept-language`
- `user-agent`

ただし、次の方針を推奨します。

- `timezone` は保存してよい
- `postal-code` は精度とセンシティブさの面で慎重に扱う
- `user-agent` は必要があるときだけ保存する
- `raw IP` はできるだけ保存しない

## プライバシー上の注意

推定地域情報を保存する場合は、フォーム付近やプライバシーポリシーで明記してください。

最低限、以下は書くべきです。

- 回答内容を保存すること
- アクセス元の推定地域情報を取得すること
- 分析目的で利用すること

## 結論

回答者の「住んでいる情報」を知りたいときは、次のように考えるのが正しいです。

- 自動取得だけで分かるのは `推定地域`
- 正確な都道府県を知りたいなら `都道府県入力欄` を追加する
- 今の実装は、地域傾向の分析には使える
- 居住地の確定には使わない
