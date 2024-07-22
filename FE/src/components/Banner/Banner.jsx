import React from 'react';
import styles from './Banner.module.css';

const Banner = () => {
    return (
        <div>
            <div className={styles.bannerSlider}>


                <a href="/ad.php?id=1961" target="_blank"><img className={styles.lazyLoaded} style={{ display: "block" }} src="https://hanoicomputercdn.com/media/banner/01_Jun060439148a35e29a4865dfecfdddec61.png" alt="Trùm loa di động" width="400" height="183" data-was-processed="true" /></a>



                <a href="/ad.php?id=1682" target="_blank"><img className={styles.lazyLoaded} style={{ display: "block" }} src="https://hanoicomputercdn.com/media/banner/01_Junee51cffaa11b5dba59decb9c39539e81.png" alt="Ghế Gaming Văn phòng" width="400" height="183" data-was-processed="true" /></a>



                <a href="/ad.php?id=1726" target="_blank"><img className={styles.lazyLoaded} style={{ display: "block" }} src="https://hanoicomputercdn.com/media/banner/03_Junb25a6ddf822ac61c91e148c588fb7d05.jpg" alt="Trùm máy chơi game" width="400" height="183" data-was-processed="true" /></a>



                <a href="/ad.php?id=2502" target="_blank"><img className={styles.lazyLoaded} style={{ display: "block" }} src="https://hanoicomputercdn.com/media/banner/03_Jun179a7d31d0d2313aadb59dc9f0c85c4e.jpg" alt="Case Thùng Máy Tính" width="400" height="183" data-was-processed="true" /></a>


            </div>
        </div>
    );
}

export default Banner;
