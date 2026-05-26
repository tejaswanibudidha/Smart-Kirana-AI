import React, { useState } from 'react';
import { Category } from '../../types';
import { useTranslation } from '../../i18n/i18n';
import { getCategoryKey } from '../../i18n/categories';
import { getCategoryFallbackImage } from '../../i18n/product-images';

interface CategoryCardProps {
  category: Category;
  productCount: number;
  onClick: () => void;
}

const categoryImageMap: Record<string, string> = {
  grocery: 'https://source.unsplash.com/800x400/?rice,grains,bag',
  snacks: 'https://source.unsplash.com/800x400/?snacks,packets,biscuits',
  beverages: 'https://source.unsplash.com/800x400/?beverages,drinks,bottles',
  personalCare: 'https://source.unsplash.com/800x400/?personal-care,soap,shampoo',
  household: 'https://source.unsplash.com/800x400/?cleaning,detergent,household',
  packaged_food: 'https://source.unsplash.com/800x400/?packaged-food,packets',
  dairy: 'https://source.unsplash.com/800x400/?dairy,milk,cheese',
  fruitsVegetables: 'https://source.unsplash.com/800x400/?fruits,vegetables,market',
  rice_grains: 'https://source.unsplash.com/800x400/?rice,grains,bags',
  oils_spices: 'https://source.unsplash.com/800x400/?oil,spices,masala',
  flour_pulses: 'https://source.unsplash.com/800x400/?flour,pulses,dal',
  salt_sugar: 'https://source.unsplash.com/800x400/?salt,sugar,packets',
  bakery: 'https://source.unsplash.com/800x400/?bakery,bread,pastry',
  stationery: 'https://source.unsplash.com/800x400/?stationery,notebooks,pens',
  vegetables: 'https://source.unsplash.com/800x400/?vegetables,market',
  fruits: 'https://source.unsplash.com/800x400/?fruits,market',
  frozen: 'https://source.unsplash.com/800x400/?frozen-foods,freezer',
  cleaning: 'https://source.unsplash.com/800x400/?cleaning,supplies',
};

const CategoryCard: React.FC<CategoryCardProps> = ({ category, productCount, onClick }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const { t } = useTranslation();
  const mapCategoryKey = (name: string) => getCategoryKey(name);
  const ckey = mapCategoryKey(category.name);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.warn(`Failed to load image for ${category.name}:`, e);
    // Try fallback image
    const fallbackUrl = fallbackImages[category.name];
    if (fallbackUrl && e.currentTarget.src !== fallbackUrl) {
      e.currentTarget.src = fallbackUrl;
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const imageUrl = categoryImageMap[ckey] || category.image || getCategoryFallbackImage(category.name);

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition transform hover:scale-105 text-center p-0"
    >
      {/* Category Image */}
      <div className="relative h-36 sm:h-32 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden flex items-center justify-center">
        {imageLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
        )}
        
        <img
          src={imageUrl}
          alt={t(`categories.${ckey}`) || category.name}
          loading="lazy"
          onError={(e) => {
            const fallback = getCategoryFallbackImage(category.name);
            (e.currentTarget as HTMLImageElement).src = fallback;
          }}
          onLoad={handleImageLoad}
          className="w-full h-full object-cover"
          style={{
            opacity: imageLoading ? 0.5 : 1,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
      </div>
      
      {/* Category Info */}
      <div className="p-4 text-left">
        <h3 className="font-semibold text-gray-800 text-lg mb-1">{t(`categories.${mapCategoryKey(category.name)}`)}</h3>
        <p className="text-gray-600 text-sm">
          {t('products.count', { count: productCount })}
        </p>
      </div>
    </button>
  );
};

export default CategoryCard;
