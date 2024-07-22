import React, { useEffect, useState } from 'react';
import { Card, Button, Typography, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { useCart } from 'react-use-cart';
import { database } from "../../firebase";
import { getDatabase, ref, child, get, set } from "firebase/database";
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
};
const ProductCard = ({ product }) => {
    const id = uuidv4();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        const storedUserData = localStorage.getItem('user');
        if (storedUserData) {
            setUserData(storedUserData);
        }
    }, []);
    const { addItem } = useCart();
    const idItem = product?.id;
    const image = product?.product_images?.[0].image_url || 'chưa có data';
    // const image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF9Zlt8RrEpkmekyA9jlbOlubouWUJf3fOnA&s" || 'chưa có data';
    const name = product?.name || 'chưa có data';
    const oldPrice = product?.price ? parseInt(product.price) : 0;
    const discount = product?.discount || 0;
    const newPrice = oldPrice - (oldPrice * discount / 100);

    const handleAddItem = async () => {
        if (!userData) {
            message.warning("Chưa đăng nhập nhau vui lòng thử lại");
            navigate("/login");
            return;
        }
        // console.log("product", product);
        const save_cart = product;
        // xử lý trên firebase
        await set(ref(database, `user_cart/${userData}/${id}`), save_cart);
        message.success("Đã thêm vào giỏ hàng");


        const productWithPrice = { ...product, price: newPrice, id: id };
        addItem(productWithPrice);

    };

    return (
        <Card
            hoverable
            style={{ width: 300 }}
        >
            {/* objectPosition: '50% 50%',  height: 250*/}
            <div style={{ height: 300 }}>
                <a href={`/details/${idItem}`}>
                    <img
                        alt={"title"}
                        src={image}
                        style={{ maxWidth: '100%', objectFit: 'cover', width: '100%', objectPosition: '50% 50%' }}
                        className="product-image"
                    />
                </a>
            </div>
            <Title
                level={4}
                style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%'
                }}
            >
                {name}
            </Title>
            <Text delete style={{ fontSize: '16px', color: '#888', textAlign: 'center' }}>
                Giá cũ: {formatPrice(oldPrice)}
            </Text>
            <br></br>
            <Text style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '10px' }}>
                Giá mới: {formatPrice(newPrice)}
            </Text>
            <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                onClick={handleAddItem}
                style={{ marginTop: '10px', width: '100%' }}
            >
                Thêm vào giỏ hàng
            </Button>
        </Card>
    );
};

export default ProductCard;
