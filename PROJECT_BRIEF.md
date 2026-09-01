# Project Brief: Saree & Lehenga E-commerce Demo (Client Pitch Build)

## 0. How to use this document (read this first, agent)

You are building a client-pitch demo, not a production system. Optimize for: looking sharp, being fast, and having one genuinely working feature (live admin upload) rather than broad but shallow coverage.

Before writing any code:
1. Use Playwright to visit the reference site (Section 2) and actually look at it. Do not assume anything about layout, spacing, or copy that you can verify by inspection.
2. Take screenshots at desktop (1440px) and mobile (390px) widths for the homepage, a collection page, and a product page.
3. Write a short "Findings" section at the bottom of this file summarizing what you observed, and flag anywhere your findings disagree with or add detail to the spec below.
4. If anything in this brief is ambiguous, underspecified, or you think there's a better approach (different library, different data model, different phasing), say so explicitly before proceeding, don't just silently pick something and move on. Propose the change, give a one-line reason, and continue only after flagging it (you don't need to wait for approval on small things, but call them out in your output).
5. Work in the phases defined in Section 9, in order. Stop at the end of each phase and summarize what's done, what's left, and anything you're unsure about, before continuing to the next phase.

## 1. Goal

Build a fast, modern-looking demo of a sarees & lehengas e-commerce storefront, closely modeled on a reference Shopify store, PLUS a working admin panel where a product can be uploaded live and immediately appears on the storefront. This will be shown live to a client to pitch a custom build as an alternative to their current Shopify site.

Primary success moment: uploading a product in the admin panel during the call and having it appear on the storefront on refresh, with no code changes or redeploys.

## 2. Reference site to analyze

URL: https://lepakshigdk.com

**Important, non-negotiable: this is a layout/structure reference only, not an asset source.** Do not download, re-host, or reuse the reference site's actual product photos, videos, or written copy anywhere in the build, even temporarily. Study the layout, spacing, component structure, and interaction patterns, not the content. For product images, use royalty-free stock photography (Unsplash/Pexels or similar) or ask the user for real photos to upload through the admin panel during the demo itself. Reusing another business's copyrighted product photography is a real legal risk, not a formality.

Pages to inspect with Playwright:
- Homepage (`/`)
- A collection page (`/collections/all` or `/collections/sarees`)
- A single product page (any `/products/...` URL)
- Mobile viewport of all of the above

Note: the site has an age-gate popup on load (18+ confirmation). Dismiss it (click "Yes, I am") before inspecting/screenshotting the rest of the page.

What to extract:
- Section order and structure on the homepage
- Header behavior (sticky? mega-menu structure?)
- Product card anatomy (image, title, price display, sale badge, sold-out state, wishlist icon)
- Color palette (pull actual hex values via computed styles, don't guess)
- Typography (font family, heading sizes, weights)
- Spacing/grid rhythm (container width, gutter, card grid columns at desktop vs mobile)
- Footer structure
- Mobile bottom nav bar (exists on this site, check if we want to replicate it)

## 3. Tech stack

- **Frontend:** Next.js (App Router) + Tailwind CSS
- **Backend/DB/Storage:** Supabase (Postgres + Storage + auto-generated client APIs)
- **Deployment:** Vercel (frontend), Supabase cloud (free tier is sufficient for demo)
- **Image upload:** direct-to-Supabase-Storage from the admin panel, no custom upload server needed

Do not build a custom Express/Node API layer for this demo. Call Supabase directly from Next.js server components/actions and from the admin panel. This is the only realistic way to have a genuinely live upload-to-storefront flow given the timeline.

**Security, do not skip this even for a demo:**
- Enable Row Level Security (RLS) on every Supabase table. Public/anon key gets read-only access to `products`, `collections`, `banners`. Writes (insert/update/delete) only happen through a policy gated by the admin session, or via a Supabase service-role key used only in a server action that itself checks the admin password, never exposed to the browser.
- Admin password lives in an environment variable (`ADMIN_PASSWORD` in `.env.local`, and the equivalent in Vercel's env settings), never hardcoded in a component, never committed to the repo.
- Add `.env.local` to `.gitignore` before the first commit.

## 4. Site structure / routes

- `/` — Homepage
- `/collections/[slug]` — Collection/category listing (grid of products, filterable by category)
- `/products/[slug]` — Product detail page
- `/admin` — Password-gated admin panel (simple shared password is fine for a demo, no need for full auth/roles)

## 5. Section-by-section homepage spec

Build in this order, top to bottom:

1. **Announcement bar** — thin bar, rotating/static text (e.g. "Pan-India Shipping | Honest Prices Since [year]")
2. **Header** — logo, nav links with mega-menu dropdown for "Sarees" (sub-categories: Fancy, Designer, Work, Pattu) and "Lehengas", search icon, account icon, wishlist icon, cart icon. Sticky on scroll.
3. **Hero slider** — full-width rotating banner images, each linking to a collection
4. **"Shop by Collections"** — grid of circular or square category tiles (Lehengas, Fancy Sarees, Designer Sarees, Pattu Sarees, Work Sarees, etc.)
5. **Two-up promo banner** — two large side-by-side clickable image blocks
6. **Tabbed product carousel** — tabs (e.g. "Sarees" / "Offer Zone"), each tab shows a horizontal scrollable row of product cards
7. **Full-width promo banner**
8. **Best Sellers grid** — product card grid, "Shop more" link
9. **"Shop by Price"** — 4 banner tiles linking to price-range filtered collections
10. **New Arrivals grid** — same product card grid pattern
11. **Featured videos** — horizontal scroll of short vertical product videos (can be stubbed/omitted for the 3-day demo if time is tight, flag this if you cut it)
12. **Trust bar** — small row of icons/text just above or below the fold: secure checkout, COD/UPI available, easy returns, pan-India shipping. Cheap to build, does real work in making the demo feel like a finished product.
13. **Footer** — quick links column, help/policy links column, About/Discover column, social icons, copyright line
14. **Mobile bottom nav bar** — Home / Account / Shop / Wishlist / Help, fixed to bottom, visible only on mobile viewport
15. **WhatsApp chat bubble** — fixed floating button, bottom-right, links to `wa.me/[number]` (placeholder number is fine for the demo). Near-zero build cost, high perceived value for this market.

**Search:** basic search bar in the header, client-side filter over the seeded product list by name/category. Doesn't need to be fancy, needs to work when the client tries it.

**Cart (nice-to-have, not required):** a slide-out cart drawer with session-only state (no persistence, no checkout) adds polish if Phase 2 finishes early. Cut it without guilt if time is tight, it's explicitly optional.

**Product card component (reused everywhere):**
- Product image (with hover/second-image swap if time allows)
- "Sold Out" badge overlay when out of stock
- Wishlist heart icon (top corner)
- Title
- Sale price + strikethrough regular price (when on sale)
- "Select options" / "Add to cart" action

## 6. Data model (Supabase / Postgres)

```sql
-- products
id            uuid primary key default gen_random_uuid()
name          text not null
slug          text unique not null
description   text
price         numeric not null          -- regular price
sale_price    numeric                   -- nullable, if on sale
image_url     text not null             -- primary image, Supabase Storage URL
gallery_urls  text[]                    -- optional additional images
category      text not null             -- e.g. 'sarees', 'lehengas', 'fancy-sarees'
in_stock      boolean default true
is_new        boolean default false
is_bestseller boolean default false
created_at    timestamptz default now()

-- collections (only needed if categories should be admin-editable too; otherwise hardcode categories)
id      uuid primary key default gen_random_uuid()
name    text not null
slug    text unique not null
image_url text

-- banners
id        uuid primary key default gen_random_uuid()
image_url text not null
link_url  text
position  text  -- 'hero', 'promo-1', 'promo-2', 'shop-by-price-1', etc.
sort_order int default 0
```

## 7. Admin panel spec (`/admin`)

Gate behind a simple shared password (env variable), no need for full user auth for a demo.

Must support, live, no redeploy needed:
- **Add product** form: image upload (drag-drop, uploads straight to Supabase Storage, returns URL), name, price, sale price (optional), category (dropdown), toggles for "in stock", "new arrival", "bestseller"
- **Product list view**: table of existing products with quick edit/delete
- **Banner management**: upload/replace hero slider and promo images with a link URL

This is optional but strong if time allows: a minimal "Orders" placeholder view (even with mock/empty state) to gesture at future scope without building it out.

## 8. Explicitly out of scope for this demo

Do not build, and don't spend time on:
- Real payment gateway integration
- Real customer authentication/login flows (storefront side)
- Real order fulfillment/shipping logic
- SEO optimization
- Multi-currency/multi-language
- Persisted wishlist/cart (a client-side/session-only cart is fine if a cart UI is wanted at all)

If asked by the client, the answer is "that's standard scope for the full build, this demo is focused on showing you the storefront experience and the admin workflow."

## 9. Build phases (target: ~3 working days, budgets below, adjust and flag if slipping)

**Phase 1: Setup + Playwright audit** (~half day)
- Run the reference-site audit (Section 2), write Findings section
- Scaffold Next.js + Tailwind project
- Set up Supabase project, enable RLS per Section 3, create tables from Section 6, seed 6-8 realistic products (stock imagery per Section 2's copyright note) across 2-3 categories
- Stop and summarize before continuing

**Phase 2: Storefront build** (~1.5 days)
- Header, mega-menu, search bar, hero slider, trust bar, footer, mobile bottom nav, WhatsApp bubble
- Shop by Collections grid
- Product card component
- Tabbed product carousel, Best Sellers grid, New Arrivals grid, Shop by Price banners
- Collection page, Product detail page
- Stop and summarize before continuing

**Phase 3: Admin panel** (~half day)
- `/admin` password gate (env-var password, per Section 3 security notes)
- Add/edit/delete product form with image upload to Supabase Storage
- Banner management
- Verify end-to-end: upload a product in admin, confirm it appears on the storefront on refresh
- Stop and summarize before continuing

**Phase 4: Polish + responsive pass** (~half day)
- Mobile responsiveness pass on every page (this audience shops on mobile primarily)
- Loading states, empty states
- Final review against Section 10 acceptance criteria
- Run through Section 12's pre-demo checklist

## 10. Acceptance criteria / definition of done

- [ ] Homepage matches the section order and general layout rhythm of the reference site, with our own visual identity (not a pixel clone)
- [ ] All product grids pull real data from Supabase, not hardcoded arrays
- [ ] Admin panel can add a new product with an uploaded image, and it appears on the storefront without a redeploy
- [ ] Site is responsive and looks clean on a phone-width viewport
- [ ] No console errors, no broken images, no dead links in the primary demo path
- [ ] Page loads fast (no unoptimized multi-MB images, use Next.js Image component)
- [ ] No reference-site images or copy reused anywhere (Section 2 copyright note)
- [ ] Supabase anon key cannot write to any table (RLS verified), admin password is env-var only and not in the repo

## 11. Differentiation tactics (don't just clone, execute a few of these)

Pick 2-3, don't try all of them in 3 days:
- **Product image hover/zoom** on hover or tap, the reference site doesn't do this
- **Smoother page transitions** between collection and product pages (Next.js makes this cheap)
- **Better typography** — a distinct heading font paired with a clean body font, rather than a generic theme default
- **Skeleton loading states** instead of layout jumps while data loads
- **Sticky "add to cart" bar** on mobile product pages once you scroll past the main image
- **Cleaner mega-menu** with category thumbnail images instead of plain text links

## 12. Pre-demo QA checklist (run this the night before or morning of)

- [ ] Full click-through on desktop Chrome: homepage → collection → product → back
- [ ] Full click-through on an actual phone (not just devtools responsive mode) on mobile data or hotel wifi, not localhost
- [ ] Do the live admin upload once, end to end, before the call, exactly as you'll do it live
- [ ] Confirm the Vercel deployment is on the production URL you'll actually show, not a preview link
- [ ] Have 2-3 pre-uploaded products already live so the storefront doesn't look empty before your live-upload moment
- [ ] Close any unrelated browser tabs, dev consoles, or terminal windows with errors visible before sharing your screen

## 13. Findings (agent fills this in after the Playwright audit)

### A. Reference Site Audit Summary (`https://lepakshigdk.com`)

1. **Color Palette (Computed Hex Codes)**:
   - **Body Background**: `#FCF3ED` (`rgb(252, 243, 237)`) — Warm ivory / soft sand blush, giving a traditional royal Indian boutique feel.
   - **Primary Text**: `#341B09` (`rgb(52, 27, 9)`) — Deep rich espresso brown (replaces harsh pure black for body and headings).
   - **Primary Brand / Accent / CTA**: `#7B3D14` (`rgb(123, 61, 20)`) — Warm terracotta / burnt sienna used for primary buttons, active states, and prices.
   - **Sale Badge / Alert Red**: `#DA3F3F` (`rgb(218, 63, 63)`) — Vibrant contrast badge for "On Sale".
   - **Card & Container Surfaces**: `#FFFFFF` (pure white) and `#F3F3F3` / `#FCFCFC` for clean product card surfaces.
   - **Borders & Dividers**: `rgba(52, 27, 9, 0.08)` to `rgba(52, 27, 9, 0.15)`.
   - **Secondary / Subdued Text**: `rgba(52, 27, 9, 0.65)` (`#666666`).

2. **Typography System**:
   - **Heading Font Family**: `WildRose-Regular` (Shopify custom serif display font) — Characterized by elegant, high-contrast serif flourishes. 
     - *Recommendation for Next.js build*: Use Google Font `Cormorant Garamond` or `Cinzel` / `Playfair Display` paired with `DM Sans`, providing identical luxury serif elegance without licensing bottlenecks.
   - **Heading Scale & Weights**:
     - `H1` / Sub-headings: `16px - 22px`, uppercase letterspaced, weight 400.
     - `H2` Section Titles: `36px - 42px`, weight 400, color `#7B3D14` or `#341B09`.
     - `H3` Card Titles: `15px - 18px`, medium weight.
   - **Body Font Family**: `DM Sans`, sans-serif (Weights: 400 Regular, 500 Medium, 700 Bold).

3. **Homepage Layout & Section Order Observed**:
   - 1. **Announcement Bar**: Sticky/sliding bar with pan-India shipping, return policies, and heritage tagline.
   - 2. **Header Navigation**: Logo left, inline category navigation (Home, Offer Zone, Shop, Best Sellers, New Arrivals, Sarees, Lehengas, 3 Piece Set), actions on right (Search, Wishlist heart, Cart icon with badge). Sticky behavior on scroll.
   - 3. **Hero Carousel**: Full-width responsive banner slider with pagination bullets and navigation arrows.
   - 4. **Shop by Collections**: 6 circular/square category cards (Lehengas, Fancy Sarees, Designer Sarees, Pattu Sarees, Work Sarees, 3 Piece Set).
   - 5. **Two-Up Promo Banner**: Side-by-side promotional imagery linking to special categories.
   - 6. **Tabbed Product Carousel**: "Drape the Beauty. Discover the Offers" with tabs for "Sarees" and "Offer Zone", horizontal scrollable card slider.
   - 7. **Full-Width Feature Promo Banner**: High-impact visual break.
   - 8. **Best Sellers Grid**: 4-column product grid with "Shop more" button.
   - 9. **Shop by Price Banners**: 4 visual price cards (e.g. Under ₹499, Under ₹999, Under ₹1499, Under ₹1999).
   - 10. **New Arrivals Grid**: 4-column product grid with "Shop more" button.
   - 11. **Featured Video Carousel**: Portrait 9:16 product showcase reel slider.
   - 12. **Store Heritage & Trust Section**: "Rooted in Indian tradition since 1996" brand story + 4 trust pillars (Pan-India Shipping, Easy Returns, Secure Payment, Authentic Handcrafted Sarees).
   - 13. **Footer**: 4 columns (Brand story, Quick links, Policies/Customer Care, Contact/Social icons, Copyright).
   - 14. **Floating Actions**: WhatsApp quick-chat floating widget + Mobile sticky bottom navigation bar.

4. **Product Card Anatomy**:
   - 3:4 / 4:5 vertical portrait image container.
   - Top-left "On Sale" / "Sold Out" overlay badge.
   - Top-right Wishlist heart toggle.
   - Title in 2-line clamped clean serif/sans typography.
   - Pricing display: Sale Price (`₹XXX` bold brand accent) + Original Price (`₹XXX` strikethrough muted).
   - Quick "Select Options" / "Add to Cart" button.

5. **Grid & Spacing Rhythm**:
   - Container max width: `1440px` with `16px` (mobile) and `32px` (desktop) padding.
   - Product Grid columns:
     - Desktop (1440px): 4 columns (gap: 20px - 24px)
     - Tablet (768px - 1024px): 3 columns (gap: 16px)
     - Mobile (390px): 2 columns (gap: 12px)

---

### B. Brief Review, Clarifications & Recommended Architectural Approach

1. **Supabase Schema Refinements**:
   - *Banner Model*: Add `title`, `subtitle`, `cta_text` to the `banners` table in Section 6. This allows dynamic hero sliders and promo banners to be fully managed from the admin panel without hardcoded text.
   - *Product Sizes/Variants*: Add a `sizes text[]` or `variants jsonb` column to the `products` table. The reference site has sizes (M, L, XL, 2XL, 3XL) on 3-piece sets and lehengas; supporting a simple size selector makes the product detail page look authentic during the client pitch without over-engineering an inventory matrix.
   - *Category Table*: Seed predefined categories (`sarees`, `lehengas`, `fancy-sarees`, `designer-sarees`, `pattu-sarees`, `work-sarees`, `3-piece-set`) with dedicated banner/thumbnail URLs.

2. **Admin Image Upload & Demo Reliability**:
   - In addition to direct drag-and-drop Supabase Storage upload, include a quick "Image URL" input option in the `/admin` product creation form. If demo conference WiFi restricts direct binary blob uploads, having the direct URL fallback guarantees zero failure during the live client pitch.
   - Include auto-slug generation in the admin form (typing product name automatically creates a clean URL slug).

3. **Selected Differentiation Tactics for Phase 2 & 4**:
   - **Tactic 1: Dual Image Hover Swap & Zoom** — On desktop hover and mobile tap, smoothly cross-fade to the second gallery image with a subtle zoom.
   - **Tactic 2: Sticky Mobile "Add to Cart" Bar** — On mobile product detail pages, when the user scrolls past the main buy button, a compact bottom bar slides in with the product title, price, and instant "Add to Cart" button.
   - **Tactic 3: Polished Skeleton Shimmer Loading States** — Eliminates the jarring Shopify layout shift when loading products and collections.
   - **Tactic 4: Luxury Indian Boutique Aesthetic** — Pairing `Cormorant Garamond` (display headings) and `DM Sans` (body) with the rich `#FCF3ED` ivory and `#7B3D14` terracotta palette.

