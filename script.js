/**
 * 陳律師聯合事務所 - 網站互動功能
 * Mobile menu, scroll effects, animations, modal, share buttons
 */

// 等待 components.js 載入完成再初始化
document.addEventListener('componentsLoaded', initApp);

function initApp() {
    // DOM Elements
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    // ===== Mobile Navigation Toggle =====
    function toggleMobileMenu() {
        const isActive = hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isActive);

        // Prevent body scrolling when menu is open
        document.body.style.overflow = isActive ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // Close mobile menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            toggleMobileMenu();
        }
    });

    // ===== Dropdown Toggle =====
    const dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = toggle.closest('.nav-dropdown');
            const isActive = dropdown.classList.contains('active');

            // 關閉其他 dropdown
            document.querySelectorAll('.nav-dropdown.active').forEach(d => {
                d.classList.remove('active');
                d.querySelector('.nav-dropdown-toggle').setAttribute('aria-expanded', 'false');
            });

            // 切換當前
            if (!isActive) {
                dropdown.classList.add('active');
                toggle.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // 點擊外部關閉 dropdown
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.nav-dropdown.active').forEach(d => {
                d.classList.remove('active');
                d.querySelector('.nav-dropdown-toggle').setAttribute('aria-expanded', 'false');
            });
        }
    });

    // ===== Header Scroll Effect =====
    function handleScroll() {
        const currentScrollY = window.scrollY;

        // Add/remove scrolled class
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ===== Scroll Animations (Intersection Observer) =====
    const animatedElements = document.querySelectorAll(
        '.service-card, .team-card, .stat-item, .about-content, .about-image'
    );

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Only observe if user hasn't set reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            observer.observe(el);
        });
    }

    // ===== Smooth Scroll for Navigation Links =====
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ===== Active Navigation Highlight =====
    const sections = document.querySelectorAll('section[id]');

    function highlightNavOnScroll() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

    // ===== About — 從 data/about.js 載入（含輪播圖） =====
    const aboutSlider = document.getElementById('aboutSlider');
    const aboutContent = document.getElementById('aboutContent');

    function loadAbout() {
        if (!aboutSlider || !aboutContent) return;

        if (typeof ABOUT_DATA === 'undefined') {
            console.error('ABOUT_DATA 未載入，請確認 data/about.js 已引入');
            return;
        }

        // 渲染輪播圖
        const slides = ABOUT_DATA.slides;
        aboutSlider.innerHTML = `
            <div class="slider">
                <div class="slider-track">
                    ${slides.map((slide, i) => `
                        <div class="slider-slide ${i === 0 ? 'active' : ''}">
                            <img src="${slide.image}" alt="${slide.alt}" onerror="this.parentElement.classList.add('img-fallback')">
                            ${slide.caption ? `<span class="slider-caption">${slide.caption}</span>` : ''}
                        </div>
                    `).join('')}
                </div>
                <button class="slider-btn slider-btn--prev" aria-label="上一張">‹</button>
                <button class="slider-btn slider-btn--next" aria-label="下一張">›</button>
                <div class="slider-dots">
                    ${slides.map((_, i) => `<button class="slider-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="切換到第${i + 1}張"></button>`).join('')}
                </div>
            </div>
        `;

        // 渲染文字內容
        const content = ABOUT_DATA.content;
        aboutContent.innerHTML = `
            <span class="section-tag">${content.tag}</span>
            <h2 class="section-title">${content.title}</h2>
            ${content.paragraphs.map(p => `<p class="about-text">${p}</p>`).join('')}
            <ul class="about-features">
                ${content.features.map(f => `<li>✓ ${f}</li>`).join('')}
            </ul>
        `;

        // 輪播功能
        initSlider();
    }

    function initSlider() {
        const slider = document.querySelector('.slider');
        if (!slider) return;

        const slides = slider.querySelectorAll('.slider-slide');
        const dots = slider.querySelectorAll('.slider-dot');
        const prevBtn = slider.querySelector('.slider-btn--prev');
        const nextBtn = slider.querySelector('.slider-btn--next');
        let current = 0;
        let autoPlayTimer = null;

        function goTo(index) {
            slides[current].classList.remove('active');
            dots[current].classList.remove('active');
            current = (index + slides.length) % slides.length;
            slides[current].classList.add('active');
            dots[current].classList.add('active');
        }

        function next() { goTo(current + 1); }
        function prev() { goTo(current - 1); }

        // 自動輪播
        function startAutoPlay() {
            autoPlayTimer = setInterval(next, 4000);
        }
        function stopAutoPlay() {
            clearInterval(autoPlayTimer);
        }

        prevBtn.addEventListener('click', () => { stopAutoPlay(); prev(); startAutoPlay(); });
        nextBtn.addEventListener('click', () => { stopAutoPlay(); next(); startAutoPlay(); });
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                stopAutoPlay();
                goTo(parseInt(dot.dataset.index));
                startAutoPlay();
            });
        });

        // 滑鼠移入暫停
        slider.addEventListener('mouseenter', stopAutoPlay);
        slider.addEventListener('mouseleave', startAutoPlay);

        startAutoPlay();
    }

    loadAbout();

    // ===== Stats — 從 data/stats.js 載入 =====
    const statsGrid = document.getElementById('statsGrid');

    function loadStats() {
        if (!statsGrid) return;

        if (typeof STATS_DATA === 'undefined' || !STATS_DATA.length) {
            console.error('STATS_DATA 未載入，請確認 data/stats.js 已引入');
            return;
        }

        statsGrid.innerHTML = STATS_DATA.map(stat => `
            <div class="stat-item">
                <span class="stat-number">${stat.number}</span>
                <span class="stat-label">${stat.label}</span>
            </div>
        `).join('');
    }

    loadStats();

    // ===== Services — 從 data/services.js 載入 =====
    const servicesGrid = document.getElementById('servicesGrid');

    /**
     * 判斷欄位是圖片路徑還是 emoji
     */
    function isImagePath(str) {
        if (!str) return false;
        return str.includes('/') || str.includes('.jpg') || str.includes('.jpeg') || str.includes('.png') || str.includes('.webp') || str.includes('.svg');
    }

    function loadServices() {
        if (!servicesGrid) return;

        if (typeof SERVICES_DATA === 'undefined' || !SERVICES_DATA.length) {
            console.error('SERVICES_DATA 未載入，請確認 data/services.js 已引入');
            return;
        }

        servicesGrid.innerHTML = SERVICES_DATA.map(service => `
            <div class="service-card">
                <h3 class="service-title">${service.title}</h3>
                <p class="service-desc">${service.desc}</p>
            </div>
        `).join('');
    }

    loadServices();

    // ===== Cases — 從 data/cases.js 載入 =====
    const casesGrid = document.getElementById('casesGrid');
    const casesFilter = document.getElementById('casesFilter');
    const casesAll = document.getElementById('casesAll'); // cases.html 完整列表用

    function loadCases() {
        if (typeof CASES_DATA === 'undefined' || !CASES_DATA.length) return;

        // 依日期排序（最新的在前）
        const sorted = [...CASES_DATA].sort((a, b) => new Date(b.date) - new Date(a.date));

        // 首頁：只顯示最新 6 筆 + 查看更多按鈕
        if (casesGrid) {
            const latest = sorted.slice(0, 6);
            renderCases(casesGrid, latest);

            // 加入查看更多按鈕（放在卡片上方）
            const moreBtn = document.createElement('div');
            moreBtn.className = 'cases-more';
            moreBtn.innerHTML = `<a href="cases.html" class="btn btn-primary">查看所有案例 →</a>`;
            casesGrid.insertAdjacentElement('beforebegin', moreBtn);
        }

        // cases.html 完整列表：顯示全部 + 篩選
        if (casesAll) {
            // 從 SERVICES_DATA 取得類別（與服務項目連動）
            const categories = ['全部'];
            if (typeof SERVICES_DATA !== 'undefined') {
                SERVICES_DATA.forEach(s => categories.push(s.title));
            }

            if (casesFilter) {
                casesFilter.innerHTML = categories.map((cat, i) => `
                    <button class="cases-filter-btn ${i === 0 ? 'active' : ''}" data-filter="${cat}">${cat}</button>
                `).join('');

                casesFilter.querySelectorAll('.cases-filter-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        casesFilter.querySelectorAll('.cases-filter-btn').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        const filter = btn.dataset.filter;
                        renderCases(casesAll, filter === '全部' ? sorted : sorted.filter(c => c.category === filter));
                    });
                });
            }

            renderCases(casesAll, sorted);
        }
    }

    function renderCases(container, cases) {
        container.innerHTML = cases.map(c => `
            <div class="case-card">
                <div class="case-card-header">
                    <span class="case-category">${c.category}</span>
                    <span class="case-date">${formatDate(c.date)}</span>
                </div>
                <h3 class="case-title">${c.title}</h3>
                <p class="case-summary">${c.summary}</p>
                <div class="case-result">
                    <span class="case-result-label">✓ 結果：</span>
                    <span class="case-result-value">${c.result}</span>
                </div>
            </div>
        `).join('');
    }

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
    }

    loadCases();

    // ===== Lawyer Team — 從 data/lawyers.js 載入 =====
    const teamGrid = document.getElementById('teamGrid');
    const modal = document.getElementById('lawyerModal');
    const modalPhoto = document.getElementById('modalPhoto');
    const modalTitle = document.getElementById('modalTitle');
    const modalRole = document.getElementById('modalRole');
    const modalDetails = document.getElementById('modalDetails');
    const modalClose = modal ? modal.querySelector('.modal-close') : null;

    /**
     * 載入律師卡片（資料來自 data/lawyers.js 的 LAWYERS_DATA）
     */
    function loadLawyers() {
        if (!teamGrid) return;

        if (typeof LAWYERS_DATA === 'undefined' || !LAWYERS_DATA.length) {
            console.error('LAWYERS_DATA 未載入，請確認 data/lawyers.js 已引入');
            teamGrid.innerHTML = '<p style="text-align:center;color:#999;">律師資料載入失敗</p>';
            return;
        }

        renderTeamCards(LAWYERS_DATA);
    }

    /**
     * 渲染律師卡片
     */
    function renderTeamCards(lawyers) {
        teamGrid.innerHTML = lawyers.map(lawyer => `
            <div class="team-card" data-lawyer="${lawyer.id}">
                <div class="team-photo">
                    <div class="team-photo-placeholder">
                        ${isImagePath(lawyer.photo)
                            ? `<img src="${lawyer.photo}" alt="${lawyer.name}" onerror="this.parentElement.textContent='👤'">`
                            : lawyer.photo}
                    </div>
                </div>
                <h3 class="team-name">${lawyer.name}</h3>
                <p class="team-role">${lawyer.role}</p>
                <p class="team-bio">${lawyer.bio}</p>
                <span class="team-more">點擊查看詳細經歷 →</span>
            </div>
        `).join('');

        // 綁定點擊事件
        teamGrid.querySelectorAll('.team-card[data-lawyer]').forEach(card => {
            card.addEventListener('click', () => {
                const lawyerId = card.getAttribute('data-lawyer');
                const lawyer = LAWYERS_DATA.find(l => l.id === lawyerId);
                if (lawyer) openLawyerModal(lawyer);
            });
        });
    }

    /**
     * 開啟律師詳細資料彈窗
     */
    function openLawyerModal(lawyer) {
        if (!modal) return;

        modalPhoto.innerHTML = isImagePath(lawyer.photo)
            ? `<img src="${lawyer.photo}" alt="${lawyer.name}" onerror="this.parentElement.textContent='👤'">`
            : lawyer.photo;
        modalTitle.textContent = lawyer.name;
        modalRole.textContent = lawyer.role;

        let detailsHTML = '';

        if (lawyer.education && lawyer.education.length) {
            detailsHTML += `<h4>學歷</h4><ul>${lawyer.education.map(item => `<li>${item}</li>`).join('')}</ul>`;
        }
        if (lawyer.experience && lawyer.experience.length) {
            detailsHTML += `<h4>經歷</h4><ul>${lawyer.experience.map(item => `<li>${item}</li>`).join('')}</ul>`;
        }
        if (lawyer.specialties && lawyer.specialties.length) {
            detailsHTML += `<h4>專長領域</h4><ul>${lawyer.specialties.map(item => `<li>${item}</li>`).join('')}</ul>`;
        }
        if (lawyer.languages) {
            detailsHTML += `<h4>語言能力</h4><p>${lawyer.languages}</p>`;
        }

        modalDetails.innerHTML = detailsHTML;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    // 關閉彈窗
    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // 啟動載入
    loadLawyers();

    // ===== Contact — 從 data/contact.js 載入 =====
    const contactSection = document.getElementById('contactSection');

    function loadContact() {
        if (!contactSection) return;
        if (typeof CONTACT_DATA === 'undefined') return;

        const d = CONTACT_DATA;
        const lineSection = d.line ? `
            <div class="contact-line">
                <h3 class="contact-line-title">LINE 即時諮詢</h3>
                <div class="contact-line-qr">
                    <img src="${d.line.qrcode}" alt="LINE QR Code" onerror="this.style.display='none'">
                </div>
                <p class="contact-line-id">LINE ID：<strong>${d.line.id}</strong></p>
                <a href="${d.line.url}" class="btn btn-line" target="_blank" rel="noopener">
                    加入好友
                </a>
            </div>
        ` : '';

        contactSection.innerHTML = `
            <span class="section-tag">${d.tag}</span>
            <h2 class="section-title">${d.title}</h2>
            <p class="contact-desc">${d.description}</p>

            <div class="contact-layout">
                <!-- 左欄：聯絡資訊 -->
                <div class="contact-info">
                    <div class="contact-details">
                        ${d.info.map(item => `
                            <div class="contact-item">
                                <span class="contact-icon">${item.icon}</span>
                                <div>
                                    <strong>${item.label}</strong>
                                    <p>${item.value}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- 中欄：LINE QR Code -->
                ${lineSection}

                <!-- 右欄：地圖 -->
                <div class="contact-map">
                    <iframe src="${d.map.src}" width="100%" height="100%" style="border:0; border-radius: 12px;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="${d.map.title}"></iframe>
                </div>
            </div>
        `;
    }

    loadContact();

    // ===== FAQ — 從 data/faq.js 載入 =====
    const faqList = document.getElementById('faqList');

    function loadFaq() {
        if (!faqList) return;
        if (typeof FAQ_DATA === 'undefined') return;

        faqList.innerHTML = FAQ_DATA.map(item => `
            <div class="faq-item">
                <button class="faq-question" aria-expanded="false">
                    <span>${item.question}</span>
                    <span class="faq-icon">+</span>
                </button>
                <div class="faq-answer">
                    <p>${item.answer}</p>
                </div>
            </div>
        `).join('');

        // 重新綁定 FAQ 手風琴事件
        initFaqAccordion();
    }

    function initFaqAccordion() {
        const items = document.querySelectorAll('.faq-item');
        items.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    items.forEach(other => other.classList.remove('active'));
                    if (!isActive) {
                        item.classList.add('active');
                        question.setAttribute('aria-expanded', 'true');
                    } else {
                        question.setAttribute('aria-expanded', 'false');
                    }
                });
            }
        });
    }

    loadFaq();

    // ===== Process — 從 data/process.js 載入 =====
    const processContent = document.getElementById('processContent');

    function loadProcess() {
        if (!processContent) return;
        if (typeof PROCESS_DATA === 'undefined') return;

        const d = PROCESS_DATA;
        processContent.innerHTML = `
            <span class="section-tag">${d.tag}</span>
            <h1 class="section-title">${d.title}</h1>
            <p class="page-intro">${d.intro}</p>
            <div class="process-timeline">
                ${d.steps.map((step, i) => `
                    <div class="process-step">
                        <div class="process-number">${i + 1}</div>
                        <div class="process-content">
                            <h3>${step.step}</h3>
                            <p>${step.desc}</p>
                            <span class="process-time">⏱ ${step.time}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="process-cta">
                <h3>${d.cta.title}</h3>
                <p>${d.cta.desc}</p>
                <a href="${d.cta.buttonLink}" class="btn btn-primary">${d.cta.buttonText}</a>
            </div>
            <div class="disclaimer-back">
                <a href="index.html" class="btn btn-secondary-dark">← 返回首頁</a>
            </div>
        `;
    }

    loadProcess();

    // ===== Pricing — 從 data/pricing.js 載入 =====
    const pricingContent = document.getElementById('pricingContent');

    function loadPricing() {
        if (!pricingContent) return;
        if (typeof PRICING_DATA === 'undefined') return;

        const d = PRICING_DATA;
        pricingContent.innerHTML = `
            <span class="section-tag">${d.tag}</span>
            <h1 class="section-title">${d.title}</h1>
            <p class="page-intro">${d.intro}</p>

            <section class="pricing-section">
                <h2 class="pricing-section-title">計費方式</h2>
                <div class="pricing-methods">
                    ${d.methods.map(m => `
                        <div class="pricing-method-card">
                            <div class="pricing-method-icon">${m.icon}</div>
                            <h3>${m.title}</h3>
                            <p>${m.desc}</p>
                        </div>
                    `).join('')}
                </div>
            </section>

            <section class="pricing-section">
                <h2 class="pricing-section-title">各項服務參考費用</h2>
                <div class="pricing-table-wrapper">
                    <table class="pricing-table">
                        <thead>
                            <tr>${d.table.headers.map(h => `<th>${h}</th>`).join('')}</tr>
                        </thead>
                        <tbody>
                            ${d.table.rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </section>

            <section class="pricing-section">
                <h2 class="pricing-section-title">付款方式</h2>
                <div class="pricing-payment">
                    ${d.payment.map(p => `
                        <div class="payment-item">
                            <strong>${p.icon} ${p.title}</strong>
                            <p>${p.desc}</p>
                        </div>
                    `).join('')}
                </div>
            </section>

            <section class="pricing-section">
                <h2 class="pricing-section-title">注意事項</h2>
                <ul class="pricing-notes">
                    ${d.notes.map(n => `<li>• ${n}</li>`).join('')}
                </ul>
            </section>

            <div class="process-cta">
                <h3>${d.cta.title}</h3>
                <p>${d.cta.desc}</p>
                <a href="${d.cta.buttonLink}" class="btn btn-primary">${d.cta.buttonText}</a>
            </div>

            <div class="disclaimer-back">
                <a href="index.html" class="btn btn-secondary-dark">← 返回首頁</a>
            </div>
        `;
    }

    loadPricing();

    // ===== Legal Pages — 從 data/legal.js 載入 =====
    const legalContent = document.getElementById('legalContent');

    function loadLegal() {
        if (!legalContent) return;
        if (typeof LEGAL_DATA === 'undefined') return;

        const page = legalContent.getAttribute('data-page');
        const d = LEGAL_DATA[page];
        if (!d) return;

        legalContent.innerHTML = `
            <h1 class="disclaimer-title">${d.title}</h1>
            <p class="disclaimer-updated">最後更新日期：${d.updated}</p>
            ${d.sections.map(s => `
                <section class="disclaimer-section">
                    <h2>${s.heading}</h2>
                    ${s.content.startsWith('<') ? s.content : `<p>${s.content}</p>`}
                </section>
            `).join('')}
            <div class="disclaimer-back">
                <a href="index.html" class="btn btn-primary">← 返回首頁</a>
            </div>
        `;
    }

    loadLegal();

    // ===== Share Buttons =====
    const shareToggle = document.getElementById('shareToggle');
    const shareButtons = document.getElementById('shareButtons');
    const shareLine = document.getElementById('shareLine');
    const shareFacebook = document.getElementById('shareFacebook');

    if (shareToggle && shareButtons) {
        shareToggle.addEventListener('click', () => {
            shareButtons.classList.toggle('active');
        });
    }

    if (shareLine) {
        shareLine.addEventListener('click', (e) => {
            e.preventDefault();
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent('陳律師聯合事務所 — 專業法律服務');
            window.open(`https://social-plugins.line.me/lineit/share?url=${url}&text=${text}`, '_blank', 'width=600,height=500');
        });
    }

    if (shareFacebook) {
        shareFacebook.addEventListener('click', (e) => {
            e.preventDefault();
            const url = encodeURIComponent(window.location.href);
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=500');
        });
    }
}
