// ==UserScript==
// @name         GitHub Enhanced
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Enhance GitHub with advanced UI tweaks, PR tools, quick actions, and performance boosts.
// @author       Onyx-i7
// @match        https://github.com/*
// @match        https://*.github.com/*
// @run-at       document-idle
// @icon         http://github.com/favicon.ico
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addValueChangeListener
// @grant        GM_addElement
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @connect      github.com
// @connect      api.github.com
// @connect      raw.githubusercontent.com
// @require      https://github.com/Onyx-i7/GitHub-Enhanced/releases/download/deps-1.0.0/config.min.js
// @resource     catppuccin-associations https://github.com/Onyx-i7/GitHub-Enhanced/raw/refs/heads/main/dependencies/associations.json
// @resource     catppuccin-icons https://github.com/Onyx-i7/GitHub-Enhanced/raw/refs/heads/main/dependencies/icons.json
// @resource     catppuccin-palette https://github.com/Onyx-i7/GitHub-Enhanced/raw/refs/heads/main/dependencies/palette.json
// @downloadURL  https://github.com/Onyx-i7/GitHub-Enhanced/blob/main/github-enhanced.user.js
// @updateURL    https://github.com/Onyx-i7/GitHub-Enhanced/blob/main/github-enhanced.user.js
// ==/UserScript==

(function () {
    "use strict";
    const { name, version } = GM_info.script;
    const idPrefix = "ghp-";
    const topDomain = location.hostname.split(".").slice(-2).join(".");
    const officialDomain = "github.com";
    const themeColor = "#f78166";
    const expandedAssetsRegex = new RegExp(
        `https://${topDomain.replaceAll(".", "\\.")}/([^/]+)/([^/]+)/releases/expanded_assets/([^/]+)`,
    );
    let releaseData = {};
    let rateLimit = { limit: -1, remaining: -1, reset: -1 };

    // ==========================================
    // CONFIGURATION
    // ==========================================
    const configDesc = {
        $default: { autoClose: false },
        appearance: {
            name: "🎨 Appearance & UI",
            type: "folder",
            items: {
                dashboard: { name: "📰 Dashboard Layout", title: "Configures the main dashboard layout and visibility of feeds.", type: "enum", options: ["Default", "Hide Copilot", "Hide Feed", "Mobile-Like"] },
                leftSidebar: { name: "↖️ Left Sidebar", title: "Configures the visibility of the left sidebar on the dashboard.", type: "enum", options: ["Default", "Hidden"] },
                rightSidebar: { name: "↗️ Right Sidebar", title: "Configures the visibility of the right sidebar on the dashboard.", type: "enum", options: ["Default", "Hide 'Latest changes'", "Hide 'Explore repositories'", "Hide Completely"] },
                stickyAvatar: { name: "📌 Sticky Avatars", title: "Makes user avatars stick to the top of the screen when scrolling through issues and PRs.", type: "bool", value: false },
                stickyMore: { name: "📌 Sticky Headers", title: "Makes issue and comment headers sticky when scrolling.", type: "bool", value: false },
                hideHeaderUnderline: { name: "🫥 Hide Header Underline", title: "Removes the bottom border of Markdown headings for a cleaner look.", type: "bool", value: false },
                visibleDetails: { name: "👁️ Visible Details", title: "Adds indentation and borders to <details> elements to make them stand out.", type: "bool", value: false },
                catppuccinIcons: { name: "🐱 Catppuccin Icons", title: "Replaces default file/folder icons with beautiful Catppuccin icons (Requires page refresh).", type: "enum", options: ["🚫 Default", "🌻 Latte", "🪴 Frappé", "🌺 Macchiato", "🌿 Mocha"] },
            },
        },
        code: {
            name: "💻 Code & Markdown",
            type: "folder",
            items: {
                tabSize: { name: "➡️ Tab Size", title: "Sets the indentation size for code blocks.", type: "int", min: 1, value: 4 },
                cursorBlink: { name: "😉 Cursor Blink", title: "Enables a blinking effect for the code navigation cursor.", type: "bool", value: false },
                cursorAnimation: { name: "🌊 Cursor Animation", title: "Makes the code navigation cursor move smoothly between lines.", type: "bool", value: false },
                fullWidth: { name: "🔲 Full Width Code", title: "Expands code blocks to use the full available width.", type: "bool", value: false },
                hideReadonlyTip: { name: "🫥 Hide Readonly Tip", title: "Hides the 'Code view is read-only.' notification in code blocks.", type: "bool", value: false },
            },
        },
        prAndDiffs: {
            name: "🔀 Pull Requests & Diffs",
            type: "folder",
            items: {
                expandAllDiffs: { name: "📂 Expand All Diffs", title: "Automatically expands all collapsed diff files in Pull Requests.", type: "bool", value: false },
                hideLockFiles: { name: "🔒 Hide Lock Files", title: "Hides package-lock.json, yarn.lock, etc. in PRs to reduce clutter (adds a toggle button).", type: "bool", value: true },
            },
        },
        quickActions: {
            name: "🚀 Quick Actions",
            type: "folder",
            items: {
                openInVSCode: { name: "💻 Open in VS Code", title: "Adds a button to open the current repository directly in VS Code for the Web (vscode.dev).", type: "bool", value: true },
                quickClone: { name: "📋 Quick Clone", title: "Adds a button to quickly copy the repository HTTPS clone URL to your clipboard.", type: "bool", value: true },
            },
        },
        release: {
            name: "📦 Releases",
            type: "folder",
            items: {
                uploader: { name: "⬆️ Show Uploader", title: "Displays the username of the person who uploaded each release asset.", type: "bool", value: true },
                downloads: { name: "📥 Show Downloads", title: "Displays the download count for each release asset.", type: "bool", value: true },
                histogram: { name: "📊 Download Histogram", title: "Shows a visual bar chart of download counts for release assets.", type: "bool", value: false },
                hideArchives: { name: "🫥 Hide Source Archives", title: "Hides the default source code archives (zip, tar.gz) to focus on custom assets.", type: "bool", value: false },
            },
        },
        additional: {
            name: "🛡️ Privacy, Performance & Info",
            type: "folder",
            items: {
                extendedUserInfo: { name: "👤 Extended User Info", title: "Shows extra details on user profiles (public repos/gists count, join date, node ID).", type: "bool", value: false },
                extendedRepoInfo: { name: "📁 Extended Repo Info", title: "Shows extra details in the repo sidebar (size, created/updated/pushed dates, node ID).", type: "bool", value: false },
                trackingPrevention: {
                    name: "🎭 Tracking Prevention",
                    title: () => `Blocks GitHub's internal analytics and telemetry. (Blocked ${GM_getValue("trackingPrevented", 0)} times)`,
                    type: "bool",
                    value: true,
                },
                lazyLoadAvatars: { name: "🖼️ Lazy Load Avatars", title: "Defers loading of off-screen avatars to significantly improve page load speed.", type: "bool", value: true },
            },
        },
        shortcutsAndFocus: {
            name: "⌨️ Shortcuts & Focus Mode",
            type: "folder",
            items: {
                enabledShortcuts: { name: "🎹 Global Shortcuts", title: "Enables keyboard shortcuts (e.g., 'g r' for repo, 'g i' for issues, 'g p' for PRs).", type: "bool", value: true },
                focusModeButton: { name: "🧘 Focus Mode Button", title: "Adds a floating button to hide all distractions (sidebars, headers, footers).", type: "bool", value: false },
            },
        },
        uiCleaner: {
            name: "🧹 UI Cleaner",
            type: "folder",
            items: {
                hideSponsors: { name: "💸 Hide Sponsors Banner", title: "Hides the GitHub Sponsors widget in the sidebar to save space.", type: "bool", value: false },
                hideCopilot: { name: "🤖 Hide Copilot Ads", title: "Hides promotional banners and widgets for GitHub Copilot.", type: "bool", value: false },
            },
        },
        advanced: {
            name: "⚙️ Advanced Settings",
            type: "folder",
            items: {
                token: { name: "🔑 Personal Access Token", title: "Your GitHub PAT (starts with `github_pat_`). Used to increase API rate limits.", type: "str" },
                rateLimit: { name: "📈 View Rate Limit", title: "Click to view your current GitHub API rate limit status.", type: "action" },
                debug: { name: "🐞 Debug Mode", title: "Enables verbose logging in the browser console for troubleshooting.", type: "bool", value: false },
            },
        },
    };
    const config = new GM_config(configDesc);

    // ==========================================
    // HELPER FUNCTIONS
    // ==========================================
    function injectCSS(id, css) {
        const style = document.head.appendChild(document.createElement("style"));
        style.id = idPrefix + id;
        style.textContent = css;
        return style;
    }
    function cssHelper(id, enable) {
        const current = document.getElementById(idPrefix + id);
        if (current) current.disabled = !enable;
        else if (enable) injectCSS(id, dynamicStyles[id]);
    }
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    function log(...args) {
        if (config.get("advanced.debug")) console.log(`%c[${name}]%c`, `color:${themeColor};`, "color: unset;", ...args);
    }
    function warn(...args) {
        console.warn(`%c[${name}]%c`, `color:${themeColor};`, "color: unset;", ...args);
    }
    function fixDomain(url) {
        return topDomain === officialDomain ? url : url.replace(`https://${officialDomain}/`, `https://${topDomain}/`);
    }
    async function fetchWithToken(url, options) {
        const token = config.get("advanced.token");
        if (token) {
            if (!options) options = {};
            if (!options.headers) options.headers = {};
            options.headers.accept = "application/vnd.github+json";
            options.headers["X-GitHub-Api-Version"] = "2022-11-28";
            options.headers.Authorization = `Bearer ${token}`;
        }
        const r = await fetch(url, options);
        function parseRateLimit(suffix, defaultValue = -1) {
            const parsed = parseInt(r.headers.get(`X-RateLimit-${suffix}`));
            return isNaN(parsed) ? defaultValue : parsed;
        }
        for (const key of Object.keys(rateLimit)) rateLimit[key] = parseRateLimit(key);
        const resetDate = new Date(rateLimit.reset * 1000).toLocaleString();
        log(`Rate limit: remaining ${rateLimit.remaining}/${rateLimit.limit}, resets at ${resetDate}`);
        if (r.status === 403 || r.status === 429) throw new Error(`Rate limit exceeded! Will reset at ${resetDate}`);
        else if (rateLimit.remaining === 0) warn(`Rate limit has been exhausted! Will reset at ${resetDate}`);
        return r;
    }

    // ==========================================
    // CSS & APPEARANCE FEATURES
    // ==========================================
    const dynamicStyles = {
        "code.cursorBlink":
            "[data-testid='navigation-cursor'] { animation: blink 1s step-end infinite; }",
        "code.cursorAnimation":
            "[data-testid='navigation-cursor'] { transition: top 0.1s ease-in-out, left 0.1s ease-in-out; }",
        "code.fullWidth": "#copilot-button-positioner { padding-right: 0; }",
        "code.hideReadonlyTip":
            "[class^='CodeBlob-module__cursorContainer__'] .position-absolute.color-bg-subtle { display: none; }",
        "appearance.stickyAvatar": `
            .pull-discussion-timeline .TimelineItem-avatar {
                position: relative;
                margin-left: -40px;
                left: -32px;
                & > a[data-hovercard-type='user'], & > a[href^="/apps/"], & > img.avatar {
                    position: sticky;
                    top: 5em;
                }
            }
            #issue-timeline [class*='Avatar-module__avatarOuter__'] {
                position: sticky;
                top: 3em;
            }
            [data-testid='issue-viewer-issue-container'] [class*='Avatar-module__avatarOuter__'] {
                position: sticky;
                top: 4em;
            }
            /* .page-responsive .timeline-comment--caret {
                &::before, &::after {
                    position: sticky;
                    top: 4em;
                    margin-top: -1em;
                    transform: translate(-0.5em, 2em);
                }
            } */
        `,
        "appearance.stickyMore": `
            .react-issue-body [class^='IssueBodyHeader-module__IssueBodyHeaderContainer__'],
            .react-issue-comment [data-testid="comment-header"]
            { position: sticky; top: 4em; z-index: 1; backdrop-filter: brightness(0.1); }
            .timeline-comment-group .timeline-comment-header
            { position: sticky; top: 5em; z-index: 1; backdrop-filter: brightness(0.1); }`,
            .timeline-comment-group .timeline-comment-header
            { position: sticky; top: 5em; z-index: 1; backdrop-filter: brightness(0.1); }`,
        "appearance.hideHeaderUnderline": `.markdown-heading > .heading-element { border-bottom: none; }`,
        "appearance.visibleDetails": `
            .markdown-body details {
                padding: 0 1em; /* Indent content */
                border: 1px solid var(--borderColor-default,var(--color-border-default));
                border-radius: 0.5em;

                > summary {
                    padding: 0.5em 1em; /* Enlarge clickable area */
                    margin: 0 -1em; /* Align summary with content edges */
                }

                &:open {
                    > summary {
                        margin: 0 -1em 1em -1em; /* Gap between summary and content */
                        border-bottom: 1px dashed var(--borderColor-default,var(--color-border-default)); /* Nice little separator */
                    }
                }
            }
        `,
    };
    for (const prop in dynamicStyles) cssHelper(prop, config.get(prop));

    function tabSize(size) {
        const id = idPrefix + "tabSize";
        const style = document.getElementById(id) ?? injectCSS(id, "");
        style.textContent = `pre, code { tab-size: ${size}; }`;
    }

    const enumStyles = {
        "appearance.dashboard": [
            "/* Default */",
            "/* Hide Copilot */ #dashboard > .news > .copilotPreview__container { display: none; }",
            "/* Hide Feed */ #dashboard > .news > feed-container { display: none; }",
            `/* Mobile-Like */ .application-main > div > aside[aria-label="Account context"] { display: block !important; }
            #dashboard > .news { > .copilotPreview__container { display: none; } > feed-container { display: none; } > .d-block.d-md-none { display: block !important; } }`,
        ],
        "appearance.leftSidebar": ["/* Default */", "/* Hidden */ .application-main .feed-background > aside.feed-left-sidebar { display: none; }"],
        "appearance.rightSidebar": [
            "/* Default */",
            "/* Hide 'Latest changes' */ aside.feed-right-sidebar > .dashboard-changelog { display: none; }",
            "/* Hide 'Explore repositories' */ aside.feed-right-sidebar > [aria-label='Explore repositories'] { display: none; }",
            "/* Hide Completely */ aside.feed-right-sidebar { display: none; }",
        ],
    };
    function enumStyleHelper(id, mode) {
        const style = document.getElementById(idPrefix + id) ?? injectCSS(id, "");
        style.textContent = enumStyles[id][mode];
    }
    for (const prop in enumStyles) enumStyleHelper(prop, config.get(prop));

    // ==========================================
    // CATPPUCCIN ICONS
    // ==========================================
    const flavors = ["default", "latte", "frappe", "macchiato", "mocha"];
    const flavor = flavors[config.get("appearance.catppuccinIcons")];
    const catppuccinPalette = JSON.parse(GM_getResourceText("catppuccin-palette"));
    function updateCatppuccinColors(flavor = "mocha") {
        const id = "ghp-catppuccin-icons-css-variables";
        let styleEl = $(`#${id}`);
        if (!styleEl) { styleEl = document.createElement("style"); styleEl.setAttribute("id", id); document.documentElement.appendChild(styleEl); }
        if (flavor === "default") { styleEl.textContent = ""; return; }
        const colors = catppuccinPalette[flavor];
        const vars = Object.entries(colors).map(([name, hex]) => `  --ctp-${name}: ${hex};`).join("\n");
        styleEl.textContent = `:root {\n${vars}\n}`;
    }
    updateCatppuccinColors(flavor);
    const associations = JSON.parse(GM_getResourceText("catppuccin-associations"));
    const icons = JSON.parse(GM_getResourceText("catppuccin-icons"));
    function getIconName(filename, filetype = "file") {
        if (filetype === "submodule") return "folder_git";
        if (filetype === "folder" || filetype === "folder-open") {
            let iconName = "_folder";
            if (filename in associations.folderNames) iconName = associations.folderNames[filename];
            else if (filename.toLowerCase() in associations.folderNames) iconName = associations.folderNames[filename.toLowerCase()];
            return filetype === "folder-open" ? iconName + "_open" : iconName;
        }
        if (filename in associations.fileNames) return associations.fileNames[filename];
        if (filename.toLowerCase() in associations.fileNames) return associations.fileNames[filename.toLowerCase()];
        const fileExtensions = [];
        if (filename.length <= 255) for (let i = 0; i < filename.length; i++) if (filename[i] === ".") fileExtensions.push(filename.toLowerCase().slice(i + 1));
        for (const ext of fileExtensions) {
            if (ext in associations.fileExtensions) return associations.fileExtensions[ext];
            if (ext in associations.languageIds) return associations.languageIds[ext];
        }
        return "_file";
    }
    const iconClass = "ghp-catppuccin-icon";
    const selectors = [
        { rows: ".react-directory-row .react-directory-filename-column", icon: "svg.octicon", filename: ".react-directory-filename-cell a" },
        { rows: "#folder-row-0 a", icon: "svg.octicon", filename: "div" },
        { rows: ".PRIVATE_TreeView-item > .PRIVATE_TreeView-item-container > .PRIVATE_TreeView-item-content", icon: ".PRIVATE_TreeView-item-visual svg.octicon", filename: ".PRIVATE_TreeView-item-content-text" },
    ];
    injectCSS("catppuccin-icons-hide", ".ghp-catppuccin-icon + svg.octicon { display: none; }");
    function updateIcons(body = document.body) {
        if (config.get("appearance.catppuccinIcons") === 0) return;
        selectors.forEach(({ rows, icon, filename }) => {
            body.querySelectorAll(rows).forEach((row) => {
                const iconEl = row.querySelector(icon);
                const filenameEl = row.querySelector(filename);
                if (!iconEl || !filenameEl) return;
                let filetype = "file";
                if (iconEl.classList.contains("octicon-file-directory") || iconEl.classList.contains("octicon-file-directory-fill")) filetype = "folder";
                else if (iconEl.classList.contains("octicon-file-directory-open") || iconEl.classList.contains("octicon-file-directory-open-fill")) filetype = "folder-open";
                else if (iconEl.classList.contains("octicon-file-submodule")) filetype = "submodule";
                const name = filenameEl.textContent.trim();
                const iconName = getIconName(name, filetype);
                log(`${name} -> ${iconName}`);
                const svg = icons[iconName];
                const newIcon = new DOMParser().parseFromString(svg, "image/svg+xml").querySelector("svg");
                if (newIcon) {
                    newIcon.setAttribute("width", "16"); newIcon.setAttribute("height", "16"); newIcon.classList.add(iconClass);
                    row.querySelector(`.${iconClass}`)?.remove();
                    iconEl.insertAdjacentElement("beforebegin", newIcon);
                } else warn(`Icon "${iconName}" not found for file "${name}"`);
            });
        });
    }
    document.addEventListener("soft-nav:react-done", () => updateIcons());
    document.addEventListener("turbo:load", () => updateIcons());

    // ==========================================
    // RELEASE FEATURES
    // ==========================================
    async function getReleaseData(owner, repo, version) {
        if (!releaseData[owner]) releaseData[owner] = {};
        if (!releaseData[owner][repo]) releaseData[owner][repo] = {};
        if (!releaseData[owner][repo][version]) {
            const url = `https://api.${topDomain}/repos/${owner}/${repo}/releases/tags/${version}`;
            releaseData[owner][repo][version] = fetchWithToken(url).then(r => r.json()).then(data => {
                const assets = {};
                for (const asset of data.assets) assets[fixDomain(asset.browser_download_url)] = { downloads: asset.download_count, uploader: { name: asset.uploader.login, url: fixDomain(asset.uploader.html_url) } };
                return assets;
            });
        }
        return releaseData[owner][repo][version];
    }
    function createUploaderLink(uploader) {
        const link = document.createElement("a");
        link.href = uploader.url; link.setAttribute("class", "text-sm-left flex-auto ml-md-3 nowrap");
        if (uploader.url.startsWith(`https://${topDomain}/apps/`)) {
            link.classList.add("color-fg-success");
            const name = uploader.name.endsWith("[bot]") ? uploader.name.slice(0, -5) : uploader.name;
            link.title = `Uploaded by GitHub App @${name}`; link.textContent = `@${name}`;
        } else {
            link.classList.add("color-fg-muted");
            link.setAttribute("data-hovercard-url", `/users/${uploader.name}/hovercard`);
            link.title = `Uploaded by @${uploader.name}`; link.textContent = `@${uploader.name}`;
        }
        return link;
    }
    function createDownloadCount(downloads) {
        const downloadCount = document.createElement("span");
        downloadCount.textContent = `${downloads} DL`; downloadCount.title = `${downloads} downloads`;
        downloadCount.setAttribute("class", "color-fg-muted text-sm-left flex-shrink-0 flex-grow-0 ml-md-3 nowrap");
        return downloadCount;
    }
    function showHistogram(asset, value, max) { asset.style.setProperty("--percent", `${(value / max) * 100}%`); }
    async function addAdditionalInfoToRelease(el, info) {
        const entries = el.querySelectorAll("ul > li"); const assets = []; const hideArchives = config.get("release.hideArchives");
        entries.forEach((asset) => { if (asset.querySelector("svg.octicon-package")) assets.push(asset); else if (hideArchives) asset.remove(); });
        const relData = await getReleaseData(info.owner, info.repo, info.version);
        if (!relData) return;
        const maxDownloads = Math.max(0, ...Object.values(relData).map(asset => asset.downloads));
        assets.forEach((asset) => {
            const downloadLink = asset.children[0].querySelector("a")?.href;
            const statistics = asset.children[1];
            const assetInfo = relData[downloadLink];
            if (!assetInfo) return;
            asset.classList.add("ghp-release-asset");
            if (config.get("release.downloads")) statistics.prepend(createDownloadCount(assetInfo.downloads));
            if (config.get("release.uploader")) statistics.prepend(createUploaderLink(assetInfo.uploader));
            if (config.get("release.histogram") && maxDownloads > 0 && assets.length > 1) showHistogram(asset, assetInfo.downloads, maxDownloads);
        });
    }
    function onFragmentReplace(event) {
        const match = expandedAssetsRegex.exec(event.target.src);
        if (!match) return;
        const [_, owner, repo, version] = match;
        for (const child of event.detail.fragment.children) addAdditionalInfoToRelease(child, { owner, repo, version });
    }
    function setupReleaseListeners() {
        if (!config.get("release.downloads") && !config.get("release.uploader") && !config.get("release.histogram")) return;
        document.querySelectorAll('[data-hpc] details[data-view-component="true"] include-fragment').forEach((fragment) => {
            if (!fragment.hasAttribute("data-ghp-listening")) {
                fragment.toggleAttribute("data-ghp-listening", true);
                fragment.addEventListener("include-fragment-replace", onFragmentReplace, { once: true });
                if (config.get("release.hideArchives")) {
                    const summary = fragment.parentElement.previousElementSibling;
                    if (summary?.tagName === "SUMMARY" && summary.firstElementChild.textContent === "Assets") {
                        const counter = summary.querySelector("span.Counter");
                        if (counter) { const count = parseInt(counter.textContent) - 2; counter.textContent = count.toString(); counter.title = count.toString(); }
                    }
                }
            }
        });
    }
    if (location.hostname === topDomain) {
        document.addEventListener("DOMContentLoaded", setupReleaseListeners, { once: true });
        document.addEventListener("turbo:load", setupReleaseListeners);
        injectCSS("release", `
            @media (min-width: 1012px) { .ghp-release-asset .col-lg-6 { width: 40%; } }
            .nowrap { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .ghp-release-asset { background: linear-gradient(to right, var(--bgColor-accent-muted) var(--percent, 0%), transparent 0); }
        `);
    }

    // ==========================================
    // EXTENDED USER & REPO INFO
    // ==========================================
    const octicons = {
        repo: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path></svg>',
        calendar: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0ZM2.5 7.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V7.5Zm10.75-4H2.75a.25.25 0 0 0-.25.25V6h11V3.75a.25.25 0 0 0-.25-.25Z"></path></svg>',
        id_badge: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M3 7.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-3Zm10 .25a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1 0-1.5h4.5a.75.75 0 0 1 .75.75ZM10.25 11a.75.75 0 0 0 0-1.5h-2.5a.75.75 0 0 0 0 1.5h2.5Z"></path><path d="M7.25 0h1.5c.966 0 1.75.784 1.75 1.75V3h3.75c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25v-8.5C0 3.784.784 3 1.75 3H5.5V1.75C5.5.784 6.284 0 7.25 0Zm3.232 4.5A1.75 1.75 0 0 1 8.75 6h-1.5a1.75 1.75 0 0 1-1.732-1.5H1.75a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25ZM7 1.75v2.5c0 .138.112.25.25.25h1.5A.25.25 0 0 0 9 4.25v-2.5a.25.25 0 0 0-.25-.25h-1.5a.25.25 0 0 0-.25.25Z"></path></svg>',
        file_zip: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M3.5 1.75v11.5c0 .09.048.173.126.217a.75.75 0 0 1-.752 1.298A1.748 1.748 0 0 1 2 13.25V1.75C2 .784 2.784 0 3.75 0h5.586c.464 0 .909.185 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v8.586A1.75 1.75 0 0 1 12.25 15h-.5a.75.75 0 0 1 0-1.5h.5a.25.25 0 0 0 .25-.25V4.664a.25.25 0 0 0-.073-.177L9.513 1.573a.25.25 0 0 0-.177-.073H7.25a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5h-3a.25.25 0 0 0-.25.25Zm3.75 8.75h.5c.966 0 1.75.784 1.75 1.75v3a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1-.75-.75v-3c0-.966.784-1.75 1.75-1.75ZM6 5.25a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 6 5.25Zm.75 2.25h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM8 6.75A.75.75 0 0 1 8.75 6h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 8 6.75ZM8.75 3h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM8 9.75A.75.75 0 0 1 8.75 9h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 8 9.75Zm-1 2.5v2.25h1v-2.25a.25.25 0 0 0-.25-.25h-.5a.25.25 0 0 0-.25.25Z"></path></svg>',
    };
    function relativeTime(timestamp) {
        const date = new Date(timestamp);
        return `<relative-time prefix="" datetime="${date.toISOString()}">${date.toLocaleString()}</relative-time>`;
    }
    function extendedUserInfo() {
        const profile = $(".js-profile-editable-replace .js-profile-editable-area > ul.vcard-details");
        const username = $("meta[property='profile:username']")?.content;
        if (!profile || !username || profile.querySelector(".ghp-extended-user-info")) return;
        const fetchPromise = fetchWithToken(`https://api.${topDomain}/users/${username}`).then(r => r.json()).catch(() => null);
        function addInfoRow(icon_name, name, lambda) {
            const row = document.createElement("li");
            row.classList.add("vcard-detail", "pt-1", "ghp-extended-user-info");
            row.innerHTML = `${octicons[icon_name] || ""}<span>${name}: Loading...</span>`;
            row.querySelector("svg")?.classList.add("octicon");
            profile.appendChild(row);
            fetchPromise.then(info => {
                const span = row.querySelector("span");
                span.innerHTML = info ? `${name}: ${lambda(info)}` : `${name}: Error`;
            });
        }
        addInfoRow("repo", "Public", (info) => {
            const repos = `<a href="/${username}?tab=repositories" class="Link--primary wb-break-all">${info.public_repos} repo${info.public_repos !== 1 ? "s" : ""}</a>`;
            const gists = `<a href="https://gist.github.com/${username}" class="Link--primary wb-break-all" target="_blank">${info.public_gists} gist${info.public_gists !== 1 ? "s" : ""}</a>`;
            return `${repos}, ${gists}`;
        });
        addInfoRow("calendar", "Joined", (info) => relativeTime(info.created_at));
        addInfoRow("calendar", "Updated", (info) => relativeTime(info.updated_at));
        addInfoRow("id_badge", "Node ID", (info) => info.node_id);
    }
    if (config.get("additional.extendedUserInfo")) {
        document.addEventListener("soft-nav:end", extendedUserInfo);
        document.addEventListener("turbo:load", extendedUserInfo);
    }
    injectCSS("extended-repo-info", ".ghp-extended-repo-info { color: var(--fgColor-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }");
    function extendedRepoInfo() {
        const repoSidebar = $("[data-partial-name='codeViewRepoRoute.Sidebar']");
        const properties = repoSidebar?.querySelector(".hide-sm.hide-md");
        const repoLink = $("#code-view-repo-link");
        if (!properties || !repoLink) return;
        const repoName = repoLink.getAttribute("href").slice(1);
        if (properties.dataset.ghpExtendedRepoInfo === repoName) return;
        properties.dataset.ghpExtendedRepoInfo = repoName;
        properties.querySelectorAll(".ghp-extended-repo-info").forEach(el => el.remove());
        const reportBtn = properties.querySelector("a[href^='/contact/report-content']");
        const fetchPromise = fetchWithToken(`https://api.${topDomain}/repos/${repoName}`).then(r => r.json()).catch(() => null);
        function addRow(icon_name, name, html_cb, title_cb = null) {
            const h3 = document.createElement("h3");
            h3.classList.add("sr-only", "ghp-extended-repo-info"); h3.textContent = name;
            const container = document.createElement("div");
            container.classList.add("mt-2", "ghp-extended-repo-info");
            const entry = document.createElement("span");
            entry.innerHTML = `${octicons[icon_name] || ""} Loading...`;
            entry.querySelector("svg")?.classList.add("octicon", "mr-2");
            entry.title = name; container.appendChild(entry);
            if (reportBtn) { reportBtn.insertAdjacentElement("beforebegin", h3); reportBtn.insertAdjacentElement("beforebegin", container); }
            else { properties.appendChild(h3); properties.appendChild(container); }
            fetchPromise.then(info => {
                if (info) { entry.innerHTML = `${octicons[icon_name] || ""} ${html_cb(info)}`; if (title_cb) entry.title = title_cb(info); }
                else entry.textContent = `${octicons[icon_name] || ""} Error`;
                entry.querySelector("svg")?.classList.add("octicon", "mr-2");
            });
        }
        function formatRepoSize(sizeInKb) {
            const units = ["KB", "MB", "GB", "TB"]; let size = sizeInKb; let unitIndex = 0;
            while (size >= 1024 && unitIndex < units.length - 1) { size /= 1024; unitIndex++; }
            return `${size.toLocaleString(undefined, { maximumFractionDigits: unitIndex === 0 ? 0 : 2 })} ${units[unitIndex]}`;
        }
        addRow("file_zip", "Size", (info) => `<strong>${formatRepoSize(info.size)}</strong>`, (info) => `Size: ${info.size} KB`);
        addRow("calendar", "Created", (info) => "Created: " + relativeTime(info.created_at));
        addRow("calendar", "Updated", (info) => "Updated: " + relativeTime(info.updated_at));
        addRow("calendar", "Pushed", (info) => "Pushed: " + relativeTime(info.pushed_at));
        addRow("id_badge", "Node ID", (info) => info.node_id);
    }
    if (config.get("additional.extendedRepoInfo")) {
        document.addEventListener("soft-nav:react-done", extendedRepoInfo);
        document.addEventListener("turbo:load", () => requestAnimationFrame(extendedRepoInfo));
    }

    // ==========================================
    // PRIVACY, UI CLEANER & PERFORMANCE
    // ==========================================
    function preventTracking() {
        const elements = [...$$("meta[name^=octolytics-]"), $("meta[name=browser-stats-url]")];
        elements.forEach(el => { if (el) { el.content = ""; log("Preventing tracking:", el.name); } });
        if (elements.some(el => el)) GM_setValue("trackingPrevented", GM_getValue("trackingPrevented", 0) + 1);
    }
    if (config.get("additional.trackingPrevention")) {
        preventTracking();
        document.addEventListener("turbo:before-render", preventTracking);
        Object.defineProperty(unsafeWindow, "fetch", { writable: false });
    }

    function setupUICleaner() {
        let css = "";
        if (config.get("uiCleaner.hideSponsors")) css += ".js-sponsor-sidebar, [data-testid='sponsor-sidebar'], .BorderGrid-cell:has(.js-sponsor-list) { display: none !important; }\n";
        if (config.get("uiCleaner.hideCopilot")) css += ".copilotPreview__container, [aria-label='GitHub Copilot'], .js-copilot-banner, .copilot-preview { display: none !important; }\n";
        if (css) {
            const existing = document.getElementById(idPrefix + "ui-cleaner");
            if (existing) existing.textContent = css; else injectCSS("ui-cleaner", css);
        }
    }

    function setupPerformance() {
        if (!config.get("additional.lazyLoadAvatars")) return;
        function lazyLoad(img) { if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy"); }
        document.querySelectorAll("img.avatar").forEach(lazyLoad);
        if (!document.body.hasAttribute("data-ghp-perf-observer")) {
            document.body.setAttribute("data-ghp-perf-observer", "true");
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            if (node.tagName === "IMG" && node.classList.contains("avatar")) lazyLoad(node);
                            node.querySelectorAll?.("img.avatar").forEach(lazyLoad);
                        }
                    });
                });
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    // ==========================================
    // SHORTCUTS
    // ==========================================
    function setupShortcuts() {
        if (!config.get("shortcutsAndFocus.enabledShortcuts")) return;
        if (document.body.hasAttribute("data-ghp-shortcuts")) return;
        document.body.setAttribute("data-ghp-shortcuts", "true");
        let buffer = ""; let timeout;
        document.addEventListener("keydown", (e) => {
            const target = e.target;
            if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;
            clearTimeout(timeout);
            buffer += e.key.toLowerCase();
            timeout = setTimeout(() => { buffer = ""; }, 1000);
            const match = location.pathname.match(/^\/([^\/]+\/[^\/]+)/);
            const repoPath = match ? match[1] : "";
            if (buffer === "gr" && repoPath) window.location.href = `/${repoPath}`;
            else if (buffer === "gi" && repoPath) window.location.href = `/${repoPath}/issues`;
            else if (buffer === "gp" && repoPath) window.location.href = `/${repoPath}/pulls`;
            else if (buffer === "gc" && repoPath) window.location.href = `/${repoPath}`;
            else if (buffer === "gd") window.location.href = "https://github.com/";
            else if (buffer === "gn") window.location.href = "https://github.com/notifications";
        });
    }

    // ==========================================
    // FOCUS MODE BUTTON
    // ==========================================
    function setupFocusMode() {
        if (!config.get("shortcutsAndFocus.focusModeButton")) {
            log("Focus Mode button disabled in config");
            return;
        }
        if (document.getElementById("ghp-focus-btn")) {
            log("Focus Mode button already exists");
            return;
        }

        log("Creating Focus Mode button...");
        const btn = document.createElement("button");
        btn.id = "ghp-focus-btn";
        btn.innerHTML = "🧘";
        btn.title = "Toggle Focus Mode (hide distractions)";
        btn.style.cssText = `
            position: fixed !important;
            bottom: 24px !important;
            right: 24px !important;
            z-index: 999999 !important;
            width: 48px !important;
            height: 48px !important;
            border-radius: 50% !important;
            border: 2px solid rgba(255,255,255,0.2) !important;
            background: #1f6feb !important;
            color: #ffffff !important;
            font-size: 22px !important;
            cursor: pointer !important;
            box-shadow: 0 4px 16px rgba(31, 111, 235, 0.4) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.2s ease !important;
            padding: 0 !important;
            line-height: 1 !important;
        `;
        btn.onmouseenter = () => {
            btn.style.transform = "scale(1.15)";
            btn.style.boxShadow = "0 6px 20px rgba(31, 111, 235, 0.6)";
        };
        btn.onmouseleave = () => {
            btn.style.transform = "scale(1)";
            btn.style.boxShadow = "0 4px 16px rgba(31, 111, 235, 0.4)";
        };
        btn.onclick = () => {
            document.body.classList.toggle("ghp-focus-mode");
            const active = document.body.classList.contains("ghp-focus-mode");
            btn.innerHTML = active ? "🏃" : "🧘";
            btn.title = active ? "Exit Focus Mode" : "Enter Focus Mode";
            GM_setValue("focusModeActive", active);
            log("Focus Mode:", active ? "ON" : "OFF");
        };

        document.body.appendChild(btn);
        log("✅ Focus Mode button created and appended to body");

        if (GM_getValue("focusModeActive", false)) {
            document.body.classList.add("ghp-focus-mode");
            btn.innerHTML = "🏃";
            btn.title = "Exit Focus Mode";
        }
    }

    // ==========================================
    // QUICK ACTIONS (MEJORADO)
    // ==========================================
    function setupQuickActions() {
        if (!config.get("quickActions.openInVSCode") && !config.get("quickActions.quickClone")) {
            log("Quick Actions disabled in config");
            return;
        }

        const match = location.pathname.match(/^\/([^\/\s]+\/[^\/\s]+)/);
        if (!match) {
            log("Not a repository page, skipping Quick Actions");
            return;
        }
        const repoPath = match[1];
        log(`Repository detected: ${repoPath}`);

        if (document.getElementById("ghp-quick-actions")) {
            log("Quick Actions already exist");
            return;
        }

        let codeButton = null;
        codeButton = document.querySelector('[data-testid="code-button"]');

        if (!codeButton) {
            const buttons = Array.from(document.querySelectorAll('button, summary, a'));
            codeButton = buttons.find(el => {
                const text = el.textContent.trim();
                return text === 'Code' || text === ' code' || text.includes('Code');
            });
        }

        if (!codeButton) {
            codeButton = document.querySelector('.get-repo-btn, [data-open-app="https"], button.Button--primary');
        }

        let insertTarget = null;
        let insertMode = "after";

        if (codeButton) {
            log("✅ Found Code button:", codeButton);
            insertTarget = codeButton;
            insertMode = "after";
        } else {
            log("⚠️ Code button not found, trying fallback containers");
            insertTarget = document.querySelector(`
                .pagehead-actions,
                [data-testid="repo-overview-header"],
                .BorderGrid-row:first-child .BorderGrid-cell,
                main .d-flex,
                .repohead-details-container
            `);
            insertMode = "append";
        }

        if (!insertTarget) {
            log("⚠️ No container found, using floating button");
            insertTarget = document.body;
            insertMode = "floating";
        }

        injectQuickActions(insertTarget, repoPath, insertMode);
    }

    function injectQuickActions(container, repoPath, mode) {
        const wrapper = document.createElement("div");
        wrapper.id = "ghp-quick-actions";

        if (mode === "floating") {
            wrapper.style.cssText = `
                position: fixed !important;
                bottom: 84px !important;
                right: 24px !important;
                z-index: 999998 !important;
                display: flex !important;
                flex-direction: column !important;
                gap: 8px !important;
            `;
        } else if (mode === "after") {
            wrapper.style.cssText = `
                display: inline-flex !important;
                gap: 4px !important;
                margin-left: 8px !important;
                vertical-align: middle !important;
            `;
        } else {
            wrapper.style.cssText = `
                display: flex !important;
                gap: 6px !important;
                margin: 8px 0 !important;
            `;
        }

        // Estilo consistente con GitHub (botones secundarios)
        const btnStyle = `
            background: var(--bgColor-default, #ffffff);
            color: var(--fgColor-default, #1f2328);
            border: 1px solid var(--borderColor-default, rgba(31,35,40,0.15));
            padding: 3px 12px !important;
            border-radius: 6px !important;
            cursor: pointer;
            font-size: 12px !important;
            font-weight: 500 !important;
            text-decoration: none !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 4px !important;
            transition: all 0.1s ease !important;
            white-space: nowrap !important;
            line-height: 20px !important;
            height: 28px !important;
            box-sizing: border-box !important;
        `;

        if (config.get("quickActions.openInVSCode")) {
            const vscodeBtn = document.createElement("a");
            vscodeBtn.href = `https://vscode.dev/${repoPath}`;
            vscodeBtn.target = "_blank";
            vscodeBtn.rel = "noopener";
            vscodeBtn.style.cssText = btnStyle;
            vscodeBtn.innerHTML = "💻 VS Code";
            vscodeBtn.title = "Open in VS Code for the Web";
            vscodeBtn.onmouseenter = () => {
                vscodeBtn.style.background = "var(--bgColor-muted, #f6f8fa)";
                vscodeBtn.style.borderColor = "var(--borderColor-default, rgba(31,35,40,0.15))";
            };
            vscodeBtn.onmouseleave = () => {
                vscodeBtn.style.background = "var(--bgColor-default, #ffffff)";
                vscodeBtn.style.borderColor = "var(--borderColor-default, rgba(31,35,40,0.15))";
            };
            wrapper.appendChild(vscodeBtn);
        }

        if (config.get("quickActions.quickClone")) {
            const cloneBtn = document.createElement("button");
            cloneBtn.style.cssText = btnStyle;
            cloneBtn.innerHTML = "📋 Copy Clone";
            cloneBtn.title = "Copy HTTPS clone URL to clipboard";
            cloneBtn.onmouseenter = () => {
                cloneBtn.style.background = "var(--bgColor-muted, #f6f8fa)";
                cloneBtn.style.borderColor = "var(--borderColor-default, rgba(31,35,40,0.15))";
            };
            cloneBtn.onmouseleave = () => {
                cloneBtn.style.background = "var(--bgColor-default, #ffffff)";
                cloneBtn.style.borderColor = "var(--borderColor-default, rgba(31,35,40,0.15))";
            };
            cloneBtn.addEventListener("click", () => {
                const url = `https://github.com/${repoPath}.git`;
                navigator.clipboard.writeText(url).then(() => {
                    cloneBtn.innerHTML = "✅ Copied!";
                    setTimeout(() => { cloneBtn.innerHTML = "📋 Copy Clone"; }, 2000);
                }).catch(() => {
                    cloneBtn.innerHTML = "❌ Failed";
                    setTimeout(() => { cloneBtn.innerHTML = "📋 Copy Clone"; }, 2000);
                });
            });
            wrapper.appendChild(cloneBtn);
        }

        if (wrapper.children.length > 0) {
            if (mode === "after") {
                // Insertar justo después del botón Code
                container.parentElement.insertBefore(wrapper, container.nextSibling);
            } else {
                container.appendChild(wrapper);
            }
            log("✅ Quick Actions injected successfully");
        }
    }

    // ==========================================
    // PR ENHANCEMENTS
    // ==========================================
    function setupPREnhancements() {
        const isPRPage = /\/pull\/\d+/.test(location.pathname) || /\/compare\//.test(location.pathname);
        if (!isPRPage) {
            log("Not a PR/Compare page, skipping PR enhancements");
            return;
        }

        if (!config.get("prAndDiffs.expandAllDiffs") && !config.get("prAndDiffs.hideLockFiles")) {
            log("PR enhancements disabled in config");
            return;
        }

        log("🔀 PR page detected, setting up enhancements...");

        let attempts = 0;
        const maxAttempts = 50;

        const trySetup = () => {
            attempts++;
            const fileElements = document.querySelectorAll('.file, .js-file, [data-testid="diff-file"]');

            if (fileElements.length === 0 && attempts < maxAttempts) {
                log(`Waiting for diffs to load... (attempt ${attempts}/${maxAttempts})`);
                setTimeout(trySetup, 300);
                return;
            }

            if (fileElements.length === 0) {
                log("⚠️ No diff files found after waiting");
                return;
            }

            log(`✅ Found ${fileElements.length} diff files`);

            if (config.get("prAndDiffs.expandAllDiffs")) expandAllDiffs();
            if (config.get("prAndDiffs.hideLockFiles")) hideLockFiles();
        };

        trySetup();
    }

    function expandAllDiffs() {
        log("📂 Expanding all diffs...");
        const collapsedDiffs = document.querySelectorAll(`
            details:not([open]),
            .file:not(.open),
            .js-diff-progressive-container details
        `);

        let expanded = 0;
        collapsedDiffs.forEach(details => {
            if (!details.hasAttribute("open")) {
                details.setAttribute("open", "");
                expanded++;
                const loadBtn = details.querySelector("button.js-load-diff-button, button[type='submit']");
                if (loadBtn && !details.hasAttribute("data-ghp-expanded")) {
                    details.setAttribute("data-ghp-expanded", "true");
                    setTimeout(() => loadBtn.click(), 100);
                }
            }
        });
        log(`✅ Expanded ${expanded} diffs`);
    }

    function hideLockFiles() {
        if (document.getElementById("ghp-toggle-locks")) {
            log("Lock files toggle already exists");
            return;
        }

        const lockFilePatterns = [
            "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lockb",
            "composer.lock", "Gemfile.lock", "Cargo.lock", "poetry.lock", "Pipfile.lock"
        ];

        const lockFiles = [];
        const fileElements = document.querySelectorAll('.file, .js-file, [data-testid="diff-file"]');

        fileElements.forEach(file => {
            const nameEl = file.querySelector(`
                .file-info a, .file-header a, bdi, .js-file-link,
                [data-testid="diff-file-header"], .file-header a
            `);
            if (!nameEl) return;

            const fileName = nameEl.textContent.trim();
            const isLockFile = lockFilePatterns.some(pattern =>
                fileName === pattern || fileName.endsWith("/" + pattern)
            );

            if (isLockFile) {
                lockFiles.push(file);
                file.style.display = "none";
                file.classList.add("ghp-hidden-lock-file");
            }
        });

        if (lockFiles.length === 0) {
            log("No lock files found to hide");
            return;
        }

        log(`🔒 Hiding ${lockFiles.length} lock files`);

        const toggleBtn = document.createElement("div");
        toggleBtn.id = "ghp-toggle-locks";
        toggleBtn.style.cssText = `
            margin: 12px 0;
            padding: 10px 14px;
            background: #ddf4ff;
            border: 1px solid #54aeff66;
            border-radius: 6px;
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        const btn = document.createElement("button");
        btn.id = "ghp-toggle-locks-btn";
        btn.innerHTML = `🔓 Show ${lockFiles.length} lock file(s)`;
        btn.style.cssText = `
            background: #0969da;
            color: #ffffff;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
        `;

        const info = document.createElement("span");
        info.style.cssText = `color: #0969da; font-size: 13px; font-weight: 500;`;
        info.textContent = `${lockFiles.length} lock file(s) hidden to reduce clutter`;

        toggleBtn.appendChild(btn);
        toggleBtn.appendChild(info);

        const firstFile = fileElements[0];
        if (firstFile && firstFile.parentElement) {
            firstFile.parentElement.insertBefore(toggleBtn, firstFile);
            log("✅ Lock files toggle button injected");
        }

        let visible = false;
        btn.addEventListener("click", () => {
            visible = !visible;
            lockFiles.forEach(f => f.style.display = visible ? "" : "none");
            btn.innerHTML = visible ? `🔒 Hide ${lockFiles.length} lock file(s)` : `🔓 Show ${lockFiles.length} lock file(s)`;
        });
    }

    // ==========================================
    // INITIALIZATION & EVENT LISTENERS
    // ==========================================
    injectCSS("focus-mode", `
        body.ghp-focus-mode header,
        body.ghp-focus-mode [data-testid="header"],
        body.ghp-focus-mode aside,
        body.ghp-focus-mode .feed-right-sidebar,
        body.ghp-focus-mode .feed-left-sidebar,
        body.ghp-focus-mode footer,
        body.ghp-focus-mode [data-testid="footer"],
        body.ghp-focus-mode .BorderGrid-cell:not(:has(.markdown-body)),
        body.ghp-focus-mode .pagehead-actions { display: none !important; }
        body.ghp-focus-mode .application-main { padding-top: 0 !important; margin-top: 0 !important; }
        body.ghp-focus-mode .container-xl { max-width: 100% !important; padding: 0 20px !important; }
    `);

    function initializeFeatures() {
        log("Initializing features...");
        setupShortcuts();
        setupFocusMode();
        setupPerformance();
        setupPREnhancements();
        setupQuickActions();
    }

    setupUICleaner();

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeFeatures);
    } else {
        setTimeout(initializeFeatures, 500);
    }

    document.addEventListener("turbo:load", () => setTimeout(initializeFeatures, 500));
    document.addEventListener("soft-nav:end", () => setTimeout(initializeFeatures, 500));

    if (config.get("advanced.debug")) {
        ["turbo:load", "soft-nav:end", "soft-nav:react-done"].forEach(event => {
            document.addEventListener(event, (e) => log(`Event: ${event}`, e));
        });
    }

    const callbacks = {
        "code.tabSize": tabSize,
        "appearance.catppuccinIcons": (value) => updateCatppuccinColors(flavors[value]),
    };
    for (const [prop, callback] of Object.entries(callbacks)) callback(config.get(prop));

    config.addEventListener("get", (e) => {
        if (e.detail.prop === "advanced.rateLimit") {
            const resetDate = new Date(rateLimit.reset * 1000).toLocaleString();
            alert(`Rate limit: remaining ${rateLimit.remaining}/${rateLimit.limit}, resets at ${resetDate}.\nIf you see -1, it means the rate limit has not been fetched yet.`);
        }
    });
    config.addEventListener("set", (e) => {
        if (e.detail.prop in dynamicStyles) cssHelper(e.detail.prop, e.detail.after);
        if (e.detail.prop in enumStyles) enumStyleHelper(e.detail.prop, e.detail.after);
        if (e.detail.prop in callbacks) callbacks[e.detail.prop](e.detail.after);
        if (e.detail.prop.startsWith("uiCleaner.")) setupUICleaner();
    });

    log(`${name} v${version} has been loaded.`);
})();
