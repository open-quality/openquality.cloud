# Repository Guidelines

## Project Structure & Module Organization
The marketing site lives under `src/`, where `main.tsx` boots the React tree and `App.tsx` contains the hero, feature grids, and Three.js motion logic; shared styles sit in `App.css` and `index.css`, while lightweight assets (logos, shaders) live in `src/assets/`. Markdown stories for campaigns are stored in `content/` (for example `content/articles/001-fintech.md`) and can be imported or copied into the UI. Static files, the custom domain entry, and any favicons go inside `public/`. Build artifacts appear in `dist/` during CI and are ignored locally. Platform automation is located in `.github/workflows/deploy.yml`, so treat that workflow and `vite.config.ts` as part of the deployment contract.

## Build, Test, and Development Commands
- `npm install` — sync dependencies before any other action.
- `npm run dev` — start the Vite dev server at `http://localhost:5173` for live reload and WebGL inspection.
- `npm run lint` — run ESLint with the repo’s config (`eslint.config.js` ignores `dist/`) to enforce hooks and React refresh rules.
- `npm run build` — execute the TypeScript project references plus `vite build`; run this before every PR to ensure the GitHub Pages workflow will succeed.
- `npm run preview` — serve the output in `dist/` to validate routing and asset loading exactly as Pages will.

## Coding Style & Naming Conventions
TypeScript is compiled in strict mode (`tsconfig.app.json`), so keep props typed explicitly and prefer derived types over `any`. Components and hooks use PascalCase (e.g., `ShiningStars`), utilities use camelCase, and constants that are effectively configuration (colors, easing values) should be UPPER_SNAKE_CASE. The codebase uses two-space indentation, React function components, and CSS custom properties defined in `App.css`; extend them instead of inlining values. Before committing, run `npm run lint` to take advantage of the React Hooks and Refresh plugins that shield the Three.js canvas from runtime regressions.

## Testing Guidelines
There is no dedicated Jest/Vitest suite yet, so lean on three layers of validation: TypeScript strictness, ESLint, and manual QA. For UI or animation changes, capture steps (e.g., “open `/` and verify the star field animates smoothly”) in the PR description and test both desktop and mobile breakpoints under `npm run dev`. When adding data-driven sections sourced from `content/`, verify markdown escapes and run `npm run preview` to ensure static asset resolution works without dev-server fallbacks. If you add a test harness, colocate specs next to components inside `src/` and name them `*.test.tsx`.

## Commit & Pull Request Guidelines
Git history follows a Conventional Commits flavor (`feat:`, `fix:`, `chore:`), so continue using imperative, lower-case subjects under 72 characters (e.g., `feat: refresh hero copy`). Branch names such as `feature/animated-stars` make triage easier. Every PR should: link its GitHub issue if one exists, summarize the change, attach screenshots or short clips for visual tweaks, list manual test steps, and confirm `npm run build` passed locally. Keep individual PRs scoped (copy update, animation tweak, config change) so the Pages workflow in `deploy.yml` can be audited quickly.

## Deployment & Configuration Notes
Deployments flow through GitHub Pages via `.github/workflows/deploy.yml`, which assumes the production domain `openquality.cloud`. Never delete `public/CNAME` unless you also update `vite.config.ts` `base` for a repo-hosted deployment. The `dist/` directory must stay untracked—CI will regenerate it—and static assets referenced from markdown should be copied into `public/` to be served by Pages. Changes to analytics, meta tags, or custom scripts belong in `index.html` so they survive Vite rebuilds.

# Global Coding Standards

## Always Apply:
- Before each change checkout new branch from `main` branch.
- After change is completed - and validated - merge branch back to `main` 
- When asked for new feature please take into conideration UI/API/DB changes needed.
- Write idiomatic, clean code
- Include error handling
- Add JSDoc comments for public APIs
- Add documentation for the feature in docs/ update README with features listings.
- Use meaningful variable names
- Propose unit tests
- No passwords stored in code - treat code like in OpenSource Git repository publicly available.
- Use `.env` (always in global gitignore) safe for passwords
- Always update documentation if needed
- Follow project specific coding standards if available
- Always try to rebuild both frontend and backend projects after changes to make sure nothing is broken, it's also for CLI tools.

## Golang:
- Use idiomatic Go formatting (`gofmt`)
- Error handling with `if err != nil` always
- Use current project layout
- Prefer splitting libraries into `pkg` directory (no business logic)
- Prefer business logic in `app` directory
- Use repository pattern for data access
- Use services pattern for orchestration
- No `any` types. Try to use concrete types as much as possible.
- When creating new package interface first + types in `interface.go`, implementations in `implementation_name.go`
- If needed more than one implentation for testing purpose (I'll as you for that explicitly) - use strategy pattern. Add Common function inside package to choose from available stragegies based on strategy name.
- Naming: Service E. g. `UserService`, Repository E.g. `UserRepository`, full name, in case of interface + implementation UserRepository interface + UserRepositoryPgSQL for specific implementation.
- Methods naming: CRUD + Entity name E.g. `CreateUser`, `GetUserByID`, `UpdateUser`, `DeleteUser`
- Use context.Context in all public methods
- Use constructor functions for creating new instances of services/repositories etc.
- Use constructor functions for models too.
- Use dependency injection via constructors


### Golang Testing:
- Arrange-Act-Assert pattern
- Test happy path + edge cases + errors
- Use table-driven tests
- Mock external dependencies

## TypeScript:

### Architecture:
- Use recent VUE 3 + Composition API
- Use Quasar framework for UI components
- Abstract API calls (use Axios as HTTP client)
- Global error handling for API calls
- Strict mode enabled
- Explicit return types on functions
- DON'T USE `any` TYPE
- Split UI components into smaller ones
- Organize components in groups by subdirectories

### TypeScript Testing:
- Arrange-Act-Assert pattern
- Test happy path + edge cases + errors
- Mock external dependencies
