// 實用資訊頁資料

export interface InfoCard {
  id: string;
  icon: string;
  title: string;
  lines: string[];
  links?: { label: string; url: string }[];
}

export const INFO_CARDS: InfoCard[] = [
  {
    id: 'emergency', icon: '🆘', title: '緊急狀況',
    lines: ['緊急電話：112（警消醫共用，可 App 定位）', '路況危險或迷路先打 112，再聯絡租車公司'],
    links: [{ label: 'SafeTravel 安全資訊', url: 'https://safetravel.is' }],
  },
  {
    id: 'weather', icon: '🌦️', title: '每日出發前必查',
    lines: ['vedur.is：天氣與風速（風速 >15 m/s 開車門要小心）', 'safetravel.is：路況、Reynisfjara 浪況燈號', 'road.is：道路即時狀態'],
    links: [
      { label: 'Veður 氣象局', url: 'https://en.vedur.is' },
      { label: 'SafeTravel', url: 'https://safetravel.is/travel-conditions' },
      { label: 'Umferdin 路況', url: 'https://umferdin.is/en' },
    ],
  },
  {
    id: 'parking', icon: '🅿️', title: '停車與繳費',
    lines: ['景點停車多用 Parka App（可離場後 24h 內補繳）', '常見費用：1,000 ISK/次（Þingvellir、Seljalandsfoss、Skógafoss、Reynisfjara、Fjaðrárgljúfur、Skaftafell、Jökulsárlón）', 'Skaftafell 與 Jökulsárlón 同一張卡付 → 冰河湖停車半價', '市區 P1 630／P2-P4 230 ISK/h（09:00–21:00）'],
    links: [{ label: 'Parka', url: 'https://www.parka.is' }],
  },
  {
    id: 'tunnel', icon: '🚇', title: 'Vaðlaheiðargöng 隧道費',
    lines: ['Goðafoss↔Akureyri 之間，單程 2,216 ISK', '通過前後 24 小時內上 veggjald.is 繳，現場不能繳、逾期罰款', 'D6 進城＋D7 出城共 2 次；免費舊路 Víkurskarð 多 10–15 分'],
    links: [{ label: 'veggjald.is 繳費', url: 'https://www.veggjald.is/en' }],
  },
  {
    id: 'fuel', icon: '⛽', title: '加油原則',
    lines: ['Egilsstaðir、Akureyri、Borgarnes、Staðarskáli 過站必滿油', 'Costco Garðabær 最便宜（需會員卡）', '自助加油：信用卡需可預授權（先驗一筆額度）'],
  },
  {
    id: 'taxfree', icon: '🧾', title: '退稅 Tax-Free',
    lines: ['單張收據滿 12,000 ISK 才可退', 'KEF 退稅櫃檯：入境大廳 Prosegur（租車櫃檯對面），04:30–01:00', '⚠️ 必須在「託運行李之前」辦理，需出示商品＋表單＋收據'],
  },
  {
    id: 'daylight', icon: '☀️', title: '7 月中永晝',
    lines: ['日落 23:00–23:35、整夜微亮（民用暮光）', '晚上 9–11 點仍可玩景點＝行程最大彈性', '帶眼罩助眠'],
  },
  {
    id: 'safety', icon: '⚠️', title: '安全鐵則',
    lines: ['Reynisfjara／Djúpalónssandur：看浪況燈號、永遠不背對海', 'Hverir 地熱區勿離步道（蒸氣燙傷）', '碎石路（711/715/579/862 支線）放慢、會車減速', '勿踩苔蘚、勿越過封閉標示'],
  },
];

export const SUN_TABLE = [
  { date: '7/12', sunrise: '03:30', sunset: '23:20' },
  { date: '7/13', sunrise: '03:32', sunset: '23:15' },
  { date: '7/14', sunrise: '03:38', sunset: '23:05' },
  { date: '7/15', sunrise: '03:35', sunset: '23:00' },
  { date: '7/16', sunrise: '03:10', sunset: '23:25' },
  { date: '7/17', sunrise: '03:05', sunset: '23:31' },
  { date: '7/18', sunrise: '03:09', sunset: '23:28' },
  { date: '7/19', sunrise: '03:50', sunset: '23:05' },
  { date: '7/20', sunrise: '03:52', sunset: '23:03' },
  { date: '7/21', sunrise: '03:59', sunset: '22:57' },
];
