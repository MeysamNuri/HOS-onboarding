# Holoo Hamrah landing

Public standalone route: "/holoo-hamrah". Follows HolooSendLinkLanding's feature structure with Views, Components, Hooks, data, assets, and routes.

- Light/dark preference is scoped to this landing and persisted as "holoo-hamrah-theme".
- Phone illustrations are extracted from the supplied Light.png and Dark.png references; the remaining UI is responsive HTML/SCSS.
- Home and landing activation both submit service BI with packet Simple through useHamrahActivation after serial selection (and authentication when needed). Payment verification and order details are carried to /holoo-hamrah in router state. The existing success, reserved-package, and error modals display the result there; dismissing removes the result state without submitting another order.
- Guide and support link to "/BI-guide" and "/support".
- The demo button redirects to the URL configured by `demoHolooHamrah` in `src/core/constants/config.json`.
- The download button links to the Holoo Hamrah 1.1.1196 installer configured in Components/GettingStarted.tsx.
- The reference heading says four steps but contains three numbered cards; this layout preserves the reference, followed by package activation.

Validation: npx vitest run src/features/HolooHamrahLanding
