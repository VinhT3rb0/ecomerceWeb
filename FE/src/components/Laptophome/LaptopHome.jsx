import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Card from '../../components/ProductCardPhone/ProductCardPhone';
import styles from './LaptopHome.module.css';

const LaptopHome = () => {
    const [data, setData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://api.trandai03.online/api/products?category_id=2");
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
    const displayedData = data.slice(0, 4);
    return (
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px', marginTop: '50px' }}>
            {displayedData.map((x, index) => {
                return (
                    <div className={`${styles.item} animate__animated animate__backInLeft`} key={index}>
                        <Card product={x} />
                    </div>
                )
            })}</div>
    );
}

export default LaptopHome;
