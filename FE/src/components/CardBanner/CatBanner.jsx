import React from 'react';
import styles from './CatBanner.module.css';
import { Link } from 'react-router-dom';

const CatBanner = () => {
    return (
        <div style={{ display: 'flex', marginTop: '50px' }}>
            <div className={styles.card} style={{backgroundImage: "url('https://giatin.com.vn/wp-content/uploads/2020/11/cac-loai-kich-thuoc-man-hinh-laptop.jpg')"}}>
                <div className={styles.cardDetails}>
                </div>
                <Link to='laptop'>
                    <button className={styles.cardButton}>Laptop</button>
                </Link>
            </div>
            <div className={styles.card} style={{backgroundImage: "url('https://cdn11.dienmaycholon.vn/filewebdmclnew/public//userupload/images/dien-thoai-Samsung-Galaxy-S10-Plus-1.jpg')"}}>
                <div className={styles.cardDetails}>
                </div>
                <Link to='phone'>
                    <button className={styles.cardButton}>Điện thoại</button>
                </Link>
            </div>
            <div className={styles.card} style={{backgroundImage: "url('https://png.pngtree.com/background/20230520/original/pngtree-an-image-of-purple-headphones-with-music-notes-picture-image_2677106.jpg')"}}>
                <div className={styles.cardDetails}>
                </div>
                <Link to='/accessories'>
                    <button className={styles.cardButton}>Phụ kiện</button>
                </Link>
            </div>
        </div>

    );
}

export default CatBanner;
