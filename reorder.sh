#!/bin/bash
set -e

# Salvar la rama staging actual
git branch staging-backup staging

# Crear una nueva rama basada en origin/staging
git checkout -b staging-new origin/staging

# 1. Auth
git merge --squash 5b1fdee
git commit -m "feat(auth): implement users management, security updates and login fixes"

# 2. Temarios
git merge --squash 5734d98
git commit -m "feat(temarios): redesign dashboard and implement CRUD interface"

# 3. Material
git merge --squash f27d193
git commit -m "feat(material): redesign content viewer with export options"

# 4. Generation
git merge --squash f8c3198
git commit -m "feat(generation): redesign generator UI, fix crashes and update AI integration"

# Reubicar feature/generation sobre la nueva staging
git checkout feature/generation
git rebase --onto staging-new staging feature/generation

# Reemplazar staging antigua con la nueva
git branch -D staging
git branch -m staging-new staging

echo "Done!"
