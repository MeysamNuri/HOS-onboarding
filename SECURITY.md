# Security and publication notes

This is a sanitized, offline portfolio snapshot, not a security certification.

## Removed or isolated

- No Git history, deployment definitions, private registry configuration, diagnostic logs, build output or dependency directory is shipped.
- A hard-coded widget JWT was found in the original project. The widget implementation and embedded credential are absent here. Ask the service owner to assess and revoke/rotate it if appropriate. Do not copy it into documentation or a public issue.
- Live API and SSO origins and client identifiers were replaced. OAuth client IDs are identifiers, not necessarily secrets.
- Matomo, Clarity and chatbot execution are disabled. No production analytics are initialized.
- API calls are replaced by an in-memory demo query; account/payment operations return a deliberate error without reading or transmitting tokens.
- Private package-registry URLs in the npm lockfile were changed to the public npm registry; integrity hashes are retained.
- Source maps are disabled. This is not a substitute for removing secrets.
- 29 potentially sensitive screenshot/mockup assets and 19 SVGs containing embedded images were replaced by neutral placeholders; 150 raster files were re-encoded without original metadata. The visual result intentionally differs from the private original.
- Commercial font binaries are excluded. Contacts and the business-profile fixture are anonymized.
- CSP restricts external scripts, requests, frames and form submission. The development server removes the meta CSP so Vite React Refresh can initialize; use it only on localhost. Production builds retain the restrictive CSP. Production hosting should set its own response-header policy, including frame-ancestors.

## Why not encryption?

A secret shipped to the browser cannot be protected by bundling its decryption key alongside it. This export removes credentials instead of disguising them. VITE_* variables are public build inputs, not secret storage. Real service credentials belong on a backend.

## Remaining review before public release

The repository still contains company branding, illustrations and screenshots. Their publication rights and any text or personal data inside raster or embedded images require manual approval. Text scans do not constitute OCR or a complete image audit. Obtain permission for the source code as well as assets. No new license is granted by this export.

The original application's authentication design, localStorage token helpers, API schemas and server assumptions remain visible as source examples but cannot access the real service in this copy. A real deployment requires a separate security review of OAuth state/PKCE, session storage, server authorization, input validation, privacy and response headers.

Dependencies and tests are recorded in RELEASE-CHECKS.md. Do not interpret a scan with no matches as proof that all vulnerabilities are eliminated. This snapshot does not clean the original repository or its history. If credentials were previously published, rewriting a new snapshot does not revoke them.
