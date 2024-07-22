import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Card from '../../components/ProductCardPhone/ProductCardPhone';
import styles from './Keyboard.module.css';

const Keyboard = () => {
    const [data, setData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://api.trandai03.online/api/products?keyword=ban_phim");
                setData(response.data.data.products);
                console.log(444, response.data.data);
            } catch (error) {
                console.error('Có lỗi xảy ra:', error);
            }
        };

        fetchData();
    }, []);


    if (!data) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                Loading...
            </div>
        )
    }
    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Tất cả sản phẩm</h1>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px', margin: '50px 0' }}>
                {data.map((x, index) => {
                    return (
                        <div className={`${styles.item} animate__animated animate__backInLeft`} key={index}>
                            <Card product={x} />
                        </div>
                    )
                })}</div>
        </div>
    );
}

export default Keyboard;
