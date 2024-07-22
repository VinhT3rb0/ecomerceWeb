// Header.jsx
import React, { useEffect, useState } from 'react';
import styles from './Header.module.css';
import { HeartOutlined, LockOutlined, LogoutOutlined, PhoneOutlined, SearchOutlined, ShoppingCartOutlined, ShoppingOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, Skeleton, Space } from "antd";
import { Link } from 'react-router-dom';
import ButtonBs from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Cookies from "universal-cookie";
// import { useCart } from '../../CartContext';
import { useCart } from 'react-use-cart';
import CartOffcanvas from '../Cartoffcanvas/CartOffcanvas';
import axios from 'axios';

const cookies = new Cookies();
export default function Header() {
  const data = [
    {
      "id": 1,
      "name": "Màn hình Dell P2719HC Type C - Cũ đẹp (Không vỏ hộp)",
      "price": "3.499.000 ₫",
      "image": {
        "src": "https://hanoicomputercdn.com/media/product/120_82071_man_hinh_dell_p2719hc_type_c_cu_dep_1.jpg",
        "alt": "Màn hình Dell P2719HC"
      }
    },
    {
      "id": 2,
      "name": "Apple MacBook Pro 16 inch",
      "price": "55.999.000 ₫",
      "image": {
        "src": "https://hanoicomputercdn.com/media/product/120_83616_super_si_cong_20w_kem_cap_type_c_to_lightning_1m__3_.jpg",
        "alt": "Apple MacBook Pro 16 inch"
      }
    },
    {
      "id": 3,
      "name": "Samsung Galaxy S21 Ultra",
      "price": "25.999.000 ₫",
      "image": {
        "src": "https://hanoicomputercdn.com/media/product/120_83616_super_si_cong_20w_kem_cap_type_c_to_lightning_1m__3_.jpg",
        "alt": "Samsung Galaxy S21 Ultra"
      }
    }
  ];

  const [data2, setData2] = useState(null);
  const [load, setLoad] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token-nghiep"));
  const [sticky, setSticky] = useState(false);
  const value = localStorage.getItem('user') || '';
  const role = localStorage.getItem('role');
  const [showSubNav, setShowSubNav] = useState({ laptop: false, phone: false, accessories: false });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.trandai03.online/api/products/all");
        setData2(response.data.data.products);
        setLoad(false);
        console.log(11111, response.data.data.products?.[0].name);
      } catch (error) {
        console.error('Có lỗi xảy ra:', error);
      }
    };

    fetchData();
  }, []);

  const toggleSubNav = (category, state) => {
    setShowSubNav((prevState) => ({
      ...prevState,
      [category]: state,
    }));
  };
  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    setIsSearching(term.trim() !== '');
  };


  const handle = (term) => {
  };
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setSticky(true);
    } else {
      if (window.scrollY === 0) {
        setSticky(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const handleLogout = async () => {
    // Xóa token và user từ cookies và local storage
    cookies.remove("auth-token-nghiep");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");

    // Đặt lại dữ liệu giỏ hàng trong local storage về trạng thái rỗng
    const cartData = {
      items: [],
      isEmpty: true,
      totalItems: 0,
      totalUniqueItems: 0,
      cartTotal: 0,
      metadata: {},
    };
    localStorage.setItem('react-use-cart', JSON.stringify(cartData));

    // Reload trang và đặt lại trạng thái authentication
    window.location.reload();
    setIsAuth(false);
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
  };

  if (load) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
        <Skeleton active />
      </div>
    )
  }
  const filteredData = data2.filter((item) => {
    console.log("data2: ", item.name);
    return item.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  var newPrice = 0;
  console.log(12331, data2);
  return (
    <div>
      <div className={`${styles.First_Navbar} animate__animated animate__fadeInDown`}>
        {role == "ADMIN" ? (<Link to='/admin'> <div className={styles.Item}><UserOutlined />Quản lý</div></Link>) : ""}
        <Link to='/profile'>
          <div className={styles.Item}><UserOutlined />Tài khoản của tôi</div>
        </Link>
        <div className={styles.Item}><HeartOutlined />Danh sách yêu thích</div>
        <Link to='payments'>
          <div className={styles.Item}><ShoppingOutlined /> Thanh toán</div>
        </Link>
        {value ? (<div> <button style={{ background: 'transparent', border: 'none' }} onClick={handleLogout}><LogoutOutlined />Đăng xuất</button></div>) : (<div className={styles.Item}><LockOutlined /><Link to='/login'>Đăng nhập</Link></div>)}
      </div>
      <div className={sticky ? `${styles.sticky}` : `${styles.header}`}>
        <div className={styles.Mid_Navbar}>
          <div style={{ width: "25%", color: 'black' }} className='fw-bold fs-4'>
            <a href="/" className='text-dark'>
              TL ELECTRONIC
            </a>
          </div>


          <div className={styles.search_container}>
            <input type="text" value={searchTerm} className={styles.search_input} placeholder="Tìm kiếm..." onChange={handleSearch} />
            <button className={styles.search_button} onClick={handle}><SearchOutlined /></button>
            {console.log(searchTerm)}
            {isSearching && (
              <div className={`${styles.productSearch} Header_productSearch`}>
                {filteredData.map(item => (
                  <div key={item.id}>
                    <a href={`/details/${item.id}`}>
                      <div style={{ display: 'none' }}>
                        {newPrice = item.price - (item.price * item.discount / 100)}
                      </div>
                      <a className='product'>
                        <img src={item.product_images[0]?.image_url} alt="khóc" />
                        <span className={styles.inforSearch}>
                          <span className={styles.name}>{item.name}</span>
                          <span className={styles.price}> {formatPrice(newPrice)}   </span>
                        </span>
                      </a>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: '25%' }}>
            <div className='text-dark'>
              <PhoneOutlined
                style={{
                  border: "2px solid black",
                  borderRadius: "50%",
                  padding: "10px",
                  background: "#91caff",
                  marginRight: "10px",
                }}
                className={styles.Reverse}
              />
              <span>HN: 076 922 0162 - SG: 1900 636 648</span>
            </div>

            <div style={{ position: "relative" }}>
              <CartOffcanvas />

            </div>
          </div>
        </div>

        <div className={styles.Bottom_Navbar}>
          <div className={styles.nav_container}>
            <div className={styles.nav_item}><Link to='/'>Trang chủ</Link></div>
            <div
              className={styles.nav_item}
              onMouseEnter={() => toggleSubNav('laptop', true)}
              onMouseLeave={() => toggleSubNav('laptop', false)}
            >
              <Link to='/laptop'>Laptop</Link>
              {showSubNav.laptop && (
                <div className={styles.sub_nav}>
                  <div className={styles.sub_nav_item}><Link to='/macbook'>MacBook</Link></div>
                  <div className={styles.sub_nav_item}><Link to='/ldell'>Dell</Link></div>
                  <div className={styles.sub_nav_item}><Link to='/hp'>HP</Link></div>
                </div>
              )}
            </div>
            <div
              className={styles.nav_item}
              onMouseEnter={() => toggleSubNav('phone', true)}
              onMouseLeave={() => toggleSubNav('phone', false)}
            >
              <Link to='/phone'>Điện thoại</Link>
              {showSubNav.phone && (
                <div className={styles.sub_nav}>
                  <div className={styles.sub_nav_item}><Link to='/ip'>IPhone</Link></div>
                  <div className={styles.sub_nav_item}><Link to='/samsung'>Samsung</Link></div>
                  <div className={styles.sub_nav_item}><Link to='/xiaomi'>Xiaomi</Link></div>
                </div>
              )}
            </div>
            <div
              className={styles.nav_item}
              onMouseEnter={() => toggleSubNav('accessories', true)}
              onMouseLeave={() => toggleSubNav('accessories', false)}
            >
              <Link to='/accessories'>Phụ kiện</Link>
              {showSubNav.accessories && (
                <div className={styles.sub_nav}>
                  <div className={styles.sub_nav_item}><Link to='/headphone'>Tai nghe</Link></div>
                  <div className={styles.sub_nav_item}><Link to='/mouse'>Chuột</Link></div>
                  <div className={styles.sub_nav_item}><Link to='/keyboard'>Bàn phím</Link></div>
                </div>
              )}
            </div>
            {/* <Link to='/test'>Test</Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}
