import React from 'react';
import { CartProvider } from 'react-use-cart';
import Cart from './Cart'; // Component giỏ hàng của bạn
import ProductList from './ProductList'; // Component danh sách sản phẩm của bạn

const App = () => {
  return (
    <CartProvider>
      <div>
        <h1>Giỏ hàng của tôi</h1>
        <ProductList />
        <Cart />
      </div>
    </CartProvider>
  );
};

export default App;
