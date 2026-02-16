# Task List: Muslim Lifestyle App (PWA) & Admin Panel

## Phase 1: Planning & Architecture

- [x] **Technical Design** <!-- id: 1 -->
  - [x] Finalize Requirement Analysis (Features & User Roles)
  - [x] Design Database Schema (User, Lesson, Dua, Place)
  - [x] Define API Interface Specification
  - [x] Select UI Component Library or Design System tokens

## Phase 2: Project Initialization

- [x] **Scaffolding** <!-- id: 2 -->
  - [x] Initialize Next.js 14 Project (`npx create-next-app`)
  - [x] Configure TypeScript, ESLint, Prettier
  - [x] Setup Folder Structure (app, components, lib, styles, prisma)
- [x] **Infrastructure** <!-- id: 3 -->
  - [x] Setup PostgreSQL Database (Local or Hosted)
  - [x] Configure Prisma ORM & Run Initial Migration
  - [x] Configure NextAuth.js (Admin Credentials Provider)
  - [x] Setup PWA (manifest, icons, service worker)

## Phase 3: Core Features (Frontend PWA)

- [x] **Layout & Navigation** <!-- id: 4 -->
  - [x] Create Responsive Shell (Sidebar/Bottom Nav)
  - [x] Implement Dark/Light Mode Theme Provider
- [x] **Home Dashboard** <!-- id: 5 -->
  - [x] Build Hero Component (Prayer Timer)
  - [x] Create Daily Content Widgets (Dua/Ayah)
- [x] **Prayer Times System** <!-- id: 6 -->
  - [x] Implement `useGeolocation` Hook
  - [x] Integrate Aladhan API
  - [x] Build Monthly Schedule View
  - [x] Implement Azan Audio Player
- [x] **Quran Reader** <!-- id: 7 -->
  - [x] Build Surah Index Page
  - [x] Create Ayah List Component with Virtualization
  - [x] Implement Search & Filter
  - [x] Add Audio Playback Controls
- [x] **Qibla Compass** <!-- id: 8 -->
  - [x] Implement `DeviceOrientation` Logic
  - [x] innovative Compass UI Component

## Phase 4: Dynamic Features (Backend & Data)

- [ ] **Islamic Lessons** <!-- id: 9 -->
  - [ ] Create API: `GET /api/lessons` (Pagination, Filter)
  - [ ] Build Lesson List & Detail Pages
- [ ] **Duas (Hisn'ul Muslim)** <!-- id: 10 -->
  - [ ] Create API: `GET /api/duas` (Categories)
  - [ ] Build Dua List & Search UI
- [ ] **Halal Places Finder** <!-- id: 11 -->
  - [ ] Integrate Leaflet/React-Leaflet
  - [ ] Create API: `GET /api/proximities` (Combine OSM + Local DB)
  - [ ] Build Interactive Map Component

## Phase 5: Admin Panel (CMS)

- [ ] **Admin Authentication** <!-- id: 12 -->
  - [ ] Create Login Page (`/admin/login`)
  - [ ] Protect Admin Routes (Middleware)
- [ ] **Content Management UI** <!-- id: 13 -->
  - [ ] **Lessons Manager**:
    - [ ] List View (Data Table)
    - [ ] Create/Edit Form (Rich Text)
    - [ ] Delete Functionality
  - [ ] **Places Manager**:
    - [ ] List verified places
    - [ ] Add new place (Map Picker)
  - [ ] **Duas Manager**:
    - [ ] Simple CRUD for Prayers

## Phase 6: Polish & Deployment

- [ ] **Optimization** <!-- id: 14 -->
  - [ ] Image Optimization (Next/Image)
  - [ ] SEO Meta Tags & OpenGraph
- [ ] **Testing** <!-- id: 15 -->
  - [ ] Manual QA of all features
  - [ ] Cross-browser verification
- [ ] **Deployment** <!-- id: 16 -->
  - [ ] Deploy to Vercel
  - [ ] Set up Production Database
  - [ ] Final PWA Validation
