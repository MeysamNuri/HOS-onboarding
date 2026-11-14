# Export verification — 2026-11-14

## Verified

- Independent snapshot; no intentional changes to the original application's source.
- Clean dependency installation: npm ci --legacy-peer-deps --ignore-scripts — passed.
- npm run build (ESLint, TypeScript, Vite) — passed.
- Complete Vitest suite — 216 passed, 0 failed, 40 files.
- Offline API regression tests — synthetic statistics and no network transmission for account/payment operations.
- npm audit against the public npm registry — 0 reported vulnerabilities at verification time; the initial snapshot reported 29.
- Security scan of export text files — passed. Run npm run security:check before publishing further changes.
- Build source maps disabled. node_modules, dist, Git history, pipeline/deployment configuration, diagnostic logs and original credentials are excluded from the archive.

## Dependency changes

The lockfile uses public npm registry URLs. Compatible security updates were installed; Vitest and its coverage package were upgraded to 5.1.0. The missing @testing-library/dom test peer dependency was made explicit. The TypeScript ESLint dependency chain uses a patched minimatch override; validate future dependency upgrades before removing it.

Test setup was adjusted for constructor mocks and localStorage under the upgraded test runtime. Business-profile API tests use a test-only transport with mocked fetch, while shipped application requests remain offline. Stale fixed-width carousel assertions were aligned with the existing fluid carousel implementation; no carousel production behavior was changed for the export.

## Known limitations

- antd-jalali-plus declares an older Ant Design peer range; the existing project still requires --legacy-peer-deps. A successful build is not proof of every component's runtime compatibility.
- Vite reports a large bundle and an eval-related warning in lottie-web. Production CSP does not permit unsafe-eval. Full browser visual/runtime verification of every route has not been performed.
- The normal demo has no login, payments, private account data, real activation or production analytics.
- 29 potentially sensitive raster screenshots/mockups and 19 SVG files with embedded imagery were replaced with neutral preview assets. Raster metadata was stripped. Other branding and artwork remain and still need owner approval and manual content review.
- Commercial fonts are excluded, which changes typography.
- No security audit can guarantee the absence of every secret or vulnerability. No production deployment or publication to GitHub has been performed.

## Before upload

Obtain permission to publish company source and remaining assets. Extract the ZIP and upload its project contents to a new repository, not into the old repository history. Ask the original widget service owner to review and rotate/revoke the exposed credential where appropriate. Do not reuse the private original's config, logs or history.
