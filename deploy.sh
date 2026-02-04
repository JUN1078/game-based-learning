#!/bin/bash

# LearnQuest Studio - Deployment Helper Script
# This script helps you deploy to Vercel and Railway

set -e

echo "🚀 LearnQuest Studio - Deployment Helper"
echo "========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if git is initialized
if [ ! -d .git ]; then
    echo -e "${YELLOW}Git not initialized. Initializing...${NC}"
    git init
    echo -e "${GREEN}✓ Git initialized${NC}"
fi

# Check for changes
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${BLUE}📝 Uncommitted changes found${NC}"
    echo ""
    git status --short
    echo ""
    read -p "Commit message: " commit_msg

    if [ -z "$commit_msg" ]; then
        commit_msg="Deploy: $(date +%Y-%m-%d-%H:%M:%S)"
    fi

    git add .
    git commit -m "$commit_msg"
    echo -e "${GREEN}✓ Changes committed${NC}"
else
    echo -e "${GREEN}✓ No uncommitted changes${NC}"
fi

# Check if remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo ""
    echo -e "${YELLOW}No git remote found${NC}"
    read -p "Enter your GitHub repository URL: " repo_url
    git remote add origin "$repo_url"
    echo -e "${GREEN}✓ Remote added${NC}"
fi

# Push to GitHub
echo ""
echo -e "${BLUE}📤 Pushing to GitHub...${NC}"
git push -u origin main || git push origin main
echo -e "${GREEN}✓ Pushed to GitHub${NC}"

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}✅ Code pushed to GitHub successfully!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""

# Deployment instructions
echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo "📦 Backend (Railway):"
echo "  1. Go to https://railway.app"
echo "  2. Create new project from GitHub"
echo "  3. Add PostgreSQL database"
echo "  4. Set environment variables (see DEPLOYMENT.md)"
echo "  5. Deploy!"
echo ""
echo "🌐 Frontend (Vercel):"
echo "  1. Run: cd frontend && vercel"
echo "  2. Or go to https://vercel.com/new"
echo "  3. Import your GitHub repository"
echo "  4. Set root directory to 'frontend'"
echo "  5. Set environment variables (see DEPLOYMENT.md)"
echo "  6. Deploy!"
echo ""
echo "📚 Full guide: DEPLOYMENT.md"
echo ""
