const categoryKeyMap: Record<string, string> = {
  'Grocery': 'grocery',
  'Grocery Essentials': 'grocery',
  'Snacks': 'snacks',
  'Biscuits & Snacks': 'snacks',
  'Beverages': 'beverages',
  'Personal Care': 'personalCare',
  'Dairy': 'dairy',
  'Dairy Products': 'dairy',
  'Bakery': 'bakery',
  'Household': 'household',
  'Cleaning Supplies': 'cleaning',
  'Stationery': 'stationery',
  'Fruits': 'fruits',
  'Vegetables': 'vegetables',
  'Fruits & Vegetables': 'fruitsVegetables',
  'Frozen Foods': 'frozen',
  'Rice & Grains': 'rice_grains',
  'Rice & Grains ': 'rice_grains',
  'Oils & Spices': 'oils_spices',
  'Flour & Pulses': 'flour_pulses',
  'Salt & Sugar': 'salt_sugar',
  'Rice & Grains': 'rice_grains',
};

export const getCategoryKey = (name?: string | null) => {
  if (!name) return '';
  if (categoryKeyMap[name]) return categoryKeyMap[name];
  // sanitize fallback: lower-case, replace non-alphanumerics with underscores
  return name.toString().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').replace(/_+/g, '_');
};

export const ALL_CATEGORY_KEYS = [
  'grocery', 'snacks', 'beverages', 'personalCare', 'dairy', 'bakery', 'household', 'stationery', 'vegetables', 'fruits', 'frozen', 'cleaning', 'fruitsVegetables'
];

export default categoryKeyMap;
