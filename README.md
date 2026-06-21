# GitHub Enhanced

<div align="center">

**A professional enhancement suite for GitHub**

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/Onyx-i7/GitHub-Enhanced/releases)
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
- **Performance-optimized**: Minimal overhead, efficient DOM manipulation
- **Professional UI**: Clean, non-intrusive enhancements
- **Highly configurable**: Enable only the features you need
- **Open source**: Fully transparent, community-driven development

---

## Features

### Release Management

| Feature | Description |
|---------|-------------|
| **Download Statistics** | Display download counts for each release asset |
| **Uploader Information** | See who uploaded each release asset |
| **Download Histogram** | Visual representation of download distribution |
| **Archive Filtering** | Hide source code archives (zip, tar.gz) from release listings |

### Extended Information

- **User Profiles**: View additional metadata including join date, last update, public repositories count, and Node ID
- **Repository Details**: Access repository size, creation date, last update, last push, and Node ID directly from the sidebar

### Interface Enhancements

- **Sticky Avatars**: Keep user avatars visible while scrolling through discussions
- **Sticky Headers**: Maintain context with sticky comment and issue headers
- **Visible Details**: Improved styling for collapsible `<details>` elements
- **Custom Tab Size**: Configure code block indentation (default: 4 spaces)
- **Cursor Effects**: Optional cursor blink and smooth animation
- **Full Width Code**: Maximize code block width for better readability

### Privacy & Security

- **Tracking Prevention**: Blocks GitHub's analytics tracking (octolytics, browser-stats)
- **Fetch Protection**: Prevents unauthorized modification of the fetch API
- **No External Dependencies**: All functionality is self-contained

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

### Code Features

| Setting | Default | Description |
|---------|---------|-------------|
| Custom Tab Size | Enabled | Use 4-space indentation in code blocks |
| Cursor Blink | Disabled | Enable cursor blinking animation |
| Cursor Animation | Disabled | Enable smooth cursor movement |
| Full Width Code | Disabled | Remove padding from code blocks |
| Hide Readonly Tip | Disabled | Hide "Code view is read-only" notification |

### Appearance

| Setting | Default | Description |
|---------|---------|-------------|
| Sticky Avatars | Disabled | Keep avatars visible while scrolling |
| Sticky Headers | Disabled | Keep comment/issue headers visible |
| Hide Header Underline | Disabled | Remove underline from markdown headers |
| Visible Details | Disabled | Add borders and padding to `<details>` elements |

### Release Features

| Setting | Default | Description |
|---------|---------|-------------|
| Show Uploader | Enabled | Display who uploaded each release asset |
| Show Downloads | Enabled | Display download counts for assets |
| Show Histogram | Disabled | Show visual download distribution |
| Hide Archives | Disabled | Hide source code archives from listings |

### Additional Features

| Setting | Default | Description |
|---------|---------|-------------|
| Extended User Info | Disabled | Show additional user profile metadata |
| Extended Repo Info | Disabled | Show additional repository metadata |
| Tracking Prevention | Disabled | Block GitHub analytics tracking |

### Advanced Settings

| Setting | Default | Description |
|---------|---------|-------------|
| Personal Access Token | Empty | GitHub API token for increased rate limits |
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
- **CSS Injection**: Dynamic stylesheet management
- **Event Listeners**: Turbo and soft-nav event handling for SPA navigation
- **API Integration**: GitHub REST API with rate limit management
- **DOM Manipulation**: Efficient element creation and modification

### Performance Considerations

- **Lazy Loading**: Features are only initialized when needed
- **Event Delegation**: Minimal event listeners using event bubbling
- **Caching**: Release data is cached to reduce API calls
- **CSS Optimization**: Styles are injected once and reused

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
   - Console logs (if applicable)

### Feature Requests

1. Open an issue describing the feature
2. Explain the use case and benefits
3. Provide mockups or examples if possible

### Code Contributions

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit with clear messages: `git commit -m 'Add amazing feature'`
6. Push to your fork: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- Use modern JavaScript (ES6+)
- Follow existing code patterns
- Add comments for complex logic
- Keep functions focused and small
- Test across multiple browsers

---

## Roadmap

### Planned Features

- [ ] Custom themes support
- [ ] Keyboard shortcuts
- [ ] Notification enhancements
- [ ] Issue/PR templates
- [ ] Code review helpers
- [ ] Performance metrics dashboard

### Under Consideration

- [ ] Integration with GitHub Actions
- [ ] Custom CSS injection
- [ ] Advanced search filters
- [ ] Repository statistics
- [ ] Contribution tracking

---

## FAQ

**Q: Does this script collect any data?**  
A: No. GitHub Enhanced is completely privacy-focused and does not collect, transmit, or store any user data.

**Q: Will this slow down GitHub?**  
A: No. The script is optimized for performance and adds minimal overhead. Most features use lazy loading and efficient DOM manipulation.

**Q: Can I use this with other GitHub enhancement scripts?**  
A: Yes, but conflicts may occur. Test thoroughly and disable conflicting features if needed.

**Q: Why are some features disabled by default?**  
A: To provide a clean, non-intrusive experience. Enable only the features you need.

**Q: Does this work on GitHub Enterprise?**  
A: Theoretically yes, but it's not officially tested. You may need to adjust the @match patterns.

**Q: How do I report a bug?**  
A: Open an issue on GitHub with detailed information about the problem.

---

## Credits

### Inspiration

- [Refined GitHub](https://github.com/refined-github/refined-github) - UI enhancements
- [GitHub Dark](https://github.com/StylishThemes/GitHub-Dark) - Theme inspiration
- [OctoLinker](https://github.com/OctoLinker/OctoLinker) - Navigation improvements

### Technologies

- [Tampermonkey](https://www.tampermonkey.net/) - Userscript manager
- [GitHub REST API](https://docs.github.com/rest) - Data retrieval
- [Turbo](https://turbo.hotwired.dev/) - GitHub's SPA framework

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
