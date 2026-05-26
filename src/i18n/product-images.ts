import { Product } from '../types';
import { getCategoryKey } from './categories';
import productCatalog from './products';

const sanitize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').replace(/_+/g, '_');

export const productImages: Record<string, string> = {
  hide_seek: 'https://5.imimg.com/data5/SELLER/Default/2021/2/PI/YV/ZA/14475970/hide-n-seek-biscuit-1000x1000.jpg',
  kurkure: 'https://apnafoodmarket.com/wp-content/uploads/2020/05/kurkure-masala.jpg',
  tata_salt: 'https://5.imimg.com/data5/SELLER/Default/2022/3/WQ/FT/ID/3642811/1kg-tata-salt-packet-500x500.jpg',
  surf_excel: 'https://tiimg.tistatic.com/fp/1/007/879/easy-wash-surf-excel-detergent-powder-pack--949.jpg',
  amul_milk: 'https://5.imimg.com/data5/SELLER/Default/2023/1/AM/VH/NG/183940015/amul-milk-1000x1000.jpg',
  basmati_rice: 'https://i5.walmartimages.com/seo/India-Gate-White-Basmati-Rice-Jute-10-lb-bag_a9dd4d16-b76a-440a-8c4b-55a06ab3565d.cc89e81e7a32e91f65e6c810bc1be0f7.jpeg',
  sunflower_oil: 'https://m.media-amazon.com/images/I/41rbZGGXdaL.jpg',
  parle_g: 'https://www.bbassets.com/media/uploads/p/l/40115498_10-parle-g-original-gluco-biscuits.jpg',
  amul_butter: 'https://www.oifood.in/files/products/b2654e6460765d3b44a551a585f13002.jpg',
  dahi: 'https://tiimg.tistatic.com/fp/1/007/874/pack-of-400-gram-5-fat-content-fresh-mother-dairy-dahi-with-no-additives-and-preservatives-910.jpg',
  paneer: 'https://5.imimg.com/data5/SELLER/Default/2023/10/357062951/VK/WF/HI/6974227/paneer-500-gm-500x500.jpg',
  red_label_tea: 'https://m.media-amazon.com/images/I/71U5K3QvWZL._SL1500_.jpg',
  sprite: 'https://www.bbassets.com/media/uploads/p/l/40146410_1-sprite-2-l-bottle.jpg',
  coca_cola: 'https://www.bbassets.com/media/uploads/p/l/10000150_16-coca-cola-soft-drink.jpg',
  fanta_orange: 'https://www.bbassets.com/media/uploads/p/l/40146411_1-fanta-orange-2-l-bottle.jpg',
  tropicana_orange_juice: 'https://www.bbassets.com/media/uploads/p/l/40174493_2-tropicana-orange-delight-juice.jpg',
  lassi: 'https://m.media-amazon.com/images/I/51gJXgZs2YL._SL1000_.jpg',
  tea_powder: 'https://m.media-amazon.com/images/I/61+Jx8Q+uAL._SL1500_.jpg',
  coffee_powder: 'https://m.media-amazon.com/images/I/61mXv0X3f5L._SL1500_.jpg',
  horlicks: 'https://m.media-amazon.com/images/I/71f+9d8t3mL._SL1500_.jpg',
};

export const productImageMap: Record<string, string> = {
  prod_001: 'https://5.imimg.com/data5/SELLER/Default/2023/1/AM/VH/NG/183940015/amul-milk-1000x1000.jpg',
  prod_002: 'https://www.oifood.in/files/products/b2654e6460765d3b44a551a585f13002.jpg',
  prod_003: 'https://tiimg.tistatic.com/fp/1/007/874/pack-of-400-gram-5-fat-content-fresh-mother-dairy-dahi-with-no-additives-and-preservatives-910.jpg',
  prod_004: 'https://5.imimg.com/data5/SELLER/Default/2023/10/357062951/VK/WF/HI/6974227/paneer-500-gm-500x500.jpg',
  prod_005: 'https://5.imimg.com/data5/SELLER/Default/2023/10/357062951/VK/WF/HI/6974227/paneer-500-gm-500x500.jpg',
  prod_006: 'https://5.imimg.com/data5/SELLER/Default/2024/9/452388872/KX/FI/IE/232531304/61vwjqzeckl-sl1500-1000x1000.jpg',
  prod_007: 'https://5.imimg.com/data5/SELLER/Default/2022/4/IQ/ZS/WO/146296450/parle-g-biscuits-110-g-get-20-g-extra-product-images-o491539619-p491539619-1-202203170517-1000x1000.jpg',
  prod_008: 'https://www.bbassets.com/media/uploads/p/l/40146410_1-sprite-2-l-bottle.jpg',
  prod_009: 'https://5.imimg.com/data5/SELLER/Default/2021/2/PI/YV/ZA/14475970/hide-n-seek-biscuit-1000x1000.jpg',
  prod_010: 'https://apnafoodmarket.com/wp-content/uploads/2020/05/kurkure-masala.jpg',
  prod_011: 'https://i5.walmartimages.com/seo/India-Gate-White-Basmati-Rice-Jute-10-lb-bag_a9dd4d16-b76a-440a-8c4b-55a06ab3565d.cc89e81e7a32e91f65e6c810bc1be0f7.jpeg',
  prod_012: 'https://5.imimg.com/data5/SELLER/Default/2021/7/EQ/AA/AY/6428050/5-kg-wheat-flour-1000x1000.jpeg',
  prod_013: 'https://pictures.grocerapps.com/original/grocerapp-sufi-sunflower-oil-bottle-5eaac488cb42d.jpeg',
  prod_014: 'https://i5.walmartimages.com/asr/23c3362a-a899-4525-8506-201db85e958d_1.cf2e2f8054d125108cec894ad72c71a9.jpeg',
  prod_015: 'https://www.tatanutrikorner.com/cdn/shop/products/Tata-Sampann-Toor-Dal-1kg-_FOP_-with-Sanjeev-kapoor.png?v=1660201674',
  prod_016: 'https://m.media-amazon.com/images/I/81z7m6wDqjL._AC_SL1500_.jpg',
  prod_017: 'https://m.media-amazon.com/images/I/81l3UQZr7RL._AC_SL1500_.jpg',
  prod_018: 'https://m.media-amazon.com/images/I/61Q8B9Lr1jL._AC_SL1500_.jpg',
  prod_019: 'https://5.imimg.com/data5/SELLER/Default/2022/3/WQ/FT/ID/3642811/1kg-tata-salt-packet-500x500.jpg',
  prod_020: 'https://images.unsplash.com/photo-1546470427-2d1f8d9b3a3b?w=800&h=600&fit=crop',
  prod_021: 'https://images.unsplash.com/photo-1621233111232-88d1a2f7d0c8?w=800&h=600&fit=crop',
  prod_022: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&h=600&fit=crop',
  prod_023: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=800&h=600&fit=crop',
  prod_024: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=800&h=600&fit=crop',
  prod_025: 'https://images.unsplash.com/photo-1446834890810-9fb8a5e0f8b1?w=800&h=600&fit=crop',
  prod_026: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&h=600&fit=crop',
  prod_027: 'https://images.unsplash.com/photo-1576402187878-974f70c890a5?w=800&h=600&fit=crop',
  prod_028: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=800&h=600&fit=crop',
  prod_029: 'https://www.bbassets.com/media/uploads/p/l/40146410_1-sprite-2-l-bottle.jpg',
  prod_030: 'https://www.bbassets.com/media/uploads/p/l/10000150_16-coca-cola-soft-drink.jpg',
  prod_031: 'https://www.bbassets.com/media/uploads/p/l/40146411_1-fanta-orange-2-l-bottle.jpg',
  prod_032: 'https://www.bbassets.com/media/uploads/p/l/40174493_2-tropicana-orange-delight-juice.jpg',
  prod_033: 'https://m.media-amazon.com/images/I/51gJXgZs2YL._SL1000_.jpg',
  prod_034: 'https://m.media-amazon.com/images/I/71U5K3QvWZL._SL1500_.jpg',
  prod_035: 'https://m.media-amazon.com/images/I/61mXv0X3f5L._SL1500_.jpg',
  prod_036: 'https://m.media-amazon.com/images/I/71f+9d8t3mL._SL1500_.jpg',
};

export const categoryFallbackImages: Record<string, string> = {
  grocery: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop',
  snacks: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&h=600&fit=crop',
  beverages: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop',
  personalCare: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&h=600&fit=crop',
  household: 'https://images.unsplash.com/photo-1581579185169-0b53a21e5a9d?w=800&h=600&fit=crop',
  dairy: 'https://images.unsplash.com/photo-1553530666-ba2a8e36cd12?w=800&h=600&fit=crop',
  fruitsVegetables: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop',
  bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop',
  stationery: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=600&fit=crop',
  frozen: 'https://images.unsplash.com/photo-1588260737453-4b1e3eb4d0ed?w=800&h=600&fit=crop',
  cleaning: 'https://images.unsplash.com/photo-1581579185169-0b53a21e5a9d?w=800&h=600&fit=crop',
};

export const getProductImageKey = (product: Product, _language: 'en' | 'hi' | 'te' = 'en', displayName?: string, displayCategory?: string) => {
  if (productImageMap[product.id]) return productImageMap[product.id];

  const name = sanitize(displayName || '');
  if (productImages[name]) return productImages[name];

  const catalogEntry = productCatalog[product.id];
  if (catalogEntry?.image) return catalogEntry.image;

  const categoryKey = getCategoryKey(displayCategory || product.category);
  if (categoryFallbackImages[categoryKey]) return categoryFallbackImages[categoryKey];

  return 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop';
};

export const getCategoryFallbackImage = (categoryName?: string | null) => {
  const key = getCategoryKey(categoryName);
  return categoryFallbackImages[key] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop';
};
