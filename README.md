# 陳律師聯合事務所 — 官方網站

## 專案簡介

律師事務所品牌官網，純前端靜態網站。所有內容（導航列、頁尾、服務項目、律師資料、案例、FAQ 等）皆以 JavaScript 資料檔驅動，修改資料即可更新畫面，無需觸碰 HTML 或 CSS。

主要頁面：首頁（Landing Page）、成功案例、常見問題、服務流程、收費標準、隱私權政策、服務條款、免責聲明。

---

## 技術架構

| 項目 | 說明 |
|------|------|
| 框架 | 無（Pure HTML + CSS + Vanilla JS） |
| 建置工具 | 無（零 build step） |
| 資料層 | `data/*.js` — 全域變數，`<script>` 載入即可使用 |
| 共用元件 | `components.js` — 動態產生 NAV / FOOTER |
| 互動邏輯 | `script.js` — Mobile menu, scroll, dropdown, modal, 動態渲染各區塊 |
| 字型 | Google Fonts（Noto Serif TC + Noto Sans TC） |
| 響應式 | CSS media queries，支援手機 / 平板 / 桌面 |

**運作流程：**

```
HTML 載入
 → <script src="data/navigation.js">  (NAV_DATA, FOOTER_DATA)
 → <script src="data/services.js">    (SERVICES_DATA)
 → <script src="components.js">       (渲染 NAV + FOOTER → dispatch 'componentsLoaded')
 → <script src="data/xxx.js">         (各頁面資料)
 → <script src="script.js">           (監聽 'componentsLoaded' → initApp → 渲染各區塊)
```

---

## 目錄結構

```
lawWeb/
├── index.html            # 首頁（Landing Page，含所有主要區塊）
├── cases.html            # 成功案例完整列表（含篩選功能）
├── faq.html              # 常見問題
├── pricing.html          # 收費標準
├── process.html          # 服務流程
├── privacy.html          # 隱私權政策
├── terms.html            # 服務條款
├── disclaimer.html       # 免責聲明
├── styles.css            # 全站樣式（含 RWD）
├── script.js             # 互動邏輯與動態渲染
├── components.js         # 共用 NAV / FOOTER 元件
├── data/                 # 所有資料檔（見下方詳細說明）
│   ├── navigation.js     # 導航列 + 頁尾連結
│   ├── services.js       # 服務項目
│   ├── about.js          # 關於我們（含輪播圖片）
│   ├── stats.js          # 首頁統計數字
│   ├── lawyers.js        # 律師團隊
│   ├── cases.js          # 成功案例
│   ├── contact.js        # 聯絡資訊
│   ├── faq.js            # 常見問題
│   ├── pricing.js        # 收費標準
│   ├── process.js        # 服務流程
│   └── legal.js          # 法律聲明（隱私、條款、免責）
├── images/               # 圖片資源
│   ├── about-office.jpeg # 事務所照片
│   ├── about-team.jpeg   # 團隊合照
│   ├── people1.jpeg      # 律師大頭照
│   └── line-qrcode.png   # LINE QR Code
└── README.md             # 本文件
```

---

## 資料檔說明 (data/)

### `navigation.js`

定義 `NAV_DATA` 與 `FOOTER_DATA` 兩個全域變數。

```javascript
// NAV_DATA.links 每一筆結構：
{
  label: "顯示文字",
  href: "#section" | "page.html" | null,  // # 開頭 = 首頁錨點
  cta: true,             // 選填：顯示為 CTA 按鈕
  dynamic: "services",   // 選填：由 SERVICES_DATA 動態產生子選單
  children: [...]        // 選填：靜態下拉子選單
}

// FOOTER_DATA.groups 每一筆結構：
{
  title: "群組標題",
  dynamic: "services",   // 選填：從 SERVICES_DATA 產生連結
  links: [{ label, href }]  // 靜態連結
}
```

### `services.js`

```javascript
// SERVICES_DATA 陣列，每筆：
{ id: "唯一英文代號", title: "服務名稱", desc: "卡片說明文字" }
```

**連動範圍：** 首頁服務卡片、NAV 下拉選單、Footer 服務群組、案例篩選標籤。

### `about.js`

```javascript
// ABOUT_DATA
{
  slides: [{ image: "路徑", alt: "替代文字", caption: "標題" }],
  content: { tag, title, paragraphs: [...], features: [...] }
}
```

### `stats.js`

```javascript
// STATS_DATA 陣列，每筆：
{ number: "500+", label: "說明文字" }
```

### `lawyers.js`

```javascript
// LAWYERS_DATA 陣列，每筆：
{
  id: "唯一代號",
  name: "姓名",
  role: "職稱",
  photo: "圖片路徑（空字串 = 顯示預設圖）",
  bio: "一句話簡介",
  education: [...],
  experience: [...],
  specialties: [...],
  languages: "語言能力"
}
```

### `cases.js`

```javascript
// CASES_DATA 陣列，每筆：
{
  id: "唯一代號",
  category: "案件類別（對應 SERVICES_DATA.title）",
  title: "案件標題",
  summary: "摘要",
  result: "結果",
  date: "YYYY-MM-DD（最新排前面）"
}
```

首頁顯示最新 6 筆；`cases.html` 顯示全部並可依 category 篩選。

### `contact.js`

```javascript
// CONTACT_DATA
{
  tag, title, description,
  info: [{ icon: "emoji", label, value }],
  line: { id, url, qrcode: "圖片路徑" },
  traffic: null,  // 交通指引（目前停用）
  map: { src: "Google Maps embed URL", title }
}
```

### `faq.js`

```javascript
// FAQ_DATA 陣列，每筆：
{ question: "問題", answer: "回答（支援 HTML）" }
```

### `pricing.js`

```javascript
// PRICING_DATA
{
  tag, title, intro,
  methods: [{ icon, title, desc }],
  table: { headers: [...], rows: [[...], ...] },
  notes: [...]
}
```

### `process.js`

```javascript
// PROCESS_DATA
{
  tag, title, intro,
  steps: [{ step: "步驟名稱", desc: "說明", time: "預估時間" }],
  notes: [...]
}
```

### `legal.js`

```javascript
// LEGAL_DATA — 包含三個子頁面資料
{
  privacy: { title, updated, sections: [{ heading, content }] },
  terms:   { title, updated, sections: [...] },
  disclaimer: { title, updated, sections: [...] }
}
```

---

## 共用元件 (components.js)

`components.js` 為 IIFE，在 DOM 載入時自動執行：

1. 尋找 `#nav-placeholder` → 替換為完整的 `<header>` HTML
2. 尋找 `#footer-placeholder` → 替換為完整的 `<footer>` HTML
3. 觸發 `componentsLoaded` 自訂事件 → `script.js` 收到後才初始化互動功能

**NAV 產生邏輯：**

- `link.cta === true` → 渲染為 CTA 按鈕
- `link.dynamic === 'services'` → 從 `SERVICES_DATA` 動態產生下拉選單
- `link.children` 存在 → 產生靜態下拉子選單
- 其餘 → 一般超連結

**FOOTER 產生邏輯：**

- `group.dynamic === 'services'` → 從 `SERVICES_DATA` 動態產生連結列表
- 其餘 → 直接渲染 `group.links`

**路徑處理：** `resolveHref()` 會判斷當前頁面是否為首頁：
- `#anchor` → 首頁直接用、子頁面加上 `index.html` 前綴
- 絕對 / 相對路徑 → 原樣輸出

---

## 新增頁面流程

以新增「律師專欄 blog.html」為例：

### 1. 建立 HTML 檔

複製任一子頁面（如 `faq.html`）作為模板：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>律師專欄 | 陳律師聯合事務所</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;700&family=Noto+Sans+TC:wght@300;400;500;600&display=swap" rel="stylesheet">
</head>
<body>
    <div id="nav-placeholder"></div>

    <main class="page-content">
        <div class="container">
            <!-- 頁面內容 -->
            <div id="blogList"></div>
        </div>
    </main>

    <div id="footer-placeholder"></div>

    <!-- 必要 scripts -->
    <script src="data/navigation.js"></script>
    <script src="data/services.js"></script>
    <script src="components.js"></script>
    <!-- 頁面專屬資料 -->
    <script src="data/blog.js"></script>
    <script src="script.js"></script>
</body>
</html>
```

### 2. 建立資料檔 `data/blog.js`

```javascript
const BLOG_DATA = [
  { id: "post1", title: "...", content: "..." }
];
```

### 3. 在 `script.js` 新增渲染邏輯

在 `initApp()` 內加入對應的渲染函式，判斷 DOM 元素是否存在即可：

```javascript
const blogList = document.getElementById('blogList');
if (blogList && typeof BLOG_DATA !== 'undefined') {
    // 渲染 blog 卡片
}
```

### 4. 加入導航連結

編輯 `data/navigation.js`，在 `NAV_DATA.links` 或 `children` 中新增項目：

```javascript
{ label: "律師專欄", href: "blog.html" }
```

---

## 新增 / 修改資料流程

適合非工程師操作——只需編輯 `data/` 資料夾中的 `.js` 檔案。

### 修改原則

1. **只動引號內的文字**，不要動結構符號（`{}`、`[]`、`,`）
2. 每筆資料以 `{}` 包裹，陣列項目間用 `,` 分隔
3. 文字中若有引號，需用反斜線跳脫：`\"`
4. 存檔後重新整理瀏覽器即可看到效果

### 範例：新增一筆服務項目

編輯 `data/services.js`，在陣列最後加入：

```javascript
  {
    id: "tax",
    title: "稅務法",
    desc: "稅務申報爭議、租稅規劃、行政救濟。"
  }
```

→ 首頁服務卡片、NAV 下拉選單、Footer 服務列表皆會自動更新。

### 範例：新增一位律師

編輯 `data/lawyers.js`，在陣列尾端新增一筆物件（參照既有格式）。照片放入 `images/` 資料夾並填入 `photo` 欄位路徑。

### 範例：新增一筆成功案例

編輯 `data/cases.js`，`category` 欄位請填入 `SERVICES_DATA` 中既有的 `title`（如「公司商務法」、「家事法」），這樣篩選標籤才能正確對應。

---

## 連動機制

以下說明資料如何在多處自動生效：

```
data/services.js (SERVICES_DATA)
 ├── 首頁 #services 區塊 → 服務卡片
 ├── components.js NAV → 動態下拉子選單（link.dynamic === 'services'）
 ├── components.js FOOTER → 「服務項目」群組（group.dynamic === 'services'）
 └── cases.html 篩選標籤 → 從 CASES_DATA 的 category 取得所有類別

data/navigation.js (NAV_DATA + FOOTER_DATA)
 ├── 所有頁面的 <header> 導航列
 └── 所有頁面的 <footer> 頁尾連結

data/cases.js (CASES_DATA)
 ├── 首頁 #cases → 最新 6 筆
 └── cases.html → 全部案例 + 篩選
```

**重點：** 修改 `services.js` 後，新服務會同步出現在 NAV 下拉選單和 Footer，無需額外設定。若新增的案例 `category` 不屬於任何現有服務名稱，該類別仍會出現在篩選標籤中（從案例資料本身提取）。

---

## 部署說明

本專案為純靜態網站，**無需任何 build step**。

### 部署方式

將整個資料夾內容上傳至任何靜態檔案伺服器即可：

- **GitHub Pages** — push 到 `gh-pages` branch 或設定 main branch 即可
- **Netlify / Vercel** — 直接連接 repo，無需設定 build command
- **AWS S3 + CloudFront** — 上傳檔案至 S3 bucket 並設定為靜態網站託管
- **傳統虛擬主機** — FTP 上傳所有檔案

### 部署清單

確認以下檔案皆已包含：
- 所有 `.html` 檔案
- `styles.css`
- `script.js`、`components.js`
- `data/` 整個資料夾
- `images/` 整個資料夾

不需上傳：`.DS_Store`、`README.md`

---

## 注意事項

### 1. file:// 協定的 CORS 問題

本專案使用 `<script>` 標籤載入資料（非 fetch），**大部分情況下可直接用 file:// 開啟**。但若未來改用 `fetch()` 或 ES Modules，瀏覽器會因 CORS 政策阻擋本地檔案存取。

**建議開發時使用本地伺服器：**

```bash
# Python 3
python3 -m http.server 8000

# Node.js（需安裝 serve）
npx serve .

# VS Code
# 安裝 Live Server 擴充套件，右鍵 Open with Live Server
```

然後開啟 `http://localhost:8000`。

### 2. Script 載入順序

各 HTML 頁面的 `<script>` 引入順序很重要：

1. `data/navigation.js` — 必須最先（NAV_DATA / FOOTER_DATA）
2. `data/services.js` — 在 `components.js` 之前（SERVICES_DATA 用於動態選單）
3. `components.js` — 產生 NAV + FOOTER
4. 其他 `data/*.js` — 頁面專屬資料
5. `script.js` — 必須最後（等待 `componentsLoaded` 事件）

### 3. 圖片路徑

所有圖片放在 `images/` 資料夾。資料檔中填寫相對路徑（如 `images/people1.jpeg`）。律師 `photo` 留空字串 `""` 會顯示預設佔位圖。

### 4. 錨點連結行為

`components.js` 中的 `resolveHref()` 會自動處理跨頁錨點：
- 在首頁：`#services` → 直接滾動
- 在子頁面：`#services` → 導向 `index.html#services`

### 5. 新增服務與案例類別對應

案例的 `category` 欄位建議使用與 `SERVICES_DATA` 中 `title` 一致的文字，以確保篩選功能正確運作。
