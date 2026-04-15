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

## 🚀 Getting Started

```bash
npm install
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