# Product Requirements Document (PRD)
## Silo — One-Size-Fits-All Inventory Management Web App

**Version:** 1.0  
**Date:** April 2026  
**Status:** Draft  

---

## Table of Contents

1. [Overview](#1-overview)
2. [Goals & Success Metrics](#2-goals--success-metrics)
3. [Target Users & Personas](#3-target-users--personas)
4. [Features & Requirements](#4-features--requirements)
5. [User Stories](#5-user-stories)
6. [Data Model](#6-data-model)
7. [Tech Stack](#7-tech-stack)
8. [UI/UX Flow](#8-uiux-flow)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [Out of Scope](#10-out-of-scope)
11. [Milestones & Phases](#11-milestones--phases)

---

## 1. Overview

### 1.1 Product Summary

**Silo** is a multi-tenant, cloud-based inventory management web application built for retail shops and warehouse-type businesses. It provides a centralized platform for tracking products, managing stock levels, handling purchase orders, recording stock movements, and generating insightful reports — all within a clean and intuitive interface that adapts to businesses of varying sizes and industries.

### 1.2 Problem Statement

Small-to-medium retail shops and warehouses often struggle with one of two scenarios:

- **Too simple:** They use spreadsheets or basic tools that don't scale, lack an audit trail, and break down with multiple users or locations.
- **Too complex:** Enterprise tools like SAP or Oracle are expensive, over-engineered, and require dedicated IT staff to configure and maintain.

There is a clear gap for a tool that is powerful enough to handle real business needs — multi-location, multi-user, purchase orders, reporting — while remaining affordable, intuitive, and fast to set up.

### 1.3 Proposed Solution

Silo fills this gap by offering a flexible, modular inventory platform with:

- A clean, role-based interface accessible to non-technical staff
- Custom attributes so any type of product can be tracked (clothing sizes, serial numbers, expiry dates, shelf locations, etc.)
- A full stock movement audit trail so nothing is ever "just edited"
- Multi-tenancy so each business has a fully isolated account
- Multi-location support for businesses with more than one branch or warehouse

---

## 2. Goals & Success Metrics

### 2.1 Business Goals

- Build a scalable SaaS inventory platform targeting retail and warehouse businesses
- Achieve product-market fit within the first 6 months post-launch
- Establish a freemium or tiered pricing model to support growth

### 2.2 Product Goals

- A new business can complete full setup (organization, locations, products) in under 15 minutes
- Staff can record a stock movement in under 30 seconds
- Managers can generate a stock report in under 1 minute

### 2.3 Success Metrics

| Metric | Target |
|---|---|
| Setup time for new organization | < 15 minutes |
| Time to record a stock movement | < 30 seconds |
| Stock discrepancy reduction | 40% within 3 months of use |
| User retention (month 2) | > 60% |
| System uptime | 99.5% |
| Page load time | < 2 seconds |

---

## 3. Target Users & Personas

### 3.1 Persona 1 — The Retail Shop Owner (Primary)

**Name:** Emeka  
**Role:** Owner of a mid-sized clothing retail store  
**Tech comfort:** Moderate (uses WhatsApp, basic spreadsheets)

**Goals:**
- Know exactly what stock he has at any point in time
- Avoid running out of fast-moving products
- Reduce theft and discrepancies by tracking who did what

**Pain Points:**
- Currently uses Excel; it gets out of sync when staff make changes
- No easy way to track which items are selling fast
- Hard to track stock across two store branches

---

### 3.2 Persona 2 — The Warehouse Manager (Primary)

**Name:** Fatima  
**Role:** Warehouse manager at a consumer goods distribution company  
**Tech comfort:** High (comfortable with ERPs and desktop software)

**Goals:**
- Track inbound stock from multiple suppliers
- Manage stock across different shelf zones
- Generate daily/weekly stock movement reports for management

**Pain Points:**
- Current ERP is too rigid — custom product attributes can't be added
- Reports take too long to generate
- No mobile access for floor staff

---

### 3.3 Persona 3 — The Stock Clerk (Secondary)

**Name:** Chidi  
**Role:** Junior staff member at a retail store  
**Tech comfort:** Basic (uses smartphone daily, familiar with simple apps)

**Goals:**
- Quickly log received stock or sold items
- View current stock levels for specific products

**Pain Points:**
- Doesn't want a complicated interface — needs something simple to use
- Sometimes needs to scan barcodes instead of searching manually

---

## 4. Features & Requirements

### 4.1 Phase 1 — MVP

#### 4.1.1 Authentication & Organization Setup

- User registration with email and password or Google SSO
- Email verification on signup
- Login with JWT-based session management
- Password reset via email
- On first login, user creates an **Organization** (business account)
- Each organization is fully isolated (multi-tenancy)
- Organization profile: name, industry type, logo, address, currency

#### 4.1.2 User Roles & Permissions

Three default roles per organization:

| Role | Permissions |
|---|---|
| Admin | Full access — settings, users, all data |
| Staff | Can manage products, record movements, view reports |
| Viewer | Read-only access to products and reports |

- Admin can invite users via email link
- Admin can assign/change roles
- Users can only belong to one organization

#### 4.1.3 Product / SKU Management

- Create, edit, and archive products
- Required fields: name, SKU (auto-generated or manual), category, unit of measure
- Optional fields: description, cost price, selling price, product image, barcode
- **Custom attributes:** Each product can have user-defined attributes (e.g., `color`, `size`, `shelf_location`, `expiry_date`, `serial_number`). Attributes can be text, number, date, or dropdown.
- Bulk import via CSV
- Search and filter by name, SKU, category, or custom attribute

#### 4.1.4 Categories & Tags

- Create and manage product categories (e.g., Electronics, Clothing, Food & Beverage)
- Assign multiple tags per product for flexible filtering
- Categories are scoped per organization

#### 4.1.5 Supplier Management

- Create, edit, and archive suppliers
- Supplier fields: name, contact person, phone, email, address, payment terms, notes
- Link products to one or more suppliers
- View all products supplied by a given supplier

#### 4.1.6 Inventory / Stock Tracking

- Each product has a stock level per location
- Stock can be adjusted via **stock movements** — never directly overwritten
- Movement types:
  - **Stock In** — received from supplier or manual addition
  - **Stock Out** — sold, transferred, or consumed
  - **Adjustment** — correction (must include reason: damage, theft, count correction, etc.)
- Each movement records: product, quantity, location, movement type, reason, user, timestamp
- Current stock level = sum of all historical movements for that product at that location

#### 4.1.7 Low Stock Alerts

- Admin can set a **reorder point** per product per location
- When stock falls at or below the reorder point, the product is flagged
- Low stock items are highlighted on the dashboard
- In-app notification when a product hits the reorder threshold

#### 4.1.8 Dashboard

Key metrics displayed on the main dashboard:

- Total number of products
- Total inventory value (cost price × quantity)
- Number of low stock items (with quick link)
- Recent stock movements (last 10)
- Top 5 most stocked products
- Top 5 lowest stock products
- Quick actions: Add Product, Record Movement, Create Purchase Order

---

### 4.2 Phase 2

#### 4.2.1 Purchase Orders

- Create purchase orders (PO) linked to a supplier
- PO line items: product, quantity ordered, unit cost
- PO statuses: Draft → Sent → Partially Received → Received → Cancelled
- When a PO is marked as "Received," stock is automatically updated with a **Stock In** movement
- Partial receiving supported (record only what was delivered)
- PO history and PDF export

#### 4.2.2 Sales / Stock Outflow Tracking

- Record outgoing stock as "Sales" or "Outflow"
- Link outflows to a customer name (optional)
- View outflow history with filter by date, product, or customer
- This is not a full POS system — it is stock deduction tracking only

#### 4.2.3 Multi-Location Support

- Admin can create multiple locations (branches, warehouses, zones)
- Each product has independent stock levels per location
- Stock transfers between locations are recorded as movements
- Dashboard can be filtered by location or show totals across all

#### 4.2.4 CSV Import / Export

- Import products in bulk via CSV template
- Export current stock levels, movement history, and supplier lists as CSV
- Downloadable CSV templates with column definitions

#### 4.2.5 Barcode / QR Scanning

- Support scanning barcodes via device camera (web-based scanner using JS library)
- Scanning opens the matching product instantly
- Barcodes can be assigned to products during creation or later
- Ability to print product barcode labels (PDF)

---

### 4.3 Phase 3

#### 4.3.1 Reporting & Analytics

- **Stock Valuation Report:** Total value of current inventory (by location, category, or all)
- **Stock Movement Report:** All movements within a date range, filterable by product, type, or user
- **Low Stock Report:** All products currently below reorder point
- **Product Performance Report:** Most stocked and most depleted products over time
- **Supplier Report:** Purchase history per supplier with total spend
- All reports exportable as CSV or PDF

#### 4.3.2 Notifications

- In-app notification center
- Email notifications for:
  - Low stock alerts
  - Purchase order status changes
  - New user invited to organization
- User can configure notification preferences

#### 4.3.3 Audit Logs

- Every action that modifies data is logged: who did it, what changed, when
- Audit log is read-only and accessible only to Admin
- Filterable by user, action type, and date range

#### 4.3.4 Multi-User Teams & Advanced Permissions

- Custom roles (in addition to default Admin/Staff/Viewer)
- Granular permissions: e.g., "can create products but not delete," "can view but not export reports"
- Team activity summary visible to Admin

---

## 5. User Stories

### Authentication

- As a new user, I want to register with my email and password so that I can create an account.
- As a returning user, I want to log in securely so that I can access my organization's data.
- As an admin, I want to invite team members via email so that they can access the system with the right role.

### Products

- As a staff member, I want to add a new product with a custom SKU and attributes so that it matches what we actually sell.
- As an admin, I want to import products in bulk via CSV so that I don't have to add them one by one.
- As any user, I want to search products by name, SKU, or category so that I can quickly find what I'm looking for.

### Stock Management

- As a staff member, I want to record a stock-in movement when new goods arrive so that the inventory count stays accurate.
- As a staff member, I want to record a stock adjustment with a reason (e.g., damaged goods) so that the reason for the change is documented.
- As a manager, I want to see the full movement history for a product so that I can investigate any discrepancies.

### Alerts

- As an admin, I want to set a reorder point for each product so that I get notified when stock is running low.
- As a manager, I want to see all low stock items on my dashboard so that I can act quickly.

### Purchase Orders

- As a manager, I want to create a purchase order for a supplier so that I can track incoming stock formally.
- As a staff member, I want to mark a purchase order as received so that the stock levels are automatically updated.

### Reports

- As an admin, I want to generate a stock valuation report so that I know the total value of my inventory.
- As a manager, I want to export stock movement data as CSV so that I can share it with the finance team.

### Multi-Location

- As an admin, I want to create multiple locations so that I can track inventory separately for each branch.
- As a staff member at Branch A, I want to initiate a stock transfer to Branch B so that both locations stay updated.

---

## 6. Data Model

### 6.1 Core Entities

#### Organization
```
id, name, industry, logo_url, address, currency, created_at, updated_at
```

#### User
```
id, organization_id, email, password_hash, role (admin | staff | viewer), 
is_verified, created_at, updated_at
```

#### Location
```
id, organization_id, name, type (store | warehouse | zone), address, 
is_active, created_at
```

#### Category
```
id, organization_id, name, description, created_at
```

#### Supplier
```
id, organization_id, name, contact_person, phone, email, address, 
payment_terms, notes, is_active, created_at
```

#### Product
```
id, organization_id, name, sku, category_id, unit_of_measure, 
cost_price, selling_price, barcode, image_url, description, 
custom_attributes (JSONB), is_active, created_at, updated_at
```

#### InventoryItem
```
id, product_id, location_id, quantity_on_hand, reorder_point, created_at, updated_at
```
> Note: `quantity_on_hand` is a materialized/cached value computed from StockMovements for performance. It is always updated atomically when a movement is recorded.

#### StockMovement
```
id, organization_id, product_id, location_id, user_id, 
movement_type (stock_in | stock_out | adjustment | transfer_in | transfer_out),
quantity, reason, reference_id (nullable, e.g. PO id), notes, created_at
```

#### PurchaseOrder
```
id, organization_id, supplier_id, location_id, status (draft | sent | partial | received | cancelled),
order_date, expected_date, notes, created_by, created_at, updated_at
```

#### PurchaseOrderItem
```
id, purchase_order_id, product_id, quantity_ordered, quantity_received, unit_cost
```

### 6.2 Entity Relationships

```
Organization
  ├── Users (many)
  ├── Locations (many)
  ├── Categories (many)
  ├── Suppliers (many)
  ├── Products (many)
  │     └── InventoryItems (one per Location)
  ├── StockMovements (many)
  └── PurchaseOrders (many)
        └── PurchaseOrderItems (many)
```

---

## 7. Tech Stack

Use pnpm as the package manager for both frontend and backend.

### 7.1 Frontend

| Technology | Purpose |
|---|---|
| Nextjs + TypeScript | UI framework with type safety |
| Tailwind CSS | Utility-first styling |
| React Query (TanStack) | Selective client-side server state, caching, and mutation handling for interactive workflows |
| Zustand | Client/global state management |
| Zod | Form handling and validation |
| Recharts | Dashboard charts and graphs |
| html5-qrcode | Barcode / QR scanning via camera |

Frontend data fetching approach:

- Use Next.js server components, route handlers, and server actions as the default approach for page data loading
- Use TanStack Query only where client-side caching, background refetching, optimistic updates, or shared interactive server state provide clear UX value
- Use Zustand for local UI state such as drawer visibility, active filters, selected rows, and temporary workflow state

### 7.2 Backend

| Technology | Purpose |
|---|---|
| Node.js + Express (or Fastify) | REST API server |
| TypeScript | Type safety on the backend |
| Prisma ORM | Database access and migrations |
| PostgreSQL | Primary relational database |
| JWT (jsonwebtoken) | Authentication tokens |
| Nodemailer | Transactional emails |
| Multer + Cloudinary | File/image upload handling |
| Zod | API input validation |

### 7.3 Infrastructure

| Technology | Purpose |
|---|---|
| Railway or Render | Backend hosting & PostgreSQL |
| Vercel | Frontend hosting |
| Cloudinary | Product image storage |
| Resend or SendGrid | Email delivery |
| GitHub Actions | CI/CD pipeline |

### 7.4 Multi-Tenancy Strategy

- **Shared database, shared schema** approach
- Every table includes `organization_id` as a foreign key
- All queries are scoped to `organization_id` at the service layer
- Row-level security enforced at both API middleware and ORM query level

---

## 8. UI/UX Flow

### 8.1 Key Screens

1. **Landing / Auth** — Login, Register, Forgot Password
2. **Onboarding** — Create Organization, add first Location, invite team
3. **Dashboard** — Summary metrics, low stock alerts, recent activity
4. **Products** — Product list (table), product detail, add/edit product modal
5. **Inventory** — Stock levels table per location, filter by location/category
6. **Stock Movements** — Movement history, record new movement modal
7. **Suppliers** — Supplier list, supplier detail with linked products and PO history
8. **Purchase Orders** — PO list, PO detail, create/edit PO, receive goods
9. **Locations** — Location list, add/edit location, per-location stock view
10. **Reports** — Report selection, filters, results table, export button
11. **Settings** — Organization profile, users & roles, categories, integrations
12. **Notifications** — In-app notification center

### 8.2 Navigation Structure

```
Sidebar Navigation
├── Dashboard
├── Products
│     ├── All Products
│     └── Categories
├── Inventory
│     ├── Stock Levels
│     └── Stock Movements
├── Purchasing
│     ├── Purchase Orders
│     └── Suppliers
├── Locations
├── Reports
└── Settings
      ├── Organization
      ├── Users & Roles
      └── Notifications
```

### 8.3 Design Principles

- Mobile-responsive — usable on tablets and phones for floor/warehouse staff
- Clean, data-dense tables with search, filter, and sort on all list views
- Modals for quick actions (record movement, add product) without full page navigation
- Color-coded stock status: green (healthy), amber (low), red (critical/zero)
- Minimal onboarding friction — a new organization should be functional in under 15 minutes

---

## 9. Non-Functional Requirements

### 9.1 Security

- All API endpoints require authentication (except login/register)
- JWT tokens expire after 7 days; refresh token mechanism for active sessions
- All organization data is strictly isolated — no cross-tenant data leakage
- Passwords hashed with bcrypt (salt rounds ≥ 12)
- HTTPS enforced on all environments
- Input sanitization and SQL injection prevention via ORM parameterization
- Rate limiting on authentication endpoints

### 9.2 Performance

- Dashboard load time under 2 seconds on standard broadband
- Product list pagination (max 50 items per page) to avoid large data loads
- Database indexes on frequently queried columns: `organization_id`, `product_id`, `sku`, `created_at`
- Image uploads resized and optimized via Cloudinary before storage

### 9.3 Scalability

- Stateless API design to support horizontal scaling
- Database connection pooling via Prisma
- Designed to handle up to 100,000 products and 1,000,000 stock movements per organization

### 9.4 Reliability

- Target uptime: 99.5%
- Database backups: daily automated backups with 30-day retention
- Error logging via a service like Sentry

### 9.5 Accessibility

- Semantic HTML throughout
- WCAG 2.1 AA compliance for core workflows
- Keyboard navigable interfaces
- Sufficient color contrast ratios

### 9.6 Browser & Device Support

- Chrome, Firefox, Safari, Edge (latest 2 major versions)
- Responsive design: desktop (primary), tablet, mobile (secondary)

---

## 10. Out of Scope

The following are explicitly **not included** in any phase of this project:

- **Point of Sale (POS) system** — Silo is not a cashier or payment system
- **Accounting / bookkeeping** — No invoicing, ledgers, or tax calculation
- **eCommerce integration** — No Shopify, WooCommerce, or marketplace sync (may be a future add-on)
- **Manufacturing / production tracking** — No bill of materials or work orders
- **HR or payroll** — No employee management beyond user roles
- **Native mobile apps** — iOS/Android apps are not planned; the web app will be mobile-responsive
- **Offline mode** — The app requires an internet connection to function
- **AI-based demand forecasting** — May be considered as a future Phase 4 feature

---

## 11. Milestones & Phases

### Phase 1 — MVP (Estimated: 8–10 weeks)

**Goal:** A usable, production-ready core product.

| Week | Milestone |
|---|---|
| 1–2 | Project setup, DB schema, auth (register, login, roles) |
| 3–4 | Organization setup, locations, categories, supplier management |
| 5–6 | Product management with custom attributes, CSV import |
| 7–8 | Inventory tracking, stock movements, low stock alerts |
| 9–10 | Dashboard, polishing, testing, deployment |

**Definition of Done:** A retail business can sign up, add products, track stock movements, and view a dashboard — in production.

---

### Phase 2 — Growth Features (Estimated: 6–8 weeks)

**Goal:** Handle full procurement and multi-location workflows.

| Feature | Effort |
|---|---|
| Purchase orders & receiving | Medium |
| Sales / outflow tracking | Small |
| Multi-location stock & transfers | Medium |
| CSV export | Small |
| Barcode / QR scanning | Medium |

---

### Phase 3 — Power Features (Estimated: 6–8 weeks)

**Goal:** Reporting, notifications, and admin controls for growing teams.

| Feature | Effort |
|---|---|
| Reporting & analytics suite | Large |
| Email & in-app notifications | Medium |
| Audit logs | Small |
| Advanced roles & permissions | Medium |

---

# 12. Testing Guide

## 12.1 Philosophy

- A feature is **not considered done** until it has tests.
- Write tests **as you build**, not at the end.
- Prefer testing **behavior over implementation** — test what the code does, not how it does it.
- Keep tests **fast, isolated, and deterministic**.

---

## 12.2 Testing Stack

| Layer | Tool | Purpose |
|---|---|---|
| Unit & Integration | **Vitest** | Fast TypeScript-native test runner for both frontend and backend |
| Component Testing | **React Testing Library** | Tests UI behavior from the user's perspective |
| API/Route Testing | **Supertest** | Sends real HTTP requests to Express in-process |
| E2E Testing | **Playwright** | Full browser-based user flow testing |
| API Mocking | **MSW (Mock Service Worker)** | Intercepts fetch calls without modifying app code |
| Data Seeding | **@faker-js/faker** | Generates realistic mock data for tests |
| Test Database | **PostgreSQL (Docker)** | Isolated database instance for backend integration tests |

---


## Appendix

### A. Glossary

| Term | Definition |
|---|---|
| SKU | Stock Keeping Unit — a unique identifier for a product variant |
| Multi-tenancy | A single application instance serving multiple isolated organizations |
| Reorder Point | The stock level at which a replenishment alert is triggered |
| Stock Movement | Any change to stock quantity — inbound, outbound, or adjustment |
| Custom Attribute | A user-defined field added to a product (e.g., color, size, shelf_id) |
| PO | Purchase Order — a formal document sent to a supplier to request goods |
| Audit Trail | An immutable log of all changes made to inventory data |

### B. Assumptions

- Each organization manages its own product catalog independently
- The system handles one currency per organization (no multi-currency in MVP)
- Barcode scanning is camera-based in MVP; hardware scanner support via keyboard emulation is inherently supported
- Email delivery is required for invitations and low stock alerts from Phase 1
