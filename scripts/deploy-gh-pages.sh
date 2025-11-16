#!/bin/bash
# Deployment script for GitHub Pages
# Can be run manually or as a git hook

set -e  # Exit on error

echo "🚀 Starting GitHub Pages deployment..."

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

# Check if we're already on gh-pages branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
WAS_ON_GH_PAGES=false

if [ "$CURRENT_BRANCH" = "gh-pages" ]; then
    WAS_ON_GH_PAGES=true
    echo "📦 Already on gh-pages branch, building and committing..."
else
    echo "📦 Switching to gh-pages branch..."
    # Stash any uncommitted changes
    if ! git diff-index --quiet HEAD --; then
        echo "⚠️  Warning: You have uncommitted changes. Stashing..."
        git stash
    fi
    
    # Switch to gh-pages branch
    git checkout gh-pages 2>/dev/null || git checkout -b gh-pages
fi

# Build the application
echo "🔨 Building application..."
cd web-app
if [ ! -d "node_modules" ]; then
    echo "📥 Installing dependencies..."
    npm install
fi
npm run build

# Copy build files to root
cd ..
echo "📋 Copying build files to root..."
rm -rf assets index.html vite.svg 2>/dev/null || true
cp -r web-app/dist/* .

# Ensure .nojekyll exists
touch .nojekyll

# Commit changes
echo "💾 Committing deployment..."
git add .
if git diff --staged --quiet; then
    echo "✅ No changes to deploy"
else
    git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" || true
    echo "✅ Deployment committed"
fi

# If we weren't on gh-pages originally, switch back
if [ "$WAS_ON_GH_PAGES" = false ]; then
    echo "🔄 Switching back to $CURRENT_BRANCH branch..."
    git checkout "$CURRENT_BRANCH"
    
    # Restore stashed changes if any
    if git stash list | grep -q .; then
        echo "📦 Restoring stashed changes..."
        git stash pop || true
    fi
fi

echo "✅ Deployment preparation complete!"
echo "📤 Push to gh-pages branch: git push origin gh-pages"

