# IEEE SSIT · SSN Student Chapter

A React and TypeScript web application for the IEEE Society on Social Implications of Technology (SSIT), SSN Student Chapter. Built with Vite and Tailwind CSS v4, and routed with React Router.

## Stack

- React 19 with TypeScript
- Vite 8 build tooling
- Tailwind CSS v4 via `@tailwindcss/vite`
- React Router 7 for client-side routing

## Structure

```
src/
  assets/images/     Static image assets
  components/
    layout/          Navbar, Footer, page shell
    sections/         Reusable homepage sections (Hero, PullQuote, Partners)
    ui/               Small shared UI primitives (theme toggle, section label)
  context/            Theme (light/dark) context and provider
  data/               Site content, sourced from the IEEE SSIT brochure and membership materials
  hooks/              Shared React hooks
  pages/              Route-level page components
  styles/             Global stylesheet and color tokens
  App.tsx             Route definitions
  main.tsx            Application entry point
public/               Static files served as-is (favicon)
index.html            HTML shell
```

## Pages

- `/` — Home
- `/about` — Mission, history, and technical activity areas
- `/activities` — Conference series, publications, and standards
- `/membership` — Membership categories and benefits
- `/gallery` — Chapter photo gallery
- `/contact` — Contact details and chapter application form

## Theming

Colors are defined as CSS custom properties in `src/styles/theme.css`, with light and dark palettes selected by a `data-theme` attribute on the document root. The toggle in the navigation bar switches themes and persists the choice in local storage, defaulting to the visitor's system preference. Dark mode uses a near-black, silver-toned finish rather than a tinted dark blue.

## Development

```bash
npm install
npm run dev
```

The dev server runs on port 8443 by default (configurable via the `PORT` environment variable).

## Build

```bash
npm run build
npm run preview
```

Production output is written to `dist/`.
