# Smart Kirana AI - Developer Documentation

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    REACT COMPONENTS                 │
│  (Pages: Home, Categories, Alerts, Profile)         │
├─────────────────────────────────────────────────────┤
│                  GLOBAL STATE (CONTEXT)              │
│            (AppContext - User, Products, etc)       │
├─────────────────────────────────────────────────────┤
│              BUSINESS LOGIC & UTILS                  │
│  (Predictions, Translations, Helpers)               │
├─────────────────────────────────────────────────────┤
│                  MOCK DATABASE                       │
│           (localStorage compatible)                 │
└─────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
src/
├── components/
│   ├── App.tsx                 # Main router component
│   ├── pages/                  # Full screen components
│   │   ├── LoginScreen.tsx    # Auth flow
│   │   ├── LanguageSelection.tsx
│   │   ├── MainApp.tsx        # Main app shell
│   │   ├── HomePage.tsx       # Dashboard
│   │   ├── CategoriesPage.tsx
│   │   ├── AlertsPage.tsx
│   │   └── ProfilePage.tsx
│   └── ui/                     # Reusable UI components
│       ├── BottomNavBar.tsx
│       ├── SummaryCard.tsx
│       ├── ProductCard.tsx
│       ├── CategoryCard.tsx
│       ├── AlertCard.tsx
│       ├── AlertBanner.tsx
│       ├── AddProductModal.tsx
│       ├── ProductDetailModal.tsx
│       └── ProductList.tsx
├── context/
│   └── AppContext.tsx         # Global state management
├── types/
│   └── index.ts              # TypeScript interfaces
├── utils/
│   ├── translations.ts       # Multi-language strings
│   └── predictions.ts        # AI calculation logic
├── services/
│   └── database.ts          # Data access layer
├── Root.tsx                 # App wrapper with provider
├── main.tsx                 # Entry point
└── index.css               # Animations & globals
```

## 🔄 Data Flow

### Adding a Product
```
User Input → AddProductModal
    ↓
Form Validation
    ↓
mockDB.addProduct()
    ↓
Context: addProduct()
    ↓
Component Re-renders with new product
```

### Recording a Sale
```
ProductDetailModal ("Record Sale")
    ↓
User enters quantity
    ↓
mockDB.addSale()  + mockDB.updateProduct()
    ↓
Context: addProduct() (with updated quantity)
    ↓
Automatic Alert Generation (if needed)
    ↓
Component Re-renders
```

### Alert Generation
```
Product Updated → Check Conditions
    ↓
shouldAlertOnStock()? → Create Alert
shouldAlertOnExpiry()? → Create Alert
shouldAlertCritical()? → Create Alert
    ↓
mockDB.addAlert()
    ↓
Context: addAlert()
    ↓
Alert appears in AlertsPage
```

## 🧠 AI Prediction Logic

### Stock Day Calculation
```typescript
// From predictions.ts
const calculateDaysLeft = (quantity: number, dailyAverage: number) => {
  if (dailyAverage === 0) return -1;
  return Math.ceil(quantity / dailyAverage);
};
```

### Daily Average Calculation
```typescript
// From database.ts mock sales
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const recentSales = sales.filter(
  s => s.productId === product.id && new Date(s.date) > thirtyDaysAgo
);

const dailyAverage = recentSales.length > 0 
  ? Math.ceil(recentSales.reduce((sum, s) => sum + s.quantity, 0) / 30)
  : 0;
```

### Prediction Message Generation
```typescript
if (daysLeft <= 2) return 'critical';
if (daysLeft <= 5) return 'warning';
return 'safe';
```

## 🌐 Multi-Language System

### Adding a New Language

1. **Update Type** (src/types/index.ts):
```typescript
language: 'en' | 'hi' | 'te' | 'new_lang'; // Add here
```

2. **Add Translations** (src/utils/translations.ts):
```typescript
export const translations = {
  // ... existing
  new_lang: {
    'welcome': 'Welcome message in new language',
    'home': 'Home in new language',
    // ... add all keys
  }
};
```

3. **Update UI Components**:
```typescript
const language = user?.language || 'en';
const text = t('key', language);
```

## 🔌 Extending the System

### Adding a New Feature: Supplier Management

1. **Create Type** (src/types/index.ts):
```typescript
export interface Supplier {
  id: string;
  name: string;
  phone: string;
  products: string[];
  userId: string;
}
```

2. **Add to Database** (src/services/database.ts):
```typescript
suppliers: Map<string, Supplier[]> = new Map();

addSupplier(userId: string, supplier: Supplier): Supplier {
  const suppliers = this.suppliers.get(userId) || [];
  suppliers.push(supplier);
  this.suppliers.set(userId, suppliers);
  return supplier;
}
```

3. **Update Context** (src/context/AppContext.tsx):
```typescript
suppliers: Supplier[];
addSupplier: (supplier: Supplier) => void;
// Add to value object
```

4. **Create Component** (src/components/pages/SuppliersPage.tsx):
```typescript
// Create new page component
```

5. **Add Navigation** (src/components/pages/MainApp.tsx):
```typescript
const navItems = [
  // ... existing
  { id: 'suppliers', icon: Building2, label: 'Suppliers' },
];
```

### Adding Firebase Integration

1. **Install Firebase**:
```bash
npm install firebase
```

2. **Replace mockDB** (src/services/database.ts):
```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = { /* Your config */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
```

3. **Use Firestore methods**:
```typescript
// Replace Map operations with Firestore queries
```

### Adding Barcode Scanning

1. **Install library**:
```bash
npm install @zxing/browser
```

2. **Create Component**:
```typescript
import { BrowserMultiFormatReader } from '@zxing/browser';

const BarcodeScanner: React.FC = () => {
  // Implement barcode reading
};
```

3. **Integrate with Product Add**:
```typescript
// Scan barcode → Lookup product → Pre-fill form
```

## 📊 Database Schema

### Tables/Collections

```typescript
Users
├── id: string (primary key)
├── phone: string (unique)
├── name: string
├── language: 'en' | 'hi' | 'te'
├── shopName: string
└── createdAt: Date

Products
├── id: string
├── userId: string (foreign key → Users)
├── name: string
├── category: string
├── quantity: number
├── unit: string
├── expiryDate?: Date
├── lastRestockDate: Date
└── dailyAverage: number

Sales
├── id: string
├── userId: string (foreign key → Users)
├── productId: string (foreign key → Products)
├── quantity: number
└── date: Date

Alerts
├── id: string
├── userId: string (foreign key → Users)
├── type: 'stock' | 'expiry' | 'fastSelling'
├── productId: string (foreign key → Products)
├── message: string
├── severity: 'info' | 'warning' | 'critical'
├── createdAt: Date
└── read: boolean
```

## 🔐 Security Considerations

### For Production:

1. **Authentication**:
   - Use Firebase Auth with phone verification
   - Implement proper JWT tokens
   - Secure session management

2. **Data Protection**:
   - Encrypt sensitive data
   - HTTPS only
   - CORS configuration

3. **Input Validation**:
   ```typescript
   // Validate all inputs
   if (!formData.name || formData.name.length > 100) {
     throw new Error('Invalid product name');
   }
   ```

4. **Rate Limiting**:
   - Limit API calls
   - Implement throttling
   - DDoS protection

## 📈 Performance Optimization

### Current Performance
- Initial load: ~500ms
- Components re-render: milliseconds
- Database queries: instant

### Future Optimizations
1. **Lazy Loading**: Load components on demand
2. **Code Splitting**: Split bundle by route
3. **Caching**: Cache calculations and queries
4. **Virtual Scrolling**: For long product lists

### Example - Lazy Loading:
```typescript
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('./pages/HomePage'));

// Use with Suspense
<Suspense fallback={<Loading />}>
  <HomePage />
</Suspense>
```

## 🧪 Testing Strategy

### Component Testing:
```typescript
// Use React Testing Library
import { render, screen } from '@testing-library/react';

test('AddProductModal adds product', () => {
  render(<AddProductModal />);
  // Test implementation
});
```

### Utils Testing:
```typescript
import { calculateDaysLeft } from '../utils/predictions';

test('calculateDaysLeft returns correct value', () => {
  expect(calculateDaysLeft(100, 10)).toBe(10);
  expect(calculateDaysLeft(50, 20)).toBe(3);
});
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deployment Platforms
- **Vercel** (recommended for React apps)
  ```bash
  npm i -g vercel
  vercel
  ```

- **Netlify**
  ```bash
  npm install -D netlify-cli
  netlify deploy
  ```

- **Firebase Hosting**
  ```bash
  npm install -g firebase-tools
  firebase deploy
  ```

## 📚 Key Libraries & Usage

| Library | Version | Usage |
|---------|---------|-------|
| React | 18.2.0 | UI Framework |
| TypeScript | 5.0.2 | Type Safety |
| Tailwind CSS | 3.3.0 | Styling |
| Vite | 4.4.5 | Build Tool |
| Lucide React | 0.263.1 | Icons |
| date-fns | 2.30.0 | Date Handling |

## 🔧 Debugging

### Enable DevTools
```typescript
// In any component
console.log('Debug info:', state);
```

### React Dev Tools
- Install React DevTools browser extension
- Inspect components, state, props in DevTools

### TypeScript Checking
```bash
npx tsc --noEmit  # Check for type errors
```

## 📝 Git Workflow

```bash
# Clone repo
git clone <repo>

# Create feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "feat: Add new feature"

# Push
git push origin feature/new-feature

# Create pull request
```

## 🎓 Learning Resources

- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Vite**: https://vitejs.dev/guide/

---

**Happy Coding! 🚀**
