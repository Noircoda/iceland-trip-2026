# 🇮🇸 冰島環島手冊 2026

冰島 10 日自駕（2026/7/12–7/21）的互動式行程網頁：地圖＋每日路線＋時間軸＋一鍵導航，可安裝成 PWA 離線使用，作為旅行期間的隨身工具本。

## 功能

- **總覽首頁**：全冰島地圖、10 日路線逐日繪製開場動畫、日卡快速進入
- **單日工具模式**：桌面雙欄／手機可拖曳底部抽屜；時間軸與地圖雙向聯動（捲動跟飛、點 marker 開詳情）
- **停靠點詳情**：介紹、tips、營業時間、評分、價格、🧭 一鍵開 Google Maps 導航、預約連結
- **清單**：預約（13 項）／採買補給（6 站）／行前檢查——勾選存 localStorage
- **實用資訊**：隧道費、停車、退稅、安全鐵則、日出日落表
- **旅行期間**：日期吻合時自動跳到當天並顯示「現在」時間線
- **PWA**：可加入主畫面；行程資料完全離線可用，看過的地圖區域離線可見

## 開發

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 產出 dist/（含 PWA service worker）
```

## 部署到 GitHub Pages

1. 在 GitHub 建立 repo（例：`iceland-trip-2026`）
2. 推上去：
   ```bash
   git remote add origin https://github.com/<你的帳號>/iceland-trip-2026.git
   git push -u origin main
   ```
3. Repo → Settings → Pages → Source 選 **GitHub Actions**
4. push 後 Actions 會自動建置部署；網址為 `https://<帳號>.github.io/iceland-trip-2026/`

> 子路徑由 workflow 的 `BASE_PATH` 自動帶入 repo 名，repo 改名也不用改程式。

## 資料維護

| 檔案 | 內容 |
|---|---|
| `src/data/itinerary.ts` | 10 天全部停靠點（時間、座標、介紹、tips、預約連結） |
| `src/data/checklists.ts` | 預約／採買／行前清單 |
| `src/data/info.ts` | 實用資訊卡片與日出日落表 |
| `public/routes/day*.geojson` | 每日行車路線（OSRM 預抓，已 commit） |

改了停靠點座標後重抓路線：

```bash
node --experimental-strip-types scripts/fetch-routes.mjs
```

其他腳本：`scripts/resolve-coords.mjs`（Google Maps 短連結 → 座標）、`scripts/gen-icons.mjs`（PWA 圖示，需臨時安裝 sharp：`npm i --no-save sharp`——sharp 不在 devDependencies，因為它的跨平台原生二進位會破壞 CI 的 `npm ci`；圖示已 commit，平時不需重跑）。

## 技術

Vite + React 18 + TypeScript・MapLibre GL（OpenFreeMap 圖磚，免 API key）・Tailwind CSS 4・Framer Motion・Zustand・vite-plugin-pwa

地圖資料 © OpenFreeMap / OpenStreetMap 貢獻者
