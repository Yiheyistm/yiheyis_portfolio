const preloader = document.querySelector("[data-preloader]");

window.addEventListener("DOMContentLoaded", function () {
    preloader.classList.add("loaded");
    document.body.classList.add("loaded");
});



/**
 * add event on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
    for (let i = 0, len = elements.length; i < len; i++) {
        elements[i].addEventListener(eventType, callback);
    }
}



/**
 * Mobile navbar toggle
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

addEventOnElements(navTogglers, "click", function () {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("nav-active");
});

addEventOnElements(navLinks, "click", function () {
    navbar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("nav-active");
});



/**
 * Header active
 */

const header = document.querySelector("[data-header]");
const backToTop = document.querySelector("[data-back-top]");

window.addEventListener("scroll", function () {
    header.classList[window.scrollY > 100 ? "add" : "remove"]("active");
    backToTop.classList[window.scrollY > 100 ? "add" : "remove"]("active");

});



/**
 * Element tilt effect
 */

const tiltElements = document.querySelectorAll("[data-tilt]");

const initTilt = function (event) {

    /** get tilt element center position */
    const centerX = this.offsetWidth / 2;
    const centerY = this.offsetHeight / 2;

    const tiltPosY = ((event.offsetX - centerX) / centerX) * 10;
    const tiltPosX = ((event.offsetY - centerY) / centerY) * 10;

    this.style.transform = `perspective(1000px) rotateX(${tiltPosX}deg) rotateY(${tiltPosY - (tiltPosY * 2)}deg)`;

}

addEventOnElements(tiltElements, "mousemove", initTilt);

addEventOnElements(tiltElements, "mouseout", function () {
    this.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
});



/**
 * Tab content
 */

const tabBtns = document.querySelectorAll("[data-tab-btn]");
const tabContents = document.querySelectorAll("[data-tab-content]");

let lastActiveTabBtn = tabBtns[0];
let lastActiveTabContent = tabContents[0];

const filterContent = function () {

    if (!(lastActiveTabBtn === this)) {

        lastActiveTabBtn.classList.remove("active");
        lastActiveTabContent.classList.remove("active");

        this.classList.add("active");
        lastActiveTabBtn = this;

        const currentTabContent = document.querySelector(`[data-tab-content="${this.dataset.tabBtn}"]`);

        currentTabContent.classList.add("active");
        lastActiveTabContent = currentTabContent;

    }

}

addEventOnElements(tabBtns, "click", filterContent);



/**
 * Custom cursor
 */

const cursors = document.querySelectorAll("[data-cursor]");
const hoveredElements = [...document.querySelectorAll("button"), ...document.querySelectorAll("a")];

window.addEventListener("mousemove", function (event) {

    const posX = event.clientX;
    const posY = event.clientY;

    /** cursor dot position */
    cursors[0].style.left = `${posX}px`;
    cursors[0].style.top = `${posY}px`;

    /** cursor outline position */
    setTimeout(function () {
        cursors[1].style.left = `${posX}px`;
        cursors[1].style.top = `${posY}px`;
    }, 80);

});

/** add hovered class when mouseover on hoverElements */
addEventOnElements(hoveredElements, "mouseover", function () {
    for (let i = 0, len = cursors.length; i < len; i++) {
        cursors[i].classList.add("hovered");
    }
});

/** remove hovered class when mouseout on hoverElements */
addEventOnElements(hoveredElements, "mouseout", function () {
    for (let i = 0, len = cursors.length; i < len; i++) {
        cursors[i].classList.remove("hovered");
    }
});

const themeToggleBtn = document.querySelector("[data-theme-btn]");

themeToggleBtn.addEventListener("click", function () {

    themeToggleBtn.classList.toggle("active");

    if (themeToggleBtn.classList.contains("active")) {
        document.body.classList.remove("dark_theme");
        document.body.classList.add("light_theme");

        localStorage.setItem("theme", "light_theme");
    } else {
        document.body.classList.add("dark_theme");
        document.body.classList.remove("light_theme");

        localStorage.setItem("theme", "dark_theme");
    }

});

/**
 * check & apply last time selected theme from localStorage
 */

if (localStorage.getItem("theme") === "light_theme") {
    themeToggleBtn.classList.add("active");
    document.body.classList.remove("dark_theme");
    document.body.classList.add("light_theme");
} else {
    themeToggleBtn.classList.remove("active");
    document.body.classList.remove("light_theme");
    document.body.classList.add("dark_theme");
}

// ---- Simple cache helpers (localStorage with TTL) ----
function cacheGet(key) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const { expiry, data } = JSON.parse(raw);
        if (typeof expiry === 'number' && Date.now() > expiry) {
            localStorage.removeItem(key);
            return null;
        }
        return data;
    } catch {
        return null;
    }
}

function cacheSet(key, data, ttlMs) {
    try {
        const payload = { data, expiry: typeof ttlMs === 'number' && ttlMs > 0 ? Date.now() + ttlMs : 0 };
        localStorage.setItem(key, JSON.stringify(payload));
    } catch { /* ignore quota */ }
}

// fullscreen image script for any element with data-fullscreen
document.querySelectorAll('[data-fullscreen]')?.forEach((el) => {
    el.addEventListener('click', function () {
        if (this.requestFullscreen) {
            this.requestFullscreen();
        } else if (this.mozRequestFullScreen) { // Firefox
            this.mozRequestFullScreen();
        } else if (this.webkitRequestFullscreen) { // Chrome, Safari and Opera
            this.webkitRequestFullscreen();
        } else if (this.msRequestFullscreen) { // IE/Edge
            this.msRequestFullscreen();
        }
    });
});

// -------- Certificates gallery from Google Drive links --------
(function initCertificates() {
    const list = document.getElementById('certificates-list');
    if (!list) return;

    // Helper to convert Google Drive share link to a thumbnail URL
    const toDrivePreview = (url) => {
        try {
            const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
            const id = match ? match[1] : null;
            // Thumbnail endpoint generally works for images & PDFs when shared publicly
            return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w1000` : url;
        } catch {
            return url;
        }
    };

    const certificates = [
        {
            title: 'Presidential Award',
            url: 'https://drive.google.com/file/d/13DG0gDiDp9c1yPQJ_NlrfBYLSO48RDlx/view?usp=drive_link',
            caption: 'National-level recognition for excellence.'
        },
        {
            title: 'Gojo Rent Virtual Home Rent Group Certificate',
            url: 'https://drive.google.com/file/d/1aweuTEsEw9kiNe4WqqG4m4R39CWPeW6y/view?usp=drive_link',
            caption: 'Certificate of contribution and completion.'
        },
        {
            title: 'Russian Hackathon Winning Certificate',
            url: 'https://drive.google.com/file/d/1aYeyQyij1fZl-AD2u3xR-Jsjb2Rg5sjz/view?usp=drive_link',
            caption: 'Winning team at an international hackathon.'
        },
        {
            title: 'GDSC Flutter Certificate',
            url: 'https://drive.google.com/file/d/1BoIFtnSw6M6YOfI1YMWNdhEIHr4kVRG1/view?usp=drive_link',
            caption: 'Google Developer Student Clubs Flutter track.'
        }
    ];

    const frag = document.createDocumentFragment();
    certificates.forEach((c) => {
        const li = document.createElement('li');
        li.innerHTML = `
                        <div class="award-card">
                            <figure class="card-banner img-holder" style="--width: 534; --height: 383;">
                                <img src="${toDrivePreview(c.url)}" alt="${c.title}" class="img-cover cert-thumb" loading="lazy" decoding="async"/>
                            </figure>
                            <div class="text-center" style="margin-top:8px">
                                <a class="btn btn:hover" href="${c.url}" target="_blank" rel="noopener"><span class="span">Open ${c.title}</span><ion-icon name="open-outline"></ion-icon></a>
                            </div>
                        </div>`;
        // Add robust fallback if Drive thumbnail is unavailable (private or non-image)
        const img = li.querySelector('img.cert-thumb');
        img.addEventListener('error', () => {
            img.src = './assets/images/certificate-1.png';
        }, { once: true });
        frag.appendChild(li);
    });
    list.appendChild(frag);

    // Lightbox preview on click
    const lightbox = document.getElementById('lightbox');
    const imgEl = lightbox?.querySelector('.lightbox-image');
    const captionEl = lightbox?.querySelector('.lightbox-caption');
    const closeBtn = lightbox?.querySelector('.lightbox-close');

    list.addEventListener('click', (e) => {
        const img = e.target.closest('.cert-thumb');
        if (!img || !lightbox) return;
        imgEl.src = img.src;
        captionEl.textContent = img.alt || '';
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
    });
    closeBtn?.addEventListener('click', () => {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
    });
    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('open');
            lightbox.setAttribute('aria-hidden', 'true');
        }
    });
})();

// -------- GitHub Projects & Filters --------
(async function initProjects() {
    const list = document.getElementById('projects-list');
    const filtersWrap = document.getElementById('project-filters');
    if (!list || !filtersWrap) return;

    const username = 'Yiheyistm';
    const api = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`;
    const cacheKeyRepos = `gh:repos:${username}:v1`;
    const reposTTL = 60 * 60 * 1000; // 1 hour
    // Small curated pin list (top priority ordering)
    const pinned = [
        'Abeto---Go-online',
        'tictactoe_game'
    ];
    // Optional: override descriptions or image per project here
    const projectOverrides = {
        // 'repo-name': { description: 'Custom description', image: './assets/images/some-banner.jpg' }
        'Abeto---Go-online': {
            description: 'Responsive hosting landing page with hero sections, pricing, and feature grid.'
        },
        'tictactoe_game': {
            description: 'Flutter Tic-Tac-Toe with Node.js backend, real-time play, and clean UI.'
        }
    };
    let repos = [];
    const readmeCache = new Map(); // repo.name -> { summary, imageUrl }
    const renderSkeletons = (count = 8) => {
        list.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const li = document.createElement('li');
            li.className = 'slider-item';
            li.innerHTML = `
              <div class="project-card skeleton-card">
                <div class="card-banner img-holder" style="--width: 1000; --height: 600;">
                  <div class="skeleton skeleton-img"></div>
                </div>
                <div class="card-content">
                  <div class="skeleton skeleton-text" style="width:30%"></div>
                  <div class="skeleton skeleton-text" style="width:85%"></div>
                  <div class="skeleton skeleton-text" style="width:95%"></div>
                </div>
              </div>`;
            list.appendChild(li);
        }
    };
    const orderRepos = (input) => {
        const arr = Array.isArray(input) ? input.slice() : [];
        const pinIndex = new Map(pinned.map((n, i) => [n, i]));
        arr.sort((a, b) => {
            const ai = pinIndex.has(a.name) ? pinIndex.get(a.name) : Number.POSITIVE_INFINITY;
            const bi = pinIndex.has(b.name) ? pinIndex.get(b.name) : Number.POSITIVE_INFINITY;
            if (ai !== bi) return ai - bi;
            const as = a.stargazers_count || 0; const bs = b.stargazers_count || 0;
            if (as !== bs) return bs - as;
            const au = Date.parse(a.updated_at) || 0; const bu = Date.parse(b.updated_at) || 0;
            return bu - au;
        });
        return arr;
    };
    try {
        // Try cache first; if empty, render skeletons while fetching
        const cached = cacheGet(cacheKeyRepos);
        if (Array.isArray(cached) && cached.length) {
            repos = cached;
        } else {
            renderSkeletons(8);
            const res = await fetch(api);
            repos = await res.json();
            if (!Array.isArray(repos)) throw new Error('Unexpected GitHub response');
            cacheSet(cacheKeyRepos, repos, reposTTL);
        }
    } catch (e) {
        // Fallback to static examples if API fails
        repos = [
            { name: 'Abeto---Go-online', html_url: 'https://github.com/Yiheyistm/Abeto---Go-online', description: 'Frontend for cloud hosting marketing site.', language: 'HTML', topics: ['frontend', 'landing-page'] },
            { name: 'tictactoe_game', html_url: 'https://github.com/Yiheyistm/tictactoe_game', description: 'Tic-Tac-Toe Mobile Game using Flutter and Node.js', language: 'Dart', topics: ['flutter', 'game'] }
        ];
    }
    // Order repos with pins first
    repos = orderRepos(repos);

    // Build filter set from languages
    const langs = Array.from(new Set(repos.map(r => r.language).filter(Boolean))).sort();

    const mkBtn = (label) => {
        const b = document.createElement('button');
        b.className = 'filter-btn btn:hover';
        b.dataset.filter = label;
        b.textContent = label;
        return b;
    };
    const allBtn = mkBtn('All');
    allBtn.classList.add('active');
    filtersWrap.appendChild(allBtn);
    langs.forEach(l => filtersWrap.appendChild(mkBtn(l)));

    const bannerFor = (repo) => {
        // local heuristic fallback
        const n = repo.name.toLowerCase();
        if (n.includes('tic')) return './assets/images/tic-tac-toe.jpg';
        if (n.includes('cloud') || n.includes('abeto')) return './assets/images/cloud-hosting.jpg';
        return './assets/images/project-3.jpg';
    };

    const ogImageFor = (repo) => `https://opengraph.githubassets.com/1/${username}/${repo.name}`;

    // Extract first image URL from README markdown
    const extractFirstImageFromMarkdown = (md) => {
        if (!md) return null;
        const match = md.match(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/);
        return match ? match[1] : null;
    };

    // Extract a concise summary from README (first non-heading, non-badge paragraph)
    const extractSummaryFromMarkdown = (md, maxLen = 180) => {
        if (!md) return null;
        // Remove code blocks
        md = md.replace(/```[\s\S]*?```/g, '');
        const lines = md.split(/\r?\n/);
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            if (!line) continue;
            if (line.startsWith('#')) continue; // headings
            if (line.startsWith('<')) continue; // html blocks
            if (line.includes('shields.io')) continue; // badges
            if (line.startsWith('![')) continue; // images
            // Strip markdown links/images
            line = line.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[[^\]]*\]\([^)]*\)/g, '$1');
            // Collapse whitespace
            line = line.replace(/\s+/g, ' ').trim();
            if (line) {
                if (line.length > maxLen) {
                    line = line.slice(0, maxLen - 1) + '…';
                }
                return line;
            }
        }
        return null;
    };

    // Build a raw URL for a relative path in README
    const buildRawUrl = (repo, relPath, branch) => `https://raw.githubusercontent.com/${username}/${repo.name}/${branch}/${relPath.replace(/^\.\//, '')}`;

    const fetchReadmeData = async (repo) => {
        if (readmeCache.has(repo.name)) return readmeCache.get(repo.name);
        const url = `https://api.github.com/repos/${username}/${repo.name}/readme`;
        const key = `gh:readme:${username}:${repo.name}:v1`;
        const cached = cacheGet(key);
        if (cached && (cached.summary || cached.imageUrl)) {
            readmeCache.set(repo.name, cached);
            return cached;
        }
        try {
            const res = await fetch(url, { headers: { Accept: 'application/vnd.github.v3.raw' } });
            if (!res.ok) throw new Error('README fetch failed');
            // With Accept: raw, we directly get markdown content
            const md = await res.text();
            const summary = extractSummaryFromMarkdown(md);
            let img = extractFirstImageFromMarkdown(md);
            // If image is relative, try main then master
            if (img && !/^https?:\/\//i.test(img)) {
                const mainUrl = buildRawUrl(repo, img, 'main');
                const masterUrl = buildRawUrl(repo, img, 'master');
                const ok = await new Promise(async (resolve) => {
                    const t = (u) => new Promise((r) => {
                        const im = new Image();
                        const timer = setTimeout(() => { im.src = ''; r(false); }, 2000);
                        im.onload = () => { clearTimeout(timer); r(true); };
                        im.onerror = () => { clearTimeout(timer); r(false); };
                        im.src = u;
                    });
                    if (await t(mainUrl)) return resolve(mainUrl);
                    if (await t(masterUrl)) return resolve(masterUrl);
                    resolve(false);
                });
                if (ok) img = ok; else img = null;
            }
            const data = { summary, imageUrl: img };
            readmeCache.set(repo.name, data);
            cacheSet(key, data, 12 * 60 * 60 * 1000); // 12 hours
            return data;
        } catch (e) {
            const data = { summary: null, imageUrl: null };
            readmeCache.set(repo.name, data);
            return data;
        }
    };

    // Try to find an image inside the repo (common paths). Returns a URL or null.
    const resolveRepoImage = async (repo) => {
        const branches = ['main', 'master'];
        const candidates = [
            'preview.png', 'preview.jpg', 'banner.png', 'banner.jpg',
            'screenshot.png', 'screenshot.jpg', 'docs/cover.png', 'docs/cover.jpg',
            'assets/cover.png', 'assets/cover.jpg', 'images/cover.jpg', 'images/cover.png'
        ];
        const tryLoad = (url, timeout = 2500) => new Promise((resolve) => {
            const img = new Image();
            const timer = setTimeout(() => { img.src = ''; resolve(false); }, timeout);
            img.onload = () => { clearTimeout(timer); resolve(true); };
            img.onerror = () => { clearTimeout(timer); resolve(false); };
            img.referrerPolicy = 'no-referrer';
            img.src = url;
        });
        for (const br of branches) {
            for (const path of candidates) {
                const raw = `https://raw.githubusercontent.com/${username}/${repo.name}/${br}/${path}`;
                // eslint-disable-next-line no-await-in-loop
                const ok = await tryLoad(raw);
                if (ok) return raw;
            }
        }
        return null;
    };

    const render = async (items) => {
        list.innerHTML = '';
        if (!items || items.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'slider-item';
            empty.innerHTML = `<div class="project-card text-center"><div class="card-content"><h3 class="title h3">No repositories found</h3><p class="section-text">Either the GitHub API is rate-limited or this user has no public repos.</p></div></div>`;
            list.appendChild(empty);
            return;
        }
        const subset = items.slice(0, 12);
        for (let i = 0; i < subset.length; i++) {
            const repo = subset[i];
            const li = document.createElement('li');
            li.className = 'slider-item';
            li.dataset.lang = repo.language || 'Other';
            const override = projectOverrides[repo.name] || {};
            const initialThumb = override.image || ogImageFor(repo);
            const desc = override.description || repo.description || 'No description provided.';
            li.innerHTML = `
                        <div class="project-card text-center" data-aos="fade-left" data-aos-delay="${200 + i * 50}" data-aos-duration="1000">
              <div class="card-banner img-holder has-before" style="--width: 1000; --height: 600;">
                <img src="${initialThumb}" width="1000" height="600" loading="lazy" class="img-cover" alt="${repo.name}">
                <a href="${repo.html_url}" class="btn btn:hover" target="_blank" rel="noopener">
                  <span class="span">Project Details</span>
                  <ion-icon name="arrow-forward" aria-hidden="true"></ion-icon>
                </a>
              </div>
              <div class="card-content">
                <p class="card-subtitle">${repo.language || 'Other'}</p>
                <h3 class="title h3">
                  <a href="${repo.html_url}" class="card-title" target="_blank" rel="noopener">${repo.name}</a>
                </h3>
                <p class="section-text">${desc}</p>
              </div>
            </div>`;
            const imgEl = li.querySelector('img.img-cover');
            const descEl = li.querySelector('.section-text');
            // Fallback if OpenGraph fails
            imgEl.addEventListener('error', () => { imgEl.src = bannerFor(repo); }, { once: true });
            list.appendChild(li);
            // Try to upgrade to an in-repo image asynchronously
            (async () => {
                try {
                    const rd = await fetchReadmeData(repo);
                    if (rd.summary && !override.description) {
                        descEl.textContent = rd.summary;
                    }
                    if (rd.imageUrl) {
                        imgEl.src = rd.imageUrl;
                    } else {
                        const url = await resolveRepoImage(repo);
                        if (url) imgEl.src = url;
                    }
                } catch { }
            })();
        }
        // Ensure AOS recognizes newly added elements so they become visible
        if (window.AOS) {
            try {
                // small timeout to allow DOM paint before refresh
                setTimeout(() => {
                    if (typeof AOS.refreshHard === 'function') {
                        AOS.refreshHard();
                    } else if (typeof AOS.refresh === 'function') {
                        AOS.refresh();
                    }
                }, 50);
            } catch { }
        }
    };

    await render(repos);

    // Filter interactions
    filtersWrap.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        filtersWrap.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        if (f === 'All') return void render(repos);
        void render(repos.filter(r => (r.language || 'Other') === f));
    });
})();

// -------- Tech Stack from GitHub + manual --------
(async function initTechStack() {
    const wrap = document.getElementById('tech-stack-list');
    const bioEl = document.querySelector('[data-profile-bio]');
    if (!wrap) return;

    const username = 'Yiheyistm';
    const cacheKeyRepos = `gh:repos:${username}:v1`;
    const cacheKeyUser = `gh:user:${username}:v1`;
    const reposTTL = 60 * 60 * 1000; // 1 hour
    const userTTL = 12 * 60 * 60 * 1000; // 12 hours
    try {
        let repos = cacheGet(cacheKeyRepos);
        let user = cacheGet(cacheKeyUser);
        if (!Array.isArray(repos)) {
            const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
            repos = await reposRes.json();
            if (Array.isArray(repos)) cacheSet(cacheKeyRepos, repos, reposTTL);
        }
        if (!user || !user.login) {
            const userRes = await fetch(`https://api.github.com/users/${username}`);
            user = await userRes.json();
            if (user && user.login) cacheSet(cacheKeyUser, user, userTTL);
        }
        if (user?.bio && bioEl) bioEl.textContent = user.bio;
        const langs = new Set();
        if (Array.isArray(repos)) {
            repos.forEach(r => { if (r.language) langs.add(r.language); });
        }
        // Manual additions commonly used per repo hints
        ['HTML', 'CSS', 'JavaScript', 'Dart', 'Flutter', 'Node.js', 'MongoDB', 'Firebase', 'MySQL', 'Appwrite'].forEach(l => langs.add(l));

        const frag = document.createDocumentFragment();
        Array.from(langs).sort().forEach(l => {
            const span = document.createElement('span');
            span.className = 'badge';
            span.textContent = l;
            frag.appendChild(span);
        });
        wrap.appendChild(frag);
    } catch (e) {
        ['HTML', 'CSS', 'JavaScript', 'Dart', 'Flutter', 'Node.js', 'MongoDB', 'Firebase', 'MySQL', 'Appwrite'].forEach(l => {
            const span = document.createElement('span');
            span.className = 'badge';
            span.textContent = l;
            wrap.appendChild(span);
        });
    }
})();

// -------- Dynamic Skills (UI + content) --------
(async function initSkills() {
    const skillsList = document.getElementById('skills-list');
    if (!skillsList) return;

    const username = 'Yiheyistm';
    let repos = [];
    const cacheKeyRepos = `gh:repos:${username}:v1`;
    const reposTTL = 60 * 60 * 1000; // 1 hour
    try {
        const cached = cacheGet(cacheKeyRepos);
        if (Array.isArray(cached) && cached.length) {
            repos = cached;
        } else {
            const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
            repos = await res.json();
            if (Array.isArray(repos)) cacheSet(cacheKeyRepos, repos, reposTTL);
        }
        if (!Array.isArray(repos)) repos = [];
    } catch (e) {
        repos = [];
    }

    // Compute simple weights by language occurrence
    const counts = repos.reduce((acc, r) => {
        const lang = r.language || 'Other';
        acc[lang] = (acc[lang] || 0) + 1;
        return acc;
    }, {});

    // Map languages/tools to categories and set baseline
    const catalog = {
        Frontend: ['HTML', 'CSS', 'JavaScript'],
        Mobile: ['Dart', 'Flutter'],
        Backend: ['Node.js', 'Python'],
        Databases: ['MongoDB', 'MySQL', 'Firebase', 'Appwrite'],
        Tools: ['Git', 'GitHub', 'Figma']
    };

    // Merge detected languages into catalog Tools if uncategorized
    Object.keys(counts).forEach(l => {
        const known = Object.values(catalog).some(arr => arr.includes(l));
        if (!known && l !== 'Other' && l !== 'Jupyter Notebook') {
            catalog.Tools.push(l);
        }
    });

    const toPercent = (label) => {
        const base = counts[label] || 0;
        // Normalize to 30–95% range, higher for frequent languages
        const max = Math.max(1, ...Object.values(counts));
        return Math.round(30 + (base / max) * 65);
    };

    const renderSkill = (name, percent) => {
        const li = document.createElement('li');
        li.className = 'skill-item';
        li.innerHTML = `
          <div class="skill-wrapper">
            <span class="span">${name}</span>
            <span class="value" data-progress-value="${percent}">${percent}%</span>
          </div>
          <div class="progress-bar"><div class="progress-fill" style="--width: ${percent}%"></div></div>`;
        return li;
    };

    // Render categories grouped
    const frag = document.createDocumentFragment();
    Object.entries(catalog).forEach(([category, skills]) => {
        // Category header
        const header = document.createElement('li');
        header.className = 'skill-category';
        header.innerHTML = `<h4 class="h5">${category}</h4>`;
        frag.appendChild(header);
        skills.forEach(s => frag.appendChild(renderSkill(s, toPercent(s))));
    });
    skillsList.innerHTML = '';
    skillsList.appendChild(frag);
})();
