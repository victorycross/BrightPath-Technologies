# CLAUDE.md - BrightPath Technologies

## Project Overview
Business consulting website for BrightPath Technologies - AI solutions and technology consulting services. Deployed at brightpathtechnology.io.

## Tech Stack
- **Framework**: React + Vite (JavaScript)
- **Styling**: Tailwind CSS + shadcn/ui
- **Package Manager**: pnpm (preferred) or npm
- **Hosting**: GitHub Pages (via `/dist`)

## Commands
```bash
pnpm install         # Install dependencies
pnpm run dev         # Start dev server
pnpm run build       # Production build to /dist
pnpm run preview     # Preview production build
```

## Project Structure
```
src/
├── components/      # React components
├── assets/          # Images, fonts
├── pages/           # Route components
└── App.jsx          # Main app component
dist/                # Built output (committed for GitHub Pages)
public/              # Static assets
CNAME                # Custom domain config
```

## Code Conventions
- JavaScript (not TypeScript) for this project
- Prefer shadcn/ui components
- Keep components focused and reusable
- Commit `/dist` folder for GitHub Pages deployment

## Domain Context
- **Services**: AI governance, risk assessment, technology consulting
- **Target clients**: Mid-market enterprises, professional services firms
- **Differentiator**: Canadian focus, practical implementation over theory
- **Tone**: Professional, knowledgeable, approachable

## When Working on This Project
- Maintain clean, modern B2B aesthetic
- Case studies and testimonials are valuable content
- Contact/inquiry forms should capture enough context for follow-up
- SEO matters—use semantic HTML and proper meta tags
- Ensure fast load times (optimize images, lazy load)
