// 預約清單／採買補給／行前檢查 — 勾選狀態存 localStorage

export interface CheckItem {
  id: string;
  label: string;
  detail?: string;
  due?: string;
  url?: string;
  urgency?: 1 | 2 | 3; // 1 = 最急
}

export const BOOKINGS: CheckItem[] = [
  { id: 'bk-fridheimar', label: 'Friðheimar 蕃茄農場午餐', detail: '7/13（一）13:00・7 月最搶手，立即訂', due: '立即', url: 'https://www.dineout.is/fridheimar', urgency: 1 },
  { id: 'bk-glacier', label: 'Sólheimajökull 冰川健行（或黑沙灘 ATV 二選一）', detail: '7/14（二）10:00 場・提前 1–2 週', due: '行前 2 週', url: 'https://troll.is/tour/solheimajokull-3-hour-glacier-hike/', urgency: 1 },
  { id: 'bk-horse', label: 'Icelandic Horse Tours 騎馬', detail: '7/18（六）14:30 場・預約制：+354 847 8577 / info@icelandhorsetours.com', due: '行前 2 週', url: 'https://icelandhorsetours.com/en/riding-tours-around-helluland/', urgency: 1 },
  { id: 'bk-earthlagoon', label: 'Earth Lagoon 米湖溫泉', detail: '7/17（五）18:00・⚠️ 改建中，確認重開才訂；備案 Forest Lagoon', due: '行前 1–2 週確認', url: 'https://www.earthlagoon.is', urgency: 2 },
  { id: 'bk-skylagoon', label: 'Sky Lagoon', detail: '7/20（一）16:45 場', due: '行前 3–7 天', url: 'https://www.skylagoon.com', urgency: 2 },
  { id: 'bk-whale', label: 'Elding 賞鯨（Akureyri）', detail: '7/18（六）09:00 出航・週六會滿', due: '行前 1 週', url: 'https://elding.is/akureyri-schedule-prices', urgency: 2 },
  { id: 'bk-vatnshellir', label: 'Vatnshellir 熔岩洞導覽', detail: '7/19（日）16:00 場', due: '行前 1–2 週', url: 'https://www.summitguides.is/vatnshellir-cave-tour', urgency: 2 },
  { id: 'bk-matarkjallarinn', label: 'Matarkjallarinn 晚餐', detail: '7/12（日）17:30', due: '行前數天', url: 'https://www.dineout.is/matarkjallarinn', urgency: 3 },
  { id: 'bk-sudurvik', label: 'Suður-Vík 晚餐', detail: '7/14（二）18:45', due: '行前數天', urgency: 3 },
  { id: 'bk-vogafjos', label: 'Vogafjós 農場餐廳午餐', detail: '7/17（五）15:00', due: '行前數天', url: 'https://www.vogafjosfarmresort.is', urgency: 3 },
  { id: 'bk-sjavarborg', label: 'Sjávarborg 晚餐', detail: '7/18（六）20:40・21:00 最後點餐', due: '行前數天', url: 'https://www.dineout.is/sjavarborg', urgency: 3 },
  { id: 'bk-messinn', label: 'Messinn 晚餐', detail: '7/20（一）19:45', due: '行前數天', url: 'https://www.messinn.com', urgency: 3 },
];

export interface GroceryStop {
  id: string;
  day: number;
  store: string;
  when: string;
  hours: string;
  supplies: string;
}

export const GROCERIES: GroceryStop[] = [
  { id: 'g-d1', day: 1, store: 'Costco（Garðabær）＋ Krónan Fitjar', when: 'D1 中午＋傍晚回程', hours: 'Costco 週日 10–18／Krónan 到 21:00', supplies: '全程乾糧零食一次買齊＋D2 早餐冷藏（冷凍品別在 Costco 買）' },
  { id: 'g-d3', day: 3, store: 'Krónan Vík', when: 'D3 傍晚 18:10', hours: '每日 09:00–21:00', supplies: 'D4＋D5 早餐、D4 午餐三明治材料（Höfn 超市 19:00 關、隔天到不了）' },
  { id: 'g-d5', day: 5, store: 'Nettó Egilsstaðir＋加油', when: 'D5 午後 14:45', hours: '09:00–20:00', supplies: 'D5 晚自炊＋D6 早午餐' },
  { id: 'g-d7', day: 7, store: 'Krónan Akureyri', when: 'D7 中午 12:20（賞鯨後）', hours: '每日 09:00–21:00', supplies: 'D7 路餐＋D8 早餐（Staður 周邊無任何商店！）' },
  { id: 'g-d8', day: 8, store: 'Kjörbúðin Ólafsvík／Grundarfjörður', when: 'D8 中午順路', hours: '週日短時段（約 12–17，現場確認）', supplies: 'D9 早餐' },
  { id: 'g-d9', day: 9, store: '市區超市（Laugavegur 周邊）', when: 'D9 下午購物時段', hours: '市區超市營業較晚', supplies: 'D10 早餐＋糖果巧克力伴手（超市買最划算）' },
];

export const PREP: CheckItem[] = [
  { id: 'p-earthlagoon', label: '確認 Earth Lagoon（米湖溫泉）是否重開', detail: '未開→改 Forest Lagoon（Akureyri）並調整 D6 傍晚' },
  { id: 'p-tide', label: '查 Hvítserkur 7/18 傍晚潮汐', detail: '低潮→可下沙灘看海豹；高潮→只看觀景台' },
  { id: 'p-dyrholaey', label: '確認 Dyrhólaey 2026 封鳥期公告', detail: '往年 6/25 解封，7/14 應全面開放' },
  { id: 'p-safetravel', label: '出發前每天查 safetravel.is＋vedur.is', detail: 'Reynisfjara 浪況燈號、93/94/711/715 路況、天氣' },
  { id: 'p-hours', label: '行前一週把餐廳營業時間在 Google Maps 再掃一次', detail: '冰島店家常臨時調整' },
  { id: 'p-parka', label: '下載 Parka＋EasyPark App、註冊 veggjald.is', detail: '停車繳費與隧道費（可離場後 24h 內補繳）' },
  { id: 'p-costco', label: '帶台灣 Costco 會員卡＋護照', detail: 'D1 採買＋全程最便宜加油' },
  { id: 'p-ba', label: 'BA801 線上報到＋確認行李規定', detail: 'D10 早班機，07:45 進航廈' },
  { id: 'p-waterproof', label: '全身防水裝備（外套＋褲＋鞋）', detail: 'Seljalandsfoss 後方、Gljúfrabúi 涉溪、Dettifoss 水霧' },
  { id: 'p-eyemask', label: '遮光眼罩（永晝必備）', detail: '7 月中近永晝、日落 23:00+、深夜室內仍亮；首晚＝台灣清晨更難睡' },
  { id: 'p-midgenet', label: '細目防蚊頭網（米湖搖蚊）', detail: 'D6 米湖區 7 月搖蚊大爆發、東峽灣有 lúsmý；無風暖日最擾人' },
];
