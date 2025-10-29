# Changelog

All notable changes to the UM GWA Extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-10-29

### Added
- Initial release of UM GWA Extension
- Automatic GWA calculation from SPR webpage
- Browser extension popup interface with modern design
- Content script for extracting grades from SPR page
- Background service worker for extension lifecycle management
- Support for Chrome, Edge, and Firefox browsers
- Comprehensive README with installation instructions
- Contributing guidelines for developers
- Extension icons (16x16, 48x48, 128x128)
- GWA remark system (Excellent, Very Good, Good, Satisfactory, Passing)
- Grade breakdown display in popup
- Total units and subjects count display
- Error handling for non-SPR pages
- Retry and refresh functionality

### Features
- Real-time GWA calculation
- User-friendly popup interface
- Automatic grade detection from tables
- Privacy-focused (all calculations done locally)
- Lightweight and fast

### Technical Details
- Manifest V3 for modern browser support
- Pure JavaScript implementation (no dependencies)
- Responsive design with gradient theme
- Smooth animations and transitions
- Console logging for debugging

---

## Future Planned Features

### [1.1.0] - Planned
- [ ] Support for multiple semesters/academic years
- [ ] GWA history tracking
- [ ] Export grades to CSV/PDF
- [ ] Customizable GWA grading scale
- [ ] Dark mode theme option

### [1.2.0] - Planned
- [ ] Comparison with target GWA
- [ ] Subject filtering by department/level
- [ ] Statistical analysis (highest, lowest, average grades)
- [ ] Grade prediction based on remaining subjects

### [2.0.0] - Planned
- [ ] Settings page for customization
- [ ] Multiple SPR page structure support
- [ ] Automatic page structure detection
- [ ] Cloud backup for GWA history (optional)
- [ ] Notifications for grade updates

---

## Version History

- **1.0.0** - Initial release with core GWA calculation functionality

---

## How to Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md) for information on how to contribute to this project.

## Reporting Issues

Found a bug or have a suggestion? Please [open an issue](https://github.com/loftyyyy/UM-GWA-Extension/issues) on GitHub.
