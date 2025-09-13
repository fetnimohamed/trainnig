# TrainMe Fitness SaaS (v3)

Plateforme fitness avec UI moderne, **admin séparé** (pas de lien dans le header public), gestion complète :
- Formations (images de couverture + galerie)
- Leçons (vidéo par leçon)
- Catégories
- Utilisateurs
- **Packs** (bundles de cours)
- **Abonnements** (simulateur)
- **Promos** (pour achat de cours, packs et abonnements)

Stack : React + Vite + Tailwind | Node.js + Express | SQLite

## Démarrage
### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
# (optionnel) seed
npm run seed
```
- Admin par défaut : `admin@coach.fit` / `admin123`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Accès admin : http://localhost:5173/admin (nécessite compte admin)
