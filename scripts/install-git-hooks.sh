#!/bin/bash
# Install git hooks for the repository

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
HOOKS_DIR="$PROJECT_ROOT/.git/hooks"

echo "🔧 Installing git hooks..."

# Create hooks directory if it doesn't exist
mkdir -p "$HOOKS_DIR"

# Install pre-push hook
if [ -f "$PROJECT_ROOT/scripts/deploy-gh-pages.sh" ]; then
    cat > "$HOOKS_DIR/pre-push" << 'HOOK_EOF'
#!/bin/bash
# Pre-push hook to automatically rebuild gh-pages when pushing to it

# Read the ref being pushed
while read local_ref local_sha remote_ref remote_sha
do
    # Check if pushing to gh-pages branch
    if [[ "$remote_ref" == "refs/heads/gh-pages" ]]; then
        echo "🔍 Detected push to gh-pages branch"
        echo "🔨 Running deployment script..."
        
        # Get project root (parent of .git directory)
        PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
        DEPLOY_SCRIPT="$PROJECT_ROOT/scripts/deploy-gh-pages.sh"
        
        if [ -f "$DEPLOY_SCRIPT" ]; then
            # Run deployment script
            "$DEPLOY_SCRIPT"
        else
            echo "⚠️  Warning: Deployment script not found at $DEPLOY_SCRIPT"
            echo "   Skipping automatic deployment"
        fi
    fi
done

exit 0
HOOK_EOF
    
    chmod +x "$HOOKS_DIR/pre-push"
    echo "✅ Installed pre-push hook"
else
    echo "⚠️  Warning: deploy-gh-pages.sh not found"
fi

echo "✅ Git hooks installed successfully!"

