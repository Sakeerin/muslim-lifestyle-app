# แผนพัฒนา LINE Mini App — Muslim Lifestyle App

> **วันที่วางแผน:** 3 พฤษภาคม 2025  
> **โปรเจคปัจจุบัน:** Next.js 16 App Router + Prisma/MySQL + NextAuth v5  
> **Hosting:** Hostinger Business Web Hosting (Shared Hosting)  
> **เป้าหมาย:** ทำให้แอปทำงานในระบบนิเวศ LINE ผ่าน LIFF (LINE Front-end Framework)

---

## ภาพรวมและกลยุทธ์

LINE Mini App ทำงานบน **LIFF (LINE Front-end Framework)** ซึ่งเป็น WebView ภายใน LINE ที่ให้แอปเว็บเข้าถึง LINE APIs ได้โดยตรง

### สิ่งที่ต้องทำ (สรุป)
- ติดตั้ง LIFF SDK และ initialize ใน Next.js
- เปลี่ยน authentication จาก email/password → LINE Login อัตโนมัติ
- ปรับ UI ให้รองรับ LINE Mini App header และ mobile-first
- เพิ่มฟีเจอร์ที่ใช้ LINE APIs (share, profile, service messages)
- สร้าง LINE Developers Console setup
- ผ่านการ review เพื่อเป็น Verified Mini App

### สิ่งที่ไม่ต้องเปลี่ยน
- ทุก page/route ที่มีอยู่ — ยังคงใช้ได้หมด
- Prisma schema และ MySQL database
- Admin panel (เข้าใช้งานผ่านเว็บปกติเท่านั้น ไม่ใช่ผ่าน LINE)
- API routes ทั้งหมด
- Business logic ทุกอย่าง

---

## สถาปัตยกรรม

```
┌──────────────────────────────────────────────┐
│              LINE App                         │
│  ┌────────────────────────────────────────┐  │
│  │         LINE Mini App Header           │  │
│  ├────────────────────────────────────────┤  │
│  │                                        │  │
│  │     Next.js App (LIFF WebView)         │  │
│  │   ┌─────────────────────────────────┐  │  │
│  │   │  liff.init() on app load        │  │  │
│  │   │  LINE Profile → User session    │  │  │
│  │   │  All existing pages work        │  │  │
│  │   │  + LINE share / service msgs    │  │  │
│  │   └─────────────────────────────────┘  │  │
│  │                                        │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
         │ HTTPS API calls
┌────────┴──────────────────────────────────────┐
│  Hostinger Business Web Hosting (Shared)        │
│  Next.js (node server.js) + MySQL               │
│  SSL: Let's Encrypt ฟรี (hPanel → SSL)         │
│  ⚠ ไม่มี background process / cron ในตัว      │
└────────────────────────────────────────────────┘
         │ external cron calls
┌────────┴──────────────────────────┐
│  cron-job.org (ฟรี)               │
│  เรียก /api/line/notify ทุก 5 นาที │
└────────────────────────────────────┘
```

---

## ⚠️ ข้อจำกัดของ Hostinger Business Web Hosting และ Workarounds

Hostinger Business Web Hosting เป็น **Shared Hosting** — มีข้อจำกัดสำคัญที่กระทบแผนนี้โดยตรง

| ข้อจำกัด | กระทบ Phase | Workaround |
|---------|------------|------------|
| **ไม่มี background process** — ไม่สามารถรัน cron job หรือ Node.js worker แบบถาวรได้ | Phase 4.4 (Prayer Notifications) | ใช้ **cron-job.org** (ฟรี) เรียก API endpoint แทน |
| **Node.js version** — ✅ ใช้ Node.js 22.x อยู่แล้ว รองรับ Next.js 16 สมบูรณ์ | — | ไม่ต้องทำอะไร |
| **RAM ~512MB** — Shared กับ user อื่น memory อาจผันผวน | Phase 7 (Performance) | Lazy load ทุก heavy component, bundle ≤ 200KB/route |
| **ไม่มี WebSocket** — Long polling ไม่ทำงาน | ไม่กระทบ | แอปนี้ไม่ใช้ WebSocket อยู่แล้ว |
| **Process restart อัตโนมัติ** — Hostinger อาจ restart Node.js process เมื่อ idle | ทุก Phase | ใช้ `pm2` ถ้า plan รองรับ หรือตรวจสอบ uptime monitor |

### วิธีตรวจสอบ Node.js version ใน hPanel

1. เข้า hPanel → **Website** → **Node.js**
2. ดู version ที่เลือกได้ → เลือก **20.x** (LTS)
3. ถ้าไม่มี 18.18+ → ต้องอัปเกรดแพลนเป็น VPS หรือ Cloud Hosting

### Workaround Prayer Notifications: cron-job.org

แทนที่จะรัน background worker บน server ให้ใช้ [cron-job.org](https://cron-job.org) (ฟรี) call API endpoint ทุก 5 นาที:

```
cron-job.org → GET https://muslimcompanion.app/api/line/notify-check
                     ↓
              API route ตรวจว่าละหมาดไหนกำลังจะถึง
                     ↓
              ส่ง LINE Service Message ให้ user ที่ opt-in
```

ไม่ต้องมี background process เลย ทุกอย่างเป็น stateless HTTP call

---

## Phase 0 — เตรียมความพร้อม (LINE Developers Console)

> **ระยะเวลาประมาณ:** 1–2 วัน  
> **เป็นขั้นตอนที่ทำบน LINE Developers Console เท่านั้น ไม่มี code**

### 0.1 สร้าง LINE Developers Account
- ไปที่ [developers.line.biz](https://developers.line.biz)
- เข้าสู่ระบบด้วย LINE Account ของคุณ
- สร้าง **Provider** ใหม่ (ชื่อ: "Muslim Lifestyle App" หรือชื่อแบรนด์)

### 0.2 สร้าง LINE Login Channel
- ใน Provider → สร้าง Channel ประเภท **LINE Login**
- Channel name: `Muslim Lifestyle App`
- Callback URL: `https://muslimcompanion.app/api/auth/line/callback`
- เพิ่ม dev callback: `https://localhost:3000/api/auth/line/callback`
- บันทึก **Channel ID** และ **Channel Secret**

### 0.3 สร้าง LIFF App
- ใน LINE Login Channel → แท็บ LIFF → Add
- LIFF app name: `Muslim Lifestyle App`
- Size: **Full** (เต็มจอ — เหมาะสุดสำหรับแอปนี้)
- Endpoint URL: `https://muslimcompanion.app`
- Scopes: `profile`, `openid`, `email` (ถ้าต้องการ)
- Module mode: **เปิด** (ซ่อน LINE header ปกติ ใช้ header ของ Mini App แทน)
- บันทึก **LIFF ID** (รูปแบบ: `1234567890-AbCdEfGh`)

### 0.4 ขอสิทธิ์ LINE Mini App
- ติดต่อ LINE ผ่านฟอร์ม [LINE Mini App Application](https://linedevth.line.me/th/line-mini-app)
- กรอกข้อมูลบริษัท/ส่วนตัว, รายละเอียดแอป, กลุ่มเป้าหมาย
- รอการอนุมัติ (ประมาณ 1–2 สัปดาห์)

### 0.5 ค่า Environment Variables ที่จะได้
```
NEXT_PUBLIC_LIFF_ID=1234567890-AbCdEfGh
LINE_CHANNEL_ID=1234567890
LINE_CHANNEL_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Phase 1 — ติดตั้ง LIFF SDK

> **ระยะเวลาประมาณ:** 1 วัน  
> **ไฟล์ที่เกี่ยวข้อง:** `package.json`, `src/lib/liff.ts`, `src/components/providers/liff-provider.tsx`

### 1.1 ติดตั้ง package

```bash
npm install @line/liff
```

### 1.2 สร้าง LIFF utility module

**สร้างไฟล์ `src/lib/liff.ts`**

```typescript
import type Liff from "@line/liff";

let liffInstance: typeof Liff | null = null;

export async function getLiff() {
  if (liffInstance) return liffInstance;
  const { default: liff } = await import("@line/liff");
  liffInstance = liff;
  return liff;
}

export async function initLiff() {
  const liff = await getLiff();
  if (liff.isInClient()) {
    await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });
  }
  return liff;
}

export async function getLiffProfile() {
  const liff = await getLiff();
  if (!liff.isLoggedIn()) return null;
  return liff.getProfile(); // { userId, displayName, pictureUrl, statusMessage }
}

export function isInLineApp(): boolean {
  if (typeof window === "undefined") return false;
  // ตรวจสอบ user agent ของ LINE
  return /Line\//.test(navigator.userAgent);
}
```

### 1.3 สร้าง LIFF Provider Component

**สร้างไฟล์ `src/components/providers/liff-provider.tsx`**

```typescript
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Profile } from "@line/liff";

type LiffContextType = {
  isReady: boolean;
  isInClient: boolean;
  profile: Profile | null;
  shareContent: (text: string) => Promise<void>;
};

const LiffContext = createContext<LiffContextType>({
  isReady: false,
  isInClient: false,
  profile: null,
  shareContent: async () => {},
});

export function LiffProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isInClient, setIsInClient] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function init() {
      const { initLiff, getLiffProfile } = await import("@/lib/liff");
      const liff = await initLiff();
      setIsInClient(liff.isInClient());

      if (liff.isLoggedIn()) {
        const p = await getLiffProfile();
        setProfile(p);
      }
      setIsReady(true);
    }
    init().catch(console.error);
  }, []);

  async function shareContent(text: string) {
    const { getLiff } = await import("@/lib/liff");
    const liff = await getLiff();
    if (!liff.isInClient()) return;
    await liff.shareTargetPicker([{ type: "text", text }]);
  }

  return (
    <LiffContext.Provider value={{ isReady, isInClient, profile, shareContent }}>
      {children}
    </LiffContext.Provider>
  );
}

export const useLiff = () => useContext(LiffContext);
```

### 1.4 เพิ่ม LiffProvider ใน layout หลัก

**แก้ไข `src/app/layout.tsx`** — เพิ่ม `<LiffProvider>` ครอบ children:

```typescript
import { LiffProvider } from "@/components/providers/liff-provider";

// ใน return:
<ThemeProvider ...>
  <LiffProvider>        {/* ← เพิ่มบรรทัดนี้ */}
    <AppShell>
      {children}
    </AppShell>
  </LiffProvider>        {/* ← และบรรทัดนี้ */}
</ThemeProvider>
```

### 1.5 เพิ่ม LIFF_ID ใน .env

```bash
# .env
NEXT_PUBLIC_LIFF_ID="1234567890-AbCdEfGh"
```

---

## Phase 2 — LINE Login Authentication

> **ระยะเวลาประมาณ:** 2–3 วัน  
> **ไฟล์ที่เกี่ยวข้อง:** `src/lib/auth.ts`, `prisma/schema.prisma`, `src/app/api/auth/line/`

**กลยุทธ์:** ผู้ใช้ที่เข้าผ่าน LINE จะ login อัตโนมัติด้วย LINE profile — ไม่ต้องกรอก email/password  
Admin panel ยังคงใช้ email/password เหมือนเดิม

### 2.1 อัปเดต Prisma Schema

**แก้ไข `prisma/schema.prisma`** — เพิ่ม fields สำหรับ LINE user:

```prisma
model User {
  id          String   @id @default(cuid())
  email       String?  @unique          // optional สำหรับ LINE users
  password    String?                   // optional สำหรับ LINE users
  role        UserRole @default(USER)
  
  // LINE-specific fields
  lineUserId  String?  @unique          // LINE userId (U...)
  displayName String?                   // LINE display name
  pictureUrl  String?                   // LINE profile picture URL
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

```bash
npx prisma migrate dev --name add-line-user-fields
```

### 2.2 สร้าง LINE Auth API Route

**สร้างไฟล์ `src/app/api/auth/line/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

export async function POST(req: NextRequest) {
  const { lineUserId, displayName, pictureUrl } = await req.json();

  if (!lineUserId) {
    return NextResponse.json({ error: "Missing lineUserId" }, { status: 400 });
  }

  // upsert LINE user
  const user = await prisma.user.upsert({
    where: { lineUserId },
    update: { displayName, pictureUrl },
    create: { lineUserId, displayName, pictureUrl, role: "USER" },
  });

  // สร้าง JWT session token
  const token = await new SignJWT({ sub: user.id, role: user.role, lineUserId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  return NextResponse.json({ token, user });
}
```

### 2.3 สร้าง LINE Auth Hook

**สร้างไฟล์ `src/hooks/use-line-auth.ts`**

```typescript
"use client";

import { useEffect, useState } from "react";
import { useLiff } from "@/components/providers/liff-provider";

type LineUser = {
  id: string;
  lineUserId: string;
  displayName: string;
  pictureUrl: string | null;
  role: "ADMIN" | "USER";
};

export function useLineAuth() {
  const { profile, isReady } = useLiff();
  const [user, setUser] = useState<LineUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady || !profile) {
      setLoading(false);
      return;
    }

    fetch("/api/auth/line", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lineUserId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .finally(() => setLoading(false));
  }, [isReady, profile]);

  return { user, loading };
}
```

### 2.4 แสดง LINE Profile ใน AppShell

**แก้ไข `src/components/layout/app-shell.tsx`** — เพิ่ม LINE profile display:

```typescript
import { useLiff } from "@/components/providers/liff-provider";

// ใน component:
const { profile, isInClient } = useLiff();

// ใน JSX (sidebar ส่วนบน):
{isInClient && profile && (
  <div className={styles.lineProfile}>
    <img src={profile.pictureUrl ?? ""} alt="" className={styles.lineAvatar} />
    <span>{profile.displayName}</span>
  </div>
)}
```

---

## Phase 3 — ปรับ UI สำหรับ LINE Mini App

> **ระยะเวลาประมาณ:** 2–3 วัน  
> **ไฟล์ที่เกี่ยวข้อง:** `app-shell.tsx`, `app-shell.module.css`, global CSS

### 3.1 ซ่อน App Header เมื่ออยู่ใน LINE

LINE Mini App มี header ของตัวเอง (ชื่อแอป + ปุ่มปิด) จึงไม่ต้องแสดง app header ซ้ำ

**แก้ไข `src/components/layout/app-shell.tsx`:**

```typescript
const { isInClient } = useLiff();

// ซ่อน sidebar navigation เมื่ออยู่ใน LINE และใช้ bottom navigation แทน
```

### 3.2 เพิ่ม Bottom Navigation Bar สำหรับ LINE

LINE Mini App มักใช้ Bottom Navigation แทน Sidebar (เหมาะกับ mobile มากกว่า)

**สร้างไฟล์ `src/components/layout/bottom-nav.tsx`:**

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, MapPin, Clock, BarChart2 } from "lucide-react";
import styles from "./bottom-nav.module.css";

const NAV_ITEMS = [
  { href: "/",            icon: Home,     label: "หน้าแรก" },
  { href: "/prayer-times",icon: Clock,    label: "เวลาละหมาด" },
  { href: "/quran",       icon: BookOpen, label: "อัลกุรอาน" },
  { href: "/places",      icon: MapPin,   label: "มัสยิด" },
  { href: "/stats",       icon: BarChart2,label: "สถิติ" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
        <Link
          key={href}
          href={href}
          className={`${styles.item} ${pathname === href ? styles.active : ""}`}
        >
          <Icon size={22} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
```

**สร้างไฟล์ `src/components/layout/bottom-nav.module.css`:**

```css
.nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  background: var(--surface-card);
  border-top: 1px solid var(--border-soft);
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom);
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: 0.65rem;
  color: var(--text-secondary);
  text-decoration: none;
}

.active {
  color: var(--accent);
}
```

### 3.3 ปรับ AppShell ให้รองรับ 2 โหมด

**แก้ไข `src/components/layout/app-shell.tsx`:**

```typescript
"use client";

import { useLiff } from "@/components/providers/liff-provider";
import { BottomNav } from "./bottom-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isInClient, isReady } = useLiff();

  // โหมด LINE Mini App
  if (isReady && isInClient) {
    return (
      <div className={styles.lineShell}>
        <main className={styles.lineContent}>
          {children}
        </main>
        <BottomNav />
      </div>
    );
  }

  // โหมดเว็บปกติ (layout เดิม)
  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
```

**เพิ่ม CSS ใน `app-shell.module.css`:**

```css
.lineShell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.lineContent {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  padding-bottom: calc(60px + env(safe-area-inset-bottom));
}
```

### 3.4 ปรับ Safe Area สำหรับ iOS/Android

**เพิ่มใน `src/app/globals.css`:**

```css
:root {
  --safe-area-inset-top: env(safe-area-inset-top);
  --safe-area-inset-bottom: env(safe-area-inset-bottom);
}
```

**แก้ไข `public/manifest.webmanifest`:** เพิ่ม `"display": "standalone"`

---

## Phase 4 — เพิ่มฟีเจอร์ LINE-Specific

> **ระยะเวลาประมาณ:** 3–5 วัน  
> **ฟีเจอร์ที่ใช้ LINE APIs**

### 4.1 Share Prayer Times

เพิ่มปุ่ม Share เวลาละหมาดส่งเพื่อนใน LINE

**แก้ไข `src/app/prayer-times/page.tsx`** — เพิ่มปุ่ม share:

```typescript
import { useLiff } from "@/components/providers/liff-provider";

// ใน component:
const { shareContent, isInClient } = useLiff();

async function handleShare() {
  const text = `🕌 เวลาละหมาดวันนี้ (${city})
ฟัจร์: ${times.fajr}
ดุฮร์: ${times.dhuhr}
อัศร์: ${times.asr}
มัฆริบ: ${times.maghrib}
อิชาอ์: ${times.isha}

แอป Muslim Lifestyle App`;
  await shareContent(text);
}

// ใน JSX:
{isInClient && (
  <button onClick={handleShare} className={styles.shareButton}>
    แชร์เวลาละหมาด
  </button>
)}
```

### 4.2 Share Quran Verse

**แก้ไข `src/app/quran/[surah]/page.tsx`** — เพิ่ม share ต่อ ayah:

```typescript
async function shareAyah(arabic: string, translation: string, ref: string) {
  const text = `﴿ ${arabic} ﴾\n\n${translation}\n\n— ${ref} | Muslim Lifestyle App`;
  await shareContent(text);
}
```

### 4.3 Share Azkar / Dua

**แก้ไข `src/app/azkar/page.tsx`** และ **`src/app/duas/page.tsx`** — เพิ่ม share แต่ละรายการ

### 4.4 ตั้งเตือนเวลาละหมาด (Service Messages)

> ต้องเป็น Verified Mini App ก่อน

> **⚠️ Shared Hosting:** ไม่มี background process — ใช้ **cron-job.org** เรียก API ทุก 5 นาทีแทน

**สถาปัตยกรรม:**
```
cron-job.org (ทุก 5 นาที)
  → GET https://muslimcompanion.app/api/line/notify-check?secret=CRON_SECRET
      → query users ที่ opt-in
      → คำนวณว่าละหมาดไหนอยู่ใน window 5 นาทีนี้
      → ส่ง LINE Service Message ให้แต่ละ user
```

**เพิ่ม field ใน Prisma schema:**

```prisma
model User {
  // ... existing fields
  prayerNotifyOptIn Boolean @default(false)
  prayerCalcMethod  Int     @default(11)    // Aladhan method (default: มุสลิมไทย = 11)
  userLat           Float?                  // ตำแหน่งที่บันทึกไว้สำหรับคำนวณเวลาละหมาด
  userLng           Float?
}
```

**สร้าง `src/app/api/line/notify-check/route.ts`:**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CRON_SECRET = process.env.CRON_SECRET; // ป้องกัน endpoint ถูกเรียกโดยไม่ได้รับอนุญาต
const LINE_API = "https://api.line.me/message/v3/notificationMessage/send";

export async function GET(req: NextRequest) {
  // ตรวจสอบ secret จาก cron-job.org
  if (req.nextUrl.searchParams.get("secret") !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // หา users ที่ opt-in และมีตำแหน่งบันทึกไว้
  const users = await prisma.user.findMany({
    where: { prayerNotifyOptIn: true, lineUserId: { not: null }, userLat: { not: null } },
  });

  const now = new Date();
  const results = await Promise.allSettled(
    users.map(async (user) => {
      // คำนวณเวลาละหมาดของ user (เรียก Aladhan API)
      const times = await fetchPrayerTimes(user.userLat!, user.userLng!, user.prayerCalcMethod);
      const upcoming = findUpcomingPrayer(times, now, 5); // ภายใน 5 นาที
      if (!upcoming) return;

      await fetch(LINE_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: user.lineUserId,
          messages: [{ type: "text", text: `🕌 ถึงเวลา${upcoming.name} แล้ว (${upcoming.time})\nขอให้ละหมาดได้รับการตอบรับ 🤲` }],
        }),
      });
    })
  );

  return NextResponse.json({ sent: results.filter((r) => r.status === "fulfilled").length });
}
```

**ตั้งค่า cron-job.org:**
1. สมัครที่ [cron-job.org](https://cron-job.org) (ฟรี)
2. สร้าง cron job: `*/5 * * * *` (ทุก 5 นาที)
3. URL: `https://muslimcompanion.app/api/line/notify-check?secret=YOUR_CRON_SECRET`
4. เพิ่ม `CRON_SECRET` ใน `.env`

### 4.5 เพิ่มหน้า Settings สำหรับ LINE

**แก้ไข `src/app/settings/page.tsx`** — เพิ่ม LINE section:

```typescript
{isInClient && (
  <section>
    <h2>LINE Notifications</h2>
    <label>
      <input
        type="checkbox"
        checked={prayerNotify}
        onChange={handleToggle}
      />
      แจ้งเตือนเวลาละหมาดใน LINE Chat
    </label>
  </section>
)}
```

---

## Phase 5 — Persistent User Data สำหรับ LINE Users

> **ระยะเวลาประมาณ:** 3–5 วัน  
> **ปัญหา:** LINE Mini App WebView อาจล้าง localStorage เมื่อปิดแอป

ปัจจุบันข้อมูลผู้ใช้ (Quran progress, azkar, prayer streaks) เก็บใน `localStorage` ซึ่งอาจหายเมื่อใช้งานใน LINE WebView

### 5.1 วางแผน Migration Data Layer

| ข้อมูล | ปัจจุบัน | LINE Mini App |
|--------|---------|---------------|
| Quran progress (bookmarks, notes) | localStorage | Database (UserProgress model) |
| Azkar daily progress | localStorage | Database (UserAzkarLog model) |
| Prayer streak | localStorage | Database (UserPrayerLog model) |
| Dua journal | localStorage | Database (DuaJournalEntry model ที่มีอยู่แล้ว?) |
| Fasting log | localStorage | Database (UserFastingLog model) |
| Ibadah checklist | localStorage | Database (UserIbadahLog model) |

### 5.2 เพิ่ม Prisma Models ใหม่

**แก้ไข `prisma/schema.prisma`:**

```prisma
model UserQuranProgress {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  surahNo   Int
  lastAyah  Int      @default(1)
  bookmarks Json     @default("[]")
  notes     Json     @default("{}")
  updatedAt DateTime @updatedAt

  @@unique([userId, surahNo])
}

model UserPrayerLog {
  id      String   @id @default(cuid())
  userId  String
  user    User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  date    String   // YYYY-MM-DD
  prayers Json     // { fajr: true, dhuhr: false, ... }

  @@unique([userId, date])
}

model UserAzkarLog {
  id     String   @id @default(cuid())
  userId String
  user   User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  date   String   // YYYY-MM-DD
  counts Json     // { "azkar-1": 33, "azkar-2": 7, ... }

  @@unique([userId, date])
}

model UserFastingLog {
  id     String   @id @default(cuid())
  userId String
  user   User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  date   String   // YYYY-MM-DD
  type   String   // "ramadan" | "sunnah" | "voluntary"

  @@unique([userId, date])
}
```

### 5.3 สร้าง API Routes สำหรับ User Data

**สร้าง `src/app/api/user/progress/route.ts`** (GET + POST)  
**สร้าง `src/app/api/user/prayer-log/route.ts`** (GET + POST)  
**สร้าง `src/app/api/user/azkar-log/route.ts`** (GET + POST)  
**สร้าง `src/app/api/user/fasting-log/route.ts`** (GET + POST)

ทุก API route ต้องตรวจสอบ LINE JWT token ก่อน:

```typescript
import { jwtVerify } from "jose";

async function getAuthUser(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
  );
  return payload as { sub: string; lineUserId: string; role: string };
}
```

### 5.4 สร้าง Sync Strategy

สำหรับผู้ใช้ที่เคยใช้บนเว็บ (มีข้อมูลใน localStorage) ให้ sync ขึ้น database เมื่อ login LINE ครั้งแรก

**สร้าง `src/hooks/use-data-sync.ts`:**

```typescript
export function useDataSync() {
  const { user } = useLineAuth();
  
  useEffect(() => {
    if (!user) return;
    
    const synced = localStorage.getItem("line-sync-done");
    if (synced) return;
    
    // อ่านข้อมูลจาก localStorage
    const localData = {
      quranProgress: localStorage.getItem("quran-progress"),
      prayerLog: localStorage.getItem("prayer-log"),
      // ...
    };
    
    // ส่งขึ้น database
    fetch("/api/user/sync", {
      method: "POST",
      body: JSON.stringify(localData),
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => localStorage.setItem("line-sync-done", "true"));
  }, [user]);
}
```

---

## Phase 6 — LINE OA (Official Account) Integration

> **ระยะเวลาประมาณ:** 1–2 วัน  
> **ต้องการก่อน:** LINE Official Account (สร้างฟรีที่ manager.line.biz)

### 6.1 Rich Menu

สร้าง Rich Menu ใน LINE OA เพื่อให้ผู้ใช้เข้าแอปได้ง่าย:

```
┌─────────────────────────────────┐
│      เวลาละหมาด  │  อัลกุรอาน   │
│──────────────────┼──────────────│
│     มัสยิดใกล้ฉัน │  เปิดแอป    │
└─────────────────────────────────┘
```

แต่ละปุ่มใน Rich Menu → ลิงก์ไปยัง LIFF URL:  
`line://app/{LIFF_ID}?path=/prayer-times`

### 6.2 Greeting Message

เมื่อผู้ใช้ add LINE OA ครั้งแรก → ส่งข้อความต้อนรับพร้อมลิงก์เปิด Mini App

### 6.3 LINE Beacon (ตัวเลือกเสริม)

เมื่อผู้ใช้อยู่ใกล้มัสยิดที่ลงทะเบียนไว้ → ส่ง notification ผ่าน LINE OA

---

## Phase 7 — Performance Optimization

> **ระยะเวลาประมาณ:** 2 วัน  
> **สำคัญมาก:** LINE Mini App มี memory limit ต่ำกว่าเบราว์เซอร์ปกติ

### 7.1 Lazy Load LIFF SDK

LIFF SDK มีขนาดประมาณ 400KB — ต้อง lazy load เสมอ:

```typescript
// ✅ ถูกต้อง — lazy import
const { default: liff } = await import("@line/liff");

// ❌ ห้ามทำ — static import
import liff from "@line/liff";
```

### 7.2 ปรับ Image Loading

```typescript
// เพิ่มใน next.config.js
images: {
  remotePatterns: [
    { protocol: "https", hostname: "profile.line-scdn.net" }, // LINE profile pics
  ],
},
```

### 7.3 Bundle Size

```bash
npm run build -- --debug
# ตรวจสอบ bundle size, code split แต่ละ route
```

เป้าหมาย: First Load JS ไม่เกิน **200KB** ต่อ route

### 7.4 Leaflet Optimization

Leaflet เป็น package ขนาดใหญ่ ควร dynamic import เฉพาะหน้า places:

```typescript
// ใน places/page.tsx
const PlacesMap = dynamic(() => import("@/components/features/places-map"), {
  ssr: false,
  loading: () => <div>กำลังโหลดแผนที่...</div>,
});
```

---

## Phase 8 — Testing

> **ระยะเวลาประมาณ:** 2–3 วัน

### 8.1 LIFF Simulator

ใช้ [LIFF Simulator](https://liff-simulator.line.me/) สำหรับ test บน desktop:
- ทดสอบ LIFF init
- ทดสอบ profile API
- ทดสอบ shareTargetPicker

### 8.2 LIFF CLI

```bash
npm install -g @line/liff-cli
liff-cli --liff-id $NEXT_PUBLIC_LIFF_ID
```

### 8.3 Checklist ก่อน Submit

- [ ] แอปโหลดภายใน 3 วินาทีใน LINE
- [ ] ทุก API call มี error handling
- [ ] ทำงานได้ทั้ง iOS (LINE 11+) และ Android (LINE 11+)
- [ ] Bottom navigation ไม่ทับ Safe Area บน iPhone
- [ ] ภาษาไทยแสดงถูกต้อง (ฟอนต์ครบ)
- [ ] Dark mode ทำงานได้
- [ ] ทดสอบ share ใน group chat
- [ ] ทดสอบ share ใน 1-on-1 chat
- [ ] Login ด้วย LINE ทำงานได้
- [ ] ข้อมูล sync ถูกต้อง
- [ ] หน้า /admin ไม่สามารถเข้าถึงผ่าน LINE ได้

### 8.4 LINE Mini App Review Checklist (LINE กำหนด)

- [ ] แอปมี Privacy Policy
- [ ] แอปมี Terms of Service
- [ ] ไม่มีเนื้อหาที่ขัดกับ LINE Mini App Policy
- [ ] UI เป็น mobile-first
- [ ] ไม่มีโฆษณา third-party
- [ ] ใช้ LINE Login เป็น authentication หลัก

---

## Phase 9 — Submit สำหรับ Verification

> **ระยะเวลาประมาณ:** 2–4 สัปดาห์ (รอ LINE review)

### 9.1 เตรียมเอกสาร
- Screenshot ทุก flow หลักของแอป (ขนาด 1080x1920)
- อธิบาย use case และ target audience
- Privacy Policy URL
- Terms of Service URL

### 9.2 Submit ผ่าน LINE Developers Console
- ไปที่ LINE Login Channel → Mini App tab
- คลิก "Submit for review"
- กรอกข้อมูลและอัปโหลด screenshots
- รอผล review ประมาณ 1–2 สัปดาห์

### 9.3 หลัง Verified
ฟีเจอร์พิเศษที่ได้เพิ่ม:
- **Service Messages** — ส่งแจ้งเตือนเวลาละหมาดผ่าน LINE Chat โดยตรง
- **Custom Path** — ใช้ชื่อ mini app แทน LIFF ID ใน URL
- **Home Screen Shortcut** — ผู้ใช้เพิ่มทางลัดไปยัง LINE Home

---

## สรุป Timeline

| Phase | งาน | ระยะเวลา |
|-------|-----|---------|
| **0** | LINE Developers Console setup | 1–2 วัน |
| **1** | ติดตั้ง LIFF SDK + Provider | 1 วัน |
| **2** | LINE Login Authentication | 2–3 วัน |
| **3** | ปรับ UI สำหรับ LINE (Bottom Nav) | 2–3 วัน |
| **4** | ฟีเจอร์ Share + Notifications | 3–5 วัน |
| **5** | Database sync สำหรับ user data | 3–5 วัน |
| **6** | LINE OA + Rich Menu | 1–2 วัน |
| **7** | Performance optimization | 2 วัน |
| **8** | Testing | 2–3 วัน |
| **9** | Submit & Verified | 2–4 สัปดาห์ |
| **รวม** | | **~3–6 สัปดาห์** (ไม่รวมรอ review) |

---

## สิ่งที่ต้องเตรียมก่อนเริ่ม Phase 1

1. **LINE Developers Account** — สมัครที่ developers.line.biz
2. **LINE Official Account** — สมัครที่ manager.line.biz (ฟรี)
3. **HTTPS domain** — ต้องใช้ HTTPS เท่านั้น (Hostinger มี Let's Encrypt ฟรี — เปิดได้จาก hPanel → SSL → Install)
4. **Privacy Policy page** — สร้างหน้า `/privacy` ในแอป
5. **Terms of Service page** — สร้างหน้า `/terms` ในแอป

---

## Environment Variables ที่ต้องเพิ่ม

```bash
# LIFF
NEXT_PUBLIC_LIFF_ID="1234567890-AbCdEfGh"

# LINE Login Channel
LINE_CHANNEL_ID="1234567890"
LINE_CHANNEL_SECRET="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# LINE Messaging API (สำหรับ Service Messages)
LINE_CHANNEL_ACCESS_TOKEN="xxxxxxxxxxxxx..."
```

---

## References

- [LINE Mini App Documentation (Thai)](https://linedevth.line.me/th/line-mini-app)
- [LIFF Documentation](https://developers.line.biz/en/docs/liff/overview/)
- [LINE Login Documentation](https://developers.line.biz/en/docs/line-login/overview/)
- [LIFF API Reference](https://developers.line.biz/en/reference/liff/)
- [LINE Mini App Policy](https://terms2.line.me/LINE_MINI_App_Policy)
- [LIFF Simulator](https://liff-simulator.line.me/)
- [Create LIFF App CLI](https://github.com/line/create-liff-app)
