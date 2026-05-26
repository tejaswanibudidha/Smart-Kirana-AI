import { User, Product, SalesRecord, Alert, Category } from '../types';

class MockDatabase {
  private users: Map<string, User> = new Map();
  private products: Map<string, Product[]> = new Map();
  private sales: Map<string, SalesRecord[]> = new Map();
  private alerts: Map<string, Alert[]> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private inferPrice(name: string): number {
    const lower = name.toLowerCase();
    if (lower.includes('milk')) return 62;
    if (lower.includes('butter')) return 180;
    if (lower.includes('cheese')) return 150;
    if (lower.includes('dahi')) return 40;
    if (lower.includes('paneer')) return 120;
    if (lower.includes('biscuit')) return 45;
    if (lower.includes('chips')) return 20;
    if (lower.includes('rice')) return 70;
    if (lower.includes('wheat') || lower.includes('flour')) return 35;
    if (lower.includes('oil')) return 140;
    if (lower.includes('sugar')) return 50;
    if (lower.includes('dal')) return 90;
    if (lower.includes('turmeric') || lower.includes('chili')) return 80;
    if (lower.includes('salt')) return 20;
    if (lower.includes('tea')) return 180;
    if (lower.includes('coffee')) return 220;
    if (lower.includes('coke') || lower.includes('cola') || lower.includes('sprite')) return 90;
    if (lower.includes('juice')) return 110;
    if (lower.includes('lassi')) return 30;
    if (lower.includes('horlicks')) return 160;
    if (lower.includes('tomato')) return 26;
    if (lower.includes('onion')) return 30;
    if (lower.includes('potato')) return 25;
    if (lower.includes('mango')) return 80;
    if (lower.includes('banana')) return 40;
    return 99;
  }

  private getDefaultProducts(userId: string): Product[] {
    const rawProducts: Partial<Product>[] = [
      {
        id: 'prod_001',
        name: 'Tata Salt 1kg',
        category: 'Grocery',
        quantity: 30,
        minStockLevel: 8,
        price: 18,
        expiryDate: new Date('2027-06-01'),
        unit: 'Pieces',
        image: 'https://images.unsplash.com/photo-1599599810481-ba4a2c3c4a96?w=400&h=400&fit=crop',
        lastRestockDate: new Date(),
        dailyAverage: 5,
      },
      {
        id: 'prod_002',
        name: 'Surf Excel Detergent',
        category: 'Household',
        quantity: 20,
        minStockLevel: 6,
        price: 180,
        expiryDate: new Date('2027-03-01'),
        unit: 'Pieces',
        image: 'https://images.unsplash.com/photo-1589841882154-bc1499d3e406?w=400&h=400&fit=crop',
        lastRestockDate: new Date(),
        dailyAverage: 4,
      },
      {
        id: 'prod_003',
        name: 'Sting Energy Drink',
        category: 'Beverages',
        quantity: 25,
        minStockLevel: 8,
        price: 45,
        expiryDate: new Date('2026-08-01'),
        unit: 'Pieces',
        image: 'https://images.unsplash.com/photo-1527960190858-4e07b7f9e928?w=400&h=400&fit=crop',
        lastRestockDate: new Date(),
        dailyAverage: 6,
      },
      {
        id: 'prod_004',
        name: 'Sprite 250ml',
        category: 'Beverages',
        quantity: 35,
        minStockLevel: 10,
        price: 30,
        expiryDate: new Date('2026-07-15'),
        unit: 'Pieces',
        image: 'https://images.unsplash.com/photo-1554866585-cf5b0bf61982?w=400&h=400&fit=crop',
        lastRestockDate: new Date(),
        dailyAverage: 8,
      },
      {
        id: 'prod_005',
        name: 'Dove Soap',
        category: 'Personal Care',
        quantity: 40,
        minStockLevel: 12,
        price: 55,
        expiryDate: new Date('2027-04-01'),
        unit: 'Pieces',
        image: 'https://images.unsplash.com/photo-1596261914949-48a3fbb8f4a5?w=400&h=400&fit=crop',
        lastRestockDate: new Date(),
        dailyAverage: 7,
      },
      {
        id: 'prod_006',
        name: 'Lux Bar Soap',
        category: 'Personal Care',
        quantity: 50,
        minStockLevel: 15,
        price: 35,
        expiryDate: new Date('2027-05-01'),
        unit: 'Pieces',
        image: 'https://images.unsplash.com/photo-1596261914949-48a3fbb8f4a5?w=400&h=400&fit=crop',
        lastRestockDate: new Date(),
        dailyAverage: 10,
      },
      {
        id: 'prod_007',
        name: 'Clinik Soap',
        category: 'Personal Care',
        quantity: 35,
        minStockLevel: 10,
        price: 45,
        expiryDate: new Date('2027-03-01'),
        unit: 'Pieces',
        image: 'https://images.unsplash.com/photo-1596261914949-48a3fbb8f4a5?w=400&h=400&fit=crop',
        lastRestockDate: new Date(),
        dailyAverage: 6,
      },
      {
        id: 'prod_008',
        name: 'Parle-G Biscuits',
        category: 'Snacks',
        quantity: 60,
        minStockLevel: 15,
        price: 50,
        expiryDate: new Date('2026-08-01'),
        unit: 'Pieces',
        image: 'https://images.unsplash.com/photo-1585865387789-e51612c6ff0f?w=400&h=400&fit=crop',
        lastRestockDate: new Date(),
        dailyAverage: 12,
      },
      {
        id: 'prod_009',
        name: 'Rin Detergent Powder',
        category: 'Household',
        quantity: 18,
        minStockLevel: 5,
        price: 160,
        expiryDate: new Date('2027-02-01'),
        unit: 'Pieces',
        image: 'https://images.unsplash.com/photo-1589841882154-bc1499d3e406?w=400&h=400&fit=crop',
        lastRestockDate: new Date(),
        dailyAverage: 3,
      },
      {
        id: 'prod_010',
        name: 'Red Label Tea',
        category: 'Beverages',
        quantity: 15,
        minStockLevel: 4,
        price: 420,
        expiryDate: new Date('2026-10-01'),
        unit: 'Pieces',
        image: 'https://images.unsplash.com/photo-1597318130584-19531eb1e1ef?w=400&h=400&fit=crop',
        lastRestockDate: new Date(),
        dailyAverage: 2,
      },
    ];

    return rawProducts.map(p => ({
      id: p.id || `prod_${Date.now()}`,
      name: p.name || 'Unknown Product',
      category: p.category || 'Grocery',
      quantity: p.quantity || 10,
      unit: p.unit || 'Pieces',
      image: p.image,
      expiryDate: p.expiryDate,
      lastRestockDate: p.lastRestockDate || new Date(),
      dailyAverage: p.dailyAverage || 0,
      userId,
      minStockLevel: p.minStockLevel || Math.max(5, Math.round((p.quantity || 10) * 0.3)),
      price: p.price || this.inferPrice(p.name || 'Product'),
    }));
  }

  private initializeMockData() {
    // Mock user
    const mockUser: User = {
      id: 'user_001',
      phone: '9876543210',
      name: 'Ramesh Kumar',
      language: 'en',
      shopName: 'Kumar Kirana Store',
      createdAt: new Date(),
    };
    this.users.set('user_001', mockUser);

    // Comprehensive mock products for kirana shop
    const rawProducts: Partial<Product>[] = [
      // ===== DAIRY PRODUCTS =====
      {
        id: 'prod_001',
        name: 'Amul Fresh Milk (1L)',
        category: 'Dairy Products',
        quantity: 45,
        unit: 'Litres',
        image: 'https://images.unsplash.com/photo-1553530666-ba2a8e36cd12?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        dailyAverage: 15,
        userId: 'user_001',
      },
      {
        id: 'prod_002',
        name: 'Amul Butter (500g)',
        category: 'Dairy Products',
        quantity: 8,
        unit: 'Kg',
        image: 'https://images.unsplash.com/photo-1589985643862-41061a05aa8d?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        dailyAverage: 2,
        userId: 'user_001',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'prod_003',
        name: 'Dahi (500ml)',
        category: 'Dairy Products',
        quantity: 24,
        unit: 'Pieces',
        image: 'https://images.unsplash.com/photo-1651531557233-0f8f0b22a547?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        dailyAverage: 6,
        userId: 'user_001',
        expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'prod_004',
        name: 'Paneer (500g)',
        category: 'Dairy Products',
        quantity: 12,
        unit: 'Kg',
        image: 'https://images.unsplash.com/photo-1589985644631-bbb47a03a2b1?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        dailyAverage: 3,
        userId: 'user_001',
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'prod_005',
        name: 'Amul Cheese (200g)',
        category: 'Dairy Products',
        quantity: 20,
        unit: 'Pieces',
        image: 'https://images.unsplash.com/photo-1588195538326-c5b1e6d4b1e5?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        dailyAverage: 2,
        userId: 'user_001',
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },

      // ===== BISCUITS & SNACKS =====
      {
        id: 'prod_006',
        name: 'Britannia Marie Biscuit (250g)',
        category: 'Biscuits & Snacks',
        quantity: 150,
        unit: 'Pieces',
        image: 'https://images.unsplash.com/photo-1599599810694-b6be63a8b914?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        dailyAverage: 25,
        userId: 'user_001',
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'prod_007',
        name: 'Parle G Biscuit (500g)',
        category: 'Biscuits & Snacks',
        quantity: 200,
        unit: 'Pieces',
        image: 'https://images.unsplash.com/photo-1585865387789-e51612c6ff0f?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        dailyAverage: 35,
        userId: 'user_001',
        expiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'prod_008',
        name: 'Lays Chips (50g)',
        category: 'Biscuits & Snacks',
        quantity: 120,
        unit: 'Pieces',
        image: 'https://images.unsplash.com/photo-1599599810481-ba4a2c3c4a96?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        dailyAverage: 20,
        userId: 'user_001',
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'prod_009',
        name: 'Hide & Seek (250g)',
        category: 'Biscuits & Snacks',
        quantity: 80,
        unit: 'Pieces',
        image: 'https://images.unsplash.com/photo-1585965120202-06ff86454c01?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        dailyAverage: 15,
        userId: 'user_001',
        expiryDate: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'prod_010',
        name: 'Kurkure Snacks (50g)',
        category: 'Biscuits & Snacks',
        quantity: 100,
        unit: 'Pieces',
        image: 'https://images.unsplash.com/photo-1599599810481-ba4a2c3d3b96?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        dailyAverage: 18,
        userId: 'user_001',
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },

      // ===== GROCERY ESSENTIALS =====
      {
        id: 'prod_011',
        name: 'Basmati Rice (1kg)',
        category: 'Grocery Essentials',
        quantity: 75,
        unit: 'Kg',
        image: 'https://images.unsplash.com/photo-1599599810999-ee9fa3a24d4b?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        dailyAverage: 12,
        userId: 'user_001',
      },
      {
        id: 'prod_012',
        name: 'Wheat Flour (1kg)',
        category: 'Grocery Essentials',
        quantity: 120,
        unit: 'Kg',
        image: 'https://images.unsplash.com/photo-1599599810481-ba4a2c3a9b96?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        dailyAverage: 8,
        userId: 'user_001',
      },
      {
        id: 'prod_013',
        name: 'Sunflower Oil (1L)',
        category: 'Grocery Essentials',
        quantity: 18,
        unit: 'Litres',
        image: 'https://images.unsplash.com/photo-1599599810481-ba4a2c3c3c96?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        dailyAverage: 4,
        userId: 'user_001',
      },
      {
        id: 'prod_014',
        name: 'Sugar (1kg)',
        category: 'Grocery Essentials',
        quantity: 200,
        unit: 'Kg',
        image: 'https://images.unsplash.com/photo-1599599810481-ba4a2c3b3b96?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        dailyAverage: 10,
        userId: 'user_001',
      },
      {
        id: 'prod_015',
        name: 'Dal Masoor (1kg)',
        category: 'Grocery Essentials',
        quantity: 50,
        unit: 'Kg',
        image: 'https://images.unsplash.com/photo-1599599810481-ba4a2c3d3c96?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        dailyAverage: 8,
        userId: 'user_001',
      },
      {
        id: 'prod_016',
        name: 'Turmeric Powder (100g)',
        category: 'Grocery Essentials',
        quantity: 60,
        unit: 'Kg',
        image: 'https://images.unsplash.com/photo-1596040299597-c8b13e5c096a?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        dailyAverage: 3,
        userId: 'user_001',
      },
      {
        id: 'prod_017',
        name: 'Red Chili Powder (100g)',
        category: 'Grocery Essentials',
        quantity: 40,
        unit: 'Kg',
        image: 'https://images.unsplash.com/photo-1599599810481-ba4a2c3c3c96?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        dailyAverage: 2,
        userId: 'user_001',
      },
      {
        id: 'prod_018',
        name: 'Garlic (500g)',
        category: 'Grocery Essentials',
        quantity: 30,
        unit: 'Kg',
        image: 'https://images.unsplash.com/photo-1599599810481-ba4a2c3d3c96?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        dailyAverage: 4,
        userId: 'user_001',
      },
      {
        id: 'prod_019',
        name: 'Salt (1kg)',
        category: 'Grocery Essentials',
        quantity: 100,
        unit: 'Kg',
        image: 'https://images.unsplash.com/photo-1599599810481-ba4a2c3c3c96?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        dailyAverage: 5,
        userId: 'user_001',
      },

      // ===== FRUITS & VEGETABLES =====
      {
        id: 'prod_020',
        name: 'Fresh Tomatoes',
        category: 'Fruits & Vegetables',
        quantity: 35,
        unit: 'Kg',
        image: 'https://images.unsplash.com/photo-1599599810481-ba4a2c3c3c96?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        dailyAverage: 10,
        userId: 'user_001',
      },
      {
        id: 'prod_021',
        name: 'Onions (White)',
        category: 'Fruits & Vegetables',
        quantity: 60,
        unit: 'Kg',
        image: 'https://images.unsplash.com/photo-1585518419759-472ec282aceb?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        dailyAverage: 15,
        userId: 'user_001',
      },
      {
        id: 'prod_022',
        name: 'Potatoes',
        category: 'Fruits & Vegetables',
        quantity: 80,
        unit: 'Kg',
        image: 'https://images.unsplash.com/photo-1599599810481-ba4a2c3c3c96?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        dailyAverage: 20,
        userId: 'user_001',
      },
      {
        id: 'prod_023',
        name: 'Green Chili',
        category: 'Fruits & Vegetables',
        quantity: 15,
        unit: 'Kg',
        image: 'https://images.unsplash.com/photo-1585947823892-a286bde0a06e?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        dailyAverage: 3,
        userId: 'user_001',
      },
      {
        id: 'prod_024',
        name: 'Cabbage',
        category: 'Fruits & Vegetables',
        quantity: 40,
        unit: 'Kg',
        image: 'https://images.unsplash.com/photo-1599599810481-ba4a2c3c3c96?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        dailyAverage: 8,
        userId: 'user_001',
      },
      {
        id: 'prod_025',
        name: 'Carrots',
        category: 'Fruits & Vegetables',
        quantity: 45,
        unit: 'Kg',
        image: 'https://images.unsplash.com/photo-1599599810481-ba4a2c3c3c96?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        dailyAverage: 7,
        userId: 'user_001',
      },
      {
        id: 'prod_026',
        name: 'Bananas',
        category: 'Fruits & Vegetables',
        quantity: 50,
        unit: 'Kg',
        image: 'https://images.unsplash.com/photo-1599599810481-ba4a2c3c3c96?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        dailyAverage: 12,
        userId: 'user_001',
      },
      {
        id: 'prod_027',
        name: 'Mangoes (Kesar)',
        category: 'Fruits & Vegetables',
        quantity: 25,
        unit: 'Kg',
        image: 'https://images.unsplash.com/photo-1599599810481-ba4a2c3c3c96?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        dailyAverage: 8,
        userId: 'user_001',
      },
      {
        id: 'prod_028',
        name: 'Lemons',
        category: 'Fruits & Vegetables',
        quantity: 20,
        unit: 'Kg',
        image: 'https://images.unsplash.com/photo-1599599810481-ba4a2c3c3c96?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        dailyAverage: 4,
        userId: 'user_001',
      },

      // ===== BEVERAGES =====
      {
        id: 'prod_029',
        name: 'Sprite (2L)',
        category: 'Beverages',
        quantity: 24,
        unit: 'Pieces',
        image: 'https://images.unsplash.com/photo-1599599810481-ba4a2c3c3c96?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        dailyAverage: 6,
        userId: 'user_001',
      },
      {
        id: 'prod_030',
        name: 'Coca Cola (2L)',
        category: 'Beverages',
        quantity: 30,
        unit: 'Pieces',
        image: 'https://images.unsplash.com/photo-1599599810481-ba4a2c3c3c96?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        dailyAverage: 8,
        userId: 'user_001',
      },
      {
        id: 'prod_031',
        name: 'Fanta Orange (2L)',
        category: 'Beverages',
        quantity: 20,
        unit: 'Pieces',
        image: 'https://images.unsplash.com/photo-1599599810481-ba4a2c3c3c96?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        dailyAverage: 5,
        userId: 'user_001',
      },
      {
        id: 'prod_032',
        name: 'Tropicana Orange Juice (1L)',
        category: 'Beverages',
        quantity: 15,
        unit: 'Pieces',
        image: 'https://images.unsplash.com/photo-1599599810481-ba4a2c3c3c96?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        dailyAverage: 4,
        userId: 'user_001',
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'prod_033',
        name: 'Lassi (400ml)',
        category: 'Beverages',
        quantity: 35,
        unit: 'Pieces',
        image: 'https://images.unsplash.com/photo-1599599810481-ba4a2c3c3c96?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        dailyAverage: 10,
        userId: 'user_001',
        expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'prod_034',
        name: 'Tea Powder (250g)',
        category: 'Beverages',
        quantity: 60,
        unit: 'Pieces',
        image: 'https://images.unsplash.com/photo-1599599810481-ba4a2c3c3c96?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        dailyAverage: 8,
        userId: 'user_001',
      },
      {
        id: 'prod_035',
        name: 'Coffee Powder (250g)',
        category: 'Beverages',
        quantity: 30,
        unit: 'Pieces',
        image: 'https://images.unsplash.com/photo-1599599810481-ba4a2c3c3c96?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        dailyAverage: 4,
        userId: 'user_001',
      },
      {
        id: 'prod_036',
        name: 'Horlicks (500g)',
        category: 'Beverages',
        quantity: 25,
        unit: 'Pieces',
        image: 'https://images.unsplash.com/photo-1599599810481-ba4a2c3c3c96?w=300&h=300&fit=crop',
        lastRestockDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        dailyAverage: 3,
        userId: 'user_001',
      },
    ];
    const normalizedProducts: Product[] = rawProducts.map(p => ({
      id: p.id || `prod_${Date.now()}`,
      name: p.name || 'Unknown Product',
      category: p.category || 'Grocery Essentials',
      quantity: p.quantity || 10,
      unit: p.unit || 'Pieces',
      image: p.image,
      expiryDate: p.expiryDate,
      lastRestockDate: p.lastRestockDate || new Date(),
      dailyAverage: p.dailyAverage || 0,
      userId: 'user_001',
      minStockLevel: p.minStockLevel || Math.max(5, Math.round((p.quantity || 10) * 0.3)),
      price: p.price || this.inferPrice(p.name || 'Product'),
    }));
    this.products.set('user_001', normalizedProducts);

    // Mock sales
    const mockSales: SalesRecord[] = [
      // Milk sales
      {
        id: 'sale_001',
        productId: 'prod_001',
        quantity: 5,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        userId: 'user_001',
      },
      {
        id: 'sale_002',
        productId: 'prod_001',
        quantity: 8,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        userId: 'user_001',
      },
      // Biscuits sales
      {
        id: 'sale_003',
        productId: 'prod_006',
        quantity: 20,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        userId: 'user_001',
      },
      // Rice sales
      {
        id: 'sale_004',
        productId: 'prod_011',
        quantity: 10,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        userId: 'user_001',
      },
      // Onions sales
      {
        id: 'sale_005',
        productId: 'prod_021',
        quantity: 15,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        userId: 'user_001',
      },
      {
        id: 'sale_006',
        productId: 'prod_021',
        quantity: 12,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        userId: 'user_001',
      },
      // Potatoes sales
      {
        id: 'sale_007',
        productId: 'prod_022',
        quantity: 18,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        userId: 'user_001',
      },
      // Tomatoes sales
      {
        id: 'sale_008',
        productId: 'prod_020',
        quantity: 8,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        userId: 'user_001',
      },
      // Bananas sales
      {
        id: 'sale_009',
        productId: 'prod_026',
        quantity: 10,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        userId: 'user_001',
      },
      // Tea powder sales
      {
        id: 'sale_010',
        productId: 'prod_034',
        quantity: 5,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        userId: 'user_001',
      },
      // Parle G sales
      {
        id: 'sale_011',
        productId: 'prod_007',
        quantity: 30,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        userId: 'user_001',
      },
      // Butter sales
      {
        id: 'sale_012',
        productId: 'prod_002',
        quantity: 2,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        userId: 'user_001',
      },
      // Dahi sales
      {
        id: 'sale_013',
        productId: 'prod_003',
        quantity: 6,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        userId: 'user_001',
      },
      // Oil sales
      {
        id: 'sale_014',
        productId: 'prod_013',
        quantity: 2,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        userId: 'user_001',
      },
      // Beverages sales
      {
        id: 'sale_015',
        productId: 'prod_029',
        quantity: 4,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        userId: 'user_001',
      },
      {
        id: 'sale_016',
        productId: 'prod_030',
        quantity: 6,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        userId: 'user_001',
      },
    ];
    this.sales.set('user_001', mockSales);

    // Mock alerts
    const mockAlerts: Alert[] = [
      {
        id: 'alert_001',
        type: 'stock',
        productId: 'prod_005',
        message: 'Amul Butter stock is low. Only 8 units left.',
        severity: 'warning',
        createdAt: new Date(),
        read: false,
        userId: 'user_001',
      },
      {
        id: 'alert_002',
        type: 'expiry',
        productId: 'prod_005',
        message: 'Amul Butter expires in 2 days',
        severity: 'critical',
        createdAt: new Date(),
        read: false,
        userId: 'user_001',
      },
    ];
    this.alerts.set('user_001', mockAlerts);
  }

  getCategories(): Category[] {
    return [
      { 
        id: 'cat_001', 
        name: 'Grocery', 
        icon: '🌾',
        image: '/images/categories/grocery.svg',
        subCategories: [
          { id: 'sub_001', name: 'Rice & Grains', icon: '🍚', image: '/images/categories/grocery.svg' },
          { id: 'sub_002', name: 'Oils & Spices', icon: '🌶️', image: '/images/categories/grocery.svg' },
          { id: 'sub_003', name: 'Flour & Pulses', icon: '🫘', image: '/images/categories/grocery.svg' },
          { id: 'sub_004', name: 'Salt & Sugar', icon: '🧂', image: '/images/categories/grocery.svg' },
        ]
      },
      { 
        id: 'cat_002', 
        name: 'Snacks', 
        icon: '🍪',
        image: '/images/categories/snacks.svg',
        subCategories: [
          { id: 'sub_005', name: 'Biscuits', icon: '🍘', image: '/images/categories/snacks.svg' },
          { id: 'sub_006', name: 'Chips & Crisps', icon: '🥔', image: '/images/categories/snacks.svg' },
          { id: 'sub_007', name: 'Cookies', icon: '🍪', image: '/images/categories/snacks.svg' },
          { id: 'sub_008', name: 'Nuts & Seeds', icon: '🥜', image: '/images/categories/snacks.svg' },
        ]
      },
      { 
        id: 'cat_003', 
        name: 'Beverages', 
        icon: '🥤',
        image: '/images/categories/beverages.svg',
        subCategories: [
          { id: 'sub_009', name: 'Soft Drinks', icon: '🥃', image: '/images/categories/beverages.svg' },
          { id: 'sub_010', name: 'Tea & Coffee', icon: '☕', image: '/images/categories/beverages.svg' },
          { id: 'sub_011', name: 'Juice & Drinks', icon: '🧃', image: '/images/categories/beverages.svg' },
          { id: 'sub_012', name: 'Energy Drinks', icon: '⚡', image: '/images/categories/beverages.svg' },
        ]
      },
      { 
        id: 'cat_004', 
        name: 'Personal Care', 
        icon: '🧴',
        image: '/images/categories/personal-care.svg',
        subCategories: [
          { id: 'sub_013', name: 'Soaps', icon: '🧼', image: '/images/categories/personal-care.svg' },
          { id: 'sub_014', name: 'Shampoo & Hair Care', icon: '💇', image: '/images/categories/personal-care.svg' },
          { id: 'sub_015', name: 'Toothpaste & Oral', icon: '🪥', image: '/images/categories/personal-care.svg' },
          { id: 'sub_016', name: 'Deodorants', icon: '💨', image: '/images/categories/personal-care.svg' },
        ]
      },
      { 
        id: 'cat_005', 
        name: 'Household', 
        icon: '🏠',
        image: '/images/categories/household.svg',
        subCategories: [
          { id: 'sub_017', name: 'Cleaning Products', icon: '🧹', image: '/images/categories/household.svg' },
          { id: 'sub_018', name: 'Laundry', icon: '🧺', image: '/images/categories/household.svg' },
          { id: 'sub_019', name: 'Air Fresheners', icon: '🌬️', image: '/images/categories/household.svg' },
          { id: 'sub_020', name: 'Storage & Utensils', icon: '🥘', image: '/images/categories/household.svg' },
        ]
      },
      { 
        id: 'cat_006', 
        name: 'Packaged Food', 
        icon: '🍜',
        image: '/images/categories/packaged-food.svg',
        subCategories: [
          { id: 'sub_021', name: 'Noodles & Pasta', icon: '🍝', image: '/images/categories/packaged-food.svg' },
          { id: 'sub_022', name: 'Instant Food', icon: '🍲', image: '/images/categories/packaged-food.svg' },
          { id: 'sub_023', name: 'Canned Food', icon: '🥫', image: '/images/categories/packaged-food.svg' },
          { id: 'sub_024', name: 'Ready to Eat', icon: '📦', image: '/images/categories/packaged-food.svg' },
        ]
      },
      { 
        id: 'cat_007', 
        name: 'Dairy', 
        icon: '🥛',
        image: '/images/categories/dairy.svg',
        subCategories: [
          { id: 'sub_025', name: 'Milk & Cream', icon: '🥛', image: '/images/categories/dairy.svg' },
          { id: 'sub_026', name: 'Yogurt & Curd', icon: '🍯', image: '/images/categories/dairy.svg' },
          { id: 'sub_027', name: 'Cheese & Butter', icon: '🧈', image: '/images/categories/dairy.svg' },
          { id: 'sub_028', name: 'Paneer', icon: '🥘', image: '/images/categories/dairy.svg' },
        ]
      },
      { 
        id: 'cat_008', 
        name: 'Fruits & Vegetables', 
        icon: '🥕',
        image: '/images/categories/fruits.svg',
        subCategories: [
          { id: 'sub_029', name: 'Fresh Vegetables', icon: '🥬', image: '/images/categories/fruits.svg' },
          { id: 'sub_030', name: 'Fresh Fruits', icon: '🍎', image: '/images/categories/fruits.svg' },
          { id: 'sub_031', name: 'Leafy Greens', icon: '🌿', image: '/images/categories/fruits.svg' },
          { id: 'sub_032', name: 'Dry Vegetables', icon: '🪴', image: '/images/categories/fruits.svg' },
        ]
      },
    ];
  }

  getUserByPhone(phone: string): User | null {
    for (const user of this.users.values()) {
      if (user.phone === phone) {
        return user;
      }
    }
    return null;
  }

  createUser(phone: string, shopName: string): User {
    const user: User = {
      id: `user_${Date.now()}`,
      phone,
      name: shopName,
      language: 'en',
      shopName,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    this.products.set(user.id, this.getDefaultProducts(user.id));
    this.sales.set(user.id, []);
    this.alerts.set(user.id, []);
    return user;
  }

  updateUser(userId: string, updates: Partial<User>): User {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');
    const updated = { ...user, ...updates };
    this.users.set(userId, updated);
    return updated;
  }

  getProducts(userId: string): Product[] {
    let products = this.products.get(userId) || [];
    if (products.length === 0) {
      products = this.getDefaultProducts(userId);
      this.products.set(userId, products);
    }
    return products;
  }

  addProduct(userId: string, product: Product): Product {
    const products = this.products.get(userId) || [];
    const newProduct = { ...product, id: `prod_${Date.now()}` };
    products.push(newProduct);
    this.products.set(userId, products);
    return newProduct;
  }

  updateProduct(userId: string, product: Product): Product {
    const products = this.products.get(userId) || [];
    const index = products.findIndex(p => p.id === product.id);
    if (index === -1) throw new Error('Product not found');
    products[index] = product;
    this.products.set(userId, products);
    return product;
  }

  deleteProduct(userId: string, productId: string): void {
    const products = this.products.get(userId) || [];
    this.products.set(userId, products.filter(p => p.id !== productId));
  }

  getSales(userId: string): SalesRecord[] {
    return this.sales.get(userId) || [];
  }

  addSale(userId: string, sale: SalesRecord): SalesRecord {
    const sales = this.sales.get(userId) || [];
    const newSale = { ...sale, id: `sale_${Date.now()}` };
    sales.push(newSale);
    this.sales.set(userId, sales);
    return newSale;
  }

  getAlerts(userId: string): Alert[] {
    return this.alerts.get(userId) || [];
  }

  addAlert(userId: string, alert: Alert): Alert {
    const alerts = this.alerts.get(userId) || [];
    const newAlert = { ...alert, id: `alert_${Date.now()}` };
    alerts.push(newAlert);
    this.alerts.set(userId, alerts);
    return newAlert;
  }

  updateAlert(userId: string, alert: Alert): Alert {
    const alerts = this.alerts.get(userId) || [];
    const index = alerts.findIndex(a => a.id === alert.id);
    if (index === -1) throw new Error('Alert not found');
    alerts[index] = alert;
    this.alerts.set(userId, alerts);
    return alert;
  }

  clearAlerts(userId: string): void {
    this.alerts.set(userId, []);
  }
}

export const mockDB = new MockDatabase();
