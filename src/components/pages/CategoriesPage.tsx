import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/i18n';
import { getCategoryKey } from '../../i18n/categories';
import { mockDB } from '../../services/database';
import CategoryCard from '../ui/CategoryCard';
import ProductList from '../ui/ProductList';
import AddProductModal from '../ui/AddProductModal';

const CategoriesPage: React.FC = () => {
  const { products } = useApp();
  const { t, language } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const categories = mockDB.getCategories();
  const currentCategory = categories.find(c => c.name === selectedCategory);
  const subCategories = currentCategory?.subCategories || [];

  const categoryProducts = selectedSubCategory
    ? products.filter(p => p.category === selectedSubCategory)
    : selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : [];

  return (
    <div className="px-4 space-y-4">
      {!selectedCategory ? (
        <>
          {/* Categories Grid */}
          <div className="grid grid-cols-2 gap-3">
            {categories.map(category => (
              <CategoryCard
                key={category.id}
                category={category}
                productCount={products.filter(p => p.category === category.name).length}
                onClick={() => setSelectedCategory(category.name)}
              />
            ))}
          </div>

          {/* Add Product Button */}
          <button
            onClick={() => setShowAddProduct(true)}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-4 rounded-lg text-lg transition mt-4"
          >
            ➕ {t('addProduct')}
          </button>
        </>
      ) : !selectedSubCategory ? (
        <>
          {/* Back Button */}
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-blue-600 hover:text-blue-700 font-bold text-lg mb-4"
          >
            ← {t('back')}
          </button>

          {/* Category Title with Image */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <img
              src={currentCategory?.image}
              alt={selectedCategory || ''}
              className="w-full h-40 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="p-4">
              <div className="text-4xl mb-2">{currentCategory?.icon}</div>
              <h2 className="text-2xl font-bold text-gray-800">{t(`categories.${getCategoryKey(selectedCategory)}`)}</h2>
            </div>
          </div>

          {/* SubCategories Grid */}
          {subCategories.length > 0 ? (
            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-3">{t('nav.categories')}</h3>
              <div className="grid grid-cols-2 gap-3">
                {subCategories.map(subCat => (
                  <button
                    key={subCat.id}
                    onClick={() => setSelectedSubCategory(subCat.name)}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition transform hover:scale-105 text-center p-0"
                  >
                    <div className="h-28 bg-gray-100 overflow-hidden flex items-center justify-center">
                      <img
                        src={`https://source.unsplash.com/800x400/?${encodeURIComponent(getCategoryKey(subCat.name).replace(/_/g,','))}`}
                        alt={t(`categories.${getCategoryKey(subCat.name)}`) || subCat.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="font-bold text-gray-800 text-sm">{t(`categories.${getCategoryKey(subCat.name)}`)}</h4>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Add Product Button */}
          <button
            onClick={() => setShowAddProduct(true)}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-4 rounded-lg text-lg transition mt-4"
          >
            ➕ {t('addProduct')}
          </button>
        </>
      ) : (
        <>
          {/* Back Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedSubCategory(null)}
              className="text-blue-600 hover:text-blue-700 font-bold text-lg"
            >
              ← {t('back')}
            </button>
          </div>

          {/* SubCategory Title with Image */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">{t(`categories.${getCategoryKey(selectedCategory)}`)}</h2>
            <h3 className="text-lg font-semibold text-gray-600">{t(`categories.${getCategoryKey(selectedSubCategory)}`)}</h3>
          </div>

          {/* Products List */}
          {categoryProducts.length === 0 ? (
            <div className="bg-white rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-4">{t('noData')}</p>
              <button
                onClick={() => setShowAddProduct(true)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                ➕ {t('addProduct')}
              </button>
            </div>
          ) : (
            <ProductList products={categoryProducts} />
          )}
        </>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <AddProductModal
          category={selectedSubCategory || selectedCategory || ''}
          onClose={() => setShowAddProduct(false)}
        />
      )}
    </div>
  );
};

export default CategoriesPage;
