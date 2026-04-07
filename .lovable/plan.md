# Build Expert Profile Page

## Overview
Create a public-facing expert/broker profile page with 7 sections, dual view/edit modes, and placeholder data. Route: `/experts/:username`

## New Files

### Data & Types
1. **`src/data/mockExpertProfile.ts`** — Mock expert profile data object with all fields (bio, stats, social links, featured vehicles, articles, reviews, social feed posts)

### Components (all in `src/components/expert-profile/`)
2. **`ExpertHero.tsx`** — Banner + overlapping profile card with avatar, badge tier, rating, stats, bio, social links, contact buttons. Two-column desktop layout.
3. **`SocialFeed.tsx`** — Platform-tabbed masonry grid of social post cards with placeholder data and TODO comments for API integration.
4. **`FeaturedVehicles.tsx`** — 3-column grid of curated vehicle picks with "Expert Pick" badges, expert commentary, affiliate tracking comments, and "Ask Expert" action.
5. **`ExpertArticles.tsx`** — Two-column layout: large featured article + 3 stacked small cards.
6. **`ExpertReviews.tsx`** — Rating summary bar + review cards grid with breakdown bars.
7. **`ReferralEarningsCTA.tsx`** — Yellow-background owner-only section with earnings stats (conditionally rendered).
8. **`ExpertDirectoryCTA.tsx`** — Two-column public CTA for browsing experts or becoming one.
9. **`AskExpertModal.tsx`** — Dialog modal for contacting expert about a specific vehicle.

### Page
10. **`src/pages/ExpertProfile.tsx`** — Assembles all sections, handles edit mode toggle, sets page title/meta.

## Modified Files
| File | Change |
|------|--------|
| `src/App.tsx` | Add route `/experts/:username` → `ExpertProfile` |

## Technical Notes
- Edit mode is local state toggle (no real persistence yet — mock only)
- Owner detection uses a mock `isOwner` flag for now
- Affiliate tracking via code comments (uses existing `fireConversionEvent` pattern)
- All animations respect `prefers-reduced-motion`
- Mobile responsive: stacked layouts, 2x2 stat grids, horizontal scroll where specified
