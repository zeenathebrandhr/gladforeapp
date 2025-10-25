# Gladfore - Fertilizer Credit Management System

## Overview
Gladfore is a mobile-first web application designed to digitize the onboarding and fertilizer credit process for farmers in Kenya. The system manages three distinct user roles (Admin, Agent, Farmer) and enforces a strict business rule: 50% down payment is the sole eligibility requirement for fertilizer credit.

## Project Status
**Current Phase:** MVP Complete - All Tasks Finished
**Last Updated:** December 2024
**Schema:** Snake_case column names (database-first approach)
**Supabase:** Tables created, RLS policies implemented
**Frontend:** All components built with mobile-first design

## Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Routing:** Wouter (lightweight React router)
- **Styling:** Tailwind CSS with Shadcn UI components
- **Icons:** Material Icons + Lucide React
- **Forms:** React Hook Form with Zod validation
- **State Management:** TanStack Query v5
- **Design System:** Material Design 3 principles (mobile-first)

### Backend & Database
- **Backend:** Supabase (PostgreSQL + Auth + Realtime)
- **ORM:** Drizzle ORM
- **Authentication:** Supabase Auth (Email/Password for Admin/Agent, Phone OTP for Farmers)
- **Validation:** Zod schemas

### Shared Business Logic
- Isolated in `shared/businessLogic.ts` for cross-platform reuse
- Pure TypeScript functions (no framework dependencies)
- Designed for future React Native mobile app

## Architecture

### Data Model (`shared/schema.ts`)
1. **Users Table** - Authentication and role management
   - Roles: 'admin' | 'agent' | 'farmer'
   - Email, name, phone, agentId

2. **Farmers Table** - Farmer registry
   - Name, phone, nationalId
   - Linked to agent who registered them

3. **Orders Table** - Fertilizer credit orders
   - Product details, quantities, pricing
   - Status: 'pending' | 'approved' | 'rejected'
   - 50% down payment tracking
   - Remaining 50% balance

4. **Payments Table** - Payment schedule for remaining balance
   - Due dates (typically 30 days after approval)
   - Status: 'pending' | 'paid' | 'overdue'

### Mobile-First Design Philosophy
- **Base breakpoint:** 0-767px (mobile)
- **Tablet:** 768-1023px (md:)
- **Desktop:** 1024px+ (lg:)
- All UI components designed for mobile first, then enhanced for larger screens
- Touch targets minimum 48x48px
- Bottom navigation on mobile, top navigation on desktop

## User Roles & Features

### Admin
**Routes:** `/admin/dashboard`, `/admin/farmers`, `/admin/orders`

**Features:**
1. **Dashboard:** Financial overview (total down payments, pending debt, order stats)
2. **Farmers Management:** CSV upload for bulk farmer registration
3. **Order Approval:** Review pending orders, approve/reject with payment schedule creation

### Agent
**Routes:** `/agent/dashboard`, `/agent/farmers`, `/agent/new-order`, `/agent/profile`

**Features:**
1. **Dashboard:** Personal stats (orders, farmers linked)
2. **Farmer Lookup:** Search and link farmers by phone/ID
3. **Order Creation:** 
   - Vertical form flow (mobile-optimized)
   - Auto-calculated 50% down payment
   - Strict validation (payment must be exactly 50%)
   - Real-time cost breakdown
4. **Profile:** View agent details

### Farmer
**Routes:** `/farmer/orders`, `/farmer/payments`, `/farmer/profile`

**Features:**
1. **Order History:** View all orders with status
2. **Payment Schedule:** 
   - Next payment due highlighted
   - Overdue warnings
   - Payment timeline
3. **Profile:** View farmer details

## Business Logic (`shared/businessLogic.ts`)

### Key Functions
- `calculateTotalCost(quantity, unitPrice)` - Compute order total
- `calculateDownPayment(totalCost)` - Calculate 50% down payment
- `validateDownPayment(totalCost, recorded)` - Enforce exact 50% rule
- `formatCurrency(amount)` - Format as KES currency
- `isPaymentOverdue(dueDate)` - Check payment status
- `getStatusVariant(status)` - UI status badge coloring

### Strict 50% Validation Rule
The system enforces that recorded down payments must be **exactly** 50% of the total cost. This is validated:
1. In the form (UI feedback with checkmark)
2. Before submission (frontend validation)
3. Will be enforced in backend (Task 2)

## Component Structure

### Layout Components
- `AppLayout` - Main layout wrapper with auth checking
- `MobileNav` - Fixed bottom navigation (mobile only)
- `DesktopNav` - Sticky top navigation (desktop only)
- `PageHeader` - Consistent page titles with optional actions

### Shared Components
- `StatusBadge` - Order/payment status indicators
- All Shadcn UI primitives (Button, Card, Input, etc.)

### Pages by Role
**Admin:** Dashboard, Farmers (CSV upload), Orders (approval)
**Agent:** Dashboard, Farmers (search/link), New Order (creation), Profile
**Farmer:** Orders (history), Payments (schedule), Profile

## Environment Variables
```
VITE_SUPABASE_URL - Supabase project URL
VITE_SUPABASE_ANON_KEY - Supabase anonymous key
```

## Development Workflow
1. **Task 1 (Complete):** Schema definition & all frontend components
2. **Task 2 (Pending):** Supabase setup, database tables, RLS policies, API routes
3. **Task 3 (Pending):** Integration, testing, polish

## Design Guidelines
See `design_guidelines.md` for comprehensive UI/UX specifications including:
- Typography scale (Inter font)
- Spacing system (4px base unit)
- Component specifications
- Mobile/desktop responsive patterns
- Accessibility requirements

## Authentication Flow
1. **Login Page:** Dual-mode (Email/Password or Phone OTP)
2. **Admin/Agent:** Email + password authentication
3. **Farmer:** Phone number + OTP (SMS)
4. **Post-login:** Redirect based on user role
5. **Session:** Managed by Supabase Auth

## CSV Upload Format (Admin)
Farmers CSV should include:
- Name
- Phone
- National ID (nationalId or ID column)

## Next Steps (Task 2)
1. Create Supabase database tables
2. Implement Row-Level Security (RLS) policies
3. Set up API routes for CRUD operations
4. Configure Supabase Auth providers (email + phone)
5. Test data flow end-to-end

## Notes
- No mock data in final implementation
- All features functional with real Supabase backend
- Component library designed for React Native portability
- Business logic 100% framework-agnostic
