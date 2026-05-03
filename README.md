# Muslim Lifestyle App

โปรเจคแอปพลิเคชันสำหรับวิถีชีวิตชาวมุสลิม (Muslim Lifestyle) พัฒนาด้วย Next.js (App Router) โดยรวบรวมฟีเจอร์ต่างๆ ที่จำเป็นสำหรับมุสลิมในชีวิตประจำวัน เช่น อัลกุรอาน, เวลาละหมาด, ทิศกิบลัต, สถานที่สำคัญ (มัสยิด/ร้านอาหารฮาลาล), บทเรียน และดุอาอ์

## 🚀 ฟีเจอร์หลัก (Key Features)

- **📖 อัลกุรอาน (Quran):** อ่านอัลกุรอานพร้อมคำแปล (รองรับภาษาอังกฤษและภาษาไทย)
- **🧠 ระบบติดตามการท่องจำ (Quran Memorization):** ติดตามความคืบหน้าการท่องจำอัลกุรอานแต่ละซูเราะห์และอายะห์
- **📝 ระบบจดบันทึกอายะห์ (Ayah Notes):** บันทึกข้อความส่วนตัวและข้อคิดเตือนใจในแต่ละอายะห์ของอัลกุรอาน
- **📿 อัซการ์ (Azkar):** รวบรวมคำรำลึกถึงอัลลอฮ์ (ซิกิร) แนะนำสำหรับการอ่านในยามเช้าและยามเย็น
- **⏱️ เวลาละหมาด (Prayer Times):** แสดงเวลาละหมาดตามตำแหน่งที่ตั้ง พร้อมระบบนับถอยหลัง
- **🧭 ทิศกิบลัต (Qibla Direction):** เข็มทิศชี้ทิศกิบลัตสำหรับปฏิบัติศาสนกิจ
- **📍 สถานที่ (Places):** ค้นหามัสยิดและร้านอาหารฮาลาลใกล้เคียง (บูรณาการกับ Leaflet/React-Leaflet)
- **📚 บทเรียน & ดุอาอ์ (Lessons & Duas):** แหล่งรวมความรู้และบทขอดุอาอ์ต่างๆ
- **💖 บริจาค (Donation):** ช่องทางการบริจาคเพื่อสนับสนุนการพัฒนาแอปพลิเคชัน
- **🌐 รองรับหลายภาษา (i18n):** รองรับภาษาไทย (TH) และภาษาอังกฤษ (EN)
- **🌓 ธีม (Theme):** รองรับ Light Mode และ Dark Mode (ผ่าน `next-themes`)
- **🔐 ระบบสมาชิก (Authentication):** จัดการผู้ใช้งานผ่านบัญชี (NextAuth.js)

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** CSS Modules / Vanilla CSS
- **Database:** MySQL (รันผ่าน Docker Compose)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) (v5 beta)
- **Maps:** Leaflet & React-Leaflet
- **Icons:** Lucide React

## 📋 สิ่งที่ต้องมีก่อนเริ่มพัฒนา (Prerequisites)

- [Node.js](https://nodejs.org/) (แนะนำเวอร์ชัน 20 ขึ้นไป)
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (สำหรับรัน MySQL Database)
- Git

## 💻 วิธีการติดตั้งและรันโปรเจค (Getting Started)

1. **โคลนโปรเจค (Clone the repository)**

   ```bash
   git clone https://github.com/Sakeerin/muslim-lifestyle-app.git
   cd muslim-pro
   ```

2. **ติดตั้ง Dependencies**

   ```bash
   npm install
   ```

3. **ตั้งค่า Environment Variables**
   สร้างไฟล์ `.env` ที่ root ของโปรเจค โดยกำหนดค่าที่จำเป็น เช่น ข้อมูลการเชื่อมต่อฐานข้อมูล (Database) คู่มือการตั้งค่าแบบเต็มน่าจะมีอ้างอิงจาก `.env.example`

   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/muslim_pro"
   ```

4. **รัน Database (ด้วย Docker)**

   ```bash
   npm run db:up
   ```

5. **ตั้งค่า Prisma (Database Migration)**
   เพื่อสร้างตารางในฐานข้อมูลตาม Schema ที่ออกแบบไว้

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

6. **รัน Development Server**

   ```bash
   npm run dev
   ```

   เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000) เพื่อดูผลลัพธ์ และการแก้ไขโค้ดจะอัปเดตบนหน้าเว็บอัตโนมัติ

## 📂 โครงสร้างโปรเจคที่สำคัญ (Project Structure)

- `src/app/` - หน้า Pages และ Layouts ต่างๆ (Next.js App Router)
  - `quran/`, `prayer-times/`, `qibla/`, `places/`, `lessons/`, `duas/`, `azkar/`, `donate/`, `settings/`
- `src/components/` - React Components ที่ใช้งานร่วมกัน (เช่น app-shell, theme-toggle)
- `src/hooks/` - Custom Hooks สำหรับจัดการ State และการบันทึกข้อมูล (เช่น `use-quran-memorization`, `use-ayah-notes`)
- `src/i18n/` - ระบบจัดการภาษา (Translations - `en.json`, `th.json`)
- `prisma/` - โครงสร้างฐานข้อมูล Prisma Schema (`schema.prisma`) และไฟล์ Migrations

## 📜 คำสั่ง Scripts ที่ใช้บ่อย (Available Scripts)

- `npm run dev`: รันเซิร์ฟเวอร์โหมด Development
- `npm run build`: สร้าง Production Build สำหรับขึ้นระบบจริง
- `npm run start`: รันเซิร์ฟเวอร์โหมด Production
- `npm run db:up`: สตาร์ท MySQL database ผ่าน Docker Compose แบบเบื้องหลัง (Detached)
- `npm run db:down`: หยุดและลบ Database Container
- `npm run prisma:generate`: สร้าง Prisma Client หลังจากที่มีการแก้ไฟล์ Schema
- `npm run prisma:migrate`: รัน Migration เผื่อทำการเปลี่ยนแปลงโครงสร้าง Database
- `npm run prisma:migrate:deploy`: รัน Migration สำหรับ Production (ไม่สร้าง migration ใหม่)
- `npm run prisma:studio`: เปิด Web UI ของ Prisma เพื่อจัดการข้อมูลใน Database แบบมองเห็นภาพ
- `npm run format`: จัดรูปแบบโค้ด (Format) ด้วย Prettier

<!-- ## 🚀 Production Migration (MySQL / Hostinger)

สำหรับการขึ้นระบบจริงบน MySQL (เช่น Hostinger Business Plan):

1. ตั้งค่า `DATABASE_URL` ให้ชี้ไปยัง MySQL Production
2. สร้าง Prisma Client
   ```bash
   npm run prisma:generate
   ```
3. รัน migration ที่ commit ไว้แล้ว
   ```bash
   npm run prisma:migrate:deploy
   ```

> แนะนำให้รัน `npm run prisma:migrate` บนเครื่อง dev ก่อน เพื่อสร้าง migration ใหม่ แล้ว commit โฟลเดอร์ `prisma/migrations` ทุกครั้งก่อน deploy

## ✅ Hostinger Deployment Checklist (Business Plan)

ลำดับที่แนะนำสำหรับ deploy ขึ้น Hostinger (MySQL):

1. ตั้งค่า Environment Variables ใน Hostinger
   - `DATABASE_URL` (MySQL production)
   - `NEXTAUTH_URL` (โดเมนจริง เช่น `https://your-domain.com`)
   - `NEXTAUTH_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD_HASH`
2. ติดตั้ง package
   ```bash
   npm ci
   ```
3. สร้าง Prisma Client
   ```bash
   npm run prisma:generate
   ```
4. รัน migration ที่อยู่ใน repo
   ```bash
   npm run prisma:migrate:deploy
   ```
5. Build และรันแอป
   ```bash
   npm run build
   npm run start
   ```

Quick verify หลัง deploy:

- เปิด `/api/lessons` และ `/api/duas` ต้องได้ `200`.
- ล็อกอิน `/admin/login` ได้ และสร้างข้อมูลใหม่ได้จริง.
- หน้า `/places` เรียกข้อมูลได้โดยไม่ error. -->

## 🤝 การมีส่วนร่วมในการพัฒนา (Contributing)

สำหรับนักพัฒนาที่จะมาพัฒนาต่อหรือเข้ามาร่วมแจม:

1. กรุณาแตก Branch ใหม่สำหรับแต่ละ Feature หรือ Bug Fix (`git checkout -b feature/your-feature-name` หรือ `bugfix/issue-name`)
2. เขียนโค้ดโดยอิงจากโครงสร้างปัจจุบัน และพยายามใช้ TypeScript ในการ Define Type ให้ชัดเจน
3. จัดรูปแบบโค้ดด้วยรูปแบบที่ตกลงกันไว้ (รัน `npm run format` หรือตั้งค่าแก้ไขผ่าน IDE)
4. ก่อนการขอ Merge โค้ด กรุณาสร้าง Pull Request (PR) พร้อมอธิบายสิ่งที่คุณได้แก้ไขหรือเพิ่มเติมอย่างละเอียด
