/**
 * 關於我們資料
 * 以後要修改「關於我們」區塊的內容，編輯此檔案即可。
 *
 * slides — 左側輪播圖片（陣列，可新增/移除）
 *   image: 圖片路徑（放在 images/ 資料夾）
 *   alt:   圖片替代文字
 *   caption: 圖片標題文字（選填）
 *
 * content — 右側文字內容
 *   tag:      小標籤文字
 *   title:    主標題
 *   paragraphs: 段落文字（陣列）
 *   features: 特色列表（陣列）
 */

const ABOUT_DATA = {
  slides: [
    {
      image: "images/about-office.jpeg",
      alt: "事務所外觀",
      caption: "專業的辦公環境"
    },
    {
      image: "images/about-team.jpeg",
      alt: "律師團隊合照",
      caption: "經驗豐富的團隊"
    },
    {
      image: "images/about-meeting.jpg",
      alt: "會議討論",
      caption: "用心為您服務"
    },
    {
      image: "images/about-court.jpg",
      alt: "法庭辯護",
      caption: "追求卓越 專業至上"
    }
  ],
  content: {
    tag: "關於事務所",
    title: "全心守護您的權益",
    paragraphs: [
      "陳律師聯合事務所成立於2004年，長期深耕台灣法律服務領域。我們的律師團隊結合豐富的法律專業知識與對當事人的真誠承諾，致力於為每一位客戶爭取最佳結果。",
      "我們相信每個人都應享有優質的法律服務。無論您面臨的是複雜的商業糾紛還是個人法律事務，我們都將以同等的專注與專業態度處理每一個案件。"
    ],
    features: [
      "量身訂做的法律策略",
      "透明且即時的溝通",
      "卓越的勝訴紀錄",
      "多語言服務（中文、英文、日文）"
    ]
  }
};
