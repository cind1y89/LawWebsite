/**
 * 聯絡我們資料
 * 修改事務所地址、電話、營業時間、LINE、交通指引、地圖等，編輯此檔案。
 */

const CONTACT_DATA = {
  tag: "聯絡我們",
  title: "免費法律諮詢",
  description: "解決法律問題的第一步，從聯繫我們開始。歡迎來電、加 LINE 或親臨事務所，我們提供免費初次諮詢服務。",

  info: [
    { icon: "📍", label: "事務所地址", value: "台北市大安區正義路123號<br>（捷運大安站步行5分鐘）" },
    { icon: "📞", label: "聯絡電話", value: "(02) 2345-6789" },
    { icon: "✉️", label: "電子信箱", value: "info@chenlaw.com.tw" },
    { icon: "🕐", label: "營業時間", value: "週一至週五：09:00 – 18:00<br>週六：10:00 – 14:00" }
  ],

  // LINE 官方帳號
  line: {
    id: "@chenlaw",
    url: "https://lin.ee/xxxxxxx",
    qrcode: "images/line-qrcode.png"
  },

  traffic: null,

  map: {
    src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.002!2d121.5434!3d25.0330!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a9c1e4b5e4b7%3A0x0!2z5aSn5a6J5Y2A!5e0!3m2!1szh-TW!2stw!4v1690000000000",
    title: "陳律師聯合事務所位置地圖"
  }
};
