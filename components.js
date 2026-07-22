/**
 * components.js — 共用 NAV 和 FOOTER
 * 從 data/navigation.js 讀取資料動態產生。
 *
 * NAV 結構：
 * - 一般連結直接顯示
 * - 有 children 的項目會產生下拉式子選單
 * - cta: true 的會顯示為 CTA 按鈕
 */

(function () {
    'use strict';

    const path = window.location.pathname;
    const isHome = path.endsWith('index.html') || path.endsWith('/');

    function resolveHref(href) {
        if (!href) return '#';
        if (href.startsWith('#')) {
            return isHome ? href : 'index.html' + href;
        }
        return href;
    }

    function logoHTML(homeLink) {
        const logo = NAV_DATA.logo;
        return `
            <a href="${homeLink}" class="logo">
                <span class="logo-icon">${logo.icon}</span>
                <span class="logo-text">${logo.text}</span>
            </a>`;
    }

    // ============================
    // NAV
    // ============================
    function getNavHTML() {
        const links = NAV_DATA.links;
        let navItems = '';

        links.forEach(link => {
            if (link.cta) {
                // CTA 按鈕
                navItems += `<li><a href="${resolveHref(link.href)}" class="nav-link nav-link--cta">${link.label}</a></li>`;
            } else if (link.dynamic === 'services' && typeof SERVICES_DATA !== 'undefined') {
                // 從 SERVICES_DATA 動態產生子選單
                navItems += `
                <li class="nav-dropdown">
                    <button class="nav-link nav-dropdown-toggle" aria-expanded="false" aria-haspopup="true">
                        ${link.label} <span class="dropdown-arrow">▾</span>
                    </button>
                    <ul class="nav-dropdown-menu">
                        ${SERVICES_DATA.map(s => `<li><a href="${resolveHref('#services')}" class="nav-dropdown-link">${s.title}</a></li>`).join('')}
                    </ul>
                </li>`;
            } else if (link.children && link.children.length) {
                // 有子選單的項目
                navItems += `
                <li class="nav-dropdown">
                    <button class="nav-link nav-dropdown-toggle" aria-expanded="false" aria-haspopup="true">
                        ${link.label} <span class="dropdown-arrow">▾</span>
                    </button>
                    <ul class="nav-dropdown-menu">
                        ${link.children.map(child => `<li><a href="${resolveHref(child.href)}" class="nav-dropdown-link">${child.label}</a></li>`).join('')}
                    </ul>
                </li>`;
            } else {
                // 一般連結
                navItems += `<li><a href="${resolveHref(link.href)}" class="nav-link">${link.label}</a></li>`;
            }
        });

        return `
    <header class="header" id="header">
        <div class="container">
            ${logoHTML(isHome ? '#' : 'index.html')}
            <nav class="nav" id="nav">
                <ul class="nav-list">
                    ${navItems}
                </ul>
            </nav>
            <button class="hamburger" id="hamburger" aria-label="開啟導航選單" aria-expanded="false">
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            </button>
        </div>
    </header>`;
    }

    // ============================
    // FOOTER
    // ============================
    function getFooterHTML() {
        const footer = FOOTER_DATA;

        // 服務項目群組從 SERVICES_DATA 動態產生（如果有載入的話）
        const groupsHTML = footer.groups.map(group => {
            if (group.dynamic === 'services' && typeof SERVICES_DATA !== 'undefined') {
                const links = SERVICES_DATA.map(s => `<li><a href="${resolveHref('#services')}">${s.title}</a></li>`).join('');
                return `
                <div class="footer-links">
                    <h4>${group.title}</h4>
                    <ul>${links}</ul>
                </div>`;
            }
            return `
                <div class="footer-links">
                    <h4>${group.title}</h4>
                    <ul>
                        ${group.links.map(link => `<li><a href="${resolveHref(link.href)}">${link.label}</a></li>`).join('')}
                    </ul>
                </div>`;
        }).join('');

        return `
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-about">
                    ${logoHTML(isHome ? '#' : 'index.html')}
                    <p class="footer-desc">${footer.description}</p>
                </div>
                ${groupsHTML}
            </div>
            <div class="footer-bottom">
                <p>${footer.copyright}</p>
            </div>
        </div>
    </footer>`;
    }

    // ============================
    // 載入
    // ============================
    function loadComponents() {
        if (typeof NAV_DATA === 'undefined' || typeof FOOTER_DATA === 'undefined') {
            console.error('NAV_DATA / FOOTER_DATA 未載入，請確認 data/navigation.js 已引入');
            return;
        }

        const navPlaceholder = document.getElementById('nav-placeholder');
        const footerPlaceholder = document.getElementById('footer-placeholder');

        if (navPlaceholder) navPlaceholder.outerHTML = getNavHTML();
        if (footerPlaceholder) footerPlaceholder.outerHTML = getFooterHTML();

        document.dispatchEvent(new CustomEvent('componentsLoaded'));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadComponents);
    } else {
        loadComponents();
    }
})();
