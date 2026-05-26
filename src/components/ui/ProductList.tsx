import React, { useState } from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const { sales } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            sales={sales}
            onClick={() => setSelectedProduct(product)}
          />
        ))}
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          sales={sales}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
};

export default ProductList;
