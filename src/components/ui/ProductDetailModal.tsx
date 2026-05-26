import React, { useState } from 'react';
import { Product, SalesRecord } from '../../types';
import { useApp } from '../../context/AppContext';
import { mockDB } from '../../services/database';
import { generatePrediction } from '../../utils/predictions';
import { useTranslation } from '../../i18n/i18n';
import { getCategoryKey } from '../../i18n/categories';
import { getProductImageKey, getCategoryFallbackImage } from '../../i18n/product-images';
import { getLocalizedProductName, getLocalizedProductCategory } from '../../i18n/product-localization';
import { X, Trash2, Edit2 } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  sales: SalesRecord[];
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, sales, onClose }) => {
  const { user, updateProduct, deleteProduct } = useApp();
  const { t, language } = useTranslation();
  const [recordSaleMode, setRecordSaleMode] = useState(false);
  const [saleQuantity, setSaleQuantity] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    quantity: product.quantity,
    expiryDate: product.expiryDate ? product.expiryDate.toISOString().split('T')[0] : '',
  });

  const prediction = generatePrediction(product, sales);
  const displayName = getLocalizedProductName(product, language) || '';
  const localizedCategory = getLocalizedProductCategory(product, language);
  const displayCategory = localizedCategory || t(`categories.${getCategoryKey(product.category)}`) || '';
  const displayImage = getProductImageKey(product, language, displayName, displayCategory) || product.image || getCategoryFallbackImage(product.category);

  const handleRecordSale = () => {
    if (!saleQuantity || parseInt(saleQuantity) <= 0) {
      alert(t('pleaseEnterValidQuantity'));
      return;
    }

    const quantity = parseInt(saleQuantity);
    if (quantity > product.quantity) {
      alert(t('cannotSellMoreThanAvailableStock'));
      return;
    }

    if (user) {
      // Add sale record
      mockDB.addSale(user.id, {
        id: '',
        productId: product.id,
        quantity,
        date: new Date(),
        userId: user.id,
      });

      // Update product quantity
      const updatedProduct = {
        ...product,
        quantity: product.quantity - quantity,
      };
      mockDB.updateProduct(user.id, updatedProduct);
      updateProduct(updatedProduct);

      alert(t('salesRecorded'));
      setSaleQuantity('');
      setRecordSaleMode(false);
      onClose();
    }
  };

  const handleUpdateProduct = () => {
    if (user) {
      const updatedProduct = {
        ...product,
        quantity: editData.quantity,
        expiryDate: editData.expiryDate ? new Date(editData.expiryDate) : undefined,
      };
      mockDB.updateProduct(user.id, updatedProduct);
      updateProduct(updatedProduct);
      alert(t('productUpdated'));
      setEditMode(false);
    }
  };

  const handleDeleteProduct = () => {
    if (confirm(t('confirmAreYouSure'))) {
      if (user) {
        mockDB.deleteProduct(user.id, product.id);
        deleteProduct(product.id);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50 max-w-md mx-auto">
      <div className="bg-white w-full rounded-t-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{displayName}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>

        {/* Product Info */}
        {!editMode && !recordSaleMode && (
          <div className="space-y-4">
            {/* Product Image */}
            {displayImage && (
              <div className="h-56 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center relative">
                  <img
                    src={displayImage}
                    alt={displayName}
                    className="w-full h-full object-cover absolute inset-0 transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = getCategoryFallbackImage(product.category);
                    }}
                  />
                </div>
            )}

            {/* Category */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 text-xs">{t('categoryLabel')}</p>
              <p className="font-bold text-gray-800">{displayCategory}</p>
            </div>

            {/* Stock Level */}
            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
              <p className="text-gray-600 text-xs">{t('currentStock')}</p>
              <p className="font-bold text-xl text-blue-600">
                {product.quantity} {t(product.unit.toLowerCase() === 'pieces' ? 'pieces' : product.unit.toLowerCase())}
              </p>
            </div>

            {/* Price and Min Stock */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-300">
                <p className="text-gray-600 text-xs">{t('priceLabel')}</p>
                <p className="font-bold text-lg text-gray-800">₹ {product.price.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-300">
                <p className="text-gray-600 text-xs">{t('minStockLevelLabel')}</p>
                <p className="font-bold text-lg text-gray-800">{product.minStockLevel}</p>
              </div>
            </div>

            {/* Expiry Date */}
            {product.expiryDate && (
              <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                <p className="text-gray-600 text-xs">{t('expiryDate')}</p>
                <p className="font-bold text-orange-600">
                  {new Date(product.expiryDate).toLocaleDateString()}
                </p>
              </div>
            )}

            {/* Prediction */}
            {prediction && (
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                <p className="text-gray-600 text-xs">{t('stockPrediction')}</p>
                <p className="font-bold text-green-600 text-lg">
                  {prediction.daysLeft} {t('days')}
                </p>
                <p className="text-sm text-green-700 mt-1">
                  {`${displayName} ${t('willRunOut')} ${prediction.daysLeft} ${t('days')}`}
                </p>
              </div>
            )}

            {/* Last Restock */}
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-gray-600 text-xs">{t('lastRestocked')}</p>
              <p className="font-bold text-purple-600">
                {new Date(product.lastRestockDate).toLocaleDateString()}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <button
                onClick={() => setRecordSaleMode(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                📊 {t('recordSales')}
              </button>
              <button
                onClick={() => setEditMode(true)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Edit2 size={18} /> {t('edit')}
              </button>
            </div>

            <button
              onClick={handleDeleteProduct}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Trash2 size={18} /> {t('delete')}
            </button>
          </div>
        )}

        {/* Record Sale Mode */}
        {recordSaleMode && (
          <div className="space-y-4">
            <p className="text-center text-gray-600">{t('howMuchSoldToday')}</p>
            <input
              type="number"
              placeholder={t('quantitySold')}
              value={saleQuantity}
              onChange={(e) => setSaleQuantity(e.target.value)}
              min="1"
              max={product.quantity}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
            />
            <p className="text-sm text-gray-600">{t('max')}: {product.quantity} {product.unit}</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setRecordSaleMode(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition"
              >
                {t('back')}
              </button>
              <button
                onClick={handleRecordSale}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                {t('recordSale')}
              </button>
            </div>
          </div>
        )}

        {/* Edit Mode */}
        {editMode && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">{t('quantity')}</label>
              <input
                type="number"
                value={editData.quantity}
                onChange={(e) => setEditData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">{t('expiryDate')}</label>
              <input
                type="date"
                value={editData.expiryDate}
                onChange={(e) => setEditData(prev => ({ ...prev, expiryDate: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition"
              >
                {t('back')}
              </button>
              <button
                onClick={handleUpdateProduct}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                {t('save')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailModal;
