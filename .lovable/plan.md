# Plan: Add "How It Works" navigation links

Surface the existing `/how-it-works` page by adding links in both the top Navbar and the Footer.

## 1. `src/components/Navbar.tsx`
- **Desktop actions**: Add a `<Button variant="ghost" size="sm" asChild><Link to="/how-it-works">How It Works</Link></Button>` in the desktop action group, placed before "Browse" so it reads naturally.
- **Mobile drawer**: Add a "How It Works" entry to the mobile menu list (inside the drawer, alongside the other navLinks). Use the `HelpCircle` icon from lucide-react for visual consistency with the other icon-prefixed links.

## 2. `src/components/Footer.tsx`
- Add `{ label: "How It Works", to: "/how-it-works" }` to the `companyLinks` array (placed first, above About). This surfaces the link in the Footer's "COMPANY" column on every page.

## Notes
- Route `/how-it-works` is already registered in `src/App.tsx` and the page component exists at `src/pages/HowItWorksPage.tsx` — no routing changes needed.
- No new dependencies required.
- Fully responsive: desktop nav, mobile drawer, and footer all covered.