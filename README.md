# GitHub Enhanced

<div align="center">

**A professional enhancement suite for GitHub**

[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)](https://github.com/Onyx-i7/GitHub-Enhanced/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-compatible-orange.svg)](https://www.tampermonkey.net/)
[![GitHub Issues](https://img.shields.io/github/issues/Onyx-i7/GitHub-Enhanced)](https://github.com/Onyx-i7/GitHub-Enhanced/issues)
[![GitHub Stars](https://img.shields.io/github/stars/Onyx-i7/GitHub-Enhanced)](https://github.com/Onyx-i7/GitHub-Enhanced/stargazers)

[Installation](#installation) • [Features](#features) • [Configuration](#configuration) • [Technical Details](#technical-details) • [Contributing](#contributing)

</div>

---

## Overview

GitHub Enhanced is a userscript that adds professional features to GitHub's interface, focusing on **performance**, **privacy**, and **productivity**. Built with modern web standards and optimized for minimal resource usage.

### Why GitHub Enhanced?

- **Privacy-first**: Built-in tracking prevention blocks GitHub's analytics
- **Performance-optimized**: Lazy loading, efficient DOM manipulation, minimal overhead
- **Professional UI**: Clean, non-intrusive enhancements that integrate seamlessly
- **Highly configurable**: Enable only the features you need
- **Productivity-focused**: Keyboard shortcuts, quick actions, and focus mode
- **Open source**: Fully transparent, community-driven development

---

## Features

### 🚀 Quick Actions

| Feature | Description |
|---------|-------------|
| **💻 Open in VS Code** | Open the current repository directly in VS Code for the Web (vscode.dev) |
| **📋 Copy Clone** | One-click copy of the HTTPS clone URL to clipboard with visual feedback |

Smart positioning: Buttons appear next to GitHub's native "Code" button with matching styling.

### 🔀 Pull Requests & Diffs

| Feature | Description |
|---------|-------------|
| **📂 Expand All Diffs** | Automatically expand all collapsed diff files in Pull Requests |
| **🔒 Hide Lock Files** | Hide `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, and other lock files with a toggle button |

Supported lock files: `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `bun.lockb`, `composer.lock`, `Gemfile.lock`, `Cargo.lock`, `poetry.lock`, `Pipfile.lock`

### ⌨️ Keyboard Shortcuts

Global keyboard navigation for faster browsing:

| Shortcut | Action |
|----------|--------|
| `g` + `r` | Go to repository |
| `g` + `i` | Go to issues |
| `g` + `p` | Go to pull requests |
| `g` + `c` | Go to code |
| `g` + `d` | Go to dashboard |
| `g` + `n` | Go to notifications |

Smart detection: Shortcuts are disabled when typing in input fields, textareas, or contenteditable elements.

### 🧘 Focus Mode

- **Floating button** in bottom-right corner (always visible)
- **Hides distractions**: Headers, sidebars, footers, sponsor widgets
- **Persistent state**: Remembers your preference across page navigations
- **Toggle modes**: Switch between "🧘 Focus" and "🏃 Exit Focus"

### 🧹 UI Cleaner

| Feature | Description |
|---------|-------------|
| **💸 Hide Sponsors Banner** | Remove GitHub Sponsors widgets from sidebars |
| **🤖 Hide Copilot Ads** | Remove GitHub Copilot promotional banners and widgets |

### 🎨 Appearance & UI

| Feature | Description |
|---------|-------------|
| **📰 Dashboard Layout** | Customize dashboard: Hide Copilot, Hide Feed, or Mobile-Like view |
| **↖️ Left Sidebar** | Hide the left sidebar on dashboard |
| **↗️ Right Sidebar** | Hide right sidebar elements or hide completely |
| **📌 Sticky Avatars** | Keep user avatars visible while scrolling through discussions |
| **📌 Sticky Headers** | Maintain context with sticky comment and issue headers |
| **🫥 Hide Header Underline** | Remove underline from markdown headers |
| **👁️ Visible Details** | Add borders and padding to collapsible `<details>` elements |
| **🐱 Catppuccin Icons** | Replace default file/folder icons with beautiful Catppuccin themes (Latte, Frappé, Macchiato, Mocha) |

### 💻 Code & Markdown

| Feature | Description |
|---------|-------------|
| **➡️ Custom Tab Size** | Configure code block indentation (default: 4 spaces) |
| **😉 Cursor Blink** | Enable cursor blinking animation |
| **🌊 Cursor Animation** | Enable smooth cursor movement between lines |
| **🔲 Full Width Code** | Maximize code block width for better readability |
| **🫥 Hide Readonly Tip** | Hide "Code view is read-only" notification |

### 📦 Release Management

| Feature | Description |
|---------|-------------|
| **⬆️ Uploader Information** | See who uploaded each release asset |
| **📥 Download Statistics** | Display download counts for each release asset |
| **📊 Download Histogram** | Visual representation of download distribution |
| **🫥 Archive Filtering** | Hide source code archives (zip, tar.gz) from release listings |

### 🛡️ Privacy & Performance

| Feature | Description |
|---------|-------------|
| **🎭 Tracking Prevention** | Block GitHub's analytics tracking (octolytics, browser-stats) |
| **🖼️ Lazy Load Avatars** | Defer loading of off-screen avatars for faster page loads |
| **Fetch Protection** | Prevent unauthorized modification of the fetch API |
| **No External Dependencies** | All functionality is self-contained |

### 👤 Extended Information

- **User Profiles**: View additional metadata including join date, last update, public repositories count, and Node ID
- **Repository Details**: Access repository size, creation date, last update, last push, and Node ID directly from the sidebar

---

## Installation

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- A userscript manager:
  - [Tampermonkey](https://www.tampermonkey.net/) (recommended)
  - [Greasemonkey](https://addons.mozilla.org/firefox/addon/greasemonkey/) (Firefox)
  - [Violentmonkey](https://violentmonkey.github.io/)

### Installation Steps

1. Install a userscript manager for your browser
2. Click the install link below: \
[https://github.com/Onyx-i7/GitHub-Enhanced/raw/main/github-enhanced.user.js](https://github.com/Onyx-i7/GitHub-Enhanced/raw/main/github-enhanced.user.js)

3. Your userscript manager will prompt you to install the script
4. Click "Install" to confirm
5. Reload GitHub to activate the enhancements

### Manual Installation

1. Create a new script in your userscript manager
2. Copy the contents of [`github-enhanced.user.js`](github-enhanced.user.js)
3. Paste the code into the new script
4. Save and reload GitHub

---

## Configuration

Access the settings menu by clicking the GitHub Enhanced icon in your userscript manager's toolbar, or use the menu command "Settings".

### 🎨 Appearance & UI

| Setting | Default | Description |
|---------|---------|-------------|
| Dashboard Layout | Default | Configure dashboard: Default, Hide Copilot, Hide Feed, or Mobile-Like |
| Left Sidebar | Default | Hide the left sidebar on dashboard |
| Right Sidebar | Default | Hide right sidebar elements or hide completely |
| Sticky Avatars | Disabled | Keep avatars visible while scrolling |
| Sticky Headers | Disabled | Keep comment/issue headers visible |
| Hide Header Underline | Disabled | Remove underline from markdown headers |
| Visible Details | Disabled | Add borders and padding to `<details>` elements |
| Catppuccin Icons | Default | Replace file/folder icons with Catppuccin themes |

### 💻 Code & Markdown

| Setting | Default | Description |
|---------|---------|-------------|
| Custom Tab Size | Enabled (4) | Use 4-space indentation in code blocks |
| Cursor Blink | Disabled | Enable cursor blinking animation |
| Cursor Animation | Disabled | Enable smooth cursor movement |
| Full Width Code | Disabled | Remove padding from code blocks |
| Hide Readonly Tip | Disabled | Hide "Code view is read-only" notification |

### 🔀 Pull Requests & Diffs

| Setting | Default | Description |
|---------|---------|-------------|
| Expand All Diffs | Disabled | Automatically expand all collapsed diff files |
| Hide Lock Files | **Enabled** | Hide lock files with a toggle button |

### 🚀 Quick Actions

| Setting | Default | Description |
|---------|---------|-------------|
| Open in VS Code | **Enabled** | Add button to open repo in VS Code for the Web |
| Quick Clone | **Enabled** | Add button to copy HTTPS clone URL |

### 📦 Release Features

| Setting | Default | Description |
|---------|---------|-------------|
| Show Uploader | **Enabled** | Display who uploaded each release asset |
| Show Downloads | **Enabled** | Display download counts for assets |
| Show Histogram | Disabled | Show visual download distribution |
| Hide Archives | Disabled | Hide source code archives from listings |

### 🛡️ Privacy, Performance & Info

| Setting | Default | Description |
|---------|---------|-------------|
| Extended User Info | Disabled | Show additional user profile metadata |
| Extended Repo Info | Disabled | Show additional repository metadata |
| Tracking Prevention | **Enabled** | Block GitHub analytics tracking |
| Lazy Load Avatars | **Enabled** | Defer loading of off-screen avatars |

### ⌨️ Shortcuts & Focus Mode

| Setting | Default | Description |
|---------|---------|-------------|
| Global Shortcuts | **Enabled** | Enable keyboard shortcuts (g+r, g+i, etc.) |
| Focus Mode Button | Disabled | Add floating button to hide distractions |

### 🧹 UI Cleaner

| Setting | Default | Description |
|---------|---------|-------------|
| Hide Sponsors Banner | Disabled | Remove GitHub Sponsors widgets |
| Hide Copilot Ads | Disabled | Remove GitHub Copilot promotional banners |

### ⚙️ Advanced Settings

| Setting | Default | Description |
|---------|---------|-------------|
| Personal Access Token | Empty | GitHub API token for increased rate limits |
| View Rate Limit | - | Click to view current API rate limit status |
| Debug Mode | Disabled | Enable verbose logging to console |

#### Personal Access Token

To increase API rate limits (from 60 to 5,000 requests per hour):

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (for private repos) or no scopes (for public repos only)
4. Copy the token and paste it into the settings

---

## Technical Details

### Architecture

GitHub Enhanced uses a modular architecture with the following components:

- **Configuration System**: Persistent storage using GM_* API
- **CSS Injection**: Dynamic stylesheet management with proper ID tracking
- **Event Listeners**: Turbo and soft-nav event handling for SPA navigation
- **API Integration**: GitHub REST API with rate limit management
- **DOM Manipulation**: Efficient element creation with retry systems for dynamic content
- **MutationObserver**: Automatic detection of dynamically loaded elements

### Performance Considerations

- **Lazy Loading**: Features are only initialized when needed
- **Event Delegation**: Minimal event listeners using event bubbling
- **Caching**: Release data is cached to reduce API calls
- **CSS Optimization**: Styles are injected once and reused
- **Smart Selectors**: Multiple fallback selectors ensure compatibility across GitHub UI versions
- **Retry Systems**: Automatic retry for dynamically loaded content (up to 15 seconds)

### Browser Compatibility

| Browser | Status |
|---------|--------|
| Chrome | ✅ Fully supported |
| Firefox | ✅ Fully supported |
| Edge | ✅ Fully supported |
| Safari | ✅ Fully supported |
| Opera | ✅ Fully supported |

### Security

- **No External Requests**: All code is self-contained
- **Sandboxed Execution**: Runs in userscript manager's isolated context
- **No Data Collection**: Zero telemetry or analytics
- **Open Source**: Fully auditable codebase
- **CORS Protection**: Proper `@connect` directives for API requests

---

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/Onyx-i7/GitHub-Enhanced.git
cd GitHub-Enhanced

# The script is ready to use - no build step required
```

### Project Structure

```
GitHub-Enhanced/
├── github-enhanced.user.js    # Main userscript
├── README.md                  # This file
├── LICENSE                    # MIT license
```

### Testing

1. Install the script in development mode
2. Enable debug mode in settings
3. Open browser console to view logs
4. Test features across different GitHub pages
5. Check console for `[GitHub Enhanced]` log messages

---

## Contributing

Contributions are welcome! Here's how you can help:

### Reporting Bugs

1. Check existing [issues](https://github.com/Onyx-i7/GitHub-Enhanced/issues) first
2. Create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and userscript manager version
   - Console logs (enable debug mode first)

### Feature Requests

1. Open an issue describing the feature
2. Explain the use case and benefits
3. Provide mockups or examples if possible

### Code Contributions

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/bugfixed-feature`
3. Make your changes
4. Test thoroughly
5. Commit with clear messages: `git commit -m 'Add feature'`
6. Push to your fork: `git push origin feature`
7. Open a Pull Request

### Code Style

- Use modern JavaScript (ES6+)
- Add comments for complex logic
- Keep functions focused and small
- Test across multiple browsers
- Use multiple fallback selectors for GitHub UI elements

---

## Roadmap

### Completed ✅

- [x] Keyboard shortcuts
- [x] Quick Actions (VS Code, Copy Clone)
- [x] Focus Mode
- [x] PR Enhancements (Expand Diffs, Hide Lock Files)
- [x] UI Cleaner (Hide Sponsors, Hide Copilot)
- [x] Catppuccin Icons integration
- [x] Lazy Load Avatars
- [x] Dashboard customization
- [x] Tracking Prevention

### Planned Features

- [ ] Custom themes support
- [ ] Notification enhancements
- [ ] Issue/PR templates
- [ ] Code review helpers
- [ ] Performance metrics dashboard
- [ ] GitHub Actions integration
- [ ] Advanced search filters
- [ ] Repository statistics
- [ ] Contribution tracking

---

## FAQ

**Q: Does this script collect any data?**  
A: No. GitHub Enhanced is completely privacy-focused and does not collect, transmit, or store any user data. In fact, it blocks GitHub's own tracking.

**Q: Will this slow down GitHub?**  
A: No. The script is optimized for performance and actually improves load times with lazy loading. Most features use lazy loading and efficient DOM manipulation.

**Q: Can I use this with other GitHub enhancement scripts?**  
A: Yes, but conflicts may occur. Test thoroughly and disable conflicting features if needed.

**Q: Why are some features disabled by default?**  
A: To provide a clean, non-intrusive experience. Enable only the features you need. Privacy and performance features are enabled by default.

**Q: Does this work on GitHub Enterprise?**  
A: Theoretically yes, but it's not officially tested. You may need to adjust the @match patterns.

**Q: Why don't I see the Quick Actions buttons?**  
A: They only appear on repository main pages (not on issues, PRs, etc.). If you still don't see them, enable Debug Mode and check the console for logs.

**Q: Can I customize the keyboard shortcuts?**  
A: Currently the shortcuts are fixed. Custom shortcuts are planned for a future release.

**Q: How do I report a bug?**  
A: Open an issue on GitHub with detailed information about the problem. Enable Debug Mode first and include console logs.

---

## Credits

### Inspiration

- [Refined GitHub](https://github.com/refined-github/refined-github) - UI enhancements
- [GitHub Dark](https://github.com/StylishThemes/GitHub-Dark) - Theme inspiration
- [OctoLinker](https://github.com/OctoLinker/OctoLinker) - Navigation improvements
- [Catppuccin](https://github.com/catppuccin/catppuccin) - Icon themes

### Technologies

- [Tampermonkey](https://www.tampermonkey.net/) - Userscript manager
- [GitHub REST API](https://docs.github.com/rest) - Data retrieval
- [Turbo](https://turbo.hotwired.dev/) - GitHub's SPA framework
- [GM_config](https://github.com/sizzlemctwizzle/GM_config) - Configuration management

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

If you find this project useful, consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting features
- 🔧 Contributing code
- 📢 Sharing with others

---

## Contact

- **GitHub**: [@Onyx-i7](https://github.com/Onyx-i7)
- **Issues**: [GitHub Issues](https://github.com/Onyx-i7/GitHub-Enhanced/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Onyx-i7/GitHub-Enhanced/discussions)

---
<div align="center">

**Made by [Onyx-i7](https://github.com/Onyx-i7)**

*Enhancing GitHub, one feature at a time*
</div>
