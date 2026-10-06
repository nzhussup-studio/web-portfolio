# Web Portfolio Agent Instructions

## Scope

These instructions apply to the entire `web-portfolio` repository. The deployable frontend is in `portfolio/`.

The site is Nurzhanat Zhussup's personal software-engineering portfolio. Preserve its existing backend-driven capabilities while refactoring the frontend toward the architecture and visual direction below.

## Current stack

The frontend migration is complete. The application uses:

- React with TypeScript in strict mode
- Vite; do not migrate to Next.js, Vue, or another application framework
- React Router for client-side routes
- Tailwind CSS for styling and design tokens
- TanStack Query for backend server state, caching, loading, and error handling
- `openapi-typescript` and `openapi-fetch` for generated API types and typed requests
- `react-i18next` for localization
- Lucide React for the small number of interface icons
- Yet Another React Lightbox for album viewing
- Vitest and React Testing Library for focused component and utility tests

Do not reintroduce Bootstrap, Bootstrap Icons, Axios, Framer Motion, JavaScript/JSX source files, or an alternative application framework. Prefer CSS transitions and respect `prefers-reduced-motion`.

## Product structure

The public navigation contains exactly these primary routes:

- About: `/`
- CV: `/curriculum-vitae`
- Projects: `/projects`
- Albums: `/albums`
- Album detail: `/albums/:albumID`

There is no standalone Links page in the target experience. Put Email, GitHub, LinkedIn, and other approved external profiles in the shared footer on every page.

Page responsibilities:

- About is a mild personal introduction. It includes the AI-summary interaction and a short section about life outside software. It must not duplicate the CV or Projects pages.
- CV is one linear document: Experience, Education, Skills, then Certificates. A sticky section navigator smoothly scrolls to these visible sections; it does not hide content in tab panels.
- Projects is a backend-driven project index.
- Albums is a backend-driven album preview grid. Album detail displays the selected album's images.

## Visual direction

Use the approved design references in `designs/`:

- `designs/about-page.png`
- `designs/cv-page.png`
- `designs/projects-page.png`
- `designs/albums-page.png`

These images describe visual direction and layout, not literal content. Backend data remains authoritative.

Follow these principles:

- Minimal, informative, and editorial
- Swiss grid discipline with Apple-like restraint
- Generous whitespace, strong alignment, clear hierarchy, and thin rules
- Warm neutral surfaces with one restrained evergreen/sage accent
- Neutral grotesk sans-serif for primary text and monospace only for metadata or subtle coding cues
- Coding references should be light: section paths, indices, or metadata—not terminals, IDE chrome, large code blocks, neon, or cyberpunk styling
- Square or nearly square geometry, minimal shadows, and few decorative elements
- Do not use large portraits on the About page
- Avoid generic dashboard cards, pill-heavy interfaces, gradients, glassmorphism, and excessive rounded corners
- Make responsive behavior intentional rather than shrinking the desktop composition

Build shared primitives instead of repeating page-specific markup. Expected reusable concepts include `AppShell`, `Header`, `Footer`, `PageIntro`, `SectionHeading`, `SectionNav`, `DataList`, `DataRow`, `ExternalLink`, `LoadingSkeleton`, `EmptyState`, and `ErrorState`. Names may differ when the existing code suggests a better abstraction.

## API and data ownership

CV, Projects, and Albums content comes from the backend. Do not hardcode production records in frontend source.

The API base is currently `https://api.nzhussup.dev/v1`. The canonical OpenAPI document in this workspace is:

`../web-admin-panel/admin-panel/openapi.yaml`

Generate TypeScript API types from the OpenAPI document. Keep generated files separate from handwritten adapters and never edit generated files manually.

The Base Service GET endpoints currently declare array items as generic objects even though component schemas exist. Until the OpenAPI responses reference those schemas correctly, use a small typed boundary based on the corresponding component schema; do not spread untyped API objects throughout components.

Use only API-delivered fields for dynamic records:

### Work experience

- `position`
- `company`
- `location`
- `startDate`
- `endDate`
- `description`
- `techStack`
- `displayOrder` controls order and is not displayed
- `id` is an internal key and is not displayed

### Education

- `degree`
- `institution`
- `location`
- `startDate`
- `endDate`
- `thesis`
- `description`
- `displayOrder` controls order and is not displayed
- `id` is an internal key and is not displayed

### Skills

- `category`
- `skillNames`
- `displayOrder` controls order and is not displayed
- Categories are backend-defined; do not hardcode a fixed taxonomy

### Certificates

- `name`
- `issuer`
- `url`
- `displayOrder` controls order and is not displayed
- `id` is an internal key and is not displayed

### Projects

- `name`
- `url`
- `techStack`
- `displayOrder` controls order and is not displayed
- `id` is an internal key and is not displayed

The backend Project schema does not provide a description, category, year, image, status, star count, live URL, or featured flag. Do not invent or hardcode those values. The current app fetches repository descriptions from GitHub separately; do not make new UI depend on that behavior unless the user explicitly keeps it and the external dependency is documented.

### Album previews

- `preview_image`
- `title`
- `date`
- `desc`
- `image_count`
- `type`
- `id` is used for navigation and is not displayed

Do not invent album locations, tags, likes, or year categories. Handle optional `date`, `desc`, and `preview_image` gracefully without breaking grid alignment.

### Album detail

- `title`
- `date`
- `desc`
- `type`
- `images`
- Each image may provide `id`, `type`, `url`, and binary `data`

### AI summary

Use `GET /llm/summarize?lang=<language>` for the About-page summary. Keep clear loading, generating, paused, completed, and error states. Do not fabricate a summary on the client when the API fails.

Use TanStack Query hooks for server state rather than duplicating `useEffect`, loading flags, retries, and cache behavior across pages. Keep query keys centralized and stable.

## Localization

The target site supports only:

- English: `en`, default
- Kazakh: use the backend-supported language code consistently; prefer standards-compliant `kk` in the frontend unless the existing backend contract requires `kz`

Remove German navigation options, resources, and German-specific warning logic as part of the migration. Do not delete translations until all references are migrated safely.

Keep visible interface text in translation resources rather than embedding it in components. Update the document `lang` attribute when language changes. Persist the choice and preserve it during navigation. API content remains as returned unless the backend supplies localized content.

## Theme

Support light and dark modes across every route and state. Use semantic design tokens rather than duplicating raw colors in components. Prefer a root `data-theme="light|dark"` attribute or equivalent Tailwind selector. Persist explicit user choice in local storage and use the OS preference on first visit. Prevent an incorrect-theme flash during initial loading.

Both themes must maintain the approved minimal visual language, readable contrast, visible keyboard focus, and usable album imagery.

## Accessibility and UX

- Use semantic landmarks, headings, lists, links, and buttons.
- All functionality must work with a keyboard.
- Give icon-only controls accessible names.
- Provide useful alt text for content images and empty alt text for purely decorative imagery.
- Keep body text at least 16px and routine controls at least 14px.
- Support 200% text zoom without overlap or horizontal page scrolling.
- Preserve focus when changing routes or opening/closing the lightbox.
- Provide deliberate loading, empty, partial-error, and full-error states for backend-driven sections.
- The CV section navigator should expose the active section and account for the sticky header when scrolling.

## Proposed source organization

Keep the source organized along this structure; do not create empty folders speculatively:

```text
portfolio/src/
  api/
    generated/
    queries/
    client.ts
    errors.ts
    queryKeys.ts
    types.ts
  app/
    App.tsx
    providers.tsx
    router.tsx
  components/
    data-display/
    feedback/
    layout/
    navigation/
  features/
    about/
      assets/
    albums/
    cv/
    projects/
  hooks/
  i18n/
  styles/
```

Keep route-level data and UI in the relevant feature. Keep truly reusable presentation primitives in `components/`. Avoid catch-all utility files and components that mix fetching, transformation, routing, and complex presentation.

## Development practices

- Prefer small, composable components with explicit typed props.
- Use strict TypeScript; avoid `any`, unchecked casts, and non-null assertions unless justified at a narrow boundary.
- Normalize API data in query/select or adapter functions, not inside presentation markup.
- Do not store server-derived data in additional global client state.
- Avoid adding dependencies when the platform, React, Tailwind, or an existing dependency is sufficient.
- Preserve query parameters and supported user preferences during navigation.
- Never expose API keys or GitHub tokens in client bundles. `VITE_*` variables are public at build time; do not use them for secrets.
- Do not edit backend services or the admin panel unless the task explicitly includes them.
- Preserve unrelated user changes in the worktree.

## Validation

Run commands from `portfolio/` unless stated otherwise.

Current commands:

```bash
npm run lint
npm run build
```

Add these target checks when the corresponding tooling is introduced:

```bash
npm run typecheck
npm test
```

For UI changes, verify at minimum:

- Desktop and mobile layouts
- English and Kazakh
- Light and dark modes
- Loading, empty, success, and failure states
- Keyboard navigation and visible focus
- Direct navigation and refresh on every route

Do not claim the migration or redesign is complete until the production build succeeds and all four public areas use the shared design system.
