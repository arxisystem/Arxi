# 太曦 Arxi 網站內容操作速查

> 給張曦昀自己看的。忘記怎麼改東西的時候翻這頁。

---

## 1. 我想改的東西在哪？

| 想改什麼 | 改哪裡 | 誰能改 |
|---|---|---|
| 文章、教學文（內文、標題、圖片） | Ghost 後台 | **你自己** |
| 新增 / 刪除文章 | Ghost 後台 | **你自己** |
| 首頁文案（太曦是什麼、關於我…） | 程式碼 `app/page.tsx` | 找 Claude |
| 關於頁五段（追問/發現/…） | 程式碼 `app/about/page.tsx` | 找 Claude |
| 回響個案（Sylvia/怡君/Marcus） | 程式碼 `lib/voices.ts` | 找 Claude |
| Footer、導覽列 | 程式碼 | 找 Claude |

重點：**文章正本只在 Ghost**。Obsidian 那些 `.md` 草稿只是當初上傳前的備份，改它們不會影響網站。

---

## 2. Ghost 後台

**登入網址**（一定要用這個，不要用 ghost.arxi.tw）：

```
https://ghost-production-8c11.up.railway.app/ghost/
```

帳號 `arxi.system@gmail.com` + 密碼。

> ⚠️ 用 `ghost.arxi.tw/ghost/` 會跳「Request made from incorrect origin」登不進去。這是 Ghost 的安全設定，正常，改用上面那條 Railway 網址就好。

**改文章步驟**：
1. 左側 **Posts** → 點文章
2. 改內容
3. 右上 **Update**
4. 等 1–3 分鐘，arxi.tw 自動更新（見下方說明）

**新增文章注意**：一定要在文章設定裡加 tag——
- 要出現在「文章」頁 → 加 tag `writing`
- 要出現在「教學」頁 → 加 tag `teaching`
- **沒加 tag 的文章不會出現在網站上**（列表頁靠 tag 篩選）。

---

## 3. 改完為什麼沒馬上變？要等多久？

Ghost 改文 → 自動觸發 Vercel 重新部署 → **約 1–3 分鐘** arxi.tw 全站（列表＋內頁）一起更新。

這是設定好的自動流程（Ghost webhook → Vercel Deploy Hook），你什麼都不用做，等就好。

**想確認有沒有在跑**：
- Vercel → arxi 專案 → Deployments，改文後應該看到一筆新的 build 在 `Building`
- 或 Ghost → Settings → Integrations → Vercel Deploy → Webhooks → 看「Last triggered」時間

---

## 4. 自救：改了很久還是沒變

1. **先等滿 3 分鐘**（build 要時間）
2. 還是舊的 → Vercel → arxi 專案 → Deployments → 看最新一筆：
   - 在 `Building` → 再等一下
   - `Error` → 截圖丟 Claude
   - 沒有新的 build（webhook 沒觸發）→ 手動點最新 deployment 右側 `⋯` → **Redeploy**（一定有效，1–3 分鐘）
3. 瀏覽器看到舊的 → `Ctrl + Shift + R` 強制重新整理，或開無痕視窗

---

## 5. 一句話總結

- **改文章** → Ghost 後台 Update → 等幾分鐘 → 自動上線
- **改網站其他東西** → 找 Claude
- **怎樣都不更新** → Vercel 手動 Redeploy