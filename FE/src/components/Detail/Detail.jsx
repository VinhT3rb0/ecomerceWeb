import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import styles from './Detail.module.css';
import { Col, Image, Row, Alert, Flex, Spin, Rate, message } from 'antd';
import { StarOutlined, StarFilled, StarTwoTone, GiftFilled, CheckOutlined, PhoneOutlined, HomeOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { WrapperStyleColImage, WrapperStyleImageSmall, WrapperStyleTextSell } from './style';
import getFontSizes from 'antd/es/theme/themes/shared/genFontSizes';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Card from '../Card/Card';
import Famous from '../../page/Famous/Famous';
import { getDatabase, ref, child, get, set } from "firebase/database";
import { useCart } from 'react-use-cart';
import { database } from "../../firebase";


export default function Detail() {
  const { addItem } = useCart();
  const userData = localStorage.getItem('user');
  const { id } = useParams();
  const id2 = uuidv4();
  const [data, setData] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const stock = 6;
  const minQuantity = 1;
  const [mainImage, setMainImage] = useState('https://img.idesign.vn/2018/10/23/id-loading-1.gif');
  const imageUrls = [];


  const oldPrice = data?.price ? parseInt(data.price) : 0;
  const discount = data?.discount || 0;
  const newPrice2 = oldPrice - (oldPrice * discount / 100);

  const handleAddItem = async () => {
    const save_cart = data;

    // Xử lý trên Firebase
    await set(ref(database, `user_cart/${userData}/${id2}`), save_cart);
    message.success("Đã thêm vào giỏ hàng");

    const productWithPrice = { ...save_cart, price: newPrice2 };

    // Lấy dữ liệu giỏ hàng từ localStorage
    const cartData = JSON.parse(localStorage.getItem('react-use-cart')) || { items: [] };

    // Thêm sản phẩm mới vào giỏ hàng
    cartData.items.push(productWithPrice);

    // Cập nhật lại thông tin giỏ hàng
    cartData.totalItems = cartData.items.length;
    cartData.totalUniqueItems = new Set(cartData.items.map(item => item.id)).size;
    cartData.cartTotal = cartData.items.reduce((total, item) => total + item.price * item.quantity, 0);

    // Lưu lại vào localStorage
    localStorage.setItem('react-use-cart', JSON.stringify(cartData));

    // Thêm sản phẩm vào giỏ hàng của ứng dụng
    addItem(productWithPrice);
  };


  const handleImageClick = (url) => {
    setMainImage(url);
  };
  const handleDecrement = (e) => {
    e.preventDefault();
    if (quantity > minQuantity) {
      setQuantity(quantity - 1);
    }
  };

  // useEffect(() => {
  //   window.scroll(0, 0)
  // }, []);

  // call api với usePrams
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.trandai03.online/api/products/detail?productId=${id}`);
        setData(response.data.data);
        setMainImage(response.data.data.product_images[0].image_url);
      } catch (error) {
        console.error('Có lỗi xảy ra:', error);
      }
    };

    fetchData();
  }, []);



  const handleIncrement = (e) => {
    e.preventDefault();
    if (quantity < stock) {
      setQuantity(quantity + 1);
    }
  };

  if (!data) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        {/* <p>{`LOADING: https://api.trandai03.online/api/detail?productId=${id}`}</p> */}
        Loading...
      </div>
    )
  }
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
  };
  for (let i = 0; i < data.product_images.length; i++) {
    imageUrls.push(data.product_images[i].image_url);
  }
  const newPrice = data.price - (data.price * data.discount / 100);
  return (
    <>
      <div className={styles.main}>
        <div className={styles.Container}>
          <h4>{data.name}</h4>
          <div style={{ marginTop: '10px', display: 'flex', background: '#fff', borderRadius: '1.3em' }}>
            <Row style={{ padding: '16px', }}>
              <Col span={10}>
                <Image src={mainImage} preview={false} alt="" />
                <Row style={{ paddingTop: '10px' }}>
                  {imageUrls.map((url, index) => (
                    <WrapperStyleColImage span={5} key={index}>
                      <WrapperStyleImageSmall
                        src={url}
                        alt={`Small ${index}`}
                        preview={false}
                        onClick={() => handleImageClick(url)}
                      />
                    </WrapperStyleColImage>
                  ))}
                </Row>
                <div className={styles.offerDetail}>
                  <div className={styles.title}>
                    <GiftFilled />
                    Thông tin Khuyến mãi
                  </div>
                  <div className={styles.contentOffer}>
                    <p className={styles.specialOfferGroup}>
                      <CheckOutlined style={{ color: '#646362' }} />
                      <span className={styles.kmai}> Balo laptop chống sốc / hoặc / Túi xách Laptop88 trị giá 199.000đ</span>
                      <span className={styles.kmaiInfo}>
                        <span className={styles.descKmai}> </span>
                      </span>
                    </p>
                    <p className={styles.specialOfferGroup}>
                      <CheckOutlined style={{ color: '#646362' }} />
                      <span className={styles.kmai}>  CHUỘT KHÔNG DÂY Deino OFi 1 Mới | hoặc | Forter FD V1     </span>
                      <span className={styles.kmaiInfo}>
                        <span className={styles.descKmai}> </span>
                      </span>
                    </p>
                    <p className={styles.specialOfferGroup}>
                      <CheckOutlined style={{ color: '#646362' }} />
                      <span className={styles.kmai}>   Thẻ Gold Member - ƯU ĐÃI GIÁ TRỊ trị giá 1.290.000 đ     </span>
                      <span className={styles.kmaiInfo}>
                        <span className={styles.descKmai}> </span>
                      </span>
                    </p>
                    <p className={styles.specialOfferGroup}>
                      <CheckOutlined style={{ color: '#646362' }} />
                      <span className={styles.kmai}>  Miễn phí dán Skin mặt lưng Laptop - sử dụng tại các cơ sở Skin88 trị giá 180.000đ     </span>
                      <span className={styles.kmaiInfo}>
                        <span className={styles.descKmai}> </span>
                      </span>
                    </p>
                  </div>
                </div>
              </Col>
              <div className={styles.mainProductMid}>
                <div className={styles.boxDeal}>
                  <div className={styles.priceDealLeft}>
                    <div className={styles.price}>{formatPrice(newPrice)}</div>
                    <div className={styles.mainPrice}>
                      <del className={styles.oldPrice}> {formatPrice(data.price)}</del>
                      <div className={styles.saleofPrice}>{data.discount}%</div>
                    </div>
                  </div>
                  <div className={styles.dealRight}>
                    <div className={styles.timeDeal}>
                      <p>Kết thúc sau </p>
                      <div className={styles.time}>
                        <span className={styles.h}>8</span>:
                        <span className={styles.m}>11</span>:
                        <span className={styles.s}>37</span>
                      </div>
                    </div>
                    <style>
                    </style>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <p className={styles.productTime}>
                        <span className={styles.productTimeLine}></span>
                        <span>ĐÃ BÁN 1</span>
                      </p>
                      <p className={styles.quantityDeal}>Số lượng bán: <span className={styles.quantityLeft}> 5 </span></p>
                    </div>
                  </div>
                </div>
                <Rate style={{ fontSize: '15px', margin: '10px 0' }} allowHalf defaultValue={2.5} />
                <div className={styles.productStatus}>
                  <div className={styles.item}>
                    <a className={styles.nameCate} href="#">New 100%</a>
                    <a className={styles.txt} href="#">Sản phẩm chưa qua sử dụng, tình trạng mới 100% full-box</a>
                  </div>
                </div>
                {data?.category_id == 1 ? ("") : (
                  <div className={styles.configHolder}>
                    <div className={styles.SelectConfig}>
                      <span className={styles.name}>CPU: </span>
                      <ul>
                        <li className={styles.SelectedValue}>
                          <span>{data?.product_details[0]?.cpu}</span>
                        </li>
                      </ul>
                    </div>
                    {data?.category_id == 2 ? ("") : (
                      <>
                        <div className={styles.SelectConfig}>
                          <span className={styles.name}>Camara trước: </span>
                          <ul>
                            <li className={styles.SelectedValue}>
                              <span>{data?.product_details[0]?.frontCamera}</span>
                            </li>
                          </ul>
                        </div>
                        <div className={styles.SelectConfig}>
                          <span className={styles.name}>Camara sau: </span>
                          <ul>
                            <li className={styles.SelectedValue}>
                              <span>{data?.product_details[0]?.behindCamera}</span>
                            </li>
                          </ul>
                        </div>
                      </>
                    )}

                    <div className={styles.SelectConfig}>
                      <span className={styles.name}>RAM: </span>
                      <ul>
                        <li className={styles.SelectedValue}>
                          <span>{data?.product_details[0]?.ram} GB</span>
                        </li>
                      </ul>
                    </div>
                    <div className={styles.SelectConfig}>
                      <span className={styles.name}>Ổ cứng: </span>
                      <ul>
                        <li className={styles.SelectedValue}>
                          <span>{data?.product_details[0]?.drive}</span>
                        </li>
                      </ul>
                    </div>


                    {data?.category_id == 3 ? ("") : (<div className={styles.SelectConfig}>
                      <span className={styles.name}>Card đồ họa: </span>
                      <ul>
                        <li className={styles.SelectedValue}>
                          <span>{data?.product_details[0]?.vga}</span>
                        </li>
                      </ul>
                    </div>)}
                    <div className={styles.SelectConfig}>
                      <span className={styles.name}>Màn hình: </span>
                      <ul>
                        <li className={styles.SelectedValue}>
                          <span>{data?.product_details[0]?.display}</span>
                        </li>
                      </ul>
                    </div>
                    <div className={styles.SelectConfig}>
                      <span className={styles.name}>Pin: </span>
                      <ul>
                        <li className={styles.SelectedValue}>
                          <span>{data.product_details[0]?.battery}</span>
                        </li>
                      </ul>
                    </div>
                    <div className={styles.SelectConfig}>
                      <span className={styles.name}>Bảo hành: </span>
                      <ul>
                        <li className={styles.SelectedValue}>
                          <span>GÓI BẢO HÀNH CƠ BẢN</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
                <div className={styles.proQuantity}>
                  <a href="" onClick={handleDecrement} data-value="-1">-</a>
                  <input type="number"
                    className={styles.quantityChange}
                    value={quantity}
                    data-stock={stock}
                    data-min={minQuantity}
                    min={minQuantity}
                    readOnly />
                  <a href="" onClick={handleIncrement} data-value="1">+</a>
                </div>
                <div className={styles.btnAddCart}>
                  <a href="" className={styles.btnAdd}>Mua trả
                    góp <span className={styles.block}>Thủ tục đơn
                      giản - lãi suất
                      thấp</span></a>
                  <button onClick={handleAddItem} className={styles.btnAdd}>
                    Mua ngay
                    <span className={styles.block}>Giao tận nơi hoặc nhận ở cửa hàng</span></button>
                </div>
              </div>
              <div className={styles.mainProductRight}>
                <div className={styles.productWarranty}>
                  <h3 className={styles.titleWarranty}>Thông tin bảo hành</h3>
                  <div className={styles.content}>
                    <p>✅Bảo hành 12 tháng Laptop88
                    </p><p>✔️Tùy chọn:</p>
                    <p>- <a href="/goi-bao-hanh-mo-rong-tai-laptop88.html" target="_blank">Gói BẢO HÀNH VÀNG</a>: gia tăng thêm 12 tháng bảo hành</p>
                    <p>- <a href="/goi-bao-hanh-mo-rong-tai-laptop88.html" target="_blank">Gói BẢO HÀNH KIM CƯƠNG</a>: gia tăng thêm 24 tháng bảo hành</p>

                    <p>&nbsp;</p>
                    <p>✅&nbsp;MIỄN PHÍ GIAO HÀNG TẬN NHÀ</p>
                    <p>- Với đơn hàng &lt; 4.000.000 đồng: Miễn phí giao hàng cho đơn hàng &lt; 5km tính từ cửa hàng Laptop88 gần nhất</p>
                    <p>- Với đơn hàng &gt; 4.000.000 đồng: Miễn phí giao hàng (khách hàng chịu phí bảo hiểm hàng hóa nếu có)</p>
                    <p>&nbsp;</p>
                  </div>
                </div>
                <div className={styles.productWarranty}>
                  <h3 className={styles.titleWarranty}>Yên tâm mua hàng</h3>
                  <div className={styles.content}>
                    <p>Hệ thống cửa hàng toàn quốc</p>
                    <p>Đại lý phân phối chính hãng</p>
                    <p>Giá luôn tốt nhất</p>
                    <p>Hỗ trợ trả góp lãi suất thấp</p>
                    <p>Bảo hành dài, hậu mãi chu đáo</p>
                    <p>Miễn phí giao hàng toàn quốc</p>
                  </div>
                </div>
              </div>
            </Row>
          </div>
          <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: '1.3em' }}>
            <div className={styles.combosetTitle}>Một số sản phẩm khác</div>
            {/* <div className={styles.combosetContent}>
              <div className={styles.clear}></div>
            </div> */}
            <Famous />
          </div>


          <div className={styles.contentDescDetail}>
            <div className={styles.contentDesc}>
              <h3 className={styles.titleDesc}>
                <span>Đặc điểm nổi bật</span>
                <p className={styles.descMain}>{data.description}</p>
              </h3>
            </div>
            <Col span={8}>
            </Col>
          </div >
        </div>
      </div >
    </>

  )
}
