# Repository Guidelines

## Project Structure & Module Organization
The site is built with Eleventy. All templates and data live under `src/`: layouts in `_includes/`, metadata in `_data/`, CSS/JS in `assets/`, and content pages such as `features.njk` or `use-cases.njk`. Blog posts now live in `src/blog/posts/` as Markdown with front matter; Eleventy turns each file into `/blog/<slug>/` automatically and the listing page (`src/blog.njk`) consumes the shared `collections.blog` data. Static assets plus the `CNAME` file stay in `public/`, and compiled output lands in `dist/`. GitHub Pages deployment is wired up in `.github/workflows/deploy.yml`.

## Build, Test, and Development Commands
- `npm install` — install Eleventy, Markdown tooling, and helper libs (`luxon`, etc.).
- `npm run dev` — run Eleventy in watch mode with the local dev server.
- `npm run build` — render the production-ready static site into `dist/`; always run before opening a PR.
- `npm run preview` — optional second watcher identical to `dev`, useful when you want a quick local server without hot reload logs.
- `npm run clean` — remove `dist/` if you need to regenerate assets from scratch.

## Coding Style & Naming Conventions
Nunjucks templates and layouts live under `src/`; keep filenames kebab-cased (`blog.njk`, `post.njk`). Front matter for posts must include `title`, `date`, and `summary` so the blog listing renders clean metadata. CSS is authored in `src/assets/css/styles.css` with two-space indentation and heavy use of CSS custom properties—extend those variables rather than adding hard-coded colors. Client-side JavaScript lives in `src/assets/js/`; modules are ES modules (`type="module"`) and should guard against missing DOM nodes (as the nav + lightning scripts do). Markdown files should use GitHub-flavored syntax and rely on Eleventy’s auto-formatting rather than inline HTML unless necessary.

## Testing Guidelines
There is no automated test harness—treat `npm run build` plus responsive QA as the minimum standard. For each change, verify:
- Eleventy builds without warnings.
- The lightning hero renders smoothly on desktop + mobile widths.
- Dropdown navigation and the mobile hamburger operate correctly.
- New blog posts render both on `/blog/` and their individual permalinks.
Document manual steps in the PR description. If you add scriptable behavior, prefer lightweight DOM tests or linting hooks colocated with the script (e.g., `src/assets/js/`).

## Commit & Pull Request Guidelines
Git history follows a Conventional Commits flavor (`feat:`, `fix:`, `chore:`), so continue using imperative, lower-case subjects under 72 characters (e.g., `feat: refresh hero copy`). Branch names such as `feature/animated-stars` make triage easier. Every PR should: link its GitHub issue if one exists, summarize the change, attach screenshots or short clips for visual tweaks, list manual test steps, and confirm `npm run build` passed locally. Keep individual PRs scoped (copy update, animation tweak, config change) so the Pages workflow in `deploy.yml` can be audited quickly.

## Deployment & Configuration Notes
Deployments flow through GitHub Pages via `.github/workflows/deploy.yml`, which installs dependencies and runs `npm run build`. Keep `public/CNAME` intact unless the production domain changes, and ensure `dist/` stays untracked because CI publishes fresh artifacts. When introducing analytics, favicons, or other static resources, add them to `public/` so Eleventy copies them verbatim. Navigation links—including the Blog submenu—are defined in `src/_data/site.js`; update that file whenever pages or collections move.

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
