import React from 'react';
import ReactDOM from 'react-dom';
import ProductCard from './ProductCard';
import './styles.css';
const products = [
  {
    id: 1,
    image: 'https://synnexfpt.com/wp-content/uploads/2022/06/iphone-13-pro-max-xanh-1.jpg',
    title: 'Sản phẩm mang phong cách độc đáo thiết kế mới lạ mới người dùng',
    oldPrice: '500,000',
    newPrice: '400,000'
  },
  {
    id: 2,
    image: 'https://vnn-imgs-f.vgcloud.vn/2019/09/11/05/hinh-anh-va-trai-nghiem-dau-tien-ve-iphone-11-11-pro-va-pro-max-1.jpg',
    title: 'Sản phẩm B',
    oldPrice: '600,000',
    newPrice: '450,000'
  },
  {
    id: 3,
    image: 'https://images.baoangiang.com.vn/image/fckeditor/upload/2020/20200201/images/iphone_11.jpg',
    title: 'Sản phẩm C',
    oldPrice: '700,000',
    newPrice: '500,000'
  }
];

export default function Test() {
  const handleAddToCart = (product) => {
    console.log(`${product.title} đã được thêm vào giỏ hàng!`);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px', marginTop: '50px' }}>
      {products.map(product => (
        <ProductCard
          key={product.id}
          image={product.image}
          title={product.title}
          oldPrice={product.oldPrice}
          newPrice={product.newPrice}
          onAddToCart={() => handleAddToCart(product)}
        />
      ))}
    </div>
  );
};

