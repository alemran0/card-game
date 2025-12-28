# Card Game - Bangladeshi Bridge / Rang

A web-based card game implementation of the Bangladeshi Bridge (Rang) 5-card deal variant.

## 🎮 Game Rules

- 4 Players, 2 Teams (User+North vs East+West)
- 52 Cards standard deck
- Deal 1: 5 cards → Auction Bidding (Minimum 7)
- Winner chooses Trump suit (hidden from others)
- Trump is revealed when someone plays a trump card
- Deal 2: Remaining 8 cards dealt
- Play 13 tricks total

## 🚀 Quick Deployment Options

### Option 1: GitHub Pages (Recommended for Static Hosting)

GitHub Pages is the easiest way to deploy this game for free.

#### Automatic Deployment (Recommended)
We've set up GitHub Actions to automatically deploy to GitHub Pages:

1. Go to your repository settings
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Push any changes to the `main` branch
5. GitHub Actions will automatically build and deploy your game
6. Your game will be available at: `https://alemran0.github.io/card-game/`

#### Manual Deployment
If you prefer manual deployment:

1. Enable GitHub Pages:
   - Go to **Settings** → **Pages**
   - Select **Deploy from a branch**
   - Choose `main` branch and `/` (root) folder
   - Click **Save**

2. Your game will be live at: `https://alemran0.github.io/card-game/`

### Option 2: Vercel (Recommended for React Apps)

Vercel provides excellent support for React applications with zero configuration.

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Vercel will auto-detect the settings
5. Click **Deploy**
6. Your game will be live at: `https://card-game-xxx.vercel.app`

**No build configuration needed** - Vercel handles everything automatically!

### Option 3: Netlify

1. Go to [netlify.com](https://netlify.com) and sign up
2. Click **Add new site** → **Import an existing project**
3. Connect to GitHub and select your repository
4. Use these settings:
   - **Build command**: `npm run build` (if you add a build step)
   - **Publish directory**: `.` (current directory)
5. Click **Deploy**
6. Your game will be live at: `https://card-game-xxx.netlify.app`

### Option 4: Traditional Web Hosting

For traditional hosting (shared hosting, VPS, etc.):

1. Upload these files to your web server:
   - `index.html`
   - `main.js`
   - Any other assets

2. Ensure your web server serves `index.html` as the default page

3. The game will be accessible at your domain

## 🛠️ Local Development

To test the game locally:

1. **Simple HTTP Server** (Python):
   ```bash
   python -m http.server 8000
   ```
   Then open http://localhost:8000

2. **Simple HTTP Server** (Node.js):
   ```bash
   npx http-server -p 8000
   ```
   Then open http://localhost:8000

3. **Live Server** (VS Code Extension):
   - Install the "Live Server" extension
   - Right-click on `index.html`
   - Select "Open with Live Server"

## 📁 Project Structure

```
card-game/
├── index.html          # Main HTML file with React setup
├── main.js             # React game component
├── package.json        # Project metadata
└── README.md           # This file
```

## 🔧 Technical Details

- **Frontend**: React with JSX
- **Styling**: Tailwind CSS (via CDN)
- **Icons**: Lucide React
- **No build step required**: Uses browser-native ES modules and CDN imports

## 🎯 Features

- Interactive card game interface
- AI opponents
- Trump suit bidding system
- Hidden trump reveal mechanic
- Responsive design
- Team-based scoring

## 📝 Notes

- The game runs entirely in the browser
- No backend server required
- All game logic is client-side
- Works on mobile and desktop

## 🤝 Contributing

Feel free to fork this repository and submit pull requests with improvements!

## 📄 License

MIT License - feel free to use this project for your own purposes.
