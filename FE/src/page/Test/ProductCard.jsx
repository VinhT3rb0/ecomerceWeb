import React from 'react';
import { Card, Button, Typography } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ProductCard = ({ image, title, oldPrice, newPrice, onAddToCart }) => {
    return (
        <Card
            hoverable
            style={{ width: 300 }}
        >
            {/* objectPosition: '50% 50%' */}
            <div style={{ height: 300 }}>
                <img 
                    alt={title} 
                    src={image} 
                    style={{ maxWidth: '100%', objectFit: 'cover', width: '100%', height: 250 }} 
                    className="product-image" 
                />
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
                {title}
            </Title>
            <Text delete style={{ fontSize: '16px', color: '#888' }}>
                {oldPrice} đ
            </Text>
            <Text style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '10px' }}>
                {newPrice} đ
            </Text>
            <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                onClick={onAddToCart}
                style={{ marginTop: '10px', width: '100%' }}
            >
                Thêm vào giỏ hàng
            </Button>
        </Card>
    );
};

export default ProductCard;
