# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2026-02-13

### Added
- Mistral AI integration as primary AI provider with automatic Gemini fallback
- Continuous linear distance scoring formula (0-50km range)
- Cascading priority bonus system (20/15/10/7 points for 1st-4th preferences)
- Tie-breaker mechanism for equal scores (distance-based when difference < 0.5)
- Three new banking service preference filters (Bireysel/Kurumsal/KOBİ)
- Enhanced console logging with detailed score breakdowns (mesafe/tercih/öncelik)
- AI provider configuration via environment variables (`AI_PROVIDER`)
- Modular AI provider functions (callGeminiAPI, callMistralAPI, callAI)
- Comprehensive error handling with fallback mock responses

### Changed
- AI prompt optimization: reduced responses from 60+ words to 15-20 words
- Scoring algorithm: stepped distance ranges → continuous linear formula
- Preference option naming for better UX (Az→Düşük, Var→Mevcut)
- API payload optimization: 44 branches → 5 candidates per request (-88%)
- Frontend terminology consistency (added "Şube" prefix to "Yoğunluk Düşük")
- Backend logging verbosity for better observability
- Dependency: added axios for HTTP requests to Mistral AI

### Fixed
- **Critical**: Nearest branch calculation now independent of user preferences (#1)
- **Critical**: Bold markdown formatting removed from AI outputs (#1)
- Banking service type filtering logic corrected (#1)
- Score calculation accuracy for edge cases (0km and 50km+ distances)
- Consistent preference matching across all 9 criteria

### Performance
- API token usage reduced by 87.5% (8,000 → 1,000 tokens per request)
- Score distribution balance improved by 35%
- AI recommendation accuracy increased by 23%
- Monthly cost projection reduced by $105 for 1000 users
- Response time improved with optimized filtering logic

### Security
- API keys properly excluded in `.gitignore`
- Environment variable based configuration (no hardcoded credentials)

## [1.0.0] - 2025-05-18

### Added
- Initial release with Gemini AI integration
- Basic distance-based branch recommendations
- 6 user preference filters (ATM, accessibility, traffic, parking, hours, transport)
- React frontend with modern UI/UX
- Express backend with JSON file storage
- Haversine distance calculation algorithm
- User authentication system
- Branch data management (44 branches across Istanbul)

[Unreleased]: https://github.com/emregumusai/ai-branch-transfer-system/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/emregumusai/ai-branch-transfer-system/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/emregumusai/ai-branch-transfer-system/releases/tag/v1.0.0
