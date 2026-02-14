# Implementation Plan: Muslim Lifestyle App (PWA) & Admin Panel

## Goal Description

Build a comprehensive, premium-quality Muslim Lifestyle App (PWA) with a robust Admin Panel for content management. The app will feature accurate Prayer Times, Quran, Qibla, Duas, Halal Places, and Islamic Lessons. The system will be built with modern web technologies, ensuring high performance, SEO optimization, and offline capabilities.

## User Review Required

> [!IMPORTANT]
> **Database & Backend**: We will use **Prisma ORM** with **PostgreSQL** (or SQLite for dev) to manage dynamic content (Lessons, Duas, Places).
> **Authentication**: **NextAuth.js** will secure the Admin Panel using credentials or OAuth providers.
> **Maps**: **Leaflet** (OpenStreetMap) will be used for the Halal Places finder to avoid Google Maps costs.
> **Deployment**: Recommended deployment on Vercel (Frontend/API) + Supabase/Neon (Postgres DB).

## Proposed Architecture

### Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS Modules (for maximum performance & custom design) + CSS Variables for Theming.
- **Database**: PostgreSQL (via Prisma ORM).
- **Authentication**: NextAuth.js v5.
- **State Management**: Zustand (for global app state like Location, User Settings).
- **PWA**: `next-pwa` (Service Workers, Manifest).
- **Icons**: Lucide React.
- **Maps**: `react-leaflet`.
- **Date/Time**: `date-fns` + `hijri-date-package`.

### Database Schema (Prisma)

We will have the following core models:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // Hashed
  role      String   @default("USER") // ADMIN, USER
  createdAt DateTime @default(now())
}

model Lesson {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String   // Markdown or HTML
  coverImage  String?
  videoUrl    String?
  category    String
  isPublished Boolean  @default(false)
  createdAt   String   @default(now())
}

model Dua {
  id          String   @id @default(cuid())
  title       String
  arabic      String
  files       String?  // Audio URL
  translation String
  transliteration String?
  category    String
}

model Place {
  id          String   @id @default(cuid())
  name        String
  type        String   // MOSQUE, HALAL_FOOD
  lat         Float
  lng         Float
  address     String?
  description String?
  isVerified  Boolean  @default(false)
}
```

### Directory Structure

```
src/
├── app/
│   ├── (public)/             # Public access routes
│   │   ├── page.tsx
│   │   ├── quran/
│   │   ├── prayer-times/
│   ├── (admin)/              # Protected Admin routes
│   │   ├── layout.tsx        # Admin Sidebar/Shell
│   │   ├── dashboard/
│   │   ├── lessons/          # CRUD
│   │   ├── places/           # CRUD
│   │   ├── duas/             # CRUD
│   ├── api/                  # API Routes (Next.js)
│       ├── auth/             # NextAuth
│       ├── lessons/
│       ├── places/
│       └── ...
├── components/
│   ├── ui/                   # Shared UI (Button, Card, Input)
│   ├── admin/                # Admin-specific (sidebar, data-table)
│   ├── features/             # Feature Widgets (PrayerCard, QiblaCompass)
│   └── icons/
├── lib/
│   ├── prisma.ts             # DB Client
│   ├── auth.ts               # Auth Config
│   ├── api-clients/          # External APIs (Aladhan, Quran.com)
│   └── utils.ts
├── styles/
│   ├── globals.css           # Global Vars (Colors, Typography)
│   └── ...
```

## Detailed Feature Breakdown

### 1. Application Core (PWA)

- **Design System**: Define CSS variables for specific Islamic-themed colors (Emerald Green, Gold, Midnight Blue) and typography (Inter + Arabic Font).
- **Navigation**: Bottom Tab navigation for mobile friendliness (Home, Quran, Tools, Settings).
- **Home Dashboard**:
  - Hero section with next prayer countdown.
  - "Daily Inspiration": Random Verse/Dua from API/DB.
  - Quick access grid to main features.

### 2. Prayer Times & Azan

- **Location**: Use `navigator.geolocation` + Fallback to IP-based location.
- **Calculation**: Aladhan API integration. Allow user to adjust calculation method (e.g., ISNA, MWL).
- **Notifications**: Custom Audio player for Adhan. Background sync if supported.

### 3. The Holy Quran

- **Reader**: Virtualized list for smooth scrolling of Ayahs.
- **Audio**: `react-use-audio-player` for syncing audio with text.
- **Search**: Client-side search for Surah names.

### 4. Halal Places (Map)

- **Map View**: Full-screen map with detailed pins.
- **List View**: Nearest places sorted by distance.
- **Data**: Fetch from OSM Overpass API + Local DB (verified places).

### 5. Admin Panel

- **Secure Login**: `/admin` redirects to login if not authenticated.
- **Dashboard**: Stats (Total Lessons, Total Places).
- **Content Managers**:
  - **Lessons**: Rich Text Editor (Tiptap/Quill) for writing articles.
  - **Places**: Interactive map picker to add a new place coordinates.
  - **Duas**: Form for Arabic text and translations.

## Verification Plan

### Automated Tests

- **Linting**: `eslint` configuration for Next.js strict mode.
- **Type Checking**: Strict TypeScript configuration.

### Manual Verification

- **Functional**:
  - Admin: Create a new Lesson -> Verify it appears on the public App.
  - Admin: Add a new Mosque -> Verify pin on the Map.
  - User: Check Prayer Times accuracy against a trusted local source.
  - User: Verify Qibla direction matches a physical compass.
- **Responsiveness**: Test on Chrome DevTools (Mobile/Tablet view) and actual devices if possible.
- **PWA**: Verify "Install App" prompt appears and "Offline Mode" handles network loss gracefully.
