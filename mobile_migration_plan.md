# Migration Plan: Muslim Lifestyle App → Noor: Muslim Lifestyle (React Native + Expo)

> **วันที่วางแผน**: April 2026  
> **ชื่อแอป**: **Muslim Lifestyle App**  
> **เป้าหมาย**: Migrate จาก Next.js 14 Web App เป็น React Native + Expo Mobile App  
> **กลยุทธ์**: Monorepo — ใช้โค้ด shared ร่วมกันระหว่าง Web และ Mobile ให้ได้มากที่สุด

---

## Naming Reference (ใช้อ้างอิงตลอดโปรเจค)

| จุดที่ใช้ | ค่า |
|----------|-----|
| App Display Name | `Noor: Muslim Lifestyle` |
| App Short Name | `Noor` |
| iOS Bundle ID | `com.noorapp.muslim` |
| Android Package | `com.noorapp.muslim` |
| Monorepo root folder | `noor-app/` |
| GitHub Repository | `noor-app` |
| npm scope | `@noor` |
| Package: shared | `@noor/shared` |
| Package: mobile | `@noor/mobile` |
| Package: web | `@noor/web` |
| App Store Name | `Noor: Muslim Lifestyle` |
| Google Play Name | `Noor: Muslim Lifestyle` |
| Website (ถ้ามี) | `noorapp.com` / `noor.app` |

---

## สรุปภาพรวม Architecture

```
noor-app/                            ← Monorepo root (Turborepo)
├── apps/
│   ├── web/                         ← Next.js 14 (เดิม — Admin Panel + Web)
│   └── mobile/                      ← NEW: Expo SDK 52+ (React Native)
├── packages/
│   ├── shared/                      ← Business logic ที่ share ได้ทั้งสองฝั่ง
│   │   ├── lib/                     ← calendar-utils, prayer-utils, qibla, zakat
│   │   ├── data/                    ← azkar/data.ts, allah-names, hadith, hajj-umrah
│   │   ├── hooks/                   ← Pure hooks (ไม่ผูกกับ DOM/localStorage)
│   │   ├── api-clients/             ← aladhan.ts, quran.ts (fetch-based)
│   │   ├── i18n/                    ← en.json, th.json, i18n types
│   │   └── types/                   ← Shared TypeScript types
│   └── ui-native/                   ← Native UI components (ถ้า reuse ได้)
└── turbo.json
```

### สิ่งที่ Share ได้จาก Web → Mobile (ไม่ต้องเขียนใหม่)

| ไฟล์ | Shareable | หมายเหตุ |
|------|-----------|----------|
| `lib/calendar-utils.ts` | ✅ 100% | Pure TypeScript ไม่ผูก DOM |
| `lib/prayer-utils.ts` | ✅ 100% | Pure TypeScript |
| `lib/qibla.ts` | ✅ 100% | Math เท่านั้น |
| `lib/zakat-utils.ts` | ✅ 100% | Pure functions |
| `lib/tasbeeh-utils.ts` | ✅ 100% | Pure functions |
| `lib/api-clients/aladhan.ts` | ✅ 100% | fetch-based |
| `lib/api-clients/quran.ts` | ✅ 100% | fetch-based |
| `app/azkar/data.ts` | ✅ 100% | Pure data |
| `data/allah-names.ts` | ✅ 100% | Pure data |
| `data/hadith.ts` | ✅ 100% | Pure data |
| `data/hajj-umrah.ts` | ✅ 100% | Pure data |
| `i18n/en.json` + `th.json` | ✅ 100% | JSON data |
| `hooks/use-prayer-times.ts` | ⚠️ 80% | เปลี่ยน geolocation → expo-location |
| `hooks/use-geolocation.ts` | ❌ 0% | เขียนใหม่ด้วย expo-location |
| `hooks/use-local-storage.ts` | ❌ 0% | เขียนใหม่ด้วย MMKV |
| `components/**` | ❌ 0% | CSS Modules ไม่ใช้งานใน RN |
| `styles/globals.css` | ❌ 0% | ออกแบบ Design tokens ใหม่ |

### สิ่งที่ต้องเขียนใหม่ทั้งหมดใน Mobile

| Web | Mobile Equivalent |
|-----|------------------|
| CSS Modules | NativeWind v4 (Tailwind syntax) |
| `useLocalStorage` hook | `useMMKV` (react-native-mmkv) |
| `navigator.geolocation` | `expo-location` |
| `react-leaflet` (Maps) | `react-native-maps` |
| Lucide React | `@lucide/react-native` |
| `next-themes` | Custom ThemeContext + `useColorScheme` |
| Next.js App Router | Expo Router (file-based, คล้ายกันมาก) |
| `<audio>` HTML | `expo-av` |
| Web Push Notifications | `expo-notifications` |
| Compass (DeviceOrientation) | `expo-sensors` (Magnetometer) |
| `react-use-audio-player` | `expo-av` |
| NextAuth (Admin) | ไม่ใช้ใน Mobile — Admin ยังใช้ Web |
| Prisma / MySQL | ไม่ใช้ใน Mobile — เรียก Next.js API แทน |

---

## Tech Stack สำหรับ Mobile

```
Framework:      Expo SDK 52+ (React Native 0.76+)
Navigation:     Expo Router v4 (file-based, tab + stack)
Language:       TypeScript (strict)
Styling:        NativeWind v4 (Tailwind CSS syntax)
Storage:        react-native-mmkv (เร็วกว่า AsyncStorage 10x)
State:          Zustand (global) + MMKV (persistent)
Icons:          @lucide/react-native
Fonts:          expo-font (Inter + Amiri สำหรับ Arabic)
Location:       expo-location
Notifications:  expo-notifications
Audio:          expo-av
Sensors:        expo-sensors (Magnetometer สำหรับ Qibla)
Maps:           react-native-maps
Haptics:        expo-haptics (Tasbeeh counter)
Build:          EAS Build (Expo Application Services)
Distribution:   App Store (iOS) + Google Play (Android)
Monorepo:       Turborepo + pnpm workspaces
```

---

## Phase 0: Monorepo Setup + Project Initialization

**ระยะเวลาโดยประมาณ: 1–2 วัน**

### 0.1 แปลง Root เป็น Turborepo Monorepo

```bash
# ที่ root ของ noor-app/
pnpm add -g turbo
```

สร้าง `turbo.json`:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": {},
    "type-check": {}
  }
}
```

สร้าง `pnpm-workspace.yaml`:
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

ย้าย Next.js project ปัจจุบันไป `apps/web/`:
```bash
mkdir -p apps/web
# ย้ายไฟล์ทั้งหมดยกเว้น node_modules
mv src apps/web/
mv package.json apps/web/
mv next.config.* apps/web/
mv tsconfig.json apps/web/
mv prisma apps/web/
mv .env* apps/web/
# ... และไฟล์อื่นๆ
```

### 0.2 สร้าง `packages/shared`

```bash
mkdir -p packages/shared/src/{lib,data,hooks,api-clients,i18n,types}
```

`packages/shared/package.json`:
```json
{
  "name": "@noor/shared",
  "version": "0.0.1",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./lib/*": "./src/lib/*.ts",
    "./data/*": "./src/data/*.ts",
    "./api-clients/*": "./src/api-clients/*.ts",
    "./i18n/*": "./src/i18n/*"
  }
}
```

ย้ายไฟล์ที่ shareable:
```bash
cp apps/web/src/lib/calendar-utils.ts    packages/shared/src/lib/
cp apps/web/src/lib/prayer-utils.ts      packages/shared/src/lib/
cp apps/web/src/lib/qibla.ts             packages/shared/src/lib/
cp apps/web/src/lib/zakat-utils.ts       packages/shared/src/lib/
cp apps/web/src/lib/tasbeeh-utils.ts     packages/shared/src/lib/
cp apps/web/src/lib/api-clients/aladhan.ts  packages/shared/src/api-clients/
cp apps/web/src/lib/api-clients/quran.ts    packages/shared/src/api-clients/
cp apps/web/src/app/azkar/data.ts        packages/shared/src/data/azkar.ts
cp apps/web/src/data/allah-names.ts      packages/shared/src/data/
cp apps/web/src/data/hadith.ts           packages/shared/src/data/
cp apps/web/src/data/hajj-umrah.ts       packages/shared/src/data/
cp apps/web/src/i18n/en.json             packages/shared/src/i18n/
cp apps/web/src/i18n/th.json             packages/shared/src/i18n/
```

อัปเดต import ใน `apps/web` ให้ใช้ `@noor/shared` แทน relative paths

### 0.3 สร้าง Expo App

```bash
cd apps/
npx create-expo-app mobile --template blank-typescript
cd mobile
npx expo install expo-router react-native-safe-area-context react-native-screens \
  expo-linking expo-constants expo-status-bar
```

ตั้งค่า `apps/mobile/package.json` ให้อ้างอิง shared package:
```json
{
  "dependencies": {
    "@noor/shared": "workspace:*"
  }
}
```

### 0.4 ตั้งค่า NativeWind

```bash
cd apps/mobile
npx expo install nativewind tailwindcss
npx tailwindcss init
```

`tailwind.config.js`:
```js
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#0e8d71",    // Islamic Green
        gold: "#d8c776",       // Islamic Gold
        surface: "#0f1a16",    // Dark background
      },
    },
  },
};
```

### 0.5 ตั้งค่า Expo Router (Tab Navigation)

`apps/mobile/app/_layout.tsx`:
```tsx
import { Stack } from "expo-router";
import { I18nProvider } from "@/contexts/i18n-context";
import { ThemeProvider } from "@/contexts/theme-context";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </I18nProvider>
    </ThemeProvider>
  );
}
```

`apps/mobile/app/(tabs)/_layout.tsx` — Tab navigator (5 tabs หลัก):
```
Home | Quran | Azkar | Prayer | Settings
```

### Checklist Phase 0
- [ ] Monorepo structure (Turborepo + pnpm workspaces)
- [ ] `packages/shared` สร้างแล้วและ build ผ่าน
- [ ] `apps/web` ยังทำงานปกติหลัง refactor imports
- [ ] Expo app สร้างแล้ว รัน `expo start` ได้
- [ ] NativeWind ตั้งค่าแล้ว ใช้ className ได้
- [ ] Expo Router tab layout แสดงผลได้

---

## Phase 1: Core Infrastructure

**ระยะเวลาโดยประมาณ: 2–3 วัน**

### 1.1 Storage Layer — MMKV แทน localStorage

```bash
npx expo install react-native-mmkv
```

สร้าง `apps/mobile/src/storage/index.ts`:
```ts
import { MMKV } from "react-native-mmkv";

export const storage = new MMKV({ id: "noor-app" });

// Drop-in replacement API สำหรับ localStorage
export function getItem<T>(key: string, fallback: T): T {
  const raw = storage.getString(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export function setItem<T>(key: string, value: T): void {
  storage.set(key, JSON.stringify(value));
}
```

สร้าง `apps/mobile/src/hooks/use-storage.ts` (เทียบเท่า `useLocalStorage`):
```ts
import { useCallback, useState } from "react";
import { getItem, setItem } from "@/storage";

export function useStorage<T>(
  key: string,
  defaultValue: T,
): [T, (val: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => getItem(key, defaultValue));

  const set = useCallback(
    (val: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof val === "function" ? (val as (p: T) => T)(prev) : val;
        setItem(key, next);
        return next;
      });
    },
    [key],
  );

  return [value, set];
}
```

> **ข้อดี**: MMKV เขียน/อ่านเร็วกว่า AsyncStorage ถึง **10–30x** และ synchronous — ไม่ต้องใช้ `useEffect` เหมือน localStorage

### 1.2 i18n System

สร้าง `apps/mobile/src/contexts/i18n-context.tsx` โดย reuse translations จาก `@noor/shared`:
```ts
import en from "@noor/shared/i18n/en.json";
import th from "@noor/shared/i18n/th.json";
import { getItem, setItem } from "@/storage";
```

API เหมือนกับ web — `useI18n()` คืน `{ t, locale, setLocale }`

### 1.3 Theme System

```bash
npx expo install @react-native-async-storage/async-storage
# ไม่ต้องใช้ async-storage — ใช้ MMKV แทน
```

สร้าง `apps/mobile/src/contexts/theme-context.tsx`:
```tsx
import { useColorScheme } from "react-native";
// อ่าน preference จาก MMKV, fallback ไปที่ system color scheme
```

CSS Variables จาก web → ใช้ JavaScript object แทน:
```ts
export const colors = {
  light: { background: "#f0f7ef", textPrimary: "#0d1f18", primary: "#0e8d71" },
  dark:  { background: "#0a1510", textPrimary: "#e8f4f0", primary: "#0e8d71" },
};
```

### 1.4 Font Loading

```bash
npx expo install expo-font @expo-google-fonts/inter
```

```tsx
// app/_layout.tsx
import { useFonts } from "expo-font";
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";

// Arabic font สำหรับ Quran และ Azkar
// ใช้ Amiri หรือ Noto Naskh Arabic
```

### 1.5 Design System Component Library

สร้าง Base components ที่ใช้บ่อย:

```
apps/mobile/src/components/
├── ui/
│   ├── Card.tsx           ← Surface container
│   ├── Button.tsx
│   ├── Badge.tsx
│   ├── ProgressBar.tsx
│   ├── Divider.tsx
│   └── EmptyState.tsx
├── layout/
│   ├── ScreenWrapper.tsx  ← SafeAreaView + ScrollView wrapper
│   └── SectionHeader.tsx
└── typography/
    ├── Heading.tsx
    ├── Text.tsx
    └── ArabicText.tsx     ← RTL, Amiri font, ขนาดใหญ่
```

### Checklist Phase 1
- [ ] MMKV storage layer พร้อมใช้งาน
- [ ] `useStorage` hook ทำงานเหมือน `useLocalStorage`
- [ ] i18n EN/TH ทำงานได้, switch locale ได้
- [ ] Theme dark/light ทำงานได้
- [ ] Fonts โหลดได้ (Inter + Arabic font)
- [ ] Base UI components ครบ

---

## Phase 2: Prayer Times (Feature หลักสุด)

**ระยะเวลาโดยประมาณ: 3–4 วัน**

### 2.1 Location Permission

```bash
npx expo install expo-location
```

สร้าง `apps/mobile/src/hooks/use-location.ts`:
```ts
import * as Location from "expo-location";

export function useLocation() {
  // ขอ permission, รับ coords, เปรียบเทียบกับ web version
  // แตกต่างจาก web: ต้องจัดการ permission flow ที่ซับซ้อนกว่า
}
```

> **สำคัญ**: ต้องเพิ่มใน `app.json`:
> ```json
> {
>   "ios": { "infoPlist": { "NSLocationWhenInUseUsageDescription": "..." } },
>   "android": { "permissions": ["ACCESS_FINE_LOCATION"] }
> }
> ```

### 2.2 Prayer Times Calculation

Reuse `@noor/shared/api-clients/aladhan.ts` และ `@noor/shared/lib/prayer-utils.ts` ได้ 100%

สร้าง `apps/mobile/src/hooks/use-prayer-times.ts`:
- API เหมือน web เลย
- แทน `localStorage` ด้วย MMKV

### 2.3 Prayer Times Screen

```
app/(tabs)/prayer/
├── index.tsx          ← Today's prayer times list
└── streak.tsx         ← Prayer streak tracker
```

ออกแบบ UI:
- Next prayer countdown (Digital clock style)
- รายการ 5 เวลาละหมาด พร้อม icon ดวงอาทิตย์/ดวงจันทร์
- Streak card (จำนวนวันที่ละหมาดครบ)
- Haptic feedback เมื่อ mark prayer

### 2.4 Prayer Notifications (ฟีเจอร์สำคัญที่ web ทำไม่ได้)

```bash
npx expo install expo-notifications
```

```ts
// src/services/prayer-notifications.ts
import * as Notifications from "expo-notifications";
import { PrayerTime } from "@noor/shared/lib/prayer-utils";

export async function schedulePrayerNotifications(prayers: PrayerTime[]) {
  // ยกเลิก notification เก่าทั้งหมด
  await Notifications.cancelAllScheduledNotificationsAsync();
  
  // Schedule notification สำหรับแต่ละเวลา
  for (const prayer of prayers) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🕌 ${prayer.nameEn} — ${prayer.nameTh}`,
        body: "ถึงเวลาละหมาดแล้ว",
        sound: "azan.mp3",  // เสียง Azan custom
      },
      trigger: { date: prayer.time },
    });
  }
}
```

> **ต้องทำ**: เพิ่มไฟล์เสียง Azan ใน `assets/sounds/azan.mp3`

### Checklist Phase 2
- [ ] Location permission flow (ขอ → ได้รับ → denied fallback)
- [ ] Prayer times โหลดจาก Aladhan API ได้
- [ ] แสดง 5 เวลาละหมาด + countdown ถัดไป
- [ ] Prayer streak tracking ด้วย MMKV
- [ ] Push notification schedule เมื่อเปิด app
- [ ] Azan sound notification บน iOS และ Android
- [ ] Settings สำหรับเลือก calculation method

---

## Phase 3: Azkar (Morning & Evening Dhikr)

**ระยะเวลาโดยประมาณ: 2–3 วัน**

### 3.1 Azkar Data

Reuse `@noor/shared/data/azkar.ts` ได้ 100% (26 entries ที่มีอยู่แล้ว)

### 3.2 Storage

Key: `"azkar-progress"` → `{ date: string; counts: Record<string, number> }`  
ย้ายจาก localStorage → MMKV โดยไม่เปลี่ยน schema

### 3.3 Azkar Screen

```
app/(tabs)/azkar/
├── index.tsx          ← Session selector (Morning / Evening)
├── [session].tsx      ← Dhikr list สำหรับ session นั้น
└── detail/[id].tsx    ← รายละเอียด azkar item เดี่ยว (optional)
```

**Azkar Card Component** — สิ่งที่แตกต่างจาก Web:
- `onPress` → Haptic feedback (`expo-haptics`)
- Progress ring แทน progress bar (native feel)
- Swipe to complete gesture
- `FlatList` แทน `map()` ใน JSX (performance สำหรับ 26 items)

```tsx
// แต่ละ AzkarCard
import * as Haptics from "expo-haptics";

const handleTap = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  increment(item.id);
};
```

### 3.4 Auto-reset Logic

```ts
// ใน useAzkarProgress:
// ถ้า date เก่ากว่าวันนี้ → reset counts
// เหมือน web แต่ใช้ MMKV แทน localStorage
```

### Checklist Phase 3
- [ ] Azkar data โหลดจาก shared package
- [ ] Morning / Evening session selector
- [ ] Tap to count พร้อม Haptic feedback
- [ ] Progress แสดงอย่างชัดเจน (N/Total)
- [ ] Auto-reset ข้ามวัน
- [ ] Completion celebration animation

---

## Phase 4: Quran Reader

**ระยะเวลาโดยประมาณ: 4–5 วัน (ซับซ้อนที่สุด)**

### 4.1 Quran Data & API

Reuse `@noor/shared/api-clients/quran.ts` ได้ 100%

### 4.2 Screen Structure

```
app/(tabs)/quran/
├── index.tsx              ← Surah list (114 surahs)
├── [surah]/
│   ├── index.tsx          ← Ayah reader
│   └── notes.tsx          ← Ayah notes (optional)
└── search.tsx             ← Search surahs
```

### 4.3 Surah List

```tsx
// ใช้ FlatList เพื่อ performance
<FlatList
  data={SURAHS}
  keyExtractor={(item) => String(item.number)}
  renderItem={({ item }) => <SurahCard surah={item} />}
  getItemLayout={(_, index) => ({ length: 72, offset: 72 * index, index })}
/>
```

### 4.4 Ayah Reader

ความท้าทายสำคัญ:
- **Arabic RTL text** — React Native รองรับ `writingDirection: "rtl"` และ `textAlign: "right"`
- **Font size ที่ปรับได้** — เก็บใน MMKV
- **Virtualized list** — `FlashList` (Shopify) แทน `FlatList` สำหรับ performance ดีกว่า

```bash
npx expo install @shopify/flash-list
```

```tsx
import { FlashList } from "@shopify/flash-list";

<FlashList
  data={ayahs}
  estimatedItemSize={120}
  renderItem={({ item }) => (
    <AyahCard
      ayah={item}
      memoStatus={memoMap[`${surahNum}:${item.numberInSurah}`]}
      note={notesMap[`${surahNum}:${item.numberInSurah}`]}
      onMemorizationToggle={cycleStatus}
    />
  )}
/>
```

### 4.5 Audio (ฟีเจอร์ที่ดีกว่า Web มาก)

```bash
npx expo install expo-av
```

```ts
// src/hooks/use-quran-audio.ts
import { Audio } from "expo-av";

// Stream audio จาก Quran API (reciter ที่เลือก)
// Background audio playback ได้ (ต้องตั้งค่า audio session)
await Audio.setAudioModeAsync({
  playsInSilentModeIOS: true,        // เล่นได้แม้ silent mode
  staysActiveInBackground: true,      // เล่นได้แม้ app อยู่ background
  interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
});
```

### 4.6 Memorization & Notes

Reuse logic เดิมจาก `use-quran-memorization.ts` แต่เปลี่ยน `useLocalStorage` → `useStorage`

### Checklist Phase 4
- [ ] Surah list แสดง 114 สูเราะห์ + ค้นหาได้
- [ ] Ayah reader แสดงข้อ Arabic + คำแปล
- [ ] Arabic RTL text render ถูกต้อง
- [ ] Font size ปรับได้
- [ ] Audio stream ได้ + background playback
- [ ] Memorization status (learning/memorized)
- [ ] Ayah notes (add/edit/delete)
- [ ] Bookmark / Last read position

---

## Phase 5: Tasbeeh Counter + Ibadah Tracker

**ระยะเวลาโดยประมาณ: 2 วัน**

### 5.1 Tasbeeh Counter

**สิ่งที่ทำได้บน Mobile แต่ทำไม่ได้บน Web:**
- Haptic feedback ทุกครั้งที่กด
- Widget บน Home Screen (ด้วย `expo-widgets` ถ้าต้องการ)
- Screen ไม่ดับขณะนับ (`expo-keep-awake`)

```bash
npx expo install expo-haptics expo-keep-awake
```

```tsx
// Tasbeeh screen — กดทั้งหน้าจอเพื่อนับ
<Pressable
  style={styles.fullScreen}
  onPress={() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    increment();
  }}
>
  <Text style={styles.counter}>{count}</Text>
</Pressable>
```

### 5.2 Ibadah Tracker

Logic เหมือน web ทั้งหมด — เปลี่ยนแค่ storage และ UI:
```
app/(tabs)/prayer/ibadah.tsx  ← Daily ibadah checklist
```

### Checklist Phase 5
- [ ] Tasbeeh counter พร้อม Haptic feedback
- [ ] Preset dhikr (Subhanallah, Alhamdulillah, Allahu Akbar)
- [ ] Custom dhikr เพิ่มได้
- [ ] Keep screen awake ขณะนับ
- [ ] Ibadah daily checklist พร้อม persistence

---

## Phase 6: Features กลุ่มที่ 2

**ระยะเวลาโดยประมาณ: 3–4 วัน**

### 6.1 Fasting Tracker

```
app/fasting/index.tsx
```

Logic เหมือน web เลย — Reuse `calendar-utils.ts` สำหรับ Hijri  
UI: Monthly calendar grid ด้วย `FlatList` (7 columns)

### 6.2 Hijri Calendar

```
app/calendar/index.tsx
```

Reuse `calendar-utils.ts` ทั้งหมด  
ใช้ `FlatList` แทน CSS Grid สำหรับ calendar grid

### 6.3 Qibla Direction (Native Magnetometer — ดีกว่า Web มาก)

```bash
npx expo install expo-sensors
```

```ts
// src/hooks/use-qibla.ts
import { Magnetometer } from "expo-sensors";

// Reuse qibla.ts จาก shared package สำหรับ calculateQiblaAngle()
// บน native ได้ Magnetometer ที่แม่นยำกว่า DeviceOrientationEvent บน web

Magnetometer.addListener(({ x, y, z }) => {
  const heading = Math.atan2(y, x) * (180 / Math.PI);
  const qiblaAngle = calculateQiblaAngle(lat, lng);
  setRotation(qiblaAngle - heading);
});
```

```tsx
// UI: Compass ที่หมุนได้จริง
<Animated.View style={{ transform: [{ rotate: `${rotation}deg` }] }}>
  <CompassNeedle />
</Animated.View>
```

### 6.4 Zakat Calculator

```
app/zakat/index.tsx
```

Reuse `zakat-utils.ts` ทั้งหมด  
UI: Form inputs + result display

### 6.5 99 Names of Allah

```
app/names/index.tsx
```

Reuse `data/allah-names.ts` ทั้งหมด  
เพิ่ม FlashList สำหรับ performance + Search + Favorites

### 6.6 Stats Dashboard

```
app/stats/index.tsx
```

Logic เหมือน web — อ่านจาก MMKV keys เดิม  
UI: Stat cards + simple charts (ใช้ `react-native-svg` สำหรับ charts)

### 6.7 Duas Journal

```
app/duas/
├── index.tsx    ← List view (categories)
└── journal.tsx  ← Personal dua notes
```

Reuse data จาก `app/duas/en.json` + `th.json`

### Checklist Phase 6
- [ ] Fasting tracker (calendar + toggle days)
- [ ] Hijri calendar แสดงได้ถูกต้อง
- [ ] Qibla compass หมุนตาม Magnetometer
- [ ] Zakat calculator คำนวณถูกต้อง
- [ ] 99 Names พร้อม search + favorites
- [ ] Stats dashboard อ่านข้อมูลจาก MMKV
- [ ] Duas journal + บันทึกส่วนตัว

---

## Phase 7: Halal Places + Map

**ระยะเวลาโดยประมาณ: 3–4 วัน**

### 7.1 Setup Maps

```bash
npx expo install react-native-maps
```

iOS: ต้องมี Apple Maps API key หรือใช้ Google Maps SDK  
Android: ต้องมี Google Maps API key

เพิ่มใน `app.json`:
```json
{
  "android": {
    "config": {
      "googleMaps": { "apiKey": "YOUR_KEY" }
    }
  }
}
```

### 7.2 Places Screen

```
app/places/
├── index.tsx     ← Map view + List toggle
└── [id].tsx      ← Place detail
```

```tsx
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

<MapView
  provider={PROVIDER_GOOGLE}
  initialRegion={{ latitude, longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
>
  {places.map((place) => (
    <Marker key={place.id} coordinate={{ latitude: place.lat, longitude: place.lng }} />
  ))}
</MapView>
```

### 7.3 Data Source

เรียก API จาก Next.js web app (`/api/places/proximities`) ที่มีอยู่แล้ว  
หรือ OSM Overpass API โดยตรง

### Checklist Phase 7
- [ ] Map แสดง markers ของ halal places
- [ ] List view เรียงตามระยะทาง
- [ ] Place detail (ชื่อ, ที่อยู่, ประเภท)
- [ ] Filter (มัสยิด / อาหารฮาลาล)
- [ ] Navigate to place (เปิด Google Maps)

---

## Phase 8: Lessons & Content

**ระยะเวลาโดยประมาณ: 2 วัน**

### 8.1 Architecture

Mobile app **ไม่มี Admin panel** — เรียก content จาก Next.js API ที่มีอยู่

```
apps/mobile → GET https://api.noorapp.com/api/lessons
```

### 8.2 Lessons Screen

```
app/lessons/
├── index.tsx     ← Lesson list
└── [slug].tsx    ← Lesson detail (render Markdown/HTML)
```

```bash
npx expo install react-native-render-html
```

```tsx
import RenderHtml from "react-native-render-html";
// Render HTML content จาก lesson.content
```

### 8.3 Hajj & Umrah Guide

```
app/hajj-umrah/index.tsx
```

Reuse `data/hajj-umrah.ts` ทั้งหมด — Static content ไม่ต้องเรียก API

### Checklist Phase 8
- [ ] Lesson list โหลดจาก API
- [ ] Lesson detail render HTML ได้
- [ ] Offline caching (cache lessons ที่อ่านไปแล้ว)
- [ ] Hajj & Umrah guide แสดงเนื้อหาครบ

---

## Phase 9: Settings + Polish

**ระยะเวลาโดยประมาณ: 2–3 วัน**

### 9.1 Settings Screen

```
app/(tabs)/settings/
├── index.tsx          ← Main settings list
├── prayer.tsx         ← Calculation method, notification
├── appearance.tsx     ← Theme, font size, language
└── about.tsx          ← Version, donate link
```

### 9.2 App Icon & Splash Screen

```bash
npx expo install expo-splash-screen
```

สร้างไฟล์:
- `assets/icon.png` (1024×1024)
- `assets/splash.png` (2048×2048)
- `assets/adaptive-icon.png` (Android)

### 9.3 Arabic RTL Support

ใน `app.json`:
```json
{
  "extra": { "supportsRTL": false }
}
```

> หมายเหตุ: App เป็น TH/EN — ไม่ต้อง full RTL แต่ Arabic text ใน Quran/Azkar ต้อง RTL เสมอ

### 9.4 Performance Checklist

- [ ] ใช้ `FlashList` แทน `FlatList` ที่ list ยาว (Quran, Names, Azkar)
- [ ] `useMemo` / `useCallback` ใน lists เพื่อป้องกัน re-render
- [ ] Image caching ด้วย `expo-image` แทน `<Image>`
- [ ] Lazy load screens ที่ไม่ได้ใช้บ่อย

```bash
npx expo install expo-image
```

### 9.5 Error Handling & Loading States

- Skeleton loaders สำหรับทุก screen ที่ load data
- Error boundary สำหรับ network failures
- Offline mode — แสดงข้อมูลจาก cache

### Checklist Phase 9
- [ ] Settings ครบทุก option
- [ ] App icon + splash screen สวยงาม
- [ ] Arabic text RTL ถูกต้องทุกจุด
- [ ] Loading states ครบ
- [ ] Error handling ครบ
- [ ] Test บน iOS Simulator + Android Emulator

---

## Phase 10: EAS Build & Store Submission

**ระยะเวลาโดยประมาณ: 3–5 วัน**

### 10.1 Setup EAS

```bash
npm install -g eas-cli
eas login
eas build:configure
```

`apps/mobile/eas.json`:
```json
{
  "cli": { "version": ">= 12.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": { "simulator": true }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 10.2 App Store (iOS) Requirements

- [ ] Apple Developer Account ($99/year)
- [ ] App ID + Bundle ID: `com.muslimpro.app`
- [ ] Provisioning Profile + Certificates (EAS จัดการให้)
- [ ] Privacy Policy URL
- [ ] Screenshots สำหรับ iPhone 6.7" (iPhone Pro Max)
- [ ] App Review Notes (อธิบาย Islamic content)

### 10.3 Google Play (Android) Requirements

- [ ] Google Play Console Account ($25 one-time)
- [ ] Package name: `com.muslimpro.app`
- [ ] Keystore (EAS จัดการให้)
- [ ] Privacy Policy URL
- [ ] Screenshots สำหรับ Phone + 7" Tablet
- [ ] Content rating questionnaire

### 10.4 Build Commands

```bash
# Development build (test บน device จริง)
eas build --profile development --platform all

# Preview build (internal testing)
eas build --profile preview --platform all

# Production build
eas build --profile production --platform all

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

### 10.5 OTA Updates (Over The Air)

```bash
npx expo install expo-updates
```

```bash
# Push update โดยไม่ต้อง submit ใหม่ (สำหรับ JS changes)
eas update --branch production --message "Fix prayer times bug"
```

> **ข้อจำกัด OTA**: ใช้ได้เฉพาะ JavaScript changes — native code ต้อง build ใหม่เสมอ

### Checklist Phase 10
- [ ] EAS configured ทั้ง iOS และ Android
- [ ] Development build test บน device จริงได้
- [ ] Production build สำเร็จ ไม่มี errors
- [ ] App Store Connect — App listing ครบ
- [ ] Google Play Console — App listing ครบ
- [ ] Submitted for Review

---

## สรุป Roadmap และ Priority

```
Phase 0   Setup Monorepo           ████░░░░░░  1–2 วัน
Phase 1   Core Infrastructure      ████████░░  2–3 วัน
Phase 2   Prayer Times + Notif.    ██████████  3–4 วัน  ← CRITICAL
Phase 3   Azkar                    ██████░░░░  2–3 วัน  ← HIGH
Phase 4   Quran Reader             ██████████  4–5 วัน  ← HIGH
Phase 5   Tasbeeh + Ibadah         ████░░░░░░  2 วัน
Phase 6   Feature Group 2          ████████░░  3–4 วัน
Phase 7   Places + Map             ██████░░░░  3–4 วัน
Phase 8   Lessons + Content        ████░░░░░░  2 วัน
Phase 9   Polish + Settings        ██████░░░░  2–3 วัน
Phase 10  EAS Build + Submission   ████████░░  3–5 วัน
                                              ──────────
                              รวม             27–39 วัน
```

### MVP ขั้นต่ำสำหรับ v1.0 (Phase 1–5 + Phase 10)

หากต้องการ ship เร็ว — ทำแค่ features หลักก่อน:
1. Prayer times + notifications
2. Azkar (morning/evening)
3. Quran reader + audio
4. Tasbeeh counter
5. Basic settings (theme, language)

ใช้เวลา ~2–3 สัปดาห์ สามารถ submit App Store ได้

---

## Risk ที่ต้องระวัง

| Risk | ระดับ | วิธีจัดการ |
|------|-------|-----------|
| React Native Arabic text rendering | สูง | Test บน device จริงตั้งแต่ Phase 1 — บางฟอนต์ render ไม่ถูกต้อง |
| iOS Audio background playback | กลาง | ตั้งค่า audio session mode อย่างถูกต้องตั้งแต่ Phase 4 |
| App Store Review (Islamic content) | กลาง | เตรียม Review Notes ชี้แจง educational purpose |
| Maps API cost (Google) | กลาง | ตั้ง usage limits และ consider Apple Maps สำหรับ iOS |
| MMKV migration (ถ้ามี user เดิมจาก web) | ต่ำ | App ใหม่ — ไม่มี migration เดิม; web ยังอยู่แยก |
| Monorepo complexity | กลาง | ใช้ Turborepo — มี template ดีและ documentation ครบ |

---

## ไฟล์ที่ต้องสร้างใน `apps/mobile`

```
apps/mobile/
├── app/
│   ├── _layout.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx        ← Tab bar (Home, Quran, Azkar, Prayer, Settings)
│   │   ├── index.tsx          ← Home dashboard
│   │   ├── quran/
│   │   ├── azkar/
│   │   ├── prayer/
│   │   └── settings/
│   ├── fasting/
│   ├── calendar/
│   ├── qibla/
│   ├── tasbeeh/
│   ├── ibadah/
│   ├── names/
│   ├── zakat/
│   ├── duas/
│   ├── stats/
│   ├── places/
│   ├── lessons/
│   └── hajj-umrah/
├── src/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── storage/
│   └── services/
├── assets/
│   ├── fonts/
│   ├── sounds/               ← azan.mp3
│   └── images/
├── app.json
├── eas.json
├── tailwind.config.js
└── package.json
```
