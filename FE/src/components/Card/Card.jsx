import React, { useEffect, useState } from 'react';
import styles from './Cart.module.css';
import { useCart } from 'react-use-cart';
import { database } from "../../firebase";
import { getDatabase, ref, child, get, set } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';
import { message } from 'antd';
import { Link,useNavigate } from 'react-router-dom';

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
};

export default function Card({ product }) {
  const navigate = useNavigate();
  const id = uuidv4();
  const userData = localStorage.getItem('user');
  const { addItem } = useCart();
  const idItem = product?.id;
  const image = product?.product_images?.[0].image_url || 'chưa có data';
  const name = product?.name || 'chưa có data';
  const oldPrice = product?.price ? parseInt(product.price) : 0;
  const discount = product?.discount || 0;
  const newPrice = oldPrice - (oldPrice * discount / 100);

  console.log("itemId: ", product.id);

  const handleAddItem = async () => {
    if(userData == null){
      navigate("/login");
    }

    // console.log("product", product);
    const save_cart = product;
    // xử lý trên firebase
    await set(ref(database, `user_cart/${userData}/${id}`), save_cart);
    message.success("Đã thêm vào giỏ hàng");


    const productWithPrice = { ...product, price: newPrice };
    addItem(productWithPrice);

  };

  return (
    <div className={`${styles.Container_Cart} mt-2 shadow rounded py-3 px-3 rounded border border-2 border-secondary d-flex align-items-center justify-content-center`}>
      <div>
        <a href={`/details/${idItem}`}>
          <div className={styles.Image_Item}>
            <img className='w-100' src={image} alt={name} />
          </div>
        </a>

        <div className={styles.Content}>
          <div className={`${styles.itemContent} Content_Item text-center fw-bold mt-3`}>{name}</div>
          <div className={`${styles.oldPrice} Price_Item_Old text-center m-1 text-decoration-line-through`}>Giá cũ: {formatPrice(oldPrice)}</div>
          <div className={`${styles.newPrice} Price_Item text-center m-1 text-danger fw-medium`}>Giá mới: {formatPrice(newPrice)}</div>
          <div className='text-center d-flex align-items-center justify-content-center'>
            <button onClick={handleAddItem} type="button" className="btn btn-primary">Thêm vào giỏ hàng</button>
          </div>
        </div>
      </div>
    </div>
  );
}
