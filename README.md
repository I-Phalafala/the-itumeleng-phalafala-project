# the-itumeleng-phalafala-project

Portfolio of Itumeleng Phalafala — built with [Next.js](https://nextjs.org/), TypeScript, and Tailwind CSS.

## 📁 Folder Structure

```
src/
├── app/
│   ├── (public)/        # Public routes (home, about, contact, etc.)
│   ├── (admin)/         # Admin routes (dashboard, settings, etc.)
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/
│   ├── ui/              # Reusable UI primitives (Button, Input, Card, etc.)
│   ├── sections/        # Page sections (Hero, Timeline, etc.)
│   └── admin/           # Admin-specific components
├── lib/
│   └── firebase/        # Firebase configuration & services
├── hooks/               # Custom React hooks
├── types/               # TypeScript interfaces & type definitions
└── constants/           # App-wide constants & configuration values
public/                  # Static assets (images, fonts, icons, etc.)
```

### Path Aliases

The project uses the `@/` path alias (configured in `tsconfig.json`) which maps to `src/`. For example:

| Alias                          | Resolves to                     |
| ------------------------------ | ------------------------------- |
| `@/components/ui/Button`       | `src/components/ui/Button`      |
| `@/components/sections/Hero`   | `src/components/sections/Hero`  |
| `@/components/admin/Dashboard` | `src/components/admin/Dashboard`|
| `@/lib/firebase`               | `src/lib/firebase`              |
| `@/hooks/useAuth`              | `src/hooks/useAuth`             |
| `@/types/project`              | `src/types/project`             |
| `@/constants/routes`           | `src/constants/routes`          |

### Route Groups

The `(public)` and `(admin)` directories inside `app/` are [Next.js route groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups). The parentheses keep them out of the URL path while allowing separate layouts for public-facing and admin pages.

## 🔐 Environment Variables

This project requires Firebase configuration via environment variables. All client-side variables use the `NEXT_PUBLIC_` prefix so they are accessible in browser-side code.

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in your Firebase project values in `.env.local`:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain (e.g. `project.firebaseapp.com`) |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket (e.g. `project.appspot.com`) |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Cloud Messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |

> **Note:** `.env.local` is listed in `.gitignore` and must never be committed. Use `.env.example` as a reference for required keys.

If any required variable is missing, the app will log a descriptive error at startup.

## 🚀 Getting Started

```bash
npm install
cp .env.example .env.local  # then fill in your Firebase values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📦 Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start development server     |
| `npm run build` | Create production build      |
| `npm run start` | Start production server      |
| `npm run lint`  | Run ESLint                   |