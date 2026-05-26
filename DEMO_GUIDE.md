# 🚀 Smart Kirana AI - Quick Start Guide

## Getting Started in 2 Minutes

### 1. Login
```
Phone: 9876543210
OTP: 123456
Shop Name: Kumar Kirana Store (or any name)
```

### 2. Select Language
Choose: English, हिंदी, or తెలుగు

### 3. Explore Demo

#### 🏠 Home Screen
- See dashboard with summary cards
- View 8 pre-loaded products
- See 2 critical alerts (Amul Butter running low)
- Quick action buttons

#### 🗂️ Categories
- 5 product categories with icons
- Tap any to see products
- Color indicators (Green=Safe, Yellow=Low, Red=Critical)
- Add Product button

#### 🔔 Alerts
- View active alerts
- 2 sample alerts pre-loaded
- Mark as read, clear all

#### 👤 Profile
- View shop details
- Change language
- See membership date

---

## Demo Flows

### Flow 1: View Product Details
1. Tap **Categories** → 🥛 **Dairy Products**
2. Tap **Amul Butter** card
3. See:
   - Current stock: 8 Kg
   - Stock Prediction: "Will finish in 4 days"
   - Expiry: Jul 3, 2026
   - Actions: Record Sale, Edit, Delete

### Flow 2: Record a Sale
1. Find **Pure Milk** product (45 Litres)
2. Tap the card
3. Tap **"Record Sale"** (blue button)
4. Enter quantity: `5`
5. Tap **"Record Sale"**
6. Stock updates: 45 → 40 Litres
7. Prediction recalculates

### Flow 3: Add New Product
1. Tap **Categories** → **Grocery Essentials**
2. Tap **"Add Product"** (green button)
3. Fill form:
   - Name: "Masala Packet"
   - Quantity: "100"
   - Unit: Auto-detects "Pieces"
   - Expiry: Leave empty
4. Tap **"Save"**
5. Product appears in list immediately

### Flow 4: Check Alerts
1. Tap **Alerts** tab (🔔)
2. See 2 critical alerts:
   - "Amul Butter stock is low" (Yellow)
   - "Amul Butter expires in 2 days" (Red)
3. Tap ✅ to mark as read
4. Updated alerts show below

### Flow 5: Change Language
1. Tap **Profile** tab
2. Tap 🇮🇳 **हिंदी**
3. Entire app switches to Hindi
4. All alerts show in Hindi
5. Return to **Profile** to switch back

---

## Pre-loaded Demo Data

### 8 Sample Products
```
1. Pure Milk Pouch (45 Litres) - 🟢 Safe
2. Wheat Flour (120 Kg) - 🟢 Safe
3. Basmati Rice (75 Kg) - 🟢 Safe
4. Britannia Biscuits (150 Pieces) - 🟢 Safe
5. Amul Butter (8 Kg) - 🔴 Critical (2 days to expiry)
6. Sunflower Oil (18 Litres) - 🟢 Safe
7. Fresh Tomatoes (35 Kg) - 🟢 Safe
8. Sprite 2L (24 Pieces) - 🟢 Safe
```

### 2 Critical Alerts
1. ⚠️ Low Stock: "Amul Butter stock is low. Only 8 units left."
2. 🚨 Expiry: "Amul Butter expires in 2 days"

---

## UI Color Guide

| Color | Meaning | Example |
|-------|---------|---------|
| 🟢 Green | Safe/Add/Save/Good | Safe stock, Add button, Save |
| 🟡 Yellow | Warning/Low | Low stock, Warning alerts |
| 🔴 Red | Critical/Danger | Critical stock, Delete, Expiry |
| 🔵 Blue | Info/Action | Record sale, Edit, Info |

---

## Feature Showcase

### ✅ Features to Demonstrate

1. **Multi-Language** - Switch between 3 languages
2. **Login System** - Phone + OTP (demo)
3. **Dashboard** - Summary cards, recent products
4. **Categories** - Browse products by type
5. **Product Details** - Full info with predictions
6. **Record Sale** - Update stock in real-time
7. **AI Prediction** - "X days until stock finishes"
8. **Smart Alerts** - Stock, expiry, fast-selling
9. **Color Coding** - Visual status indicators
10. **Mobile UI** - Bottom navigation, responsive design

---

## Testing Checklist

- [ ] Login works with demo credentials
- [ ] Language switch updates entire UI
- [ ] Products display in categories
- [ ] Colors update based on stock level
- [ ] Record sale reduces quantity
- [ ] Predictions calculate correctly
- [ ] Alerts show/hide properly
- [ ] Bottom nav navigates between tabs
- [ ] Profile shows user info
- [ ] Logout clears user session

---

## Common Issues & Solutions

**Issue**: App not loading
- Solution: Make sure `npm run dev` is still running

**Issue**: Phone field not accepting input
- Solution: Use demo phone: `9876543210`

**Issue**: OTP not working
- Solution: Always use demo OTP: `123456`

**Issue**: Products not showing
- Solution: Go to Home tab → products load automatically

**Issue**: Language not changing
- Solution: Tap Profile → Select new language → App updates

---

## Impressive Show-Offs

### 1. Smart Unit Detection
- Add product "Milk" → Auto-detects "Litres"
- Add product "Rice" → Auto-detects "Kg"  
- Add product "Biscuits" → Auto-detects "Pieces"

### 2. AI Predictions
- Open any product
- See "X days remaining" prediction
- Show how app calculates from sales history

### 3. Multi-Language
- Show app in English
- Switch to Hindi
- Alerts appear in Hindi
- Show WhatsApp-style messages in 3 languages

### 4. Real-Time Updates
- Record a sale
- Watch stock reduce
- See predictions update
- Alerts generate automatically

### 5. Mobile-First Design
- Show on mobile browser
- Tap large buttons easily
- Bottom nav for easy navigation
- Icons for non-technical users

---

## Performance Notes

- **Fast**: Vite builds in milliseconds
- **Light**: ~500KB (uncompressed)
- **Responsive**: Works on 5-inch to full desktop screens
- **Smooth**: All animations and transitions work smoothly

---

## What's NOT Included (By Design)

❌ E-commerce features (buy/sell online)
❌ Billing system (no GST/invoices)
❌ Delivery management
❌ Real payment processing
❌ WhatsApp API (messages shown in UI)
❌ Backend database (mock only)

---

## Next Steps After Demo

1. **Show README** - Explain project structure
2. **Show CODE** - Walk through key components
3. **Discuss FUTURE** - Firebase, real WhatsApp, barcode scanning
4. **Q&A** - Answer questions about tech stack

---

## Contact Information
For shopkeeper support in your region, provide local shop owner contacts.

---

**Ready to Impress! 🎉**

This demo shows everything a small kirana shop owner needs to manage inventory with AI help.
