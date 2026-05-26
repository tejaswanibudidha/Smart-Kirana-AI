# 📦 Smart Kirana AI - Deployment Guide

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm preview
```

## 🌐 Deploy to Vercel (Recommended)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Deploy
```bash
cd c:\Users\LENOVO\OneDrive\Desktop\smart kirana
vercel
```

### Step 3: Follow Prompts
- Confirm project settings
- Deploy
- Get live URL

**Result**: App available at `https://smart-kirana.vercel.app`

---

## 🔥 Deploy to Firebase Hosting

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Initialize Firebase
```bash
firebase init hosting
```

### Step 3: Build and Deploy
```bash
npm run build
firebase deploy
```

---

## 🎨 Deploy to Netlify

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Deploy
```bash
npm run build
netlify deploy --prod --dir=dist
```

---

## 🐳 Deploy with Docker

### Step 1: Create Dockerfile
```dockerfile
## Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

## Production stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Step 2: Build and Run Docker Image
```bash
docker build -t smart-kirana .
docker run -p 3000:3000 smart-kirana
```

---

## 📱 Progressive Web App (PWA)

### Add PWA Manifest
Create `public/manifest.json`:
```json
{
  "name": "Smart Kirana AI",
  "short_name": "Smart Kirana",
  "description": "AI-powered inventory management for shops",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#3b82f6",
  "background_color": "#ffffff"
}
```

### Update index.html
```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#3b82f6" />
```

### Install as App
- Mobile: Add to home screen
- Desktop: Install app button

---

## 🔒 Environment Variables

### Create .env.local
```env
VITE_API_URL=https://api.example.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_API_KEY=your-api-key
```

### Access in Code
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 🌍 Domain Configuration

### Using Custom Domain

**Vercel**:
1. Go to Vercel Dashboard
2. Project Settings → Domains
3. Add custom domain
4. Update DNS records

**Netlify**:
1. Go to Netlify Dashboard
2. Domain settings
3. Add custom domain
4. Follow DNS instructions

**Firebase**:
1. Firebase Console → Hosting
2. Connect domain
3. Update DNS

---

## 🔄 CI/CD Deployment

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - run: npm install
      - run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 📊 Performance & Analytics

### Add Google Analytics
```bash
npm install react-ga4
```

In `src/main.tsx`:
```typescript
import ReactGA from 'react-ga4';

ReactGA.initialize('G-MEASUREMENT_ID');
```

### Monitor Performance
- Use Lighthouse (Chrome DevTools)
- Check Vercel Analytics dashboard
- Monitor Core Web Vitals

---

## 🔐 Security Checklist

- [ ] Enable HTTPS
- [ ] Set security headers
- [ ] Configure CORS
- [ ] Implement CSP
- [ ] Regular dependency updates
- [ ] Security scanning
- [ ] DDoS protection
- [ ] Rate limiting

### Security Headers
```javascript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    middlewareMode: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    }
  }
})
```

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 404 Errors on SPA Routes
Add `_redirects` file (Netlify):
```
/* /index.html 200
```

Or `vercel.json` (Vercel):
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Slow Performance
- Enable code splitting
- Optimize images
- Use CDN
- Enable caching

---

## 📈 Scaling

### For 10,000+ Users
1. **Database**: Migrate from mock to Firebase/PostgreSQL
2. **Caching**: Implement Redis
3. **CDN**: Use Cloudflare/AWS CloudFront
4. **Load Balancer**: Distribute traffic
5. **Monitoring**: Use DataDog/New Relic

### Database Migration
```typescript
// Replace mockDB with Firebase
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const db = getFirestore();
await addDoc(collection(db, 'products'), productData);
```

---

## 📞 Monitoring & Logs

### Server Logs
```bash
# View Vercel logs
vercel logs

# View Netlify logs
netlify logs:functions
```

### Error Tracking
Use Sentry:
```bash
npm install @sentry/react@latest
```

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  tracesSampleRate: 1.0,
});
```

---

## 🎯 Production Checklist

- [ ] All environment variables set
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Database connected
- [ ] Error logging setup
- [ ] Analytics enabled
- [ ] Backup system ready
- [ ] Monitoring tools active
- [ ] Load testing completed
- [ ] Documentation updated

---

## 📊 Deployment Status

| Platform | Status | Link |
|----------|--------|------|
| Local Dev | ✅ Running | http://localhost:3000 |
| Vercel | Ready | vercel deploy |
| Firebase | Ready | firebase deploy |
| Netlify | Ready | netlify deploy |
| Docker | Ready | docker build . |

---

## 💾 Backup & Recovery

### Database Backup
```bash
# Firebase automatic backup
# Enable in console: Firestore → Backups

# Manual backup script
npm run backup
```

### Version Control
```bash
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin v1.0.0
```

---

## 🚀 Rollback Plan

```bash
# Revert to previous version
git revert <commit-hash>
git push

# Redeploy
vercel --prod
```

---

## 📚 Next Steps

1. Choose deployment platform
2. Set up environment variables
3. Configure custom domain
4. Enable monitoring
5. Schedule regular backups
6. Train team on deployment process
7. Document procedures
8. Monitor performance

---

**Deployment Ready! 🎉**

Choose your preferred deployment platform and start using Smart Kirana AI in production.
