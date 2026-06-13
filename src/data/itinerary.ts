// 冰島 10 日行程資料（2026/7/12–7/21）— 來源：完整行程規劃.md v2
// 座標：scripts/coords.json（Google Maps 短連結解析，pin 級精度）；少數為城鎮近似值（標 approx）

import { ENRICHMENT } from './enrichment';

export type StopType = '景點' | '餐廳' | '活動' | '採買' | '住宿' | '交通' | '加油';
export type Badge = '需預約' | '自理' | '備選' | '雨備' | '安全';

export interface Stop {
  id: string;
  name: string;
  nameLocal?: string;
  type: StopType;
  icon: string;
  coord: [number, number]; // [lng, lat]
  routeCoord?: [number, number]; // 行車導航點（如停車場）與 marker 不同時使用
  via?: [number, number][]; // 自上一點的路線途經點（強制走特定道路）
  walk?: boolean; // 自上一點步行抵達（不畫車路線）
  evening?: boolean; // 住宿後的夜間加碼段（虛線路線）
  timeStart: string;
  timeEnd?: string;
  driveFromPrev?: { km: number; min: number };
  desc: string;
  tips?: string[];
  rating?: number;
  price?: string;
  hours?: string;
  badges?: Badge[];
  cutPriority?: 1 | 2 | 3; // 延誤先砍順序（1 最先砍）
  links?: { official?: string; booking?: string };
  infoUrl?: string;
  infoLabel?: string;
}

export interface Day {
  day: number;
  date: string;
  weekday: string;
  color: string;
  title: string;
  summary: string;
  driveKm: number;
  driveTime: string;
  sunrise: string;
  sunset: string;
  hardDeadlines: string[];
  flexNotes: string[];
  stops: Stop[];
}

export const TRIP_START = '2026-07-12';
export const TRIP_END = '2026-07-21';

export const DAYS: Day[] = [
  {
    day: 1, date: '2026-07-12', weekday: '週日', color: '#ad7c5c',
    title: '抵達・Costco・雷克雅維克初見',
    summary: '09:25 降落 KEF → 取車 → Costco 採買 → 市區散步 → Matarkjallarinn 晚餐 → 宿機場附近',
    driveKm: 110, driveTime: '1h40m', sunrise: '03:30', sunset: '23:20',
    hardDeadlines: ['Costco 週日 18:00 關門', 'Matarkjallarinn 訂位 17:30'],
    flexNotes: ['航班延誤 2 小時內都不影響', '體力不行→砍市區散步，直接採買後回住宿', '替代案：市區散步換成 Sky Lagoon 15:30 場（Day 9 晚上就空出來）'],
    stops: [
      { id: 'd1-kef', name: '凱夫拉維克機場', nameLocal: 'Keflavík (KEF)', type: '交通', icon: '✈️', coord: [-22.6056, 63.985], timeStart: '09:25', timeEnd: '11:00', desc: 'BA800 09:25 降落。非申根入境（人工護照查驗）→ 領行李 → 租車接駁到場站取車，抓 90 分鐘很充裕。', tips: ['台灣護照走人工櫃檯，不能用 e-gate', '租車公司多在機場圈外，免費接駁 3–5 分鐘'] },
      { id: 'd1-costco', name: 'Costco 採買＋美食區午餐', nameLocal: 'Costco Garðabær', type: '採買', icon: '🛒', coord: [-21.912, 64.0735], timeStart: '11:45', timeEnd: '13:15', driveFromPrev: { km: 47, min: 40 }, desc: '全程乾糧零食一次買齊；午餐就吃美食區熱狗/披薩；順便加滿油（全國最便宜）。', tips: ['帶台灣 Costco 會員卡＋護照', '冷凍品先不買（下午車上放不住），冷藏放保冰袋', '週日 10:00–18:00'], hours: '週日 10:00–18:00' },
      { id: 'd1-hallgrimskirkja', name: '哈爾格林姆教堂', nameLocal: 'Hallgrímskirkja', type: '景點', icon: '⛪', coord: [-21.9265, 64.142], timeStart: '13:45', timeEnd: '14:45', driveFromPrev: { km: 9, min: 15 }, desc: '雷克雅維克地標。搭電梯登塔俯瞰彩色屋頂全景。', tips: ['登塔 1,500 ISK', '停教堂旁 P2 格（230 ISK/h，週日 10:00–21:00 收費）'], price: '登塔 1,500 ISK' },
      { id: 'd1-rainbow', name: '彩虹街', nameLocal: 'Skólavörðustígur', type: '景點', icon: '🌈', coord: [-21.9325, 64.146], walk: true, timeStart: '14:45', timeEnd: '15:30', desc: '教堂正前方的彩虹大道，兩側是設計小店與咖啡館，最好拍的街景。' },
      { id: 'd1-laugavegur', name: 'Laugavegur 主街', nameLocal: 'Laugavegur', type: '景點', icon: '🛍️', coord: [-21.9126, 64.143], walk: true, timeStart: '15:30', timeEnd: '16:15', desc: '主購物街先探路（66°North、Icewear、書店），正式採購留到 Day 9。' },
      { id: 'd1-harpa', name: '哈帕音樂廳', nameLocal: 'Harpa', type: '景點', icon: '🎵', coord: [-21.9323, 64.1502], walk: true, timeStart: '16:20', timeEnd: '16:50', desc: '蜂巢玻璃帷幕音樂廳，內部光影免費參觀，海濱步道順走。', cutPriority: 1 },
      { id: 'd1-hotdog', name: '熱狗老攤墊胃', nameLocal: 'Bæjarins Beztu Pylsur', type: '餐廳', icon: '🌭', coord: [-21.9379, 64.1482], walk: true, timeStart: '16:50', timeEnd: '17:10', desc: '1937 年至今的國民熱狗攤。點法：「ein með öllu」一支全加（脆洋蔥＋甜芥末）。', price: '~880 ISK', rating: 4.3 },
      { id: 'd1-matarkjallarinn', name: '晚餐：地窖餐廳', nameLocal: 'Matarkjallarinn', type: '餐廳', icon: '🍽️', coord: [-21.9418, 64.1486], walk: true, timeStart: '17:30', timeEnd: '19:00', desc: '老屋地窖裡的冰島 brasserie，羊肉與海鮮出色、有現場鋼琴。17:30＝台灣半夜，早吃早收。', tips: ['週日 17:00–22:00', '⚠️ 需 Dineout 訂位'], rating: 4.5, price: '主菜 4,000–8,000 ISK', badges: ['需預約'], links: { booking: 'https://www.dineout.is/matarkjallarinn' } },
      { id: 'd1-kronan', name: '補冷藏：Krónan Fitjar', nameLocal: 'Krónan Fitjar', type: '採買', icon: '🛒', coord: [-22.531, 63.97], timeStart: '19:55', timeEnd: '20:20', driveFromPrev: { km: 44, min: 40 }, desc: '回程順路補 Costco 沒買的冷藏生鮮與明天早餐。', hours: '每日 08:00–21:00' },
      { id: 'd1-lodging', name: '夜宿：KEF 機場附近', nameLocal: 'Reykjanesbær Airbnb', type: '住宿', icon: '🏠', coord: [-22.5624, 64.0049], timeStart: '20:30', driveFromPrev: { km: 5, min: 7 }, desc: 'Check-in 後早睡調時差（今晚＝台灣清晨）。', tips: ['座標為 Keflavík 鎮近似值，可貼 Airbnb 連結更新'] },
    ],
  },
  {
    day: 2, date: '2026-07-13', weekday: '週一', color: '#6f8f74',
    title: '黃金圈',
    summary: 'Sandholt 早餐 → Þingvellir → Friðheimar 蕃茄午餐 → Geysir → Gullfoss → Kerið → 宿瀑布旁小木屋',
    driveKm: 300, driveTime: '4h（含 Brúarfoss）', sunrise: '03:32', sunset: '23:15',
    hardDeadlines: ['Friðheimar 13:00 訂位'],
    flexNotes: ['Brúarfoss 是條件式：12:00 前離開 Þingvellir 才插入', '天氣差→傍晚瀑布改 Day 3 早上再玩（就住旁邊）'],
    stops: [
      { id: 'd2-sandholt', name: '早餐：Sandholt 烘焙坊', nameLocal: 'Sandholt', type: '餐廳', icon: '🥐', coord: [-21.9263, 64.1451], timeStart: '08:00', timeEnd: '09:00', driveFromPrev: { km: 47, min: 45 }, desc: '冰島最知名酸種麵包烘焙坊之一，早餐供應到 11:00。可外帶麵包當隔日早餐。', hours: '週一 07:30–18:00', rating: 4.5 },
      { id: 'd2-thingvellir', name: '辛格韋德利國家公園＋Öxarárfoss', nameLocal: 'Þingvellir', type: '景點', icon: '🏞️', coord: [-21.1179, 64.2658], timeStart: '09:50', timeEnd: '11:20', driveFromPrev: { km: 48, min: 45 }, desc: '世界遺產：北美/歐亞板塊裂谷＋世界最古老議會遺址。P2 停車場走木棧道到 Öxarárfoss 來回約 700m。', tips: ['停車 1,000 ISK（Parka App）', '早到避人潮，10 點後停車場明顯變滿'] },
      { id: 'd2-bruarfoss', name: 'Brúarfoss 藍瀑布（條件式）', nameLocal: 'Brúarfoss', type: '景點', icon: '💠', coord: [-20.5157, 64.2643], timeStart: '11:50', timeEnd: '12:35', driveFromPrev: { km: 49, min: 45 }, desc: '冰川藍色的小眾瀑布，新停車場步行即達。只有 12:00 前離開 Þingvellir 才插入。', tips: ['停車 1,000 ISK/4h，無任何設施'], badges: ['備選'], cutPriority: 1 },
      { id: 'd2-fridheimar', name: '午餐：Friðheimar 蕃茄農場', nameLocal: 'Friðheimar', type: '餐廳', icon: '🍅', coord: [-20.4449, 64.1775], timeStart: '13:00', timeEnd: '14:30', driveFromPrev: { km: 13, min: 15 }, desc: '地熱溫室裡用餐：蕃茄湯＋現烤麵包吃到飽，坐在蕃茄藤之間。7 月沒訂位幾乎吃不到。', tips: ['⚠️ 必訂位（Dineout）', '廚房 11:30–16:00'], rating: 4.6, price: '湯品吃到飽 3,740 ISK/人', badges: ['需預約'], links: { booking: 'https://www.dineout.is/fridheimar', official: 'https://fridheimar.is' } },
      { id: 'd2-geysir', name: '蓋錫爾間歇泉', nameLocal: 'Geysir / Strokkur', type: '景點', icon: '⛲', coord: [-20.3007, 64.3127], timeStart: '14:55', timeEnd: '15:45', driveFromPrev: { km: 24, min: 25 }, desc: 'Strokkur 每 5–10 分鐘噴發一次（可達 20m），停 45 分鐘能看 3–5 次。', tips: ['站上風處避免被硫磺水霧噴到', '免費停車'] },
      { id: 'd2-gullfoss', name: '黃金瀑布', nameLocal: 'Gullfoss', type: '景點', icon: '🌊', coord: [-20.1199, 64.3271], timeStart: '15:55', timeEnd: '16:45', driveFromPrev: { km: 10, min: 10 }, desc: '兩層階梯式巨瀑轟入峽谷，上下兩層觀景台都走。', tips: ['遊客中心 kjötsúpa 羊肉湯 ~2,500 ISK 可免費續碗（沒訂到 Friðheimar 時的備案午餐）', '免費停車'] },
      { id: 'd2-kerid', name: 'Kerið 火山口湖', nameLocal: 'Kerið', type: '景點', icon: '🌋', coord: [-20.8851, 64.0413], timeStart: '17:40', timeEnd: '18:20', driveFromPrev: { km: 62, min: 50 }, desc: '紅色火山渣環抱藍綠色湖水，繞口一圈＋下到湖邊 30–45 分。', price: '門票 600 ISK/人' },
      { id: 'd2-lodging', name: '夜宿：Seljalandsfoss Horizons 小木屋', nameLocal: 'Seljalandsfoss Horizons', type: '住宿', icon: '🏠', coord: [-20.0184, 63.6076], timeStart: '19:15', driveFromPrev: { km: 73, min: 55 }, desc: '就在瀑布旁的景觀小木屋。晚餐自理輕食（Friðheimar 午餐很豐盛）。', badges: ['自理'] },
      { id: 'd2-seljalandsfoss', name: '傍晚遊塞里雅蘭瀑布', nameLocal: 'Seljalandsfoss', type: '景點', icon: '💧', coord: [-19.9886, 63.6156], evening: true, timeStart: '20:00', timeEnd: '21:00', driveFromPrev: { km: 3, min: 5 }, desc: '可以走到水簾後方的環形步道（10–15 分）。傍晚人潮散去、光線斜射最美。', tips: ['全身防水必備（外套+褲+鞋）', '停車 1,000 ISK（與 Gljúfrabúi 共用）'] },
      { id: 'd2-gljufrabui', name: '峽谷隱士瀑布', nameLocal: 'Gljúfrabúi', type: '景點', icon: '🪨', coord: [-19.9864, 63.6209], walk: true, timeStart: '21:00', timeEnd: '21:30', desc: 'Seljalandsfoss 北邊步行 700m，藏在岩縫裡的瀑布——要踩石頭涉淺溪進洞，洞內全身會濕但超值得。', tips: ['防水鞋/登山鞋必備'] },
    ],
  },
  {
    day: 3, date: '2026-07-14', weekday: '週二', color: '#5f7d99',
    title: '南岸瀑布＋冰川健行',
    summary: 'Skógafoss → Sólheimajökull 冰川健行 → DC-3 → Dyrhólaey → 黑沙灘 → Vík 晚餐 → 宿 Skógar 西側',
    driveKm: 150, driveTime: '2h30m', sunrise: '03:38', sunset: '23:05',
    hardDeadlines: ['冰川健行 09:40 報到（10:00 出發）', 'Krónan Vík 21:00 關'],
    flexNotes: ['替代案：黑沙灘 ATV 2h 團（含 DC-3）取代冰川健行，二選一', 'DC-3 可整段跳過＝內建 1 小時緩衝', '住宿實際在 Skógar 西 7km（861 郵區），從 Vík 回程僅 30 分'],
    stops: [
      { id: 'd3-skogafoss', name: '斯科加瀑布（彩虹瀑布）', nameLocal: 'Skógafoss', type: '景點', icon: '🌈', coord: [-19.5114, 63.5321], timeStart: '08:25', timeEnd: '09:25', driveFromPrev: { km: 26, min: 22 }, desc: '60m 寬幕瀑布，晴天必出彩虹。右側 527 階登頂觀景台視角完全不同，值得爬。', tips: ['停車 1,000 ISK/8h（2025 起收費）', '隱藏版 Kvernufoss 在旁邊步行 20 分，人少'] },
      { id: 'd3-glacier', name: '冰川健行：索爾黑馬冰川', nameLocal: 'Sólheimajökull', type: '活動', icon: '🧗', coord: [-19.3683, 63.5298], timeStart: '09:40', timeEnd: '13:00', driveFromPrev: { km: 12, min: 12 }, desc: '3 小時冰川健行團（冰上 1–1.5h），冰爪＋冰斧裝備全含。火山灰紋理的冰川地形。', tips: ['⚠️ 必預約（Troll Expeditions / Arctic Adventures）', '提前 20 分報到，找掛業者旗的巴士', '8 歲以上可參加；登山鞋可租', '☀️ 7 月為冰川健行最佳季（冰較軟、抓地佳）；冰上仍 5–15°C 有風，穿防風保暖層'], price: '~15,000 ISK', badges: ['需預約'], links: { booking: 'https://troll.is/tour/solheimajokull-3-hour-glacier-hike/' } },
      { id: 'd3-mias', name: '午餐：Mia’s Country Van', nameLocal: 'Sveitagrill Míu', type: '餐廳', icon: '🍟', coord: [-19.505, 63.5244], timeStart: '13:15', timeEnd: '13:50', driveFromPrev: { km: 12, min: 12 }, desc: 'Skógar 旁的紅色炸魚薯條餐車，現點現炸、高評價但常排隊。', tips: ['12:00–16:00 營業', '排太長→改 Vík 再吃'], rating: 4.6, hours: '12:00–16:00' },
      { id: 'd3-dc3', name: 'DC-3 飛機殘骸', nameLocal: 'Sólheimasandur Plane Wreck', type: '景點', icon: '🛩️', coord: [-19.3648, 63.4591], routeCoord: [-19.3632, 63.4912], timeStart: '14:10', timeEnd: '15:10', driveFromPrev: { km: 10, min: 10 }, desc: '1973 年迫降的美軍 DC-3 躺在黑沙荒原上。搭接駁車來回（含停留約 1h）。', tips: ['接駁 ~2,500 ISK，每 25 分一班（10:00–17:00）', '走路來回 8km/2h 不建議'], badges: ['備選'], cutPriority: 1 },
      { id: 'd3-dyrholaey', name: '迪霍拉里海蝕拱', nameLocal: 'Dyrhólaey', type: '景點', icon: '🕳️', coord: [-19.113, 63.403], timeStart: '15:40', timeEnd: '16:40', driveFromPrev: { km: 23, min: 25 }, desc: '巨大海蝕拱門＋燈塔＋黑沙灘全景，7 月可近距離看 puffin。', tips: ['7 月已過封鳥期、全日開放', '免費停車（上下兩區）'] },
      { id: 'd3-reynisfjara', name: '雷尼斯黑沙灘', nameLocal: 'Reynisfjara', type: '景點', icon: '🖤', coord: [-19.0716, 63.4057], timeStart: '17:00', timeEnd: '18:00', driveFromPrev: { km: 17, min: 20 }, desc: '玄武岩柱洞穴＋海中石柱群 Reynisdrangar。崖壁上滿是海鸚巢。', tips: ['⚠️ 致命離岸流：看現場黃/橘/紅燈號、永遠不背對海', '停車 1,000 ISK/3h', '出發前查 safetravel.is 浪況'], badges: ['安全'] },
      { id: 'd3-kronan', name: '採買：Krónan Vík', nameLocal: 'Krónan Vík', type: '採買', icon: '🛒', coord: [-18.999, 63.4175], timeStart: '18:10', timeEnd: '18:40', driveFromPrev: { km: 12, min: 12 }, desc: '買齊 D4＋D5 早餐與 D4 午餐三明治材料（Höfn 超市 19:00 關、明天到不了）。', hours: '每日 09:00–21:00' },
      { id: 'd3-sudurvik', name: '晚餐：Suður-Vík', nameLocal: 'Suður-Vík', type: '餐廳', icon: '🍽️', coord: [-19.0082, 63.4223], timeStart: '18:45', timeEnd: '20:00', desc: 'Vík 山坡上的老屋餐廳，招牌羊排與亞洲風味料理。', tips: ['旺季建議訂位', '備案：Black Crust 活性碳披薩（12:00–21:00 免訂）'], rating: 4.5 },
      { id: 'd3-lodging', name: '夜宿：南岸小屋（861 Hvolsvöllur 郵區）', nameLocal: 'Airbnb near Skógar', type: '住宿', icon: '🏠', coord: [-19.6179, 63.5451], timeStart: '20:35', driveFromPrev: { km: 38, min: 30 }, desc: '實際位置在 Skógafoss 西側約 7km 的南岸公路旁（非 Hvolsvöllur 鎮上），回程短。', tips: ['座標已用你提供的 Google Maps 連結精確解析'] },
    ],
  },
  {
    day: 4, date: '2026-07-15', weekday: '週三', color: '#847e9e',
    title: '羽毛峽谷・Skaftafell・冰河湖',
    summary: '羽毛峽谷 → Svartifoss 健行 → Fjallsárlón → Jökulsárlón 船遊＋鑽石沙灘 → 宿 Höfn',
    driveKm: 360, driveTime: '4h20m', sunrise: '03:35', sunset: '23:00',
    hardDeadlines: ['Pakkhús 21:00 最後點餐'],
    flexNotes: ['冰河湖只在岸邊看冰山、不搭船 → 比原版省約 1 小時，本日大幅放鬆', 'Svartifoss 黑瀑布健行改為可去可不去：要去＝Skaftafell 來回 1.5–2h；不去＝1 號公路沿途午餐、直奔冰河湖', 'Skaftafell 停車用 Parka 同卡付，冰河湖停車半價'],
    stops: [
      { id: 'd4-eldhraun', name: '埃爾德熔岩原', nameLocal: 'Eldhraun', type: '景點', icon: '🍃', coord: [-18.25, 63.42], timeStart: '09:15', timeEnd: '09:30', driveFromPrev: { km: 78, min: 62 }, desc: '1783 年 Laki 大噴發形成、覆滿厚苔蘚的熔岩原，路邊觀景點快拍。', tips: ['勿踩苔蘚（數十年才長回）'], cutPriority: 3 },
      { id: 'd4-fjadrargljufur', name: '羽毛峽谷', nameLocal: 'Fjaðrárgljúfur', type: '景點', icon: '🪶', coord: [-18.1718, 63.7713], timeStart: '09:55', timeEnd: '10:55', driveFromPrev: { km: 29, min: 25 }, desc: '2km 深綠蛇行峽谷，沿崖緣步道走到頂端觀景台來回約 2km。', tips: ['末段 3km 碎石路（小車可行）', '停車 1,000 ISK'] },
      { id: 'd4-skaftafell', name: 'Skaftafell：黑瀑布健行（可選）＋午餐', nameLocal: 'Svartifoss', type: '景點', icon: '🥾', coord: [-16.9753, 64.0275], routeCoord: [-16.9667, 64.0166], timeStart: '12:00', timeEnd: '14:25', driveFromPrev: { km: 70, min: 65 }, desc: '玄武岩管風琴峭壁環抱的黑瀑布。遊客中心出發來回 3.4km／爬升 140m／1.5–2h，途經 Hundafoss。', tips: ['可去可不去：要走來回 1.5–2h；不想健行就略過，改在 1 號公路沿途午餐', '停車 1,000 ISK/日', '午餐：自備三明治（前晚 Vík 採買）或園區簡餐'], badges: ['自理', '備選'], cutPriority: 1 },
      { id: 'd4-fjallsarlon', name: '小冰河湖', nameLocal: 'Fjallsárlón', type: '景點', icon: '🧊', coord: [-16.385, 64.0186], timeStart: '15:05', timeEnd: '15:45', driveFromPrev: { km: 47, min: 40 }, desc: '人少的迷你冰河湖，冰山離岸更近、冰川壁就在眼前。', cutPriority: 2 },
      { id: 'd4-jokulsarlon', name: '傑古沙龍冰河湖', nameLocal: 'Jökulsárlón', type: '景點', icon: '🏞️', coord: [-16.2306, 64.0784], timeStart: '15:55', timeEnd: '16:55', driveFromPrev: { km: 10, min: 10 }, desc: '巨型冰山漂浮的冰川潟湖，岸邊散步即可近看冰山與覓食的海豹。', tips: ['只在岸邊看冰山、不搭船（7 月仍有大量冰山漂浮，岸觀已很精彩）', '🐦 7 月燕鷗/賊鷗護巢期：沿岸勿靠近草叢鳥巢，被俯衝時舉手過頭、快步離開', '停車 1,000 ISK（Parka 同卡有 Skaftafell 折抵）'] },
      { id: 'd4-diamond', name: '鑽石冰沙灘', nameLocal: 'Diamond Beach', type: '景點', icon: '💎', coord: [-16.1777, 64.0443], timeStart: '17:00', timeEnd: '17:40', driveFromPrev: { km: 2, min: 5 }, desc: '冰山碎塊被海浪推回黑沙灘，像散落的鑽石——出海口對面即達。', tips: ['🐦 東側為 7 月燕鷗/賊鷗巢區，勿靠近、被俯衝舉手離開', '⚠️ 注意海浪與離岸流，勿太靠近水線'] },
      { id: 'd4-pakkhus', name: '晚餐：Pakkhús 海螯蝦', nameLocal: 'Pakkhús', type: '餐廳', icon: '🦞', coord: [-15.2014, 64.2496], timeStart: '18:55', timeEnd: '20:15', driveFromPrev: { km: 78, min: 70 }, desc: 'Höfn 港邊倉庫改建的海螯蝦（langoustine）名店。', tips: ['不收訂位→直接進候位（樓下酒吧等位）', '21:00 最後點餐', '備援：Hafnarbúðin 龍蝦堡（平價）、Ottó'], rating: 4.5, price: '海螯蝦主餐 ~8,000 ISK' },
      { id: 'd4-lodging', name: '夜宿：Höfn', nameLocal: 'Sveitarfélagið Hornafjörður', type: '住宿', icon: '🏠', coord: [-15.2082, 64.2539], walk: true, timeStart: '20:25', desc: '龍蝦小鎮 Höfn 過夜。', tips: ['座標為鎮中心近似值'] },
    ],
  },
  {
    day: 5, date: '2026-07-16', weekday: '週四', color: '#ac9560',
    title: '蝙蝠山・東峽灣・白日夢小鎮＋傍晚 Puffin',
    summary: 'Vestrahorn → Djúpivogur → Egilsstaðir 補給 → Seyðisfjörður → 宿 Eiðar →（傍晚）Hafnarhólmi 海鸚',
    driveKm: 290, driveTime: '4h15m（+puffin 來回 1h50）', sunrise: '03:10', sunset: '23:25',
    hardDeadlines: ['Nettó Egilsstaðir 20:00 關（14:45 抵達 ✓）'],
    flexNotes: ['Puffin 傍晚場是推薦主案；累了→改 Day 6 清晨 06:00 出發備援', '93 號山路髮夾彎多、易起霧，慢開'],
    stops: [
      { id: 'd5-vestrahorn', name: '蝙蝠山', nameLocal: 'Vestrahorn / Stokksnes', type: '景點', icon: '🦇', coord: [-14.9699, 64.2464], timeStart: '09:05', timeEnd: '10:15', driveFromPrev: { km: 18, min: 20 }, desc: '黑沙丘＋海面倒影中的尖峰山，攝影師最愛。私人土地，Viking Cafe 購票進入，內有維京村電影場景。', tips: ['門票 1,100 ISK/人（16 歲以下免費）', '末段 4–5km 碎石路'], price: '1,100 ISK/人' },
      { id: 'd5-djupivogur', name: 'Djúpivogur：蛋雕塑＋Langabúð 輕午餐', nameLocal: 'Eggin í Gleðivík / Langabúð', type: '餐廳', icon: '🥚', coord: [-14.2831, 64.6576], timeStart: '11:30', timeEnd: '12:45', driveFromPrev: { km: 98, min: 75 }, desc: '港邊 34 顆花崗岩蛋雕塑（每顆代表一種當地鳥）；1790 年紅色長屋 Langabúð 咖啡館吃自製湯與煙燻羊肉麵包。', hours: 'Langabúð 夏季 11:00–18:00', rating: 4.4 },
      { id: 'd5-egilsstadir', name: '補給：Egilsstaðir 加油＋Nettó', nameLocal: 'Egilsstaðir', type: '採買', icon: '⛽', coord: [-14.4097, 65.2669], timeStart: '14:45', timeEnd: '15:30', driveFromPrev: { km: 143, min: 110 }, desc: '東部最大補給樞紐：加滿油＋採買今晚自炊與 D6 早午餐食材。', tips: ['🦟 順手買防蚊（東峽灣 7 月靜風黃昏有 lúsmý 叮人小黑蚊；隔日米湖更需要）'], hours: 'Nettó 09:00–20:00' },
      { id: 'd5-gufufoss', name: 'Gufufoss 瀑布', nameLocal: 'Gufufoss', type: '景點', icon: '💨', coord: [-14.0576, 65.2399], timeStart: '15:55', timeEnd: '16:10', driveFromPrev: { km: 19, min: 25 }, desc: '93 號下山進 Seyðisfjörður 前的路邊瀑布，「蒸汽瀑布」之名來自水霧。' },
      { id: 'd5-seydisfjordur', name: '白日夢冒險王小鎮', nameLocal: 'Seyðisfjörður', type: '景點', icon: '🎨', coord: [-14.0095, 65.2602], timeStart: '16:10', timeEnd: '18:00', driveFromPrev: { km: 8, min: 10 }, desc: '峽灣底的藝術小鎮：彩虹步道＋藍教堂、《白日夢冒險王》滑板長板場景。', tips: ['咖啡：Kaffi Lára；壽司名店 Norð Austur 17:00 開（想吃＝17:00 場+訂位）'] },
      { id: 'd5-lodging', name: '夜宿：Eiðar 公寓', nameLocal: 'Eiðar', type: '住宿', icon: '🏠', coord: [-14.3565, 65.3737], timeStart: '18:45', driveFromPrev: { km: 41, min: 40 }, desc: 'Egilsstaðir 北邊 15 分鐘、94 號公路上——正好在往 puffin 觀鳥台的路上。晚餐自理。', badges: ['自理'], tips: ['座標為 Eiðar 聚落近似值'] },
      { id: 'd5-puffin', name: '傍晚：Hafnarhólmi 海鸚觀鳥台', nameLocal: 'Borgarfjörður Eystri', type: '活動', icon: '🐧', coord: [-13.7545, 65.5421], evening: true, timeStart: '20:10', timeEnd: '21:40', driveFromPrev: { km: 56, min: 55 }, desc: '全冰島最容易近距離拍 puffin 的地方（約 1 萬對）。18:00 後大量歸巢＝最佳時段，木棧道＋觀景小屋，免費。', tips: ['路已鋪柏油，隘口彎急慢開', '7 月中正值育雛高峰', '回程 23:00 前天還全亮'] },
    ],
  },
  {
    day: 6, date: '2026-07-17', weekday: '週五', color: '#a9706a',
    title: 'Dettifoss・米湖地熱區・溫泉',
    summary: 'Dettifoss → Hverir → Krafla → Vogafjós 午餐 → 米湖景點 → 溫泉 → Goðafoss → 宿 Akureyri',
    driveKm: 370, driveTime: '5h', sunrise: '03:05', sunset: '23:31',
    hardDeadlines: ['Earth Lagoon 時段票（若已重開）', '隧道費 24h 內上 veggjald.is 繳'],
    flexNotes: ['🦟 7 月中米湖搖蚊（midge）大爆發：湖畔點戶外備細目防蚊頭網；無風暖日最擾人，登高處（Hverfjall）或有風時較緩，密閉的 Dimmuborgir 最嚴重', '全程最重的一天：趕→先砍 Hverfjall/Dimmuborgir、再砍 Selfoss、Krafla 縮短', '鬆版：溫泉改 Akureyri 的 Forest Lagoon 晚場 → 19:30 Goðafoss、20:30 抵 Akureyri'],
    stops: [
      { id: 'd6-dettifoss', name: '黛提瀑布＋Selfoss', nameLocal: 'Dettifoss', type: '景點', icon: '🌊', coord: [-16.3846, 65.8147], timeStart: '10:45', timeEnd: '12:15', driveFromPrev: { km: 175, min: 135 }, desc: '歐洲水量最大瀑布（《普羅米修斯》開場），西岸 862 全鋪面。加走上游 Selfoss 環線共 2.5km。', tips: ['防水外套（水霧大）', '趕時間→Selfoss 砍掉省 30 分'] },
      { id: 'd6-hverir', name: 'Hverir 地熱谷', nameLocal: 'Hverir', type: '景點', icon: '♨️', coord: [-16.8093, 65.6409], timeStart: '13:00', timeEnd: '13:45', driveFromPrev: { km: 56, min: 45 }, desc: '橘紅大地上的沸騰泥漿池與蒸氣塔，火星般的地景。', tips: ['⚠️ 勿離步道，蒸氣會燙傷'], badges: ['安全'] },
      { id: 'd6-krafla', name: 'Krafla 火山 Víti 火口湖', nameLocal: 'Krafla Víti', type: '景點', icon: '🌋', coord: [-16.7544, 65.7171], timeStart: '13:55', timeEnd: '14:30', driveFromPrev: { km: 9, min: 15 }, desc: '藍綠色火口湖，繞湖緣一圈 30–45 分（或只看觀景點 15 分）。途經地熱電廠管線陣。', cutPriority: 2 },
      { id: 'd6-vogafjos', name: '午餐：Vogafjós 農場餐廳', nameLocal: 'Vogafjós Farm Resort', type: '餐廳', icon: '🐄', coord: [-16.9217, 65.6266], timeStart: '15:00', timeEnd: '16:15', driveFromPrev: { km: 17, min: 18 }, desc: '隔著玻璃看牛舍用餐：自家煙燻北極紅點鮭、慢燉羊腿、地熱黑麥麵包、農場冰淇淋。本日正餐。', tips: ['熱門建議訂位', '🦟 米湖邊：7 月中搖蚊高峰，停車場到入口備防蚊頭網（室內隔玻璃用餐不受擾）', '備援：Gamli Bærinn、Daddi’s Pizza'], rating: 4.5, badges: ['需預約'], links: { official: 'https://www.vogafjosfarmresort.is' } },
      { id: 'd6-grjotagja', name: 'Grjótagjá 洞穴溫泉', nameLocal: 'Grjótagjá', type: '景點', icon: '🕯️', coord: [-16.8829, 65.6262], timeStart: '16:25', timeEnd: '16:40', driveFromPrev: { km: 4, min: 6 }, desc: '《冰與火之歌》場景的地下溫泉洞穴。', tips: ['⚠️ 已禁止泡水（可進洞、洞口拍照）', '🦟 近水易有搖蚊，無風時備頭網'] },
      { id: 'd6-hverfjall', name: 'Hverfjall 火山口登頂（或 Dimmuborgir 擇一）', nameLocal: 'Hverfjall', type: '景點', icon: '⛰️', coord: [-16.8717, 65.6086], timeStart: '16:50', timeEnd: '17:40', driveFromPrev: { km: 5, min: 10 }, desc: '2,500 年前的火山渣環，登頂 20–30 分俯瞰米湖全景。另一選擇：Dimmuborgir 黑色城堡熔岩迷宮（免費，環線 30–60 分）。', tips: ['停車 1,000 ISK（車牌辨識）', '🦟 無風日搖蚊多→選通風的 Hverfjall 登頂勝過密閉的 Dimmuborgir'], badges: ['備選'], cutPriority: 1 },
      { id: 'd6-myvatnbaths', name: '米湖溫泉 Earth Lagoon', nameLocal: 'Jarðböðin við Mývatn', type: '活動', icon: '🛁', coord: [-16.8476, 65.6309], timeStart: '18:00', timeEnd: '20:00', driveFromPrev: { km: 6, min: 8 }, desc: '米湖版藍湖：乳藍色地熱溫泉俯瞰湖景，比藍湖便宜且人少。', tips: ['⚠️ 改建中、2026 夏重開（行前必確認）；未重開→改 Akureyri 的 Forest Lagoon 晚場', '~7,900 ISK 起'], badges: ['需預約'], links: { booking: 'https://www.earthlagoon.is' } },
      { id: 'd6-godafoss', name: '眾神瀑布', nameLocal: 'Goðafoss', type: '景點', icon: '🌀', coord: [-17.5502, 65.6828], timeStart: '20:45', timeEnd: '21:30', driveFromPrev: { km: 53, min: 40 }, desc: '馬蹄形的「眾神瀑布」——西元 1000 年改宗時異教神像被投入此瀑。永晝傍晚光線最美。', tips: ['兩岸都有步道'] },
      { id: 'd6-lodging', name: '夜宿：Akureyri', nameLocal: 'Akureyri', type: '住宿', icon: '🏠', coord: [-18.0907, 65.6826], timeStart: '22:15', driveFromPrev: { km: 45, min: 35 }, desc: '北部之都。宵夜可吃 Brynja 老牌冰淇淋（到 23:30）。', tips: ['Vaðlaheiðargöng 隧道費 2,216 ISK 上 veggjald.is 繳（24h 內）', '座標為市中心近似值'] },
    ],
  },
  {
    day: 7, date: '2026-07-18', weekday: '週六', color: '#5d8782',
    title: '賞鯨・冰島馬・犀牛石',
    summary: 'Akureyri 港賞鯨 → Helluland 騎馬 → Kolugljúfur → Hvítserkur → Sjávarborg 晚餐 → 宿 Staður',
    driveKm: 350, driveTime: '5h', sunrise: '03:09', sunset: '23:28',
    hardDeadlines: ['賞鯨 09:00 出航', '騎馬 14:30 場', 'Sjávarborg 21:00 最後點餐（20:45 前點完）'],
    flexNotes: ['全程最緊的銜接鏈。決策點：16:30 還沒離開 Helluland → 直接跳過 Kolugljúfur', '若取消賞鯨：全天提前 3h，加 Sauðárkrókur 午餐，晚餐 19:00 從容吃'],
    stops: [
      { id: 'd7-whale', name: '賞鯨：Elding Classic', nameLocal: 'Elding Akureyri', type: '活動', icon: '🐋', coord: [-18.0875, 65.685], timeStart: '09:00', timeEnd: '12:15', desc: '市中心 Hof 文化中心旁出航（零繞路）。Eyjafjörður 峽灣以座頭鯨為主，3 小時，沒看到鯨魚可免費再來。', tips: ['⚠️ 線上預約（週六會滿）', '船上有保暖連身衣'], price: '14,500 ISK', badges: ['需預約'], links: { booking: 'https://elding.is/akureyri-schedule-prices' } },
      { id: 'd7-kronan', name: '採買：Krónan Akureyri', nameLocal: 'Krónan', type: '採買', icon: '🛒', coord: [-18.105, 65.68], timeStart: '12:20', timeEnd: '12:50', driveFromPrev: { km: 3, min: 6 }, desc: '買路餐（車上吃）＋ D8 早餐——Staður 周邊沒有任何商店。', hours: '每日 09:00–21:00', badges: ['自理'] },
      { id: 'd7-horse', name: '騎冰島馬：Helluland 農場', nameLocal: 'Icelandic Horse Tours', type: '活動', icon: '🐴', coord: [-19.5179, 65.72], timeStart: '14:30', timeEnd: '16:00', driveFromPrev: { km: 115, min: 95 }, desc: 'Skagafjörður 馬鄉騎純種冰島馬，體驗第五種步伐 tölt。新手可，1–1.5h 團。', tips: ['⚠️ 預約制（無公開班表）：+354 847 8577 / info@icelandhorsetours.com', '約 14:30 場'], price: '1h 9,000／1.5h 11,000 ISK', badges: ['需預約'], links: { official: 'https://icelandhorsetours.com/en/riding-tours-around-helluland/' } },
      { id: 'd7-blonduos', name: 'Blönduós 教堂快拍', nameLocal: 'Blönduóskirkja', type: '景點', icon: '⛪', coord: [-20.2805, 65.6597], timeStart: '17:15', timeEnd: '17:30', driveFromPrev: { km: 65, min: 55 }, desc: '仿火山口造型的清水模教堂，外觀快拍。', cutPriority: 2 },
      { id: 'd7-kolugljufur', name: 'Kolugljúfur 巨人峽谷', nameLocal: 'Kolugljúfur', type: '景點', icon: '🏞️', coord: [-20.5713, 65.3334], timeStart: '18:10', timeEnd: '18:45', driveFromPrev: { km: 46, min: 40 }, desc: '女巨人 Kola 傳說的峽谷瀑布群，橋上與兩側觀景。', tips: ['715 號 6km 碎石路（2WD 可）', '崖邊無護欄'], badges: ['備選'], cutPriority: 1 },
      { id: 'd7-hvitserkur', name: '犀牛石', nameLocal: 'Hvítserkur', type: '景點', icon: '🦏', coord: [-20.6352, 65.6064], routeCoord: [-20.6399, 65.6036], timeStart: '19:40', timeEnd: '20:15', driveFromPrev: { km: 48, min: 50 }, desc: '15m 高的海中玄武岩「飲水巨獸」。退潮可下沙灘走近＋看海豹。', tips: ['711 號 30km 碎石慢開', '行前查潮汐：高潮→只看觀景台（20 分）'] },
      { id: 'd7-sjavarborg', name: '晚餐：Sjávarborg', nameLocal: 'Sjávarborg Restaurant', type: '餐廳', icon: '🍽️', coord: [-20.9477, 65.3954], timeStart: '20:40', timeEnd: '21:45', driveFromPrev: { km: 36, min: 45 }, desc: 'Hvammstangi 海豹中心樓上的海景餐廳：龍蝦湯、烤鱈魚、羊排。', tips: ['⚠️ 週六 21:00 最後點餐→務必訂位並 20:45 前點完', '備援：N1 Staðarskáli 快餐或自理'], rating: 4.4, badges: ['需預約'], links: { booking: 'https://www.dineout.is/sjavarborg' } },
      { id: 'd7-lodging', name: '夜宿：Staður', nameLocal: 'Staður, Hrútafjörður', type: '住宿', icon: '🏠', coord: [-21.079, 65.146], timeStart: '22:05', driveFromPrev: { km: 24, min: 20 }, desc: '1 號公路旁的鄉間住宿，周邊無商店（早餐已在 Akureyri 買好）。', tips: ['座標為近似值'] },
    ],
  },
  {
    day: 8, date: '2026-07-19', weekday: '週日', color: '#9c7a8c',
    title: '斯奈山半島',
    summary: 'Kirkjufell → Ólafsvík 午餐 → Saxhóll → Vatnshellir 熔岩洞 → Djúpalónssandur → Lóndrangar → Hellnar 魚湯 → 宿 Arnarstapi',
    driveKm: 300, driveTime: '4h15m', sunrise: '03:50', sunset: '23:05',
    hardDeadlines: ['Vatnshellir 16:00 導覽場'],
    flexNotes: ['Búðakirkja＋Ytri Tunga 移到 Day 9 早上順路，本日壓力大減', 'Skarðsvík／Svörtuloft 預設砍（579 號 4km 爛路）'],
    stops: [
      { id: 'd8-stadarskali', name: '加油：N1 Staðarskáli', nameLocal: 'Staðarskáli', type: '加油', icon: '⛽', coord: [-21.081, 65.1402], timeStart: '08:30', timeEnd: '08:40', desc: '出發先加滿（走 1 號經 Borgarnes 全鋪面約 3h）。' },
      { id: 'd8-kirkjufell', name: '教堂山＋瀑布', nameLocal: 'Kirkjufell / Kirkjufellsfoss', type: '景點', icon: '🗻', coord: [-23.3069, 64.9417], via: [[-21.9105, 64.5446]], timeStart: '11:35', timeEnd: '12:10', driveFromPrev: { km: 210, min: 170 }, desc: '全冰島最上鏡的錐形山（《權力遊戲》箭頭山）。經典構圖＝瀑布上方視角以山為背景。', tips: ['停車 ~700–1,000 ISK（車牌辨識）', '快拍就走，中午人最多'] },
      { id: 'd8-sker', name: '午餐：Sker', nameLocal: 'Sker Restaurant, Ólafsvík', type: '餐廳', icon: '🐟', coord: [-23.7115, 64.8935], timeStart: '12:35', timeEnd: '13:45', driveFromPrev: { km: 26, min: 25 }, desc: '漁港 Ólafsvík 的高評價海鮮餐廳，鮮魚料理。', tips: ['週日 12:00–20:30', '備案：Hraun'], rating: 4.4, hours: '週日 12:00–20:30' },
      { id: 'd8-ingjaldsholl', name: 'Ingjaldshólskirkja＋紅色小屋', nameLocal: 'Ingjaldshólskirkja', type: '景點', icon: '⛪', coord: [-23.8578, 64.9116], timeStart: '14:00', timeEnd: '14:15', driveFromPrev: { km: 12, min: 12 }, desc: '山丘上的紅頂白教堂（1903，世界最早混凝土教堂之一），雪山背景快拍。', cutPriority: 2 },
      { id: 'd8-saxholl', name: 'Saxhóll 火山口', nameLocal: 'Saxhóll', type: '景點', icon: '🌋', coord: [-23.9246, 64.8509], timeStart: '14:30', timeEnd: '15:00', driveFromPrev: { km: 12, min: 12 }, desc: '沿 396 階金屬迴旋梯登上火山口緣，360° 熔岩原全景。' },
      { id: 'd8-skardsvik', name: 'Skarðsvík 金沙灘（備選）', nameLocal: 'Skarðsvík', type: '景點', icon: '🏖️', coord: [-23.9864, 64.8814], timeStart: '15:10', timeEnd: '15:25', driveFromPrev: { km: 6, min: 8 }, desc: '黑色熔岩間罕見的金色沙灘。', badges: ['備選'], cutPriority: 1 },
      { id: 'd8-vatnshellir', name: 'Vatnshellir 熔岩洞導覽', nameLocal: 'Vatnshellir Cave', type: '活動', icon: '🕳️', coord: [-23.8183, 64.7479], timeStart: '16:00', timeEnd: '17:00', driveFromPrev: { km: 14, min: 15 }, desc: '深入 Snæfellsjökull 火山底下 8,000 年的熔岩管，《地心歷險記》的入口就設定在這座火山。45 分鐘導覽＝「斯奈山火山體驗」首選。', tips: ['⚠️ 預約 16:00 場（夏季每日 10:00–18:00 整點）', '含頭盔手電筒，5 歲+'], price: '5,900 ISK', badges: ['需預約'], links: { booking: 'https://www.summitguides.is/vatnshellir-cave-tour' } },
      { id: 'd8-djupalonssandur', name: '黑卵石灘', nameLocal: 'Djúpalónssandur / Dritvík', type: '景點', icon: '⚫', coord: [-23.9157, 64.7502], timeStart: '17:10', timeEnd: '17:55', driveFromPrev: { km: 9, min: 10 }, desc: '黑色卵石海灣＋英國拖網漁船殘骸＋古時測力石。步道下到灘上 10–15 分。', tips: ['停車場有廁所', '⚠️ 離岸流，勿近水'], badges: ['安全'] },
      { id: 'd8-londrangar', name: 'Lóndrangar 怪物海岸', nameLocal: 'Lóndrangar', type: '景點', icon: '🗿', coord: [-23.7846, 64.7325], timeStart: '18:05', timeEnd: '18:25', driveFromPrev: { km: 8, min: 8 }, desc: '75m 火山岩塔海崖（古火山栓），觀景台快拍。Malarrif 遊客中心有免費廁所。', tips: ['🐦 7 月育雛高峰，可用長焦看岩塔上的海鸚與管鼻鸌'] },
      { id: 'd8-fjoruhusid', name: '晚餐：Fjöruhúsið 魚湯', nameLocal: 'Fjöruhúsið, Hellnar', type: '餐廳', icon: '🍲', coord: [-23.6435, 64.7517], timeStart: '18:45', timeEnd: '19:30', driveFromPrev: { km: 11, min: 12 }, desc: 'Hellnar 海邊小屋的傳奇魚湯（4.5★），窗外就是海蝕洞與海鳥。', tips: ['最後點餐早→宜先電話 +354 435 6844 確認', '安全牌：Arnarbær（Arnarstapi，12:00–22:00）'], rating: 4.5 },
      { id: 'd8-lodging', name: '夜宿：Arnarstapi', nameLocal: 'Arnarstapi / Hellnar', type: '住宿', icon: '🏠', coord: [-23.626, 64.7686], timeStart: '20:00', driveFromPrev: { km: 4, min: 6 }, desc: 'Check-in 後趁永晝走海岸步道。', tips: ['座標為 Arnarstapi 近似值'] },
      { id: 'd8-coastwalk', name: '永晝加碼：Arnarstapi 海岸步道', nameLocal: 'Gatklettur', type: '景點', icon: '🌅', coord: [-23.6177, 64.7677], evening: true, walk: true, timeStart: '20:30', timeEnd: '21:45', desc: '玄武岩海蝕拱 Gatklettur＋崖壁鳥群；往 Hellnar 單程 2.5km 的懸崖步道。日落 23:05，完全來得及。' },
    ],
  },
  {
    day: 9, date: '2026-07-20', weekday: '週一', color: '#6a7197',
    title: '回雷克雅維克：購物＋Sky Lagoon',
    summary: '黑教堂 → 海豹灘 → Borgarnes → 市區購物 → Sky Lagoon → Messinn 晚餐 → 宿市區',
    driveKm: 215, driveTime: '2h50m', sunrise: '03:52', sunset: '23:03',
    hardDeadlines: ['Sky Lagoon 16:45 場', 'Messinn 21:00 關（19:45 訂位）'],
    flexNotes: ['明早 05:15 起床→今晚早收、23:00 前睡', '購物時段 2 小時可伸縮'],
    stops: [
      { id: 'd9-budakirkja', name: '布迪爾黑教堂', nameLocal: 'Búðakirkja', type: '景點', icon: '🖤', coord: [-23.384, 64.8217], timeStart: '08:50', timeEnd: '09:10', driveFromPrev: { km: 17, min: 18 }, desc: '熔岩原中的全黑木教堂（1987 重建），極簡構圖快拍。' },
      { id: 'd9-ytritunga', name: 'Ytri Tunga 海豹灘', nameLocal: 'Ytri Tunga', type: '景點', icon: '🦭', coord: [-23.0803, 64.8027], timeStart: '09:35', timeEnd: '10:05', driveFromPrev: { km: 17, min: 15 }, desc: '金色沙灘上的港海豹棲地，帶長焦、看潮汐運氣。' },
      { id: 'd9-geirabakari', name: 'Borgarnes：Geirabakarí 麵包店', nameLocal: 'Geirabakarí Kaffihús', type: '餐廳', icon: '🥯', coord: [-21.9105, 64.5446], timeStart: '11:15', timeEnd: '12:00', driveFromPrev: { km: 85, min: 70 }, desc: '《白日夢冒險王》Papa John’s 場景的麵包店，肉桂捲＋咖啡配峽灣景。', hours: '週一 07:30–16:30', rating: 4.3 },
      { id: 'd9-checkin', name: 'Check-in：雷克雅維克市區', nameLocal: 'Reykjavík Airbnb', type: '住宿', icon: '🏠', coord: [-21.93, 64.145], timeStart: '13:05', timeEnd: '13:35', driveFromPrev: { km: 75, min: 60 }, desc: '放行李＋停車（P2 230 ISK/h，09:00–21:00 收費）。', tips: ['座標為市中心近似值，可貼 Airbnb 連結更新'] },
      { id: 'd9-shopping', name: '購物時段：Laugavegur＋彩虹街', nameLocal: 'Laugavegur', type: '採買', icon: '🛍️', coord: [-21.9126, 64.143], walk: true, timeStart: '13:45', timeEnd: '16:15', desc: '伴手禮主戰場：66°North、Icewear、書店、Brauð & Co 肉桂捲（下午場售完看緣分）；糖果巧克力在超市買最划算。順買明天早餐。', tips: ['滿 12,000 ISK 留收據退稅', '記得在市區超市買 D10 早餐（自理）', '多出的 2.5h 可悠閒逛街吃午餐'], badges: ['自理'] },
      { id: 'd9-skylagoon', name: 'Sky Lagoon 海崖溫泉', nameLocal: 'Sky Lagoon', type: '活動', icon: '🌊', coord: [-21.9463, 64.1165], timeStart: '16:45', timeEnd: '19:15', driveFromPrev: { km: 6, min: 15 }, desc: '無邊際海景溫泉＋七步驟 Skjól ritual（冷水池→海景桑拿→冷霧→磨砂→蒸氣），建議停留 2–2.5h。', tips: ['⚠️ 提前 3–7 天訂 16:45 場', '12 歲以下不可入場', '夏季 08:00–23:00'], price: 'Saman 13,990 ISK 起', badges: ['需預約'], links: { booking: 'https://www.skylagoon.com' } },
      { id: 'd9-messinn', name: '晚餐：Messinn 魚盤', nameLocal: 'Messinn', type: '餐廳', icon: '🐠', coord: [-21.9377, 64.1469], timeStart: '19:45', timeEnd: '21:00', driveFromPrev: { km: 6, min: 15 }, desc: '鐵盤魚料理名店（北極紅點鮭奶油盤必點）。', tips: ['⚠️ Dineout 訂 19:45（週一到 21:00，20:15 前點完）', '想吃慢→Sæta Svínið（到 23:00）'], rating: 4.5, price: '主菜 3,500–5,500 ISK', badges: ['需預約'], links: { booking: 'https://www.messinn.com' } },
      { id: 'd9-lodging', name: '回住宿打包・23:00 前睡', nameLocal: 'Reykjavík', type: '住宿', icon: '🌙', coord: [-21.93, 64.145], walk: true, timeStart: '21:30', desc: '明早 05:15 起床。行李打包、加油可留明早（機場旁就有）。' },
    ],
  },
  {
    day: 10, date: '2026-07-21', weekday: '週二', color: '#79828f',
    title: '離境：BA801 10:20 → 倫敦',
    summary: '06:00 出發 → Njarðvík 加油 → 還車 → 退稅 → 10:20 起飛（14:25 抵 LHR）',
    driveKm: 50, driveTime: '50m', sunrise: '03:59', sunset: '22:57',
    hardDeadlines: ['BA801 10:20 起飛（07:25 進航廈）'],
    flexNotes: ['7 月 KEF 早班安檢尖峰偏長，整體比原版提早 15 分（出發 06:00、進航廈 07:25 ≈ 起飛前 ~3h）', '退稅在「託運行李之前」辦（入境大廳 Prosegur 櫃檯，04:30 起營業）', '早餐＝前晚買好，車上/航廈吃'],
    stops: [
      { id: 'd10-depart', name: '出發（早餐自理）', nameLocal: 'Reykjavík → KEF', type: '交通', icon: '🌅', coord: [-21.93, 64.145], timeStart: '06:00', desc: '05:00 起床、06:00 上路，清晨無車流、永晝全亮 45–50 分到機場。', badges: ['自理'] },
      { id: 'd10-fuel', name: '加滿油：Orkan Njarðvík', nameLocal: 'Orkan', type: '加油', icon: '⛽', coord: [-22.544, 63.974], timeStart: '06:50', timeEnd: '07:05', driveFromPrev: { km: 47, min: 45 }, desc: '還車前加滿（租車條件），機場旁 24h 自助站。' },
      { id: 'd10-return', name: '還車＋退稅＋登機', nameLocal: 'KEF Airport', type: '交通', icon: '✈️', coord: [-22.6056, 63.985], timeStart: '07:10', timeEnd: '10:20', driveFromPrev: { km: 5, min: 7 }, desc: '07:10 還車＋接駁 → 07:25 進航廈 → 先退稅（Prosegur 櫃檯）再託運 → BA801 10:20 起飛，14:25 抵倫敦希斯洛。', tips: ['⚠️ 7 月是 KEF 全年最忙月份，清晨 05–08 點安檢尖峰可能排 40 分+，故比淡季再提早約 15 分', '飛倫敦屬非申根離境、需走護照出境查驗，緩衝要算保守', '單張收據滿 12,000 ISK 才可退稅；退稅櫃檯 04:30 起營業'] },
    ],
  },
];

// 合併研究工作流的擴充說明與「相關資訊」連結（覆寫 desc、補上 infoUrl/infoLabel）
for (const d of DAYS) {
  for (const s of d.stops) {
    const e = ENRICHMENT[s.id];
    if (!e) continue;
    s.desc = e.desc;
    if (e.infoUrl) s.infoUrl = e.infoUrl;
    if (e.infoLabel) s.infoLabel = e.infoLabel;
  }
}

export const TRIP_STATS = {
  days: DAYS.length,
  stops: DAYS.reduce((n, d) => n + d.stops.length, 0),
  km: DAYS.reduce((n, d) => n + d.driveKm, 0),
};

export function gmapsNavUrl(stop: Stop): string {
  // 導航優先用行車點（如 DC-3 殘骸 → 導到停車場）
  const [lng, lat] = stop.routeCoord ?? stop.coord;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export function gmapsPlaceUrl(stop: Stop): string {
  const [lng, lat] = stop.coord;
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}
