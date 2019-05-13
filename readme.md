# Gulp Boilerplate

Version 3.0

Uses
- Gulp 4
- PostCSS
- Babel
- TailwindCSS

To Do:
- Refactor aria-menu.js to use vanilla JS
- Fix the cachebuster task in Gulpfile
- Add backwards compatibility for SCSS so can replace older workflows
- Add PurgeCSS
- Add optional html minification for static sites
- Make localhost work even if not setup in MAMP

## Commands

`npm run dev` during development

- runs BrowserSync server
- adds sourcemaps to CSS and JS

`npm run build` for production

- minifies and obfuscates all CSS and JS
- optimizes images

