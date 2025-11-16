# GitHub Pages Deployment Instructions

This guide explains how to deploy the Word2Vec Similarity Search web app to GitHub Pages.

## Prerequisites

- A GitHub repository
- Git installed locally
- Node.js and npm installed

## Deployment Steps

### 1. Build the Application

First, ensure you're on the main branch and have the latest code:

```bash
git checkout main
git pull origin main
```

Navigate to the web-app directory and build:

```bash
cd web-app
npm install  # If dependencies aren't installed
npm run build
```

### 2. Switch to gh-pages Branch

```bash
cd ..
git checkout gh-pages
```

If the branch doesn't exist yet:
```bash
git checkout -b gh-pages
```

### 3. Copy Build Files to Root

Copy the built files from `web-app/dist/` to the repository root:

```bash
# Remove old build files (if any)
rm -rf assets index.html vite.svg

# Copy new build files to root
cp -r web-app/dist/* .
```

### 4. Create .nojekyll File

GitHub Pages uses Jekyll by default. Create a `.nojekyll` file to disable it:

```bash
touch .nojekyll
```

### 5. Commit and Push

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

### 6. Configure GitHub Pages

1. Go to your GitHub repository
2. Click **Settings**
3. Scroll to **Pages** section
4. Under **Source**, select:
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
5. Click **Save**

### 7. Access Your Site

Your site will be available at:
```
https://<your-username>.github.io/<repository-name>/
```

**Note**: The app is served from the root of the gh-pages branch. The build files from `web-app/dist/` are copied to the root for deployment.

**Note**: It may take a few minutes for the site to be available after pushing.

## Updating the Deployment

To update the deployed site:

1. Make changes on the `main` branch
2. Build the app: `cd web-app && npm run build`
3. Switch to gh-pages: `git checkout gh-pages`
4. Copy build files to root: `cp -r web-app/dist/* .`
5. Commit and push: `git add . && git commit -m "Update deployment" && git push origin gh-pages`

## Important Notes

### Base Path Configuration

The `vite.config.js` includes a `base` path. Update it based on your deployment:

**For repository subdirectory** (e.g., `username.github.io/repo-name/`):
```javascript
// web-app/vite.config.js
export default defineConfig({
  plugins: [react()],
  base: '/word-to-csv/', // Update repo name if different
})
```

**For user/organization root** (e.g., `username.github.io/`):
```javascript
base: '/'
```

### Build Output

The build creates:
- `index.html` - Main HTML file
- `assets/` - JavaScript and CSS bundles
- `vite.svg` - Vite logo (if present)

### Troubleshooting

**404 Errors**: 
- Check that the `base` path in `vite.config.js` matches your repository structure
- Ensure `.nojekyll` file exists in the root
- Verify files from `web-app/dist/` were copied to the root of gh-pages branch

**Assets Not Loading**:
- Verify all files in `web-app/dist/` were copied to root
- Check browser console for 404 errors on specific assets
- Ensure base path matches your GitHub Pages URL structure

**Changes Not Appearing**:
- GitHub Pages can take 1-5 minutes to update
- Hard refresh your browser (Ctrl+F5 or Cmd+Shift+R)
- Check GitHub Pages logs in repository Settings

## Automated Deployment with Git Hook

A pre-push git hook automatically rebuilds and updates the gh-pages branch when you push to it.

### Setup (One-time)

Install the git hook on your machine:

```bash
./scripts/install-git-hooks.sh
```

This will set up the pre-push hook that automatically rebuilds gh-pages when you push to it.

### How It Works

1. When you push to the `gh-pages` branch, the hook automatically:
   - Builds the application
   - Copies build files to root
   - Commits the changes to gh-pages
   - Switches you back to your original branch

2. Then you push:
   ```bash
   git push origin gh-pages
   ```

### Manual Deployment Script

You can also run the deployment script manually:

```bash
./scripts/deploy-gh-pages.sh
```

This script:
- Builds the app from `web-app/`
- Switches to gh-pages branch
- Copies build files to root
- Commits changes
- Switches back to your original branch

**Note**: The script preserves your current branch and stashes uncommitted changes if needed.

