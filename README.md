# OpenQuality.cloud

Marketing site for OpenQuality, rebuilt with [Eleventy](https://www.11ty.dev/) and vanilla Three.js so content teams can publish fast while keeping the immersive hero experience.

## Tech Stack

- **Eleventy 3** for static-site generation with Nunjucks templates.
- **Vanilla Three.js** to power the plasma infinity hero animation.
- **Markdown blog posts** inside `src/blog/posts/` for articles and campaigns.
- **GitHub Pages** deployment via `.github/workflows/deploy.yml`.

## Project Structure

```
openquality.cloud/
├── CNAME                     # Custom domain passed through Eleventy
├── public/                   # Favicons, logos, and other static assets
├── src/
│   ├── _data/                # Site metadata + structured feature data
│   ├── _includes/            # Layouts (base, hero, blog posts)
│   ├── assets/               # CSS, Three.js bundle, vendor modules
│   ├── blog/
│   │   ├── posts/            # Markdown sources for the blog
│   │   └── post.njk          # Layout used by individual posts
│   ├── docs.njk              # Documentation listing
│   ├── blog.njk              # Blog index page
│   ├── features.njk          # Feature overview page
│   ├── get-started.njk       # Quick-start instructions
│   ├── index.njk             # Homepage with hero + summaries
│   └── use-cases.njk         # Scenario catalog
└── eleventy.config.js        # Build + passthrough configuration
```

## Development

```bash
npm install          # Install Eleventy + Three.js dependencies
npm run dev          # Start Eleventy dev server with live reload
npm run build        # Generate the production site in dist/
npm run preview      # Alternative watcher (same as dev)
```

## Authoring Guidelines

- Drop marketing stories into `src/blog/posts/` with front matter (`title`, `date`, `summary`). Eleventy picks them up automatically for `/blog/` and individual permalinks.
- Keep reusable copy (features, use cases, tech stack, quick start) inside `src/_data/highlights.js`. Pages consume the shared data so updates cascade automatically.
- Global navigation + footer live in `src/_data/site.js`.
- CSS resides in `src/assets/css/styles.css`; keep additions modular to avoid regressions.

## Deployment

GitHub Actions installs dependencies, runs `npm run build`, and publishes `dist/` to GitHub Pages using the existing workflow. The `CNAME` file is passed through Eleventy so the `openquality.cloud` domain remains pointed at Pages.
