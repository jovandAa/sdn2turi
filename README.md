# SDN Turi 2 Refactor

Website sekolah berbasis Next.js + Prisma + PostgreSQL (Neon) + Cloudinary.

## Tech Stack

- Next.js 16 (App Router)
- Prisma ORM
- Neon PostgreSQL
- NextAuth (Credentials)
- Cloudinary + next-cloudinary
- Tailwind CSS
- tRPC + React Query + Zustand

## 1. Persiapan

Pastikan sudah terpasang:

- Node.js 20+
- npm 10+
- Akses database PostgreSQL (Neon)
- Akun Cloudinary

## 2. Install Dependency

```bash
npm install
```

## 3. Setup Environment

1. Copy file example:

```bash
cp .env.example .env
```

2. Isi semua value di `.env`.

Lihat daftar variabel di `.env.example`.

## 4. Setup Database

Generate Prisma client:

```bash
npx prisma generate
```

Push schema ke database:

```bash
npm run db:push
```

Seed data awal:

```bash
npm run db:seed
```

## 5. Jalankan Development

```bash
npm run dev
```

Buka `http://localhost:3000`.

## 6. Akun Seed Default

- SUPER_ADMIN:
  - Email: `admin@sdnturi2.sch.id`
  - Password: nilai dari `ADMIN_PASSWORD` (default fallback: `Admin123!`)
- ADMIN:
  - Email: `operator@sdnturi2.sch.id`
  - Password: nilai dari `ADMIN_PASSWORD` (default fallback: `Admin123!`)

## 7. Script Penting

- `npm run dev` : jalankan app mode development
- `npm run build` : build production
- `npm run start` : jalankan hasil build
- `npm run lint` : linting
- `npm run db:push` : sinkron schema Prisma ke DB
- `npm run db:seed` : isi data awal
- `npm run media:upload` : upload file dari folder `public/media` ke Cloudinary dan update map seed

## 8. Catatan Keamanan

- Jangan commit `.env` ke git.
- `NEXTAUTH_SECRET` wajib random dan kuat di production.
- `CLOUDINARY_API_SECRET` hanya untuk server-side, jangan expose ke client.
- Setelah deploy, update `NEXTAUTH_URL` ke domain production.
