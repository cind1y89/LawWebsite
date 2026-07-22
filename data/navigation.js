/**
 * 導航列與頁尾資料
 * 修改導航連結或頁尾連結，只需編輯此檔案。
 *
 * NAV links 結構：
 *   label    — 顯示文字
 *   href     — 連結（# 開頭表示首頁錨點，子頁面自動加前綴）
 *   cta      — 是否為 CTA 按鈕（選填）
 *   children — 子選單（陣列，選填，有這個就會變成下拉式）
 */

const NAV_DATA = {
  logo: {
    icon: "",
    text: "陳律師聯合事務所"
  },

  links: [
    { label: "首頁", href: "#home" },
    { label: "關於我們", href: "#about" },
    { label: "服務項目", href: "#services"},
    { label: "成功案例", href: "#cases" },
    { label: "律師團隊", href: "#team" },
    {
      label: "更多資訊",
      href: null,
      children: [
        { label: "常見問題", href: "faq.html" },
        { label: "服務流程", href: "process.html" },
        { label: "收費標準", href: "pricing.html" }
      ]
    },
    { label: "免費諮詢", href: "#contact", cta: true }
  ]
};

const FOOTER_DATA = {
  description: "自2004年起，以誠信與專業為您提供卓越的法律服務。",
  copyright: "© 2026 陳律師聯合事務所 版權所有",

  groups: [
    {
      title: "快速連結",
      links: [
        { label: "關於我們", href: "#about" },
        { label: "服務項目", href: "#services" },
        { label: "成功案例", href: "#cases" },
        { label: "律師團隊", href: "#team" },
        { label: "常見問題", href: "faq.html" },
        { label: "服務流程", href: "process.html" },
        { label: "收費標準", href: "pricing.html" },
        { label: "聯絡我們", href: "#contact" }
      ]
    },
    {
      title: "服務項目",
      dynamic: "services"
    },
    {
      title: "法律聲明",
      links: [
        { label: "隱私權政策", href: "privacy.html" },
        { label: "服務條款", href: "terms.html" },
        { label: "免責聲明", href: "disclaimer.html" }
      ]
    }
  ]
};
