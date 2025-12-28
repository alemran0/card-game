# Card Game - Bangladeshi Bridge

A web-based card game implementation featuring Bangladeshi Bridge (Rang) with auction bidding.

## Features

- 4-player partnership card game (User + North vs East + West)
- 52-card deck with standard suits
- Two-phase dealing: 5 cards for bidding, then 8 more cards
- Auction bidding system (minimum 7 tricks)
- Trump suit selection with hidden visibility mechanics
- AI opponents with strategic play
- Responsive design with Tailwind CSS

## Tech Stack

- **React 19** - UI framework
- **Vite 7** - Build tool and dev server
- **Tailwind CSS 4** - Styling (via PostCSS plugin)
- **Lucide React** - Icon library

## Development

### Prerequisites

- Node.js 18 or higher
- npm

### Installation

```bash
npm install
```

### Development Server

Start the development server with hot module replacement:

```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### Building for Production

Create an optimized production build:

```bash
npm run build
```

Build output will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Deployment

This project is configured for GitHub Pages deployment. The build process is automated via GitHub Actions:

1. Push to the `main` branch
2. GitHub Actions workflow builds the project
3. Built files are deployed to GitHub Pages

## Project Structure

```
/src
  ├── App.jsx       - Main game component with all game logic
  ├── main.jsx      - React entry point
  └── index.css     - Global styles with Tailwind imports
/index.html         - HTML entry point
/vite.config.js     - Vite build configuration
/postcss.config.js  - PostCSS/Tailwind configuration
```

## Game Rules

### Bidding Phase
- Each player receives 5 cards
- Players bid on the number of tricks they expect to win (minimum 7)
- The highest bidder selects the trump suit
- Trump remains hidden until played

### Playing Phase
- Remaining 8 cards are dealt to each player
- 13 tricks are played in total
- Follow suit rules apply
- Trump cards beat non-trump cards
- Trump is revealed when first played

### Scoring
- Bidding team wins: 10 + (tricks won - bid amount) points
- Bidding team loses: -(bid amount) points to bidding team, +(bid amount) to defending team

## License

MIT
