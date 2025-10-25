# Gladfore Design Guidelines

## Design Approach

**Selected System:** Material Design 3 (Utility-Focused Application)

**Rationale:** Gladfore is a productivity-focused business application serving three distinct user roles with form-heavy workflows, data visualization, and mobile-first requirements. Material Design 3 provides robust mobile patterns, excellent form components, and clear hierarchy systems perfect for information-dense interfaces.

**Core Principles:**
- Mobile-first with progressive enhancement
- Clear role-based navigation patterns
- Efficient data entry and validation feedback
- Accessible touch targets (minimum 48x48px)
- Scannable information hierarchy

---

## Typography System

**Font Family:** Inter (Google Fonts via CDN)
- Primary: Inter (400, 500, 600, 700)

**Mobile Typography Scale:**
- H1 (Page Titles): 28px / 700 / 1.2 line-height
- H2 (Section Headers): 22px / 600 / 1.3 line-height
- H3 (Card Titles): 18px / 600 / 1.4 line-height
- Body Large: 16px / 400 / 1.5 line-height
- Body: 14px / 400 / 1.5 line-height
- Caption/Labels: 12px / 500 / 1.4 line-height
- Button Text: 14px / 600 / uppercase letter-spacing 0.5px

**Desktop Enhancement (md: breakpoint):**
- H1: 36px
- H2: 28px
- H3: 20px
- Body Large: 18px

---

## Layout System

**Spacing Scale (Tailwind Units):**
Core spacing values: **2, 4, 6, 8, 12, 16, 20, 24**

**Mobile Layout (Base - 375px+):**
- Screen padding: px-4 (16px)
- Section spacing: py-6 (24px)
- Component gaps: gap-4 (16px)
- Card padding: p-4 (16px)
- Form field spacing: space-y-4 (16px)

**Tablet Layout (md: 768px+):**
- Screen padding: px-6 (24px)
- Section spacing: py-8 (32px)
- Component gaps: gap-6 (24px)
- Card padding: p-6 (24px)

**Desktop Layout (lg: 1024px+):**
- Screen padding: px-8 (32px)
- Section spacing: py-12 (48px)
- Max content width: max-w-7xl (1280px)

**Grid System:**
- Mobile: Single column (grid-cols-1)
- Tablet: Two columns for cards/data (md:grid-cols-2)
- Desktop: Three columns max for dashboard widgets (lg:grid-cols-3)

---

## Component Library

### Navigation

**Mobile Bottom Navigation Bar:**
- Fixed bottom position with 4 navigation items
- Icon + label (12px text below icon)
- Height: 64px with safe-area-inset-bottom
- Active state: bold icon with underline indicator (2px height)

**Desktop Top Navigation:**
- Horizontal bar with logo left, navigation center, user profile right
- Height: 64px
- Sticky position on scroll

**Role-Specific Navigation Items:**
- Admin: Dashboard, Farmers, Orders, Reports
- Agent: Dashboard, New Order, My Farmers, Profile
- Farmer: My Orders, Payment Schedule, Profile

### Forms & Input Fields

**Form Container:**
- Vertical stacking (space-y-6)
- Mobile: full width with px-4 container
- Desktop: max-w-2xl centered

**Text Inputs:**
- Height: 56px (touch-friendly)
- Border radius: 8px
- Padding: px-4
- Label: floating label pattern (Material Design style)
- Focus: 2px border width
- Error state: helper text below (12px)

**Buttons:**
- Primary CTA: h-12 (48px) with px-6, rounded-lg
- Secondary: h-10 (40px) with px-4, rounded-lg
- Icon-only: 48x48px minimum
- Full-width on mobile for primary actions

**Search Fields:**
- Prominent search bar: h-14 (56px)
- Magnifying glass icon left, clear button right
- Rounded-full (fully rounded) appearance

### Cards & Data Display

**Order Cards (Mobile-First):**
- Full-width mobile, 2-column tablet, 3-column desktop
- Padding: p-4 mobile, p-6 desktop
- Border radius: 12px
- Shadow: subtle elevation (shadow-sm)
- Header: Order ID + Status badge
- Body: Vertical info stack (space-y-2)
- Footer: Action buttons (full-width mobile, inline desktop)

**Dashboard Stat Cards:**
- Grid layout: 1 column mobile, 2 columns tablet, 3 columns desktop
- Height: auto with min-h-32
- Large number display: 32px / 700
- Label: 14px / 500 below number
- Icon: top-right corner (24x24px)

**Data Tables (Desktop Priority):**
- Mobile: Collapse to card view (stacked rows)
- Tablet+: Standard table with sticky header
- Row height: 56px minimum
- Zebra striping for readability
- Sortable column headers with arrow icons

### Status Indicators

**Status Badges:**
- Inline display with text
- Padding: px-3 py-1
- Border radius: rounded-full
- Font: 12px / 600 / uppercase
- States: Pending, Approved, Rejected, Paid, Overdue

**Progress Indicators:**
- Payment progress: Linear progress bar (h-2, rounded-full)
- Percentage label above bar (14px / 600)

### Modals & Overlays

**Mobile Modal (Bottom Sheet):**
- Slides up from bottom
- Rounded top corners: 16px
- Handle indicator at top (32px wide, 4px height)
- Content padding: p-6
- Max height: 90vh

**Desktop Modal:**
- Centered overlay
- Max width: max-w-2xl
- Padding: p-8
- Border radius: 16px

### Admin-Specific Components

**CSV Upload Zone:**
- Dashed border container
- Height: 160px mobile, 200px desktop
- Upload icon (48x48px) centered
- Drag-drop text + browse button
- File list below with remove option

**Order Approval Interface:**
- Order details card on top
- Payment proof section (image display)
- Approve/Reject buttons: side-by-side desktop, stacked mobile
- Approve: h-12 full-width mobile
- Reject: h-12 full-width mobile with mt-4

**Dashboard Charts:**
- Mobile: Single column, scrollable
- Desktop: 2-column grid
- Height: h-64 minimum
- Use chart.js or recharts library

### Agent-Specific Components

**Farmer Lookup:**
- Prominent search bar at top
- Results list: Card-based with phone + name + link button
- Empty state: centered icon + text
- Recent searches: Quick access chips below search

**Order Creation Form:**
- Vertical progression (stepper not needed for MVP)
- Sections: Farmer Info → Product Selection → Cost Summary → Payment
- Cost breakdown card: auto-calculating with 50% display
- Payment input: Large, validated field with checkmark on exact match
- Submit button: Disabled until validation passes

### Farmer-Specific Components

**Order List View:**
- Timeline-style vertical list
- Each order: Card with order date, amount, status
- Tap to expand for payment schedule
- Visual indicator for overdue payments

**Payment Schedule:**
- Table format on desktop
- Card list on mobile
- Columns: Due Date, Amount, Status
- Next payment highlighted

---

## Icons

**Icon Library:** Material Icons (via Google Fonts CDN)

**Icon Usage:**
- Navigation: 24x24px
- Buttons: 20x20px
- Status indicators: 16x16px
- Cards: 24x24px or 32x32px for emphasis

**Common Icons:**
- Dashboard: dashboard
- Orders: receipt_long
- Farmers: people
- Upload: cloud_upload
- Search: search
- Add: add_circle
- Approve: check_circle
- Reject: cancel
- Payment: payments
- Profile: account_circle

---

## Responsive Behavior

**Breakpoints:**
- Mobile: 0-767px (base)
- Tablet: 768-1023px (md:)
- Desktop: 1024px+ (lg:)

**Layout Transformations:**
- Bottom nav (mobile) → Top horizontal nav (desktop)
- Stacked forms → Side-by-side when space allows
- Card lists → Grid layouts
- Hidden sidebar (mobile) → Persistent sidebar (desktop for Admin)

**Touch Targets:**
- All interactive elements: minimum 48x48px
- Adequate spacing between tappable elements: 8px minimum

---

## Accessibility

**Form Fields:**
- Visible labels always (no placeholder-only)
- Clear error messages
- Success feedback on validation

**Keyboard Navigation:**
- Logical tab order
- Enter to submit forms
- Escape to close modals

**Screen Reader Support:**
- Semantic HTML (nav, main, aside, article)
- ARIA labels for icon-only buttons
- Status announcements for dynamic content

---

## Animation Guidelines

**Minimal, Purposeful Motion:**
- Button press: subtle scale (0.98) on active
- Modal entry: slide-up 200ms ease-out
- Form validation: shake on error (subtle, 300ms)
- Loading states: skeleton screens (no spinners)
- Page transitions: simple fade (150ms)

**No Animations:**
- Hero sections (N/A for this app)
- Scroll-triggered effects
- Parallax or decorative motion

---

## Images

This application does not require hero images or marketing imagery. All visuals are functional:

**Functional Images:**
- User profile photos: 40x40px circular thumbnails
- Payment proof uploads: display in modal at actual size, thumbnail preview in lists
- CSV file icons: 24x24px file type indicators

**No Hero Section:** This is a business application focused on forms, data, and workflows. No marketing-style hero imagery is needed.