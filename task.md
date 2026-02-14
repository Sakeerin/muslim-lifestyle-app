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
- [ ] **Infrastructure** <!-- id: 3 -->
  - [/] Setup PostgreSQL Database (Local or Hosted)
  - [/] Configure Prisma ORM & Run Initial Migration
  - [x] Configure NextAuth.js (Admin Credentials Provider)
  - [ ] Setup PWA (manifest, icons, service worker)

## Phase 3: Core Features (Frontend PWA)

- [ ] **Layout & Navigation** <!-- id: 4 -->
  - [ ] Create Responsive Shell (Sidebar/Bottom Nav)
  - [ ] Implement Dark/Light Mode Theme Provider
- [ ] **Home Dashboard** <!-- id: 5 -->
  - [ ] Build Hero Component (Prayer Timer)
  - [ ] Create Daily Content Widgets (Dua/Ayah)
- [ ] **Prayer Times System** <!-- id: 6 -->
  - [ ] Implement `useGeolocation` Hook
  - [ ] Integrate Aladhan API
  - [ ] Build Monthly Schedule View
  - [ ] Implement Azan Audio Player
- [ ] **Quran Reader** <!-- id: 7 -->
  - [ ] Build Surah Index Page
  - [ ] Create Ayah List Component with Virtualization
  - [ ] Implement Search & Filter
  - [ ] Add Audio Playback Controls
- [ ] **Qibla Compass** <!-- id: 8 -->
  - [ ] Implement `DeviceOrientation` Logic
  - [ ] innovative Compass UI Component

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
