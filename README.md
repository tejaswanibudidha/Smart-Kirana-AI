# 🏪 Smart Kirana AI - Mobile-First Inventory Management System

An AI-powered inventory management solution designed specifically for small kirana shop owners in India. Built with React, Tailwind CSS, and mobile-first design principles.

## 🎯 Features

### ✅ Core Functionality
- **Phone Number Authentication** with OTP verification (demo mode)
- **Multi-Language Support** - English, Hindi, and Telugu
- **Product Management** - Add, edit, delete products with automatic unit detection
- **Stock Tracking** - Real-time inventory management with visual indicators
- **Sales Recording** - Track daily sales and update stock automatically
- **AI Predictions** - Calculate stock depletion rates and predict reorder dates
- **Smart Alerts** - Stock, expiry, and fast-selling product notifications
- **WhatsApp-Style Messages** - Multi-language alert messages

### 🎨 UI/UX
- **Mobile-First Design** - Optimized for 5-inch screens and smaller devices
- **Color Coding System**:
  - 🟢 Green: Safe stock/Add/Save actions
  - 🟡 Yellow: Warnings/Low stock
  - 🔴 Red: Critical alerts/Expiry alerts
  - 🔵 Blue: General information
- **Bottom Navigation** - Easy access to all sections
- **Large Buttons & Icons** - Designed for non-technical users
- **Clear Visual Feedback** - Status indicators and intuitive layouts

## 🏗️ Project Structure

```
src/
├── components/
│   ├── App.tsx                 # Main app router
│   ├── pages/
│   │   ├── LoginScreen.tsx    # Phone + OTP login
│   │   ├── LanguageSelection.tsx
│   │   ├── MainApp.tsx        # Main app with bottom nav
│   │   ├── HomePage.tsx       # Dashboard with summary
│   │   ├── CategoriesPage.tsx # Product categories
│   │   ├── AlertsPage.tsx     # Alerts & notifications
│   │   └── ProfilePage.tsx    # User profile & settings
│   └── ui/
│       ├── BottomNavBar.tsx   # Navigation bar
│       ├── SummaryCard.tsx    # Dashboard cards
│       ├── ProductCard.tsx    # Product display
│       ├── CategoryCard.tsx   # Category tiles
│       ├── AlertCard.tsx      # Alert notifications
│       ├── AlertBanner.tsx    # Critical alert banner
│       ├── AddProductModal.tsx# Product form
│       ├── ProductDetailModal.tsx
│       └── ProductList.tsx
├── context/
│   └── AppContext.tsx         # Global state management
├── types/
│   └── index.ts              # TypeScript interfaces
├── utils/
│   ├── translations.ts       # Multi-language support
│   └── predictions.ts        # AI calculations
├── services/
│   └── database.ts          # Mock database
├── Root.tsx                 # App with provider
├── main.tsx
└── index.css               # Tailwind CSS
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Modern web browser

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

The app will be available at `http://localhost:3000`

## 📱 Usage

### 1. Login
- Enter your 10-digit phone number
- Use demo phone: `9876543210`
- Enter OTP: `123456`
- Enter shop name

### 2. Select Language
- Choose between English, हिंदी, or తెలుగు
- Language can be changed anytime in Profile

### 3. Dashboard (Home)
- View total products, low stock items, expiring soon items
- See critical alerts
- Quick actions for adding products and recording sales

### 4. Categories
- Browse products by category:
  - 🍪 Biscuits & Snacks
  - 🥛 Dairy Products
  - 🥕 Fruits & Vegetables
  - 🥤 Beverages
  - 🌾 Grocery Essentials

### 5. Add Product
- Enter product name (auto-detects unit type)
- Set quantity
- Select category
- Add optional expiry date
- Product saved to inventory

### 6. Track Stock
- View each product's current stock
- See daily average sales
- Check days remaining prediction
- Record sales to update inventory

### 7. Alerts
- View all active alerts
- See stock warnings
- Monitor expiry dates
- Track fast-selling products
- Mark alerts as read

### 8. Profile
- View shop information
- Change language preference
- Logout

## 🤖 AI Features

### Stock Prediction
- Calculates average daily sales from last 30 days
- Predicts when stock will run out
- Suggests reorder dates (2 days before depletion)
- Shows predictions in multiple languages

### Smart Alerts
Automatically generates alerts for:
- **Stock Low** (5 days or less remaining)
- **Stock Critical** (2 days or less remaining)
- **Expiry Warning** (2 days before expiry)
- **Fast Selling** (products with high daily sales)

### Automatic Unit Detection
Smart system recognizes product types:
- Milk, Dahi → Litres
- Rice, Wheat, Flour → Kg
- Oil, Ghee → Litres
- Eggs → Dozen
- Biscuits, Cookies → Pieces
- Fruits, Vegetables → Kg

## 📊 Data Structure

### User
```typescript
{
  id: string
  phone: string
  name: string
  language: 'en' | 'hi' | 'te'
  shopName: string
  createdAt: Date
}
```

### Product
```typescript
{
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  expiryDate?: Date
  lastRestockDate: Date
  dailyAverage: number
  userId: string
}
```

### Sales Record
```typescript
{
  id: string
  productId: string
  quantity: number
  date: Date
  userId: string
}
```

### Alert
```typescript
{
  id: string
  type: 'stock' | 'expiry' | 'fastSelling'
  productId: string
  message: string
  severity: 'info' | 'warning' | 'critical'
  createdAt: Date
  read: boolean
  userId: string
}
```

## 🌐 Multi-Language Support

All UI elements, alerts, and predictions support:
- **English (EN)**: Complete English interface
- **Hindi (HI)**: हिंदी interface with translations
- **Telugu (TE)**: తెలుగు interface with translations

Example alert messages:
- **EN**: "Milk stock will finish in 2 days. Please reorder."
- **HI**: "पाल 2 दिन में खत्म हो जाएगा। कृपया ऑर्डर करें।"
- **TE**: "పాలు 2 రోజుల్లో పూర్తవుతుంది। దయచేసి ఆర్డర్ చేయండి।"

## 🎨 Design System

### Colors
- Primary Blue: `#3b82f6`
- Success Green: `#10b981`
- Warning Yellow: `#f59e0b`
- Error Red: `#ef4444`
- Info Blue: `#3b82f6`

### Typography
- Font Family: -apple-system, BlinkMacSystemFont, 'Segoe UI'
- Large buttons: 48px+ height
- Icons: 24px+ size
- Text: Readable from 5 feet away

## 🔧 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: React Context API
- **Database**: Mock (Local Storage compatible)
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📝 Demo Data

The app comes with pre-loaded demo data:
- 50-year-old shopkeeper "Ramesh Kumar"
- 8 sample products across all categories
- Mock sales history for predictions
- Sample alerts

## 🚀 Future Enhancements

- Firebase integration for real persistence
- Real WhatsApp API integration for alerts
- Barcode scanning for products
- Photo capture for product images
- Supplier management
- Revenue tracking
- Expense management
- GST calculations (optional)
- Offline mode support

## ⚠️ Important Notes

- **Authentication**: Demo OTP mode (not for production)
- **Data Persistence**: Uses browser localStorage (demo only)
- **No E-commerce**: This is inventory tracking only
- **No Billing**: GST/taxes are not included

## 📞 Support

For shopkeepers with questions:
- UI is built for non-technical users
- All buttons use icons and clear labels
- Multiple language support
- Large, easy-to-tap buttons

## 📄 License

MIT License - Free to use and modify

---

**Made with ❤️ for Indian Shopkeepers**

Smart Kirana AI helps small shop owners manage inventory efficiently using AI predictions and mobile-first design.
#   S m a r t - K i r a n a - A I  
 