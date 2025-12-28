# Deployment Instructions for Card Game

This document provides detailed step-by-step instructions for deploying the Bangladeshi Bridge card game to various hosting platforms.

## 📋 Prerequisites

Before deploying, ensure you have:
- A GitHub account
- Your code pushed to the `main` branch
- Access to repository settings (for GitHub Pages)

## 🎯 Deployment Options

### Option 1: GitHub Pages (Recommended - Free & Easy)

GitHub Pages is the easiest and most straightforward deployment option for this game.

#### Automatic Deployment (Recommended)

We've already set up GitHub Actions for automatic deployment:

1. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click **Settings** (top navigation)
   - Scroll down to **Pages** in the left sidebar
   - Under **Source**, select **GitHub Actions**
   - Click **Save**

2. **Deploy Automatically:**
   - Any push to the `main` branch will automatically trigger deployment
   - View deployment progress in the **Actions** tab
   - Once complete, your game will be live at:
     ```
     https://alemran0.github.io/card-game/
     ```

3. **Manual Trigger (Optional):**
   - Go to **Actions** tab
   - Select **Deploy to GitHub Pages** workflow
   - Click **Run workflow** → **Run workflow**

#### Manual Deployment (Alternative)

If you prefer not to use GitHub Actions:

1. **Enable GitHub Pages:**
   - Go to **Settings** → **Pages**
   - Under **Source**, select **Deploy from a branch**
   - Select `main` branch and `/ (root)` folder
   - Click **Save**

2. **Your game will be live at:**
   ```
   https://alemran0.github.io/card-game/
   ```

### Option 2: Vercel (Recommended for Advanced Features)

Vercel is excellent for React applications and provides:
- Automatic deployments on push
- Preview deployments for PRs
- Custom domains
- Excellent performance

#### Steps:

1. **Sign Up:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account

2. **Import Project:**
   - Click **Add New...** → **Project**
   - Select **Import Git Repository**
   - Choose your `card-game` repository
   - Click **Import**

3. **Configure (Auto-detected):**
   - Vercel automatically detects the settings
   - No build configuration needed
   - Click **Deploy**

4. **Access Your Game:**
   - Deployment takes ~30 seconds
   - Your game will be live at: `https://card-game-[random].vercel.app`
   - You can customize the domain in settings

5. **Automatic Updates:**
   - Every push to `main` automatically deploys
   - Pull requests get preview URLs

### Option 3: Netlify (Great Alternative)

Netlify is another excellent platform with similar features to Vercel.

#### Steps:

1. **Sign Up:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with your GitHub account

2. **Deploy:**
   - Click **Add new site** → **Import an existing project**
   - Choose **GitHub**
   - Select your `card-game` repository

3. **Configure:**
   - **Build command**: Leave empty (or `echo "No build needed"`)
   - **Publish directory**: `.` (current directory)
   - Click **Deploy site**

4. **Access Your Game:**
   - Deployment takes ~1 minute
   - Your game will be live at: `https://card-game-[random].netlify.app`
   - You can customize the domain in settings

5. **Automatic Updates:**
   - Every push to `main` automatically deploys
   - Pull requests get deploy previews

### Option 4: Traditional Web Hosting

For traditional web hosting (shared hosting, VPS, cPanel, etc.):

#### Steps:

1. **Prepare Files:**
   - Download or clone your repository
   - You need these files:
     - `index.html`
     - `main.js`
     - Any other assets

2. **Upload via FTP/SFTP:**
   - Connect to your hosting via FTP/SFTP client (FileZilla, WinSCP, etc.)
   - Navigate to your public directory (usually `public_html`, `www`, or `htdocs`)
   - Upload all files

3. **Upload via cPanel:**
   - Log into cPanel
   - Go to **File Manager**
   - Navigate to `public_html`
   - Click **Upload** and upload all files

4. **Access Your Game:**
   - Your game will be available at your domain
   - Example: `https://yourdomain.com`

#### Important Notes:
- Ensure your web server serves `index.html` as the default page
- Most hosting providers do this by default
- No special server configuration needed

### Option 5: Custom Domain

Once deployed on GitHub Pages, Vercel, or Netlify, you can add a custom domain:

#### GitHub Pages:
1. Go to **Settings** → **Pages**
2. Under **Custom domain**, enter your domain
3. Configure DNS at your domain provider:
   - Add a CNAME record pointing to `alemran0.github.io`

#### Vercel:
1. Go to your project settings
2. Click **Domains**
3. Add your domain and follow DNS instructions

#### Netlify:
1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Follow DNS configuration instructions

## 🧪 Testing Locally

Before deploying, test the game locally:

### Method 1: Python (Easiest)
```bash
# Navigate to project directory
cd card-game

# Start server
python -m http.server 8000

# Open browser to http://localhost:8000
```

### Method 2: Node.js
```bash
# Install http-server globally (one time)
npm install -g http-server

# Start server
http-server -p 8000

# Open browser to http://localhost:8000
```

### Method 3: VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 🔍 Troubleshooting

### Game doesn't load:
- Check browser console for errors (F12 → Console)
- Ensure `main.js` is in the same directory as `index.html`
- Verify internet connection (CDN resources need to load)

### GitHub Pages shows 404:
- Wait 2-3 minutes after enabling Pages
- Ensure you selected the correct source (GitHub Actions or main branch)
- Check that `index.html` exists in the root directory

### Changes not showing:
- Wait for deployment to complete (check Actions tab)
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache

### GitHub Actions failing:
- Check the Actions tab for error messages
- Ensure Pages is enabled in repository settings
- Verify workflow file syntax in `.github/workflows/deploy.yml`

## 📊 Monitoring Deployments

### GitHub Pages:
- Check **Actions** tab for deployment status
- Green checkmark = successful deployment
- Red X = failed deployment (click for details)

### Vercel:
- Check **Deployments** page in Vercel dashboard
- Real-time deployment logs
- Automatic rollback on failure

### Netlify:
- Check **Deploys** page in Netlify dashboard
- Detailed build logs
- One-click rollback to previous versions

## 🎉 Success!

Once deployed, share your game:
- Share the deployment URL with friends
- The game works on desktop and mobile
- No installation required for players

## 📞 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review deployment logs in Actions/Vercel/Netlify
3. Ensure all files are committed and pushed
4. Verify your hosting platform settings

Happy gaming! 🎴
