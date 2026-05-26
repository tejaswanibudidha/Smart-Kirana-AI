import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockDB } from '../../services/database';
import { useTranslation } from '../../i18n/i18n';
import { getDefaultUnit } from '../../utils/predictions';
import { X } from 'lucide-react';

interface AddProductModalProps {
  category: string;
  onClose: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ category, onClose }) => {
  const { user, addProduct } = useApp();
  const { t, language } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    category,
    quantity: '',
    unit: 'Pieces',
    price: '',
    minStockLevel: '',
    expiryDate: '',
    image: '',
  });

  const units = [
    { value: 'Pieces', key: 'pieces' },
    { value: 'Kg', key: 'kg' },
    { value: 'Litres', key: 'litres' },
    { value: 'Dozen', key: 'dozen' },
  ];

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      unit: getDefaultUnit(name),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity || !formData.price || !formData.minStockLevel) {
      alert(t('pleaseFillAllFields'));
      return;
    }

    if (user) {
      const newProduct = mockDB.addProduct(user.id, {
        id: '',
        name: formData.name,
        category: formData.category || 'Grocery Essentials',
        quantity: parseInt(formData.quantity),
        unit: formData.unit,
        price: parseFloat(formData.price),
        minStockLevel: parseInt(formData.minStockLevel),
        lastRestockDate: new Date(),
        dailyAverage: 0,
        userId: user.id,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined,
        image: formData.image,
      });

      addProduct(newProduct);
      alert(t('productAddedSuccess'));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50 max-w-md mx-auto">
      <div className="bg-white w-full rounded-t-2xl p-6 shadow-2xl animate-slide-up">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{t('addProduct')}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              {t('productName')} *
            </label>
            <input
              type="text"
              placeholder={t('placeholderProductName')}
              value={formData.name}
              onChange={handleNameChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
              required
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              {t('quantity')} *
            </label>
            <input
              type="number"
              placeholder={t('enterQuantity')}
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
              required
            />
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              {t('unit')}
            </label>
            <select
              value={formData.unit}
              onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg bg-white"
            >
              {units.map(u => (
                <option key={u.value} value={u.value}>{t(u.key)}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">{t('priceLabel')}</label>
            <input
              type="number"
              step="0.01"
              placeholder={t('enterPrice')}
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
              required
            />
          </div>

          {/* Minimum Stock Level */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">{t('minStockLevelLabel')}</label>
            <input
              type="number"
              placeholder={t('enterMinStock')}
              value={formData.minStockLevel}
              onChange={(e) => setFormData(prev => ({ ...prev, minStockLevel: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
              required
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              {t('expiryDate')}
            </label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              🖼️ {t('imageUrlOptional')}
            </label>
            <input
              type="url"
              placeholder="https://images.example.com/product.jpg"
              value={formData.image}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition"
            >
              {t('back')}
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition"
            >
              {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
