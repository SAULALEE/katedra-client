#!/bin/bash
set -e

# Stash all current changes
git add .
git commit -m "temp stash" || echo "Nothing to commit"

# Checkout staging and pull
git checkout staging
# Assuming staging is up to date locally or no remote to pull from right now since it's local
# git pull origin staging || true

# Group 1: UI Core
git checkout -B feature/ui-core
git checkout HEAD@{1} -- .katedra/skills/DESIGN.md index.html package.json package-lock.json src/index.css src/app/components/Input.jsx src/app/components/Navbar.jsx src/app/components/ResponsiveSidebar.jsx src/app/components/LandingHeader.jsx src/app/pages/Landing.jsx
git commit -m "style(core): implement premium SaaS design system and layouts"

# Group 2: Auth
git checkout staging
git checkout -B feature/auth
git checkout HEAD@{2} -- src/app/pages/Login.jsx
git commit -m "style(auth): refactor Login UI to match new design system"

# Group 3: Temarios
git checkout staging
git checkout -B feature/temarios
git checkout HEAD@{3} -- src/app/pages/Dashboard.jsx src/app/pages/Users.jsx
git commit -m "style(temarios): refactor Dashboard and Users UI with premium styling"

# Group 4: Material
git checkout staging
git checkout -B feature/material
git checkout HEAD@{4} -- src/app/pages/GeneratedContents.jsx src/app/pages/ContentViewer.jsx
git commit -m "style(material): overhaul content viewer with immersive 16:9 and reading modes"

# Group 5: Generation
git checkout staging
git checkout -B feature/generation
git checkout HEAD@{5} -- src/app/pages/Generator.jsx
git commit -m "style(generation): sync Generator UI with ContentViewer and update layout"

# Now merge all back into staging
git checkout staging
git merge feature/ui-core --no-edit
git merge feature/auth --no-edit
git merge feature/temarios --no-edit
git merge feature/material --no-edit
git merge feature/generation --no-edit

# Clean up the temp stash from the original branch if needed
git branch -D temp_stash_branch 2>/dev/null || true

echo "All files committed to respective branches and merged into staging!"
