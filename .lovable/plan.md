

# Build "Sell Your Car" Page

## Overview
Create a full-featured `/sell` page with 7 sections, extract reusable components, and update the global accent color from orange to electric yellow.

## Global Color Change
Update `--cta` in `src/index.css` from `30 100% 50%` (orange) to `50 100% 50%` (electric yellow, matching `--primary`). Also update `--cta-foreground` to `0 0% 7%` (black text on yellow). This propagates everywhere `cta` is referenced — HowItWorks connector lines, HeroSection shortcut hover states, RentalsBanner, etc.

## New Files

### 1. `src/components/sell/VinPlateForm.tsx` (Reusable)
The tabbed License Plate / VIN input card. Props for `onSubmit`, optional `compact` mode. Contains tab toggle, conditional state selector dropdown, input field, "Get My Cash Offer" CTA button, and "Sign In" link.

### 2. `src/components/sell/SellHero.tsx`
- CSS carbon-fiber texture via repeating background gradient
- Trust badge pills row
- Headline + subheadline
- Embeds `<VinPlateForm />`

### 3. `src/components/sell/SellHowItWorks.tsx`
- 3-step cards with dashed yellow connectors
- Decorative phone mockup SVG below steps

### 4. `src/components/sell/WhySellSection.tsx`
- Two-column: heading left, stat callouts right
- 6-card benefit grid below

### 5. `src/components/sell/AffiliateShareBanner.tsx`
- Yellow background, black text (inverted section)
- Animated SVG illustration (car → share → nodes → dollar)

### 6. `src/components/sell/SellerFAQ.tsx` (Reusable accordion)
- Uses existing `Accordion` primitives from `src/components/ui/accordion.tsx`
- Yellow chevron + left-border styling on open state
- All 10 FAQ items from the spec

### 7. `src/components/sell/ExpertGuidesStrip.tsx`
- Horizontal scroll of 4 article cards
- Matches NewsSection card styling

### 8. `src/components/sell/BottomCTABanner.tsx`
- Faint watermark logo, heading, CTA button (scrolls to top)
- Trust icon row

### 9. `src/pages/SellYourCar.tsx`
- Assembles all sections with Navbar + Footer
- Imports all sell/ components

## Modified Files

| File | Change |
|------|--------|
| `src/index.css` | `--cta: 50 100% 50%`, `--cta-foreground: 0 0% 7%` |
| `src/App.tsx` | Add route `/sell` → `SellYourCar` |
| `src/components/HeroSection.tsx` | Update shortcut hover classes if they reference `cta` directly (already use `hover:border-cta` so the color swap handles it) |

## Technical Notes
- All animations use `@media (prefers-reduced-motion: reduce)` to disable motion
- Mobile responsive: hero card full-width, benefit grid 1-col, steps stacked, guides horizontal scroll
- Accordion uses existing Radix primitives — just styled with yellow accents
- Phone mockup and affiliate animation are pure CSS/SVG, no images

