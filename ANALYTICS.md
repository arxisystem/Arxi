# 太曦 Arxi 數據速查 — 一頁看完所有點擊

> 目標：不要再跑 GA、Vercel、Ghost 三個地方。用 Looker Studio 做一個專屬儀表板，加書籤，以後只看那一頁。

---

## 1. 你的網站有哪些「可以看」的數據

每次有人按關鍵按鈕，網站會送一個「事件」到 GA4。事件對照表：

| 事件名稱 | 代表什麼 | 在哪頁 |
|---|---|---|
| `book_click_hero` | 按了首頁的「預約初次諮詢」 | 首頁（上方 Hero + 下方「如果你準備好了」兩顆都算這個） |
| `book_click_about` | 在「關於」頁底按預約 | /about |
| `book_click_bookpage` | 進到 /book 跳轉頁、被導去 LINE | /book |
| `line_chat_click` | 看完文章按「有話想說嗎？來聊聊」 | 每篇文章底部 |
| `voice_book_click` | 從「回響」頁某個個案按預約 | /voices（會附 `voice_name`＝哪一位個案帶來的） |

> 注意：首頁上方 Hero 跟下方那顆預約鈕，目前都記成 `book_click_hero`，GA 裡分不出是哪一顆。要分的話再跟 Claude 說，可以拆成兩個事件。

另外 GA4 本來就會自動記：每頁多少人看（page_view）、從哪來、停多久。

---

## 2. 第一次設定 Looker Studio（約 10 分鐘，只做一次）

1. 開 https://lookerstudio.google.com → 用**跟 GA 同一個 Google 帳號**登入
2. 左上 **Create → Report**
3. 跳出 **Add data** → 選 **Google Analytics**
4. 授權 → 選你的 GA4 帳戶 → 選 `太曦`（資源 ID 對應 `G-M51Y83LHGQ`）→ **Add**
5. 它會自動放一張表，先不管它，下面開始放你要的東西

---

## 3. 要放哪些圖表（照這個清單加）

報表上方工具列 **Add a chart** / **Add a control**，依序加：

**(a) 時間範圍控制**
- Add a control → **Date range control**，拖到報表最上方
- 之後你想看「過去 7 天 / 30 天」直接點它切換

**(b) 關鍵數字卡（最重要）**
- Add a chart → **Scorecard**
- Metric 選 **Event count**
- 點該卡 → 加 **Filter**：`Event name` 等於 `book_click_hero`
- 重複做 5 張，分別 filter：`book_click_hero`、`book_click_about`、`book_click_bookpage`、`line_chat_click`、`voice_book_click`
- 這排就是你的「預約/互動點擊總數」一眼看完

**(c) 哪個回響個案最有效**
- Add a chart → **Table**
- Dimension：`Event name`（再加一個自訂維度 `voice_name`，若清單沒有先略過，跟 Claude 說再開）
- Metric：Event count
- Filter：`Event name` = `voice_book_click`
- 看哪位個案（Sylvia / 怡君 / Marcus / Syuan / ALEX）帶來最多預約點擊

**(d) 各頁瀏覽量**
- Add a chart → **Bar chart**
- Dimension：`Page path`
- Metric：`Views`
- 看 首頁 / 各文章 / /voices / /about 誰最多人看

**(e) 來源**
- Add a chart → **Pie chart**
- Dimension：`Session source / medium`
- Metric：`Sessions`
- 看人是從 Google / LINE / IG / 直接輸入 來的

排好後右上 **Save**，再點 **Share → 取得連結**（或直接把這個分頁加書籤）。

---

## 4. 之後怎麼用

- 開書籤 → 看最上面那排數字卡（這週多少人按預約）→ 看回響表（哪個個案有效）→ 看頁面表（哪篇文章紅）
- 想看不同期間 → 點最上面的日期控制切換
- 數據不是即時，GA4 通常**延遲幾小時～1 天**，看趨勢就好，不用盯當下

---

## 5. Clarity 要另外看（接不進來）

熱區圖、滑鼠軌跡、使用者卡在哪——這是「行為」不是「數字」，Looker Studio 接不了。
要看那個還是去 https://clarity.microsoft.com 後台。但「多少人、按了什麼」用上面這頁就夠。

---

## 一句話總結

GA 的數字 → Looker Studio 一頁（自己建一次，加書籤）。
使用者怎麼操作 → Clarity 後台。
其他都不用看。
