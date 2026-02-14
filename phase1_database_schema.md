# Phase 1: Database Schema Design

This schema is finalized for planning and ready to be implemented with Prisma in Phase 2.

## Prisma Draft

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  ADMIN
  USER
}

enum PlaceType {
  MOSQUE
  HALAL_FOOD
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Lesson {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String
  coverImage  String?
  videoUrl    String?
  category    String
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Dua {
  id               String   @id @default(cuid())
  title            String
  arabic           String
  audioUrl         String?
  translation      String
  transliteration  String?
  category         String
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model Place {
  id          String    @id @default(cuid())
  name        String
  type        PlaceType
  lat         Float
  lng         Float
  address     String?
  description String?
  isVerified  Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

## Notes

- `createdAt` is `DateTime` (not `String`) for proper querying/sorting.
- Enums (`UserRole`, `PlaceType`) are used for safer and cleaner API contracts.
- `updatedAt` fields are included to support audit visibility in admin UI.
