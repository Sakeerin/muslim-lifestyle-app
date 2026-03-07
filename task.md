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
  - [x] Setup MySQL Database (Local or Hosted)
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

- [x] **Islamic Lessons** <!-- id: 9 -->
  - [x] Create API: `GET /api/lessons` (Pagination, Filter)
  - [x] Build Lesson List & Detail Pages
- [x] **Duas (Hisn'ul Muslim)** <!-- id: 10 -->
  - [x] Create API: `GET /api/duas` (Categories)
  - [x] Build Dua List & Search UI
- [x] **Halal Places Finder** <!-- id: 11 -->
  - [x] Integrate Leaflet/React-Leaflet
  - [x] Create API: `GET /api/proximities` (Combine OSM + Local DB)
  - [x] Build Interactive Map Component

## Phase 5: Admin Panel (CMS)

- [x] **Admin Authentication** <!-- id: 12 -->
  - [x] Create Login Page (`/admin/login`)
  - [x] Protect Admin Routes (Middleware)
- [x] **Content Management UI** <!-- id: 13 -->
  - [x] **Lessons Manager**:
    - [x] List View (Data Table)
    - [x] Create/Edit Form (Rich Text)
    - [x] Delete Functionality
  - [x] **Places Manager**:
    - [x] List verified places
    - [x] Add new place (Map Picker)
  - [x] **Duas Manager**:
    - [x] Simple CRUD for Prayers

## Phase 6: Polish & Deployment

- [x] **Optimization** <!-- id: 14 -->
  - [x] Image Optimization (Next/Image)
  - [x] SEO Meta Tags & OpenGraph
- [x] **Testing** <!-- id: 15 -->
  - [x] Manual QA of all features
  - [x] Cross-browser verification
- [x] **Deployment** <!-- id: 16 -->
  - [x] Deploy to Vercel
  - [x] Set up Production Database
  - [x] Final PWA Validation
