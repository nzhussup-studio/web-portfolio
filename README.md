# Web Portfolio [nzhussup.dev](https://nzhussup.dev)

This repository contains the source code for my public web portfolio, a responsive frontend designed to present projects, skills, and experience.

## Frontend stack

- React and strict TypeScript
- Vite and Tailwind CSS
- React Router
- TanStack Query
- OpenAPI-generated types and `openapi-fetch`
- i18next with English and Kazakh
- Vitest with colocated `name.spec.ts` tests

The frontend source is in `portfolio/`.

## Getting Started

### Local development

```bash
cd portfolio
npm install
npm run dev
```

Useful checks:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Regenerate API types after changing the workspace OpenAPI document:

```bash
npm run generate:api
```
