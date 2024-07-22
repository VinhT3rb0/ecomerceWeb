import React from 'react';
import { useCart } from 'react-use-cart';

const ProductList = () => {
  const { addItem } = useCart();

  const products = [
    { id: 1, name: 'Sản phẩm 1', price: 10 },
    { id: 2, name: 'Sản phẩm 2', price: 20 },
    { id: 3, name: 'Sản phẩm 3', price: 30 },
  ];

  return (
    <div>
      <h2>Danh sách sản phẩm</h2>
      <ul className="list-group">
        {products.map((product) => (
          <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
            {product.name} - {product.price}$
            <button className="btn btn-primary" onClick={() => addItem(product)}>Thêm vào giỏ</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
